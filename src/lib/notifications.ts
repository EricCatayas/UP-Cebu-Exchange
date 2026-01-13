import NotificationService from '@/services/NotificationService';
import { PaymentDTO } from '@/models/Payment';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { NOTIFICATION_TYPE } from './constants';
import { fmtDate } from './formatter';

export async function newCustomerNotification(user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'New Customer Registered';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `A new customer named ${user.fullName} has just registered.`;
  const metadata = JSON.stringify({ userId: user.id });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function verifiedEmailNotification(user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Email Verification';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `The email address for user ${user.fullName} has been successfully verified.`;
  const metadata = JSON.stringify({ userId: user.id });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function orderPlacedNotification(orderId: number, user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Order Placed';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `An order with ID ${orderId} has been placed successfully by ${user.fullName}.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function orderCancelledNotification(orderId: number, user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Order Cancelled';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `The order with ID ${orderId} has been cancelled by ${user.fullName}.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function paymentCompletedNotification(payment: PaymentDTO, user: { fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Payment Completed';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `Payment with ID ${payment.id} of amount ₱${payment.amount} has been completed successfully by ${user.fullName}.`;
  const metadata = JSON.stringify({ paymentId: payment.id });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function orderStartReminderNotification(order: RentalOrderDTO) {
  const notificationService = new NotificationService();
  const title = 'Order Start Reminder';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `The rental order with ID ${order.id} is scheduled to start on ${fmtDate(
    order.startDate
  )}. Please take necessary actions.`;
  const metadata = JSON.stringify({ orderId: order.id, userId: order.userId });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function orderEndReminderNotification(order: RentalOrderDTO) {
  const notificationService = new NotificationService();
  const title = 'Order End Reminder';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `The rental order with ID ${order.id} is scheduled to end on ${fmtDate(
    order.endDate
  )}. Please take necessary actions.`;
  const metadata = JSON.stringify({ orderId: order.id, userId: order.userId });
  await notificationService.createNotification(title, type, message, metadata);
}

export async function orderReturnRequestNotification(orderId: number, user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Order Return Requested';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `A return has been requested for the order with ID ${orderId} by ${user.fullName}. Please take necessary actions.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.createNotification(title, type, message, metadata);
}
