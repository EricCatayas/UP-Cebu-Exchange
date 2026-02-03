import EventService from '@/services/EventService';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder } from '@/models/sequelize';
import { Payment } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_STATUSES } from '@/lib/constants';
import { getCurrentSession } from '@/lib/session';
import { orderPaidNotification } from '@/lib/notifications';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !isAdmin(currentUser)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!canEditContent(currentUser)) {
      return new Response(JSON.stringify({ error: 'Admin editor access required' }), { status: 403 });
    }

    const paymentId = parseInt((await params).id);

    const { amount, status, method } = await request.json();

    if (!paymentId || isNaN(Number(paymentId))) {
      return new Response(JSON.stringify({ error: 'Valid paymentId is required' }), { status: 400 });
    }
    if (!status || !PAYMENT_STATUSES.includes(status)) {
      return new Response(JSON.stringify({ error: 'Valid status is required' }), { status: 400 });
    }
    if (!amount || isNaN(Number(amount))) {
      return new Response(JSON.stringify({ error: 'Valid amount is required' }), { status: 400 });
    }
    if (!method) {
      return new Response(JSON.stringify({ error: 'Payment method is required' }), { status: 400 });
    }
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return new Response(JSON.stringify({ error: 'Payment not found' }), { status: 404 });
    }

    payment.status = status;
    payment.amount = amount;
    payment.method = method;
    await payment.save();

    if (status === PAYMENT_STATUS.COMPLETED) {
      const rentalOrder = await RentalOrder.findOne({ where: { paymentId: payment.id }, include: ['user'] });
      if (rentalOrder) {
        rentalOrder.status = ORDER_STATUS.RESERVED;
        await rentalOrder.save();
        await orderPaidNotification(rentalOrder.id, payment, rentalOrder.user);
      }

      const session = await getCurrentSession();
      if (session) {
        const eventService = new EventService(session.id);
        await eventService.completePayment(payment.id);
      }
    }
    if (status === PAYMENT_STATUS.FAILED) {
      // Handle payment failure logic if needed
    }
    return new Response(JSON.stringify({ payment }), { status: 200 });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
