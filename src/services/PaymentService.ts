import { Payment } from '@/models/sequelize';
import { opTimeframe } from '@/lib/orm';
class PaymentService {
  private timeframe?: string;

  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  async getAllPayments(): Promise<Payment[]> {
    const payments = await Payment.findAll({
      where: this.timeframe ? { createdAt: opTimeframe(this.timeframe) } : undefined,
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
}

export default PaymentService;
