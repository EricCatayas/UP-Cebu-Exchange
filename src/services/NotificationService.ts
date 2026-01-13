import { Notification } from '@/models/sequelize';
import { NotificationDTO, PaginatedNotifications } from '@/models/Notification';
// import { NOTIFICATION_TYPE } from "@/lib/constants";

class NotificationService {
  async create(title: string, type: string, message: string, metadata?: string): Promise<NotificationDTO> {
    const notification = await Notification.create({
      title,
      type,
      message,
      metadata,
      isRead: false,
    });
    return notification.toJSON();
  }
  async getAll({ page = 1, limit = 20 }): Promise<PaginatedNotifications> {
    const offset = (page - 1) * limit;
    const { count, rows } = await Notification.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    return {
      page,
      pageSize: limit,
      nextPage: page < totalPages ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
      totalPages,
      items: rows.map((notification) => notification.toJSON()),
    };
  }
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    await Notification.update(
      {
        isRead: true,
        readAt: new Date(),
        readBy: userId,
      },
      {
        where: { id: notificationId },
      }
    );
  }
  async markAllAsRead(userId: number): Promise<void> {
    await Notification.update(
      {
        isRead: true,
        readAt: new Date(),
        readBy: userId,
      },
      {
        where: { isRead: false },
      }
    );
  }
}

export default NotificationService;
