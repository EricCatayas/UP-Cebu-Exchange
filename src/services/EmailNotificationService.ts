import 'server-only';
import Mailjet from 'node-mailjet';
import { APP_NAME, APP_EMAIL } from '@/lib/constants';
import { PaymentDTO } from '@/models/Payment';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getReturnDueDate } from '@/lib/order';

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
const EMAIL_API = process.env.MAILJET_API_KEY || '';
const EMAIL_SECRET = process.env.MAILJET_API_SECRET || '';

// TODO
class EmailNotificationService {
  async notifyAdminNewOrder(orderId: number, user: { id: number; fullName: string }) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const adminOrderLink = `${APP_BASE_URL}/orders/${orderId}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `New Order Received - Order #${orderId}`,
          TextPart:
            `New Order Notification\n\n` +
            `A new order has been placed on ${APP_NAME}.\n\n` +
            `Order Details:\n` +
            `Order ID: #${orderId}\n` +
            `Customer: ${user.fullName} (ID: ${user.id})\n\n` +
            `Please review and process this order in the admin dashboard:\n` +
            `${adminOrderLink}\n\n` +
            `This is an automated notification from ${APP_NAME}.`,
          HTMLPart: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Order Notification</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                          <td style="background-color: #4F46E5; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">New Order Received</h1>
                          </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                              A new order has been placed on <strong>${APP_NAME}</strong>.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                              <tr>
                                <td style="padding: 20px;">
                                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Order Details</h2>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Order ID:</strong> #${orderId}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Customer:</strong> ${user.fullName}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Customer ID:</strong> ${user.id}
                                  </p>
                                </td>
                              </tr>
                            </table>
                            
                            <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                              Please review and process this order in the admin dashboard:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                              <tr>
                                <td align="center">
                                  <a href="${adminOrderLink}" style="display: inline-block; padding: 14px 32px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                              This is an automated notification from ${APP_NAME}.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
              `,
          CustomID: 'new_order_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send new order email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  async notifyAdminNewCustomer(user: { id: number; fullName: string; email: string }) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const newUserLink = `${APP_BASE_URL}/users/${user.id}`;

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'new_customer_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send new customer email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  async notifyAdminOrderCancelled(orderId: number, user: { id: number; fullName: string }) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const adminOrderLink = `${APP_BASE_URL}/orders/${orderId}`;

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_cancelled_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send order cancelled email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Manual Payment Emails
  async notifyAdminPaymentCompleted(orderId: number, payment: PaymentDTO) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'payment_completed_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send payment completed email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Online Payment Emails
  async notifyAdminOnlinePaymentReceived(orderId: number, paymentReceiptId: string, amount: number) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'online_payment_received_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send online payment receipt email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Reminder of Order Start Date
  async notifyAdminOrderStartReminder(order: RentalOrderDTO) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_start_reminder_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send order start reminder email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Reminder of Order Return/End Date
  async notifyAdminOrderReturnReminder(order: RentalOrderDTO) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_return_reminder_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send order return reminder email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Notify Admin of Return Request from Customer
  async notifyAdminOrderReturnRequest(orderId: number, user: { id: number; fullName: string }) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_return_request_notification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send order return request email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Send Online Payment Receipt to Customer
  async sendOnlinePaymentReceipt(
    user: { email: string; fullName: string },
    orderId: number,
    paymentReceiptId: string,
    amount: number
  ) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'online_payment_receipt',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send online payment receipt email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Send Payment Receipt to Customer (Manual Payment)
  async sendPaymentReceipt(
    user: { id: number; email: string; fullName: string },
    orderId: number,
    paymentId: number,
    amount: number
  ) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'payment_receipt',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send payment receipt email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Send Order Received Confirmation to Customer
  async sendOrderReceived(user: { id: number; email: string; fullName: string }, orderId: number) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_received',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send order received email' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Send Rental Return Reminder to Customer
  async sendRentalReturnReminder(user: { id: number; email: string; fullName: string }, order: RentalOrderDTO) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const endDate = new Date(order.endDate);
    const returnDueDate = getReturnDueDate(order);
    const orderLink = `${APP_BASE_URL}/account/rentals/${order.id}`;

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_return_reminder',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return {
          success: false,
          error: err?.message || 'Failed to send order return reminder email',
        };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // Send Order Completed Confirmation to Customer
  async sendOrderCompleted(user: { id: number; email: string; fullName: string }, orderId: number) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: ``,
          TextPart: ``,
          HTMLPart: `
              
              `,
          CustomID: 'order_completed',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return {
          success: false,
          error: err?.message || 'Failed to send order completed email',
        };
      });

    return Promise.resolve({ success: true, error: null });
  }
}

export default EmailNotificationService;
