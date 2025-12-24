import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder } from '@/models/sequelize';
import { getCurrentUser, isAdmin, canEditContent } from '@/lib/auth';
import { ORDER_STATUS, ORDER_STATUSES } from '@/lib/constants';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isAdmin(currentUser)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!canEditContent(currentUser)) {
      return new Response(JSON.stringify({ error: 'Admin editor access required' }), { status: 403 });
    }

    const orderId = parseInt((await params).id);
    const { status } = await request.json();

    if (!orderId || isNaN(Number(orderId))) {
      return new Response(JSON.stringify({ error: 'Valid orderId is required' }), { status: 400 });
    }

    if (!status || !ORDER_STATUSES.includes(status)) {
      return new Response(JSON.stringify({ error: 'Valid status is required' }), { status: 400 });
    }

    const rentalOrder = await RentalOrder.findByPk(orderId);

    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    const oldStatus = rentalOrder.status;
    if (oldStatus === status) {
      return new Response(JSON.stringify({ error: 'Rental order already has the specified status' }), { status: 400 });
    }

    const rentalOrderService = new RentalOrderService();
    if (status === ORDER_STATUS.PENDING) {
      await rentalOrderService.markOrderAsPending(rentalOrder.id);
    } else if (status === ORDER_STATUS.RESERVED) {
      await rentalOrderService.markOrderAsReserved(rentalOrder.id);
    } else if (status === ORDER_STATUS.ONGOING) {
      await rentalOrderService.markOrderAsOngoing(rentalOrder.id);
    } else if (status === ORDER_STATUS.COMPLETED) {
      await rentalOrderService.markOrderAsCompleted(rentalOrder.id);
    } else if (status === ORDER_STATUS.CANCELLED) {
      await rentalOrderService.markOrderAsCancelled(rentalOrder.id);
    } else {
      rentalOrder.status = status;
      await rentalOrder.save();
    }

    return new Response(JSON.stringify({ rentalOrder }), { status: 200 });
  } catch (error) {
    console.error('Error updating rental order status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
