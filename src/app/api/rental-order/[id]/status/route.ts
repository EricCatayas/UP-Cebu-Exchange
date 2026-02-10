import EventService from '@/services/EventService';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder, RentalOrderExtension, RentalOrderItem, User } from '@/models/sequelize';
import { Op } from 'sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { ARTWORK_STATUS, ORDER_STATUS, ORDER_STATUSES } from '@/lib/constants';
import {
  orderReservedNotification,
  orderToReceiveNotification,
  orderReceivedNotification,
  orderReturnReminderNotification,
  orderCompletedNotification,
  orderCancelledNotification,
  orderCancelledDueToReservationNotification,
} from '@/lib/notifications';
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

    const rentalOrder = await RentalOrder.findByPk(orderId, { include: ['user', 'payment'] });

    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    const session = await getCurrentSession();

    const rentalOrderService = new RentalOrderService();

    // PENDING
    if (status === ORDER_STATUS.PENDING) {
      await rentalOrder.update({ status: ORDER_STATUS.PENDING });
    }
    // RESERVED
    else if (status === ORDER_STATUS.RESERVED) {
      const items = await RentalOrderItem.findAll({ where: { rentalOrderId: rentalOrder.id } });
      const artworkIds = items.map((item) => item.artworkId);

      // Check if any of the artworks exist in another pending order
      // If exists, cancel the other pending order and notify the user
      const conflictingOrders = await RentalOrder.findAll({
        where: {
          userId: {
            [Op.ne]: rentalOrder.userId,
          },
          status: ORDER_STATUS.PENDING,
        },
        include: [
          {
            model: RentalOrderItem,
            as: 'items',
            where: {
              artworkId: artworkIds,
            },
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'email'],
          },
        ],
      });

      for (const order of conflictingOrders) {
        await rentalOrderService.cancelRentalOrderAndExtensions(order.id);
        await orderCancelledDueToReservationNotification(order.id, rentalOrder.id, {
          id: currentUser.userId,
          email: rentalOrder.user.email,
          fullName: rentalOrder.user.fullName,
        });
      }

      await rentalOrder.update({ status: ORDER_STATUS.RESERVED });
      await orderReservedNotification(rentalOrder.id, rentalOrder.user);
    }
    // TO RECEIVE
    else if (status === ORDER_STATUS.TORECEIVE) {
      await rentalOrder.update({ status: ORDER_STATUS.TORECEIVE });

      await orderToReceiveNotification(rentalOrder, rentalOrder.user);
    }
    // ONGOING
    else if (status === ORDER_STATUS.ONGOING) {
      await rentalOrder.update({ status: ORDER_STATUS.ONGOING });

      await orderReceivedNotification(rentalOrder.id, rentalOrder.user);
    }
    // TO RETURN
    else if (status === ORDER_STATUS.TORETURN) {
      await rentalOrder.update({ status: ORDER_STATUS.TORETURN });

      // If rental order has an extension, cancel all related extensions
      const extension = await RentalOrderExtension.findOne({ where: { originalOrderId: rentalOrder.id } });
      if (extension) {
        await rentalOrderService.cancelRentalOrderAndExtensions(extension.extensionOrderId);
      }

      await orderReturnReminderNotification(rentalOrder, rentalOrder.user);
    }
    // COMPLETED
    else if (status === ORDER_STATUS.COMPLETED) {
      await rentalOrder.update({ status: ORDER_STATUS.COMPLETED });
      await orderCompletedNotification(rentalOrder.id, rentalOrder.user);
    }
    // CANCELLED
    else if (status === ORDER_STATUS.CANCELLED) {
      await rentalOrderService.cancelRentalOrderAndExtensions(rentalOrder.id);
      await orderCancelledNotification(rentalOrder.id, { id: currentUser.userId, fullName: rentalOrder.user.fullName });
    }
    // EXTENDED
    else if (status === ORDER_STATUS.EXTENDED) {
      await rentalOrder.update({ status: ORDER_STATUS.EXTENDED });
    }
    // Unhandled status
    else {
      return new Response(JSON.stringify({ error: `Unhandled status: ${status}` }), { status: 400 });
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
