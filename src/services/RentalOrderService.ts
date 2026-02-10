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
      order: [['createdAt', 'ASC']],
    });
    return orders.map((order) => order.toJSON());
  }

  async getOrderDetails(orderId: number): Promise<RentalOrderDTO | null> {
    return this.getOrderWithIncludeAll({ id: orderId });
  }

  async getPaymentOrderDetails(paymentId: number): Promise<RentalOrderDTO | null> {
    return this.getOrderWithIncludeAll({ paymentId });
  }

  async getUserOrderDetails(userId: number, orderId: number): Promise<RentalOrderDTO | null> {
    return this.getOrderWithIncludeAll({ id: orderId, userId });
  }

  private async getOrderWithIncludeAll(where: any): Promise<RentalOrderDTO | null> {
    const order = await RentalOrder.findOne({
      where,
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
              attributes: ['id', 'title', 'heightCm', 'widthCm'],
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
      order: [['createdAt', 'DESC']],
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
      order: [['createdAt', 'ASC']],
    });
    return orders.map((order) => order.toJSON());
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

  async updateRentalOrderItemsStatus(orderId: number, newStatus: ARTWORK_STATUS): Promise<void> {
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

  async cancelRentalOrderAndExtensions(orderId: number): Promise<void> {
    const rentalOrder = await RentalOrder.findByPk(orderId);

    const extension = await RentalOrderExtension.findOne({
      where: { originalOrderId: orderId },
    });

    // Find last extension and cancel it recursively
    if (extension) {
      const extensionOrder = await RentalOrder.findByPk(extension.extensionOrderId);
      if (extensionOrder) {
        await this.cancelRentalOrderAndExtensions(extensionOrder.id);
      }
    }

    // Recursively delete precedent extension record
    const precedentExtension = await RentalOrderExtension.findOne({
      where: { extensionOrderId: orderId },
    });

    if (precedentExtension) {
      await precedentExtension.destroy();
    }

    if (rentalOrder) {
      rentalOrder.status = ORDER_STATUS.CANCELLED;
      await rentalOrder.save();
    }
  }
}
