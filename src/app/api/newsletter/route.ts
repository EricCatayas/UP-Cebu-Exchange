import EmailService from '@/services/EmailService';
import { NextRequest, NextResponse } from 'next/server';
import { ERROR_MESSAGE } from '@/lib/constants';
import { newsletterSubscriptionNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
    try {

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await newsletterSubscriptionNotification(email);

        const emailService = new EmailService();
        const result = await emailService.sendNewsletterSubscription(email);

        if (!result.success) {
            console.error('Failed to send newsletter subscription email:', result.error);
            return NextResponse.json({ error: ERROR_MESSAGE }, { status: 500 });
        }

        return NextResponse.json({ message: 'Newsletter subscription successful' }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }

}