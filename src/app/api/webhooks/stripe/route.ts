import Stripe from 'stripe';
import RentalOrderService from '@/services/RentalOrderService';
import { Artwork, Payment, RentalOrder } from '@/models/sequelize';
import { ARTWORK_STATUS, PAYMENT_STATUS, ORDER_STATUS } from '@/lib/constants';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('\n\nStripe Checkout Session completed:', session);
    const sessionId = session.id;
    const orderId = session.metadata?.orderId;
    const customerEmail = session.customer_email; // todo: email notification

    // Verify Checkout session actually resulted in payment
    if (session.payment_status !== 'paid') {
      console.log(`Checkout session ${sessionId} completed but payment_status=${session.payment_status}. Skipping.`);
      return new Response('ok', { status: 200 });
    }

    const rentalOrder = await RentalOrder.findByPk(orderId, { include: ['payment'] });
    if (!rentalOrder) {
      console.log(`Rental order ${orderId} not found for session ${sessionId}. Skipping.`);
      return new Response('ok', { status: 200 });
    }

    const payment = rentalOrder.payment;
    // Idempotency: short-circuit if already completed
    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      console.log(`Payment ${payment.id} already completed. Skipping duplicate processing for session ${sessionId}.`);
      return new Response('ok', { status: 200 });
    }

    await payment.update({ status: PAYMENT_STATUS.COMPLETED });

    if (orderId) {
      const rentalOrderService = new RentalOrderService();
      await rentalOrderService.markOrderAsPaid(parseInt(orderId));
      console.log(`\n\nPayment ID ${payment.id} for order ${orderId} marked as completed.`);
    }
  }

  return new Response('ok', { status: 200 });
}
