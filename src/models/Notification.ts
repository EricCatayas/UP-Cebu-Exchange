export interface NotificationAttributes {
  id: number;
  title: string;
  type: string;
  message: string;
  isRead: boolean;
  metadata?: string; // JSON string
  createdAt: Date;
  readAt?: Date;
  readBy?: number;
}

export interface NotificationDTO extends NotificationAttributes {}
