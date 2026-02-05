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
import { getOrderStatus } from '@/lib/order';
import { opTimeframe } from '@/lib/orm';

interface DueOrder {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  dueDate: Date;
  remainingDays: number;
}

interface OrderStatus {
  count: number;
  nextDueOrder: DueOrder | null;
}

interface OrderAnalytics {
  pendingOrders: OrderStatus;
  reservedOrders: OrderStatus;
  toReceiveOrders: OrderStatus;
  ongoingOrders: OrderStatus;
  toReturnOrders: OrderStatus;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
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

    const orders = ordersData.map((order) => ({
      ...order.toJSON(),
      status: order.getStatus(),
      dueDate: order.getDueDate(),
    }));

    // Helper function to find next due order (closest due date)
    const findNextDueOrder = (filteredOrders: any[]): DueOrder | null => {
      if (filteredOrders.length === 0) return null;

      const now = new Date();
      const ordersWithDueDates = filteredOrders
        .map((order) => {
          const dueDate = order.dueDate ? new Date(order.dueDate) : null;
          const remainingDays = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

          return {
            id: order.id,
            user: {
              id: order.user.id,
              fullName: order.user.fullName,
              email: order.user.email,
            },
            dueDate,
            remainingDays,
          };
        })
        .filter((order) => order.dueDate !== null)
        .sort((a, b) => {
          if (!a.dueDate || !b.dueDate) return 0;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });

      return ordersWithDueDates.length > 0 ? ordersWithDueDates[0] : null;
    };

    // Filter orders by status
    const pendingOrders = orders.filter((order) => order.status === ORDER_STATUS.PENDING);
    const reservedOrders = orders.filter((order) => order.status === ORDER_STATUS.RESERVED);
    const toReceiveOrders = orders.filter((order) => order.status === ORDER_STATUS.TORECEIVE);
    const ongoingOrders = orders.filter((order) => order.status === ORDER_STATUS.ONGOING);
    const toReturnOrders = orders.filter((order) => order.status === ORDER_STATUS.TORETURN);
    const completedOrders = orders.filter((order) => order.status === ORDER_STATUS.COMPLETED);
    const cancelledOrders = orders.filter((order) => order.status === ORDER_STATUS.CANCELLED);

    return {
      totalOrders: orders.length,
      pendingOrders: {
        count: pendingOrders.length,
        nextDueOrder: findNextDueOrder(pendingOrders),
      },
      reservedOrders: {
        count: reservedOrders.length,
        nextDueOrder: findNextDueOrder(reservedOrders),
      },
      toReceiveOrders: {
        count: toReceiveOrders.length,
        nextDueOrder: findNextDueOrder(toReceiveOrders),
      },
      ongoingOrders: {
        count: ongoingOrders.length,
        nextDueOrder: findNextDueOrder(ongoingOrders),
      },
      toReturnOrders: {
        count: toReturnOrders.length,
        nextDueOrder: findNextDueOrder(toReturnOrders),
      },
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
    };
  }
}
