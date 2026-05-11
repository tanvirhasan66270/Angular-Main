export interface Notification {
  notificationId?: string;
  recipientId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;//date
}