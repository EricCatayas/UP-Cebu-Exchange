import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder, RentalOrderItem } from '@/models/sequelize';
import { RentalOrderItemDTO } from '@/models/RentalOrderItem';
import { getCurrentUser, isAdmin, canEditContent } from '@/lib/auth';
import { isOrderReturnable } from '@/lib/order';
import { getImageUrls } from '@/lib/artwork';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const orderId = parseInt((await params).id);

    const rentalOrderService = new RentalOrderService();
    const rentalOrder = await rentalOrderService.getOrderDetails(orderId);
    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    const payment = rentalOrder.payment;
    const paymentStatus = payment?.status;
    if (paymentStatus === PAYMENT_STATUS.COMPLETED) {
      return new Response(JSON.stringify({ error: 'Order is already paid' }), { status: 400 });
    }

    const rentalItems: RentalOrderItemDTO[] = rentalOrder.items;

    const lineItems = rentalItems.map((item) => ({
      price_data: {
        currency: 'php',
        product_data: {
          name: `${item.artwork.title || 'Untitled'} - ${rentalOrder.durationMonths}-Month Rental`,
          description: item.artwork.description,
          images: getImageUrls(item.artwork),
        },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: 1,
    }));

    const heading = `UP Cebu Exchange - ${rentalOrder.durationMonths}-Month Rental Order #${orderId}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL}/account/rentals/${orderId}/payment/success`,
      cancel_url: `${process.env.APP_BASE_URL}/account/rentals/${orderId}/payment/cancelled`,
      customer_email: currentUser.email,
      metadata: {
        orderId: orderId.toString(),
        userId: currentUser.userId.toString(),
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
