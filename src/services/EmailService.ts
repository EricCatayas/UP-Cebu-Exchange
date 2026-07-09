import 'server-only';
import Mailjet from 'node-mailjet';
import { APP_NAME, APP_EMAIL } from '@/lib/constants';

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
const EMAIL_API = process.env.MAILJET_API_KEY || '';
const EMAIL_SECRET = process.env.MAILJET_API_SECRET || '';

class EmailService {
  sendEmailVerification(email: string, token: string): Promise<{ success: boolean; error: string | null }> {
    // todo: Add domain and handle errors
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const verificationLink = `${APP_BASE_URL}/verify-email/redirect?token=${encodeURIComponent(token)}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: email, Name: email }],
          Subject: 'Verify your email address',
          TextPart:
            `Hi,\n\nThanks for signing up for UP Cebu Exchange.\n\n` +
            `Please verify your email by clicking the link below:\n` +
            `${verificationLink}\n\n` +
            `If you didn’t create this account, you can safely ignore this message.`,
          HTMLPart: `
  <!doctype html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f7f7f8;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f7f7f8;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 0 28px;font-family:Segoe UI, Arial, sans-serif;color:#111827;">
                  <h1 style="margin:0 0 12px;font-size:20px;line-height:28px;">Verify your email</h1>
                  <p style="margin:0 0 20px;font-size:14px;line-height:22px;color:#374151;">
                    Thanks for signing up for <strong>UP Cebu Exchange</strong>. Please confirm this email address to activate your account.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 24px 28px;" align="left">
                  <a href="${verificationLink}"
                     style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                            font-family:Segoe UI, Arial, sans-serif;font-size:14px;line-height:20px;
                            padding:12px 18px;border-radius:8px;">
                    Verify email
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 24px 28px;font-family:Segoe UI, Arial, sans-serif;">
                  <p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#6b7280;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin:0;font-size:12px;line-height:18px;color:#2563eb;word-break:break-all;">
                    <a href="${verificationLink}" style="color:#2563eb;text-decoration:underline;">${verificationLink}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 28px 28px;font-family:Segoe UI, Arial, sans-serif;color:#6b7280;">
                  <p style="margin:0;font-size:12px;line-height:18px;">
                    If you didn’t create an account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-size:11px;line-height:16px;color:#9ca3af;font-family:Segoe UI, Arial, sans-serif;">
              © ${new Date().getFullYear()} UP Cebu Exchange
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
          `,
          CustomID: 'email_verification',
        },
      ],
    });

    request
      .then((result) => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send email verification' };
      });

    return Promise.resolve({ success: true, error: null });
  }

  // todo: implement password reset email
  sendPasswordReset(email: string, token: string): Promise<{ success: boolean; error: string | null }> {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });

    const resetLink = `${APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: email, Name: email }],
          Subject: 'Reset your password',
          TextPart:
            `Hi,\n\nYou requested a password reset for UP Cebu Exchange.\n\n` +
            `Reset your password by clicking the link below:\n` +
            `${resetLink}\n\n` +
            `If you didn’t request this, you can safely ignore this email.`,
          HTMLPart: `
  <!doctype html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f7f7f8;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f7f7f8;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 0 28px;font-family:Segoe UI, Arial, sans-serif;color:#111827;">
                  <h1 style="margin:0 0 12px;font-size:20px;line-height:28px;">Reset your password</h1>
                  <p style="margin:0 0 20px;font-size:14px;line-height:22px;color:#374151;">
                    You requested a password reset for <strong>UP Cebu Exchange</strong>. Click the button below to continue.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 24px 28px;" align="left">
                  <a href="${resetLink}"
                     style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                            font-family:Segoe UI, Arial, sans-serif;font-size:14px;line-height:20px;
                            padding:12px 18px;border-radius:8px;">
                    Reset password
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 24px 28px;font-family:Segoe UI, Arial, sans-serif;">
                  <p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#6b7280;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin:0;font-size:12px;line-height:18px;color:#2563eb;word-break:break-all;">
                    <a href="${resetLink}" style="color:#2563eb;text-decoration:underline;">${resetLink}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 28px 28px;font-family:Segoe UI, Arial, sans-serif;color:#6b7280;">
                  <p style="margin:0;font-size:12px;line-height:18px;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-size:11px;line-height:16px;color:#9ca3af;font-family:Segoe UI, Arial, sans-serif;">
              © ${new Date().getFullYear()} UP Cebu Exchange
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
          `,
          CustomID: 'password_reset',
        },
      ],
    });

    request
      .then(() => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error:', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send password reset email' };
      });

    console.log(`Sending password reset to ${email} with token ${token}`);
    return Promise.resolve({ success: true, error: null });
  }

  sendNewsletterSubscription(email: string): Promise<{ success: boolean; error: string | null }> {
    const mailjet = new Mailjet({
      apiKey: EMAIL_API,
      apiSecret: EMAIL_SECRET,
      config: { version: 'v3.1' },
    });
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: APP_EMAIL,
            Name: APP_NAME,
          },
          To: [{ Email: email, Name: email }],
          Subject: `Subscribed to ${APP_NAME} Newsletter`,
          TextPart: `You have been subscribed to the ${APP_NAME} newsletter. Thank you!`,
          HTMLPart: `
            <!doctype html>
            <html lang="en">
              <body style="margin:0;padding:0;background:#f7f7f8;font-family:Segoe UI, Arial, sans-serif;color:#111827;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f7f7f8;">
                  <tr>
                    <td align="center" style="padding:32px 16px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;">
                        <tr>
                          <td style="padding:28px 28px 0 28px;font-family:Segoe UI, Arial, sans-serif;color:#111827;">
                            <h1 style="margin:0 0 12px;font-size:20px;line-height:28px;">You're subscribed!</h1>
                            <p style="margin:0 0 20px;font-size:14px;line-height:22px;color:#374151;">Thanks — you've been subscribed to the <strong>${APP_NAME}</strong> newsletter. We'll send updates about new artwork rentals, collections, and events from UP Cebu.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 28px 24px 28px;" align="left">
                            <div style="display:inline-block;background:#e9f2ff;color:#0f172a;text-decoration:none;font-family:Segoe UI, Arial, sans-serif;font-size:14px;line-height:20px;padding:12px 18px;border-radius:8px;border:1px solid #d0e4ff;">Subscribed</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 28px 24px 28px;font-family:Segoe UI, Arial, sans-serif;">
                            <p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#6b7280;">If you don't see the confirmation, please check your spam folder.</p>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:12px 0 0;font-size:11px;line-height:16px;color:#9ca3af;font-family:Segoe UI, Arial, sans-serif;">© ${new Date().getFullYear()} ${APP_NAME}</p>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
          CustomID: 'newsletter_subscription',
        },
      ],
    });

    return request
      .then(() => {
        return { success: true, error: null };
      })
      .catch((err) => {
        console.error('Mailjet error (newsletter):', err?.statusCode || err);
        return { success: false, error: err?.message || 'Failed to send newsletter subscription' };
      });
  }
}

export default EmailService;
