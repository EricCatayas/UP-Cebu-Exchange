import { Payment, PaymentTransaction, RentalOrder, User } from '@/models/sequelize';
import { PAYMENT_STATUS } from '@/lib/constants';

class PaymentService {
  async getAllPayments(): Promise<Payment[]> {
    const payments = await Payment.findAll({
      include: ['user', 'transactions'],
      order: [['createdAt', 'DESC']],
    });

    return payments;
  }

  async getPaymentById(paymentId: number): Promise<any | null> {
    const payment = await Payment.findByPk(paymentId, {
      include: ['user', 'transactions'],
    });

    return payment;
  }

  async getAnalyticsData() {
    const allPayments = await Payment.findAll();
    const totalPayments = allPayments.length;
    const totalRevenueResult = allPayments
      .filter((payment) => payment.status === PAYMENT_STATUS.COMPLETED)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingPayments = allPayments.filter((payment) => payment.status === PAYMENT_STATUS.PENDING).length;
    const totalRevenue = totalRevenueResult || 0;
    const completedPayments = allPayments.filter((payment) => payment.status === PAYMENT_STATUS.COMPLETED).length;
    return { totalPayments, totalRevenue, pendingPayments, completedPayments };
  }
}

export default PaymentService;
