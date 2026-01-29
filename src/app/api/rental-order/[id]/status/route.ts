import EventService from '@/services/EventService';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { ARTWORK_STATUS, ORDER_STATUS, ORDER_STATUSES } from '@/lib/constants';
import { getCurrentSession } from '@/lib/session';

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
    const { status, itemsStatus } = await request.json();

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

    const session = await getCurrentSession();

    const rentalOrderService = new RentalOrderService();

    if (status === ORDER_STATUS.PENDING) {
      await rentalOrder.update({ status: ORDER_STATUS.PENDING });
    } else if (status === ORDER_STATUS.RESERVED) {
      await rentalOrder.update({ status: ORDER_STATUS.RESERVED });
    } else if (status === ORDER_STATUS.TORECEIVE) {
      await rentalOrder.update({ status: ORDER_STATUS.TORECEIVE });
    } else if (status === ORDER_STATUS.ONGOING) {
      await rentalOrder.update({ status: ORDER_STATUS.ONGOING });
    } else if (status === ORDER_STATUS.TORETURN) {
      await rentalOrder.update({ status: ORDER_STATUS.TORETURN });
    } else if (status === ORDER_STATUS.COMPLETED) {
      await rentalOrder.update({ status: ORDER_STATUS.COMPLETED });
    } else if (status === ORDER_STATUS.CANCELLED) {
      await rentalOrderService.cancelRentalOrderAndExtensions(rentalOrder.id);
    } else if (status === ORDER_STATUS.EXTENDED) {
      await rentalOrder.update({ status: ORDER_STATUS.EXTENDED });
    } else {
      rentalOrder.status = status;
      await rentalOrder.save();
    }

    if (itemsStatus === ARTWORK_STATUS.AVAILABLE) {
      await rentalOrderService.updateRentalOrderItemsStatus(rentalOrder.id, ARTWORK_STATUS.AVAILABLE);
    }
    if (itemsStatus === ARTWORK_STATUS.RENTED) {
      await rentalOrderService.updateRentalOrderItemsStatus(rentalOrder.id, ARTWORK_STATUS.RENTED);
    }
    if (itemsStatus === ARTWORK_STATUS.RESERVED) {
      await rentalOrderService.updateRentalOrderItemsStatus(rentalOrder.id, ARTWORK_STATUS.RESERVED);
    }
    if (itemsStatus === ARTWORK_STATUS.UNAVAILABLE) {
      await rentalOrderService.updateRentalOrderItemsStatus(rentalOrder.id, ARTWORK_STATUS.UNAVAILABLE);
    }

    if (status === ORDER_STATUS.COMPLETED && session) {
      const eventService = new EventService(session.id);
      await eventService.completeOrder(rentalOrder.id);
    }
    if (status === ORDER_STATUS.CANCELLED && session) {
      const eventService = new EventService(session.id);
      await eventService.cancelOrder(rentalOrder.id);
    }

    return new Response(JSON.stringify({ rentalOrder }), { status: 200 });
  } catch (error) {
    console.error('Error updating rental order status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
