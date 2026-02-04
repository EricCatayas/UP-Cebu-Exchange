export interface NotificationAttributes {
  id: number;
  title: string;
  type: string;
  message: string;
  isRead: boolean;
  metadata?: string | null; // JSON string
  createdAt: Date;
  readAt?: Date | null;
  readBy?: number | null;
}

export interface NotificationDTO extends NotificationAttributes {}

export interface PaginatedNotifications {
  page: number;
  pageSize: number;
  nextPage?: number;
  previousPage?: number;
  totalPages: number;
  items: NotificationDTO[];
}
