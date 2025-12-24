import { RentalOrderDTO } from '@/models/RentalOrder';
import { Address, Artwork, RentalOrder, RentalOrderItem, User, Payment, ArtworkImage } from '@/models/sequelize';

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
          model: Address,
          as: 'address',
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
          model: Address,
          as: 'address',
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
          model: Address,
          as: 'address',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return order?.toJSON() || null;
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
