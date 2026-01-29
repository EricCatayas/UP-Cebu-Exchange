import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder, RentalOrderExtension } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { isOrderReturnable } from '@/lib/order';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { orderReturnRequestNotification } from '@/lib/notifications';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const orderId = parseInt((await params).id);

    const rentalOrderService = new RentalOrderService();
    const rentalOrder = await rentalOrderService.getOrderDetails(orderId);

    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    if (rentalOrder.userId !== currentUser.userId && !canEditContent(currentUser)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // Update rental order status to 'To Return'
    await RentalOrder.update({ status: ORDER_STATUS.TORETURN }, { where: { id: orderId } });

    // If rental order has an extension, cancel all related extensions
    const extension = await RentalOrderExtension.findOne({ where: { originalOrderId: rentalOrder.id } });
    if (extension) {
      await rentalOrderService.cancelRentalOrderAndExtensions(extension.extensionOrderId);
    }

    await orderReturnRequestNotification(rentalOrder.id, {
      id: currentUser.userId,
      fullName: rentalOrder.user.fullName,
    });

    return new Response(JSON.stringify({ success: true, message: 'Rental order status updated to To Return' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating return status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
