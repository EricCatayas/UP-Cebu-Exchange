import EventService from '@/services/EventService';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrder } from '@/models/sequelize';
import { Payment } from '@/models/sequelize';
import { getCurrentUser, isAdmin, canEditContent } from '@/lib/auth';
import { PAYMENT_STATUS, PAYMENT_STATUSES } from '@/lib/constants';
import { getCurrentSession } from '@/lib/session';

// todo: test
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

    const { status } = await request.json();

    if (!paymentId || isNaN(Number(paymentId))) {
      return new Response(JSON.stringify({ error: 'Valid paymentId is required' }), { status: 400 });
    }
    if (!status || !PAYMENT_STATUSES.includes(status)) {
      return new Response(JSON.stringify({ error: 'Valid status is required' }), { status: 400 });
    }
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return new Response(JSON.stringify({ error: 'Payment not found' }), { status: 404 });
    }
    const oldStatus = payment.status;
    if (oldStatus === status) {
      return new Response(JSON.stringify({ error: 'Payment already has the specified status' }), { status: 400 });
    }
    payment.status = status;
    await payment.save();

    const rentalOrder = await RentalOrder.findOne({ where: { paymentId: payment.id } });
    const rentalOrderService = new RentalOrderService();
    if (status === PAYMENT_STATUS.COMPLETED) {
      if (rentalOrder) await rentalOrderService.markOrderAsPaid(rentalOrder.id);
      const session = await getCurrentSession();
      if (session) {
        const eventService = new EventService(session.id);
        await eventService.completePayment(payment.id);
      }
    }
    if (status === PAYMENT_STATUS.FAILED) {
      if (rentalOrder) await rentalOrderService.markOrderAsCancelled(rentalOrder.id);
    }
    return new Response(JSON.stringify({ payment }), { status: 200 });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
