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
          as: 'rentalOrderItems',
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
          as: 'rentalOrderItems',
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
          as: 'rentalOrderItems',
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
          as: 'rentalOrderItems',
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
}
