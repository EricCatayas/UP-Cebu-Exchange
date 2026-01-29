import EmailNotificationService from '@/services/EmailNotificationService';
import NotificationService from '@/services/NotificationService';
import { PaymentDTO } from '@/models/Payment';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { NOTIFICATION_TYPE } from '@/lib/constants';
import { getReturnDueDate } from '@/lib/order';
import { fmtDate } from '@/lib/formatter';
import { UserDTO } from '@/models/User';

export async function newCustomerNotification(user: { id: number; fullName: string }) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'New Customer Registered';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `A new customer named ${user.fullName} has just registered.`;
  const metadata = JSON.stringify({ userId: user.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminNewCustomer(user);
}

export async function verifiedEmailNotification(user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Email Verification';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `The email address for user ${user.fullName} has been successfully verified.`;
  const metadata = JSON.stringify({ userId: user.id });
  await notificationService.create(title, type, message, metadata);
}

export async function orderPlacedNotification(orderId: number, user: { id: number; fullName: string }) {
  const notificationService = new NotificationService();
  const title = 'Order Placed';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `An order with ID ${orderId} has been placed by ${user.fullName}.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.create(title, type, message, metadata);
  const emailNotificationService = new EmailNotificationService();
  await emailNotificationService.notifyAdminNewOrder(orderId, user);
}

export async function orderCancelledNotification(orderId: number, user: { id: number; fullName: string }) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Order Cancelled';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `The order with ID ${orderId} has been cancelled by ${user.fullName}.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminOrderCancelled(orderId, user);
}

export async function onlinePaymentCompletedNotification(
  orderId: number,
  payment: PaymentDTO,
  paymentReceiptId: string,
  user: { email: string; fullName: string }
) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Payment Completed';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `Payment with ID ${payment.id} of amount ₱${payment.amount} has been completed successfully by ${user.fullName}. Payment Receipt ID: ${paymentReceiptId}.`;
  const metadata = JSON.stringify({ paymentId: payment.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminOnlinePaymentReceived(orderId, paymentReceiptId, payment.amount);
  await emailNotificationService.sendOnlinePaymentReceipt(user.email, orderId, paymentReceiptId, payment.amount);
}

export async function orderPaidNotification(orderId: number, payment: PaymentDTO, user: { email: string }) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Payment Received';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `Payment with ID ${payment.id} of amount ₱${payment.amount} has been completed successfully for order ID ${orderId}.`;
  const metadata = JSON.stringify({ paymentId: payment.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminPaymentReceived(payment);
  await emailNotificationService.sendPaymentReceipt(user.email, orderId, payment.id, payment.amount);
}

export async function orderStartReminderNotification(order: RentalOrderDTO) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Order Start Reminder';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const message = `The rental order with ID ${order.id} is scheduled to start on ${fmtDate(
    order.startDate
  )}. Please take necessary actions.`;
  const metadata = JSON.stringify({ orderId: order.id, userId: order.userId });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminOrderStartReminder(order);
}

export async function orderReceivedNotification(
  orderId: number,
  user: { id: number; fullName: string; email: string }
) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Order Received';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `The order with ID ${orderId} has been marked as received by ${user.fullName}.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.sendOrderReceived(user.email, orderId);
}

export async function orderReturnReminderNotification(
  order: RentalOrderDTO,
  user: { id: number; fullName: string; email: string }
) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Order Return Reminder';
  const type = NOTIFICATION_TYPE.SYSTEM_ALERT;
  const returnDueDate = getReturnDueDate(order);
  const message = `The rental order with ID ${order.id} is scheduled to end on ${fmtDate(
    order.endDate
  )}. Please return the items on ${fmtDate(returnDueDate)}.`;
  const metadata = JSON.stringify({ orderId: order.id, userId: order.userId });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminOrderReturnReminder(order);
  await emailNotificationService.sendRentalReturnReminder(user.email, order);
}

export async function orderReturnRequestNotification(
  orderId: number,
  user: { id: number; fullName: string; email: string }
) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Order Return Requested';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `A return has been requested for the order with ID ${orderId} by ${user.fullName}. Please take necessary actions.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.notifyAdminOrderReturnRequest(orderId, user);
}

export async function orderCompletedNotification(
  orderId: number,
  user: { id: number; fullName: string; email: string }
) {
  const emailNotificationService = new EmailNotificationService();
  const notificationService = new NotificationService();
  const title = 'Order Completed';
  const type = NOTIFICATION_TYPE.ORDER_UPDATE;
  const message = `The order with ID ${orderId} has been marked as completed.`;
  const metadata = JSON.stringify({ orderId, userId: user.id });
  await notificationService.create(title, type, message, metadata);
  await emailNotificationService.sendOrderCompleted(user.email, orderId);
}
