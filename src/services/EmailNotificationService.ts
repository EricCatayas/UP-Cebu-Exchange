import 'server-only';
import Mailjet from 'node-mailjet';
import { APP_NAME, APP_EMAIL } from '@/lib/constants';
import { PaymentDTO } from '@/models/Payment';
import { RentalOrderDTO } from '@/models/RentalOrder';

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
const EMAIL_API = process.env.MAILJET_API_KEY || '';
const EMAIL_SECRET = process.env.MAILJET_API_SECRET || '';

// TODO
class EmailNotificationService {
  async notifyAdminNewOrder(orderId: number, user: { id: number; fullName: string }) {
    //todo
  }
  async notifyAdminNewCustomer(user: { id: number; fullName: string }) {
    //todo
  }
  async notifyAdminOrderCancelled(orderId: number, user: { id: number; fullName: string }) {
    //todo
  }
  async notifyAdminPaymentReceived(payment: PaymentDTO) {
    //todo
  }
  async notifyAdminOrderStartReminder(order: RentalOrderDTO) {
    // todo
  }
  async notifyAdminOrderReturnReminder(order: RentalOrderDTO) {
    // todo
  }
  async notifyAdminOrderReturnRequest(orderId: number, user: { id: number; fullName: string }) {
    // todo
  }

  // Customer Emails
  async sendPaymentReceipt(email: string, orderId: number, payment: PaymentDTO) {
    // todo
  }
  async sendOrderReceived(email: string, orderId: number) {
    // todo
  }
  async sendRentalReturnReminder(email: string, order: RentalOrderDTO) {
    // todo
  }
  async sendOrderCompleted(email: string, orderId: number) {
    // todo
  }
}

export default EmailNotificationService;
