import 'server-only';
import Mailjet from 'node-mailjet';

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
            // Replace with a verified sender on Mailjet if available
            Email: 'catayasericjay@gmail.com',
            Name: 'UP Cebu Exchange',
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

    console.log(`Sending email verification to ${email} with token ${token}`);
    return Promise.resolve({ success: true, error: null });
  }
}

export default EmailService;
