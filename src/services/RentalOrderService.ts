import { Op } from 'sequelize';
import { RentalOrderDTO } from '@/models/RentalOrder';
import {
  Address,
  Artwork,
  RentalOrder,
  RentalOrderExtension,
  RentalOrderItem,
  User,
  Payment,
  ArtworkImage,
  RentalPlan,
} from '@/models/sequelize';
import { ARTWORK_STATUS, ORDER_STATUS } from '@/lib/constants';

export default class RentalOrderService {
  async getAllOrders(): Promise<RentalOrderDTO[]> {
    const orders = await RentalOrder.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: Payment,
          as: 'payment',
          attributes: ['id', 'amount', 'status', 'method'],
        },
        {
          model: RentalOrderItem,
          as: 'items',
          include: [
            {
              model: Artwork,
              as: 'artwork',
              attributes: ['id', 'title'],
              include: [
                {
                  model: ArtworkImage,
                  as: 'images',
                  attributes: ['imageUrl'],
                  where: { isPrimary: true },
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: RentalOrderExtension,
          as: 'extension',
        },
      ],
      order: [['startDate', 'ASC']],
    });
    return orders.map((order) => order.toJSON());
  }

  async getOrderDetails(orderId: number): Promise<RentalOrderDTO | null> {
    const order = await RentalOrder.findOne({
      where: { id: orderId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: Payment,
          as: 'payment',
          attributes: ['id', 'amount', 'status', 'method'],
        },
        {
          model: RentalOrderItem,
          as: 'items',
          include: [
            {
              model: Artwork,
              as: 'artwork',
              attributes: ['id', 'title'],
              include: ['artist', 'tags', 'style', 'rentalPlans', 'images'],
            },
          ],
        },
        {
          model: Address,
          as: 'address',
        },
        {
          model: RentalOrderExtension,
          as: 'extension',
        },
      ],
    });

    return order?.toJSON() || null;
  }

  async getUserOrders(userId: number): Promise<RentalOrderDTO[]> {
    const orders = await RentalOrder.findAll({
      where: { userId },
      include: [
        {
          model: Payment,
          as: 'payment',
          attributes: ['id', 'amount', 'status', 'method'],
        },
        {
          model: RentalOrderItem,
          as: 'items',
          include: [
            {
              model: Artwork,
              as: 'artwork',
              attributes: ['id', 'title'],
              include: ['images'],
            },
          ],
        },
        {
          model: Address,
          as: 'address',
        },
        {
          model: RentalOrderExtension,
          as: 'extension',
        },
      ],
      order: [['startDate', 'ASC']],
    });
    return orders.map((order) => order.toJSON());
  }

  async getUserOrderDetails(userId: number, orderId: number): Promise<RentalOrderDTO | null> {
    const order = await RentalOrder.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: Payment,
          as: 'payment',
          attributes: ['id', 'amount', 'status', 'method'],
        },
        {
          model: RentalOrderItem,
          as: 'items',
          include: [
            {
              model: Artwork,
              as: 'artwork',
              include: ['artist', 'images', 'rentalPlans'],
            },
          ],
        },
        {
          model: Address,
          as: 'address',
        },
        {
          model: RentalOrderExtension,
          as: 'extension',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return order?.toJSON() || null;
  }
  // Returns the furthest end date of ongoing rentals for a given artwork
  async getOngoingRentalByArtworkId(artworkId: number): Promise<RentalOrderDTO | null> {
    const rentalOrderItems = await RentalOrderItem.findAll({
      where: { artworkId },
      attributes: ['rentalOrderId'],
    });
    const rentalOrderIds = rentalOrderItems.map((item) => item.rentalOrderId);

    const ongoingOrders = await RentalOrder.findAll({
      where: {
        id: {
          [Op.in]: rentalOrderIds,
        },
        status: {
          [Op.in]: [ORDER_STATUS.RESERVED, ORDER_STATUS.TORECEIVE, ORDER_STATUS.ONGOING, ORDER_STATUS.TORETURN],
        },
      },
      order: [['endDate', 'DESC']],
    });

    if (ongoingOrders.length === 0) {
      return null;
    }
    let furthestEndOrder = ongoingOrders[0];
    return furthestEndOrder.toJSON();
  }

  async markOrderAsPending(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.PENDING });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.AVAILABLE);
  }
  async markOrderAsPaid(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder && rentalOrder.status === ORDER_STATUS.PENDING) {
      await rentalOrder.update({ status: ORDER_STATUS.RESERVED });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.RESERVED);
  }
  async markOrderAsReserved(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.RESERVED });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.RESERVED);
  }
  async markOrderAsToReceive(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.TORECEIVE });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.RESERVED);
  }
  async markOrderAsOngoing(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.ONGOING });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.RENTED);
  }
  async markOrderAsCompleted(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.COMPLETED });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.AVAILABLE);
  }
  async markOrderAsToReturn(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.TORETURN });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.RENTED);
  }
  async markOrderAsCancelled(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (rentalOrder) {
      await rentalOrder.update({ status: ORDER_STATUS.CANCELLED });
    }
    this.updateRentalOrderItemsStatus(orderId, ARTWORK_STATUS.AVAILABLE);
  }

  private async updateRentalOrderItemsStatus(orderId: number, newStatus: ARTWORK_STATUS): Promise<void> {
    const rentalOrderItems = await RentalOrderItem.findAll({
      where: { rentalOrderId: orderId },
      include: [
        {
          model: Artwork,
          as: 'artwork',
        },
      ],
    });
    for (const item of rentalOrderItems) {
      if (item.artwork) {
        await item.artwork.update({ status: newStatus });
      }
    }
  }
}
