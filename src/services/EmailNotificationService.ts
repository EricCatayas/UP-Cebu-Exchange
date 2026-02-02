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
                                  <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order</a>
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

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `New Customer Registered - ${user.fullName}`,
          TextPart:
            `New Customer Registered\n\n` +
            `Exciting news! A new user has just created an account on ${APP_NAME}.\n\n` +
            `User Profile:\n` +
            `--------------------------\n` +
            `User ID: ${user.id}\n` +
            `Name: ${user.fullName}\n` +
            `Email: ${user.email}\n\n` +
            `You can view the full user profile and manage permissions in the admin panel:\n` +
            `${APP_BASE_URL}/admin/users/${user.id}\n\n` +
            `This is an automated notification from ${APP_NAME}.`,
          HTMLPart: `
                <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>New User Registration</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                        <tr>
                          <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                              <tr>
                                <td style="background-color: #10B981; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">New Customer Registered</h1>
                                </td>
                              </tr>
                              
                              <tr>
                                <td style="padding: 40px 30px;">
                                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                    Exciting news! A new user has just created an account on <strong>${APP_NAME}</strong>.
                                  </p>
                                  
                                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                    <tr>
                                      <td style="padding: 20px;">
                                        <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">User Profile</h2>
                                        <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                          <strong>User ID:</strong> ${user.id}
                                        </p>
                                        <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                          <strong>Name:</strong> ${user.fullName}
                                        </p>
                                        <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                          <strong>Email:</strong> ${user.email}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                  
                                  <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                    You can view the full user profile and manage permissions in the admin panel:
                                  </p>
                                  
                                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                    <tr>
                                      <td align="center">
                                        <a href="${APP_BASE_URL}/admin/users/${user.id}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #10B981; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View User Profile</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
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

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `Order Cancelled - Order #${orderId}`,
          TextPart:
            `Order Cancelled - Action Required\n\n` +
            `An order has been cancelled on ${APP_NAME}.\n\n` +
            `Cancellation Details:\n` +
            `--------------------------\n` +
            `Order ID: #${orderId}\n` +
            `User ID: #${user.id}\n` +
            `Customer: ${user.fullName}\n\n` +
            `Review the order history to see if any further action is required:\n` +
            `${adminOrderLink}\n\n` +
            `Sent via ${APP_NAME} Admin Notifications.`,
          HTMLPart: `
              <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Cancelled</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <tr>
                              <td style="background-color: #EF4444; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Order Cancelled</h1>
                              </td>
                            </tr>
                            
                            <tr>
                              <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                  An order has been <strong>cancelled</strong> on ${APP_NAME}. Please see the details below to manage inventory or process refunds if necessary.
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 6px; margin: 20px 0;">
                                  <tr>
                                    <td style="padding: 20px;">
                                      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #991B1B;">Cancellation Details</h2>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Order ID:</strong> #${orderId}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>User ID:</strong> #${user.id}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Customer:</strong> ${user.fullName}
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                                
                                <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                  Review the order history to see if any further action is required:
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                  <tr>
                                    <td align="center">
                                      <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #374151; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Review Order</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            
                            <tr>
                              <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                                  Sent via ${APP_NAME} Admin Notifications.
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
    const adminOrderLink = `${APP_BASE_URL}/orders/${orderId}`;
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `New Payment Completed - Order #${orderId}`,
          TextPart:
            `New Payment Completed - Order #${orderId}\n\n` +
            `A new payment has been successfully processed via ${APP_NAME}. Here are the transaction details:\n\n` +
            `Transaction Details:\n` +
            `--------------------------\n` +
            `Payment ID: #${payment.id}\n` +
            `User ID: #${payment.userId}\n` +
            `Amount: ${payment.amount}\n` +
            `Method: ${payment.method}\n` +
            `Status: ${payment.status}\n` +
            `Date: ${payment.createdAt}\n\n` +
            `You can view the full transaction history and manage this payment in the dashboard:\n` +
            `${adminOrderLink}\n\n` +
            `Sent via ${APP_NAME} Admin Notifications.\n` +
            `Last updated: ${payment.updatedAt}`,
          HTMLPart: `
              <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Payment Completed</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <tr>
                              <td style="background-color: #10B981; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Payment Completed</h1>
                              </td>
                            </tr>
                            
                            <tr>
                              <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                  Great news! A new payment has been <strong>successfully processed</strong> via ${APP_NAME}. Here are the transaction details:
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 6px; margin: 20px 0;">
                                  <tr>
                                    <td style="padding: 20px;">
                                      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #166534;">Transaction Details</h2>
                                      
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Payment ID:</strong> #${payment.id}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>User ID:</strong> #${payment.userId}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Amount:</strong> <span style="font-size: 18px; font-weight: bold; color: #10B981;">${payment.amount}</span>
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Method:</strong> ${payment.method}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Status:</strong> <span style="text-transform: capitalize;">${payment.status}</span>
                                      </p>
                                      <p style="margin: 8px 0; font-size: 13px; line-height: 22px; color: #9ca3af;">
                                        <strong>Date:</strong> ${payment.createdAt}
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                                
                                <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                  You can view the full transaction history and manage this payment in the dashboard:
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                  <tr>
                                    <td align="center">
                                      <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Transaction</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            
                            <tr>
                              <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                                  Sent via ${APP_NAME} Admin Notifications.<br>
                                  Last updated: ${payment.updatedAt}
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
    const adminOrderLink = `${APP_BASE_URL}/orders/${orderId}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `Online Payment Received - Order #${orderId}`,
          TextPart:
            `Online Payment Received\n\n` +
            `A new online payment has been successfully processed for ${APP_NAME}.\n\n` +
            `Transaction Summary:\n` +
            `--------------------------\n` +
            `Total Amount: ${amount}\n` +
            `Payment Receipt ID: ${paymentReceiptId}\n` +
            `Order Reference: #${orderId}\n\n` +
            `This payment has been logged against the order. You can view the details in order details:\n` +
            `${adminOrderLink}\n\n` +
            `This is a system-generated confirmation for ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Payment Received</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background-color: #1E40AF; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Online Payment Received</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                A new online payment has been successfully processed for <strong>${APP_NAME}</strong>.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 25px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="padding-bottom: 15px; border-bottom: 1px dashed #CBD5E1;">
                                          <h2 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Total Amount</h2>
                                          <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #1E293B;">${amount}</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding-top: 15px;">
                                          <p style="margin: 8px 0; font-size: 15px; color: #475569;">
                                            <strong>Payment Receipt ID:</strong> <span style="font-family: monospace; color: #1E40AF;">${paymentReceiptId}</span>
                                          </p>
                                          <p style="margin: 8px 0; font-size: 15px; color: #475569;">
                                            <strong>Order Reference:</strong> #${orderId}
                                          </p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                This payment has been logged against the order. You can view the details in order details:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #1E40AF; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order Details</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94A3B8;">
                                This is a system-generated confirmation for ${APP_NAME}.
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

    const adminOrderLink = `${APP_BASE_URL}/orders/${order.id}`;
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `New Order Started - Order #${order.id}`,
          TextPart:
            `Order Start Reminder - Order #${order.id}\n\n` +
            `This is a reminder that an order is scheduled to start today.\n\n` +
            `Order Details:\n` +
            `--------------------------\n` +
            `Order ID: ${order.id}\n` +
            `Customer: ${order.user}\n` +
            `Address: ${order.address}\n` +
            `Extension/Unit: ${order.extension}\n` +
            `Payment Status: ${order.payment}\n` +
            `Items: ${order.items}\n\n` +
            `Please review the full order details here:\n` +
            `${adminOrderLink}\n\n` +
            `Automated Order Start Notification.`,

          HTMLPart: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Start Reminder</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        
                        <tr>
                          <td style="background-color: #3B82F6; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Order Start Reminder</h1>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                              This is a reminder that an order is scheduled to <strong>start today</strong>.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px; margin: 20px 0;">
                              <tr>
                                <td style="padding: 20px;">
                                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1E40AF;">Order Details</h2>
                                  
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Customer:</strong> ${order.id}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Customer:</strong> ${order.user}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Address:</strong> ${order.address}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Extension/Unit:</strong> ${order.extension}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Payment Status:</strong> ${order.payment}
                                  </p>
                                  <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                    <strong>Items:</strong> ${order.items}
                                  </p>
                                </td>
                              </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #1E40AF; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order Details</a>
                                  </td>
                                </tr>
                              </table>

                          </td>
                        </tr>

                        
                        <tr>
                          <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; line-height: 20px; color: #9ca3af;">
                              Automated Order Start Notification.
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

    const adminOrderLink = `${APP_BASE_URL}/orders/${order.id}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `Order Returned - Order #${order.id}`,
          TextPart:
            `Order Return Initiated - Order #${order.id}\n\n` +
            `An item return has been requested for an order on ${APP_NAME}.\n\n` +
            `Return Details:\n` +
            `--------------------------\n` +
            `Order ID: #${order.id}\n` +
            `Customer: ${order.user}\n` +
            `Payment: ${order.payment}\n` +
            `Address: ${order.address}\n\n` +
            `View the returned order details here:\n` +
            `${adminOrderLink}\n\n` +
            `This is an automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Return Notification</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            
                            <tr>
                              <td style="background-color: #EA580C; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Order Return Initiated</h1>
                              </td>
                            </tr>
                            
                            <tr>
                              <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                  An item return has been requested for an order on <strong>${APP_NAME}</strong>.
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                  <tr>
                                    <td style="padding: 20px;">
                                      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Return Details</h2>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Order ID:</strong> #${order.id}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Customer:</strong> ${order.user}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Payment:</strong> ${order.payment}
                                      </p>
                                      <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                        <strong>Address:</strong>${order.address}
                                      </p>
                                    </td>
                                  </tr>
                                </table>

                                
                                <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                  View the returned order details here:
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                  <tr>
                                    <td align="center">
                                      <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #EA580C; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order Details</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            
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

    const adminOrderLink = `${APP_BASE_URL}/orders/${orderId}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: APP_EMAIL, Name: APP_NAME }],
          Subject: `Order Return Request - Order #${orderId}`,
          TextPart:
            `Order Return Request - Order #${orderId}\n\n` +
            `A customer has submitted a request to return items from their order on ${APP_NAME}.\n\n` +
            `Request Details:\n` +
            `--------------------------\n` +
            `Order ID: #${orderId}\n` +
            `Customer Name: ${user.fullName}\n` +
            `Customer ID: ${user.id}\n\n` +
            `Review the return request here:\n` +
            `${adminOrderLink}\n\n` +
            `This is an automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Return Request Received</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          
                          <tr>
                            <td style="background-color: #EA580C; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Return Request Received</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                A customer has submitted a request to return items from their order on <strong>${APP_NAME}</strong>.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Request Details</h2>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Order ID:</strong> #${orderId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer Name:</strong> ${user.fullName}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer ID:</strong> ${user.id}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Review the return request here:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${adminOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #EA580C; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Review Return Request</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
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

    // todo: link to order details or payment receipt page
    const paymentReceiptLink = `${APP_BASE_URL}/account/payments/${paymentReceiptId}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: `Online Payment Receipt for Order #${orderId}`,
          TextPart:
            `Online Payment Receipt for Order #${orderId}\n\n` +
            `An online payment has been successfully processed for ${APP_NAME}.\n\n` +
            `Transaction Details:\n` +
            `--------------------------\n` +
            `Amount: ${amount}\n` +
            `Order ID: #${orderId}\n` +
            `Receipt ID: ${paymentReceiptId}\n` +
            `Customer: ${user.fullName}\n` +
            `Email: ${user.email}\n\n` +
            `Transaction details can be managed via the link below:\n` +
            `${paymentReceiptLink}\n\n` +
            `Automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Payment Receipt</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          
                          <tr>
                            <td style="background-color: #0D9488; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Payment Received</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                An online payment has been successfully processed for <strong>${APP_NAME}</strong>.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Transaction Details</h2>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Amount:</strong> ${amount}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Order ID:</strong> #${orderId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Receipt ID:</strong> ${paymentReceiptId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer:</strong> ${user.fullName}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Email:</strong> ${user.email}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Transaction details can be managed via the link below:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${paymentReceiptLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #0D9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Transaction</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                                Automated notification from ${APP_NAME}.
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
    const paymentReceiptLink = `${APP_BASE_URL}/account/payments/${paymentId}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: `Payment Receipt for Order #${orderId}`,
          TextPart:
            `Payment Receipt for Order #${orderId}\n\n` +
            `A payment has been successfully processed for ${APP_NAME}.\n\n` +
            `Transaction Details:\n` +
            `--------------------------\n` +
            `Amount: ${amount}\n` +
            `Order ID: #${orderId}\n` +
            `Receipt ID: ${paymentId}\n` +
            `Customer: ${user.fullName}\n` +
            `Email: ${user.email}\n\n` +
            `Transaction details can be managed via the link below:\n` +
            `${paymentReceiptLink}\n\n` +
            `Automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Payment Receipt</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          
                          <tr>
                            <td style="background-color: #0D9488; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Payment Received</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                A payment has been successfully processed for <strong>${APP_NAME}</strong>.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Transaction Details</h2>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Amount:</strong> ${amount}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Order ID:</strong> #${orderId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Receipt ID:</strong> ${paymentId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer:</strong> ${user.fullName}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Email:</strong> ${user.email}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Transaction details can be managed via the link below:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${paymentReceiptLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #0D9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Transaction</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                                Automated notification from ${APP_NAME}.
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

    const orderLink = `${APP_BASE_URL}/account/rentals/${orderId}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: `Order Received - Order #${orderId}`,
          TextPart:
            `Order Received - Order #${orderId}\n\n` +
            `A new order has been successfully received from ${APP_NAME}.\n\n` +
            `Order Details:\n` +
            `--------------------------\n` +
            `Order ID: #${orderId}\n` +
            `Customer Name: ${user.fullName}\n` +
            `Customer Email: ${user.email}\n` +
            `Customer ID: ${user.id}\n\n` +
            `Review the order details here:\n` +
            `${orderLink}\n\n` +
            `Automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Order Received</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          
                          <tr>
                            <td style="background-color: #4F46E5; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Order Received</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                A new order has been successfully received from <strong>${APP_NAME}</strong>.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Order Details</h2>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Order ID:</strong> #${orderId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer Name:</strong> ${user.fullName}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer Email:</strong> ${user.email}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer ID:</strong> ${user.id}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Review the order details here:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${orderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Review Order Details</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                                Automated notification from ${APP_NAME}.
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

  // Todo: Send Rental Return Reminder to Customer
  async sendRentalReturnReminder(user: { id: number; email: string; fullName: string }, order: RentalOrderDTO) {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const endDate = new Date(order.endDate);
    const returnDueDate = getReturnDueDate(order);
    const orderLink = `${APP_BASE_URL}/account/rentals/${order.id}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: `Return Reminder for Order #${order.id}`,
          TextPart:
            `Return Reminder for Order #${order.id}\n\n` +
            `This is a reminder regarding a pending return request on ${APP_NAME}. We are currently awaiting the shipment of the items listed below.\n\n` +
            `Order Details:\n` +
            `--------------------------\n` +
            `Order ID: #${order.id}\n` +
            `Customer: ${user.fullName}\n` +
            `Email: ${user.email}\n` +
            `Address: ${order.address}\n` +
            `Customer ID: ${user.id}\n\n` +
            `View the order details here:\n` +
            `${orderLink}\n\n` +
            `This is an automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Order Return Reminder</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          
                          <tr>
                            <td style="background-color: #1D4ED8; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Return Reminder</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                This is a reminder regarding a pending return request on <strong>${APP_NAME}</strong>. We are currently awaiting the shipment of the items listed below.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Order Details:</h2>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer:</strong> ${user.fullName}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Email:</strong> ${user.email}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Address:</strong> ${order.address}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer ID:</strong> ${user.id}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 25px 0 10px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                View the order details here:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${orderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #1D4ED8; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Order Details</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
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

    const customerOrderLink = `${APP_BASE_URL}/account/rentals/${orderId}`;
    //todo
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: user.email, Name: user.fullName }],
          Subject: `Order Completed - Order #${orderId}`,
          TextPart:
            `Order Completed - Order #${orderId}\n\n` +
            `Great news! An order has been successfully fulfilled and marked as completed on ${APP_NAME}.\n\n` +
            `Order Summary:\n` +
            `--------------------------\n` +
            `Order ID: #${orderId}\n` +
            `Customer: ${user.fullName}\n` +
            `Customer Email: ${user.email}\n` +
            `Customer ID: ${user.id}\n\n` +
            `You can view the full transaction history and details in the admin portal here:\n` +
            `${customerOrderLink}\n\n` +
            `This is an automated notification from ${APP_NAME}.`,
          HTMLPart: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Order Completed</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          
                          <tr>
                            <td style="background-color: #10B981; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Order Completed</h1>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Great news! An order has been successfully fulfilled and marked as completed on <strong>${APP_NAME}</strong>.
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                  <td style="padding: 20px;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Order Summary</h2>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Order ID:</strong> #${orderId}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer:</strong> ${user.fullName}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer Email:</strong> ${user.email}
                                    </p>
                                    <p style="margin: 8px 0; font-size: 15px; line-height: 22px; color: #4b5563;">
                                      <strong>Customer ID:</strong> ${user.id}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                You can view the full transaction history and details in the admin portal:
                              </p>
                              
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="${customerOrderLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 32px; background-color: #10B981; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Completed Order</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
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
