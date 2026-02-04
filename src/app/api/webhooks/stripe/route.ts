import Stripe from 'stripe';
import EventService from '@/services/EventService';
import RentalOrderService from '@/services/RentalOrderService';
import PaymentTransactionService from '@/services/PaymentTransactionService';
import { Artwork, Payment, PaymentTransaction, RentalOrder } from '@/models/sequelize';
import { ARTWORK_STATUS, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '@/lib/constants';
import { stripe } from '@/lib/stripe';
import { onlinePaymentCompletedNotification } from '@/lib/notifications';

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
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    console.log('\n\nStripe Checkout Session completed:', checkoutSession);
    const checkoutSessionId = checkoutSession.id;
    const orderId = parseInt(checkoutSession.metadata?.orderId!);
    const browserSessionId = checkoutSession.metadata?.sessionId;
    const customerEmail = checkoutSession.customer_email!;
    const paymentIntentId = checkoutSession.payment_intent as string;

    // Verify Checkout session actually resulted in payment
    if (checkoutSession.payment_status !== 'paid') {
      console.log(
        `Checkout session ${checkoutSessionId} completed but payment_status=${checkoutSession.payment_status}. Skipping.`
      );
      return new Response('ok', { status: 200 });
    }

    const rentalOrder = await RentalOrder.findByPk(orderId, { include: ['payment', 'user'] });
    if (!rentalOrder) {
      console.log(`Rental order ${orderId} not found for session ${checkoutSessionId}. Skipping.`);
      return new Response('ok', { status: 200 });
    }

    const payment = rentalOrder.payment;
    // Idempotency: short-circuit if already completed
    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      console.log(
        `Payment ${payment.id} already completed. Skipping duplicate processing for session ${checkoutSessionId}.`
      );
      return new Response('ok', { status: 200 });
    }

    // PAYMENT SUCCESSFUL
    await payment.update({ status: PAYMENT_STATUS.COMPLETED });

    if (payment.method !== PAYMENT_METHOD.ONLINE) {
      await payment.update({ method: PAYMENT_METHOD.ONLINE });
    }

    const paymentTransactionService = new PaymentTransactionService();
    await paymentTransactionService.createStripeTransaction({
      paymentId: payment.id,
      amount: payment.amount,
      currency: checkoutSession.currency || 'PHP',
      metadata: {
        paymentIntentId: paymentIntentId,
        paymentMethod: checkoutSession.payment_method_types?.[0],
        browserSessionId: browserSessionId,
      },
      transactionDate: new Date(),
    });
    rentalOrder.status = ORDER_STATUS.RESERVED;
    await rentalOrder.save();

    const rentalOrderService = new RentalOrderService();
    await rentalOrderService.updateRentalOrderItemsStatus(rentalOrder.id, ARTWORK_STATUS.RESERVED);

    if (browserSessionId) {
      const eventService = new EventService(parseInt(browserSessionId));
      await eventService.completePayment(payment.id);
    }

    await onlinePaymentCompletedNotification(orderId, payment, paymentIntentId, {
      id: rentalOrder.userId,
      email: customerEmail,
      fullName: rentalOrder.user.fullName || customerEmail,
    });
  }

  return new Response('ok', { status: 200 });
}
