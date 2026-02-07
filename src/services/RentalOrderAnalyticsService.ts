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
import { getDaysRemaining } from '@/lib/order';
import { opTimeframe } from '@/lib/orm';

interface FormattedOrder {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  dueDate: Date;
  status: string;
  daysRemaining: number;
}

interface OrderAnalytics {
  currentOrders: FormattedOrder[];
  count: {
    total: number;
    pending: number;
    reserved: number;
    toReceive: number;
    ongoing: number;
    toReturn: number;
    completed: number;
    cancelled: number;
  };
}

export default class RentalOrderAnalyticsService {
  timeframe?: string;
  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  async getAnalyticsData(): Promise<OrderAnalytics> {
    const ordersData = await RentalOrder.findAll({
      ...(this.timeframe
        ? {
            where: {
              createdAt: opTimeframe(this.timeframe),
            },
          }
        : {}),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
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
          model: Payment,
          as: 'payment',
          attributes: ['id', 'amount', 'status', 'method'],
        },
        {
          model: RentalOrderExtension,
          as: 'extension',
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    const orders = ordersData.map((orderData) => {
      const order = orderData.toJSON();
      return {
        id: order.id,
        user: {
          id: order.user.id,
          fullName: order.user.fullName,
          email: order.user.email,
        },
        status: orderData.getStatus(),
        dueDate: orderData.getDueDate(),
        daysRemaining: getDaysRemaining(order),
      };
    });

    // Filter orders by status
    const pendingOrders = orders.filter((order) => order.status === ORDER_STATUS.PENDING);
    const reservedOrders = orders.filter((order) => order.status === ORDER_STATUS.RESERVED);
    const toReceiveOrders = orders.filter((order) => order.status === ORDER_STATUS.TORECEIVE);
    const ongoingOrders = orders.filter((order) => order.status === ORDER_STATUS.ONGOING);
    const toReturnOrders = orders.filter((order) => order.status === ORDER_STATUS.TORETURN);

    const currentOrders = [
      ...pendingOrders,
      ...reservedOrders,
      ...toReceiveOrders,
      ...ongoingOrders,
      ...toReturnOrders,
    ];
    const completedOrders = orders.filter((order) => order.status === ORDER_STATUS.COMPLETED);
    const cancelledOrders = orders.filter((order) => order.status === ORDER_STATUS.CANCELLED);

    return {
      currentOrders: currentOrders,
      count: {
        total: orders.length,
        pending: pendingOrders.length,
        reserved: reservedOrders.length,
        toReceive: toReceiveOrders.length,
        ongoing: ongoingOrders.length,
        toReturn: toReturnOrders.length,
        completed: completedOrders.length,
        cancelled: cancelledOrders.length,
      },
    };
  }
}
