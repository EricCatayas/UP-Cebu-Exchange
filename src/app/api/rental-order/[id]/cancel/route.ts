import EventService from '@/services/EventService';
import { RentalOrder, Payment } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { isOrderCancelable } from '@/lib/order';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { getCurrentSession } from '@/lib/session';
import { orderCancelledNotification } from '@/lib/notifications';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const orderId = parseInt((await params).id);

    const rentalOrder = await RentalOrder.findByPk(orderId, {
      include: ['user', 'payment'],
    });

    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    if (rentalOrder.userId !== currentUser.userId && !canEditContent(currentUser)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    if (!isOrderCancelable(rentalOrder)) {
      return new Response(JSON.stringify({ error: 'Invalid order status for cancellation' }), { status: 400 });
    }

    // Update rental order status to 'Cancelled'
    rentalOrder.status = ORDER_STATUS.CANCELLED;
    await rentalOrder.save();

    // TODO: If there's an associated payment that is completed, send notification for refund processing

    const session = await getCurrentSession();
    if (session) {
      const eventService = new EventService(session.id);
      await eventService.cancelOrder(rentalOrder.id);
    }

    await orderCancelledNotification(rentalOrder.id, { id: currentUser.userId, fullName: rentalOrder.user.fullName });

    return new Response(JSON.stringify({ success: true, message: 'Rental order status updated to Cancelled' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
