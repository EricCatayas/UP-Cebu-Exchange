import { Notification } from '@/models/sequelize';
// import { NOTIFICATION_TYPE } from "@/lib/constants";

class NotificationService {
  async createNotification(title: string, type: string, message: string, metadata?: string): Promise<Notification> {
    const notification = await Notification.create({
      title,
      type,
      message,
      metadata,
      isRead: false,
    });
    return notification;
  }
  async getNotifications(): Promise<Notification[]> {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
    });
    return notifications;
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
