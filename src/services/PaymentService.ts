import { Payment } from '@/models/sequelize';

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
}

export default PaymentService;
