import { Payment, PaymentTransaction, RentalOrder, User } from '@/models/sequelize';
import { PAYMENT_STATUS } from '@/lib/constants';
import { opTimeframe } from '@/lib/orm';

class PaymentAnalyticsService {
  private timeframe?: string;

  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  async getAnalyticsData() {
    const allPayments = await Payment.findAll({
      where: this.timeframe ? { createdAt: opTimeframe(this.timeframe) } : undefined,
    });
    const totalPayments = allPayments.length;
    const totalRevenueResult = allPayments
      .filter((payment) => payment.status === PAYMENT_STATUS.COMPLETED)
      .reduce<number>((sum, payment) => sum + Number(payment.amount), 0);
    const pendingPayments = allPayments.filter((payment) => payment.status === PAYMENT_STATUS.PENDING).length;
    const totalRevenue = totalRevenueResult || 0;
    const completedPayments = allPayments.filter((payment) => payment.status === PAYMENT_STATUS.COMPLETED).length;
    return { totalPayments, totalRevenue, pendingPayments, completedPayments };
  }
}

export default PaymentAnalyticsService;
