import 'server-only';

interface SendGridMessage {
  to: string;
  from: {
    email: string;
    name: string;
  };
  subject: string;
  text: string;
  html: string;
}

class EmailService {
  sendEmailVerification(email: string, token: string): void {
    // Logic to send email verification
    console.log(`Sending email verification to ${email} with token ${token}`);
  }
}

export default EmailService;
