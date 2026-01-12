import { Payment } from '@/models/sequelize';
import { PaymentMetrics } from '@/types/analytics';
import { Op } from 'sequelize';
class RevenueAnalyticsService {
  async getTotalRevenue(): Promise<number> {
    const totalRevenue = await Payment.sum('amount', {
      where: {
        status: 'COMPLETED',
      },
    });
    return totalRevenue || 0;
  }
  async getRevenue(year: number, month: number): Promise<{ monthly: number; annual: number }> {
    const monthlyStartDate = new Date(year, month - 1, 1);
    const monthlyEndDate = new Date(year, month, 1);
    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        status: 'COMPLETED',
        createdAt: {
          [Op.gte]: monthlyStartDate,
          [Op.lt]: monthlyEndDate,
        },
      },
    });
    const annualStartDate = new Date(year, 0, 1);
    const annualEndDate = new Date(year + 1, 0, 1);
    const annualRevenue = await Payment.sum('amount', {
      where: {
        status: 'COMPLETED',
        createdAt: {
          [Op.gte]: annualStartDate,
          [Op.lt]: annualEndDate,
        },
      },
    });
    return {
      monthly: monthlyRevenue || 0,
      annual: annualRevenue || 0,
    };
  }
  getPaymentMetrics = async (year: number, month: number): Promise<PaymentMetrics> => {
    const totalRevenue = await this.getTotalRevenue();
    const { monthly, annual } = await this.getRevenue(year, month);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const payments = await Payment.findAll({
      attributes: ['status', 'amount'],
    });

    const statusBreakdown: { [status: string]: { count: number; amount: number; percentage: number } } = {};
    payments.forEach((payment) => {
      const status = payment.status;
      if (!statusBreakdown[status]) {
        statusBreakdown[status] = { count: 0, amount: 0, percentage: 0 };
      }
      statusBreakdown[status].count += 1;
      statusBreakdown[status].amount += payment.amount;
    });
    for (const status in statusBreakdown) {
      const breakdown = statusBreakdown[status];
      breakdown.percentage = totalRevenue ? parseFloat(((breakdown.amount / totalRevenue) * 100).toFixed(2)) : 0;
    }

    return {
      revenue: {
        total: totalRevenue,
        monthly,
        annual,
      },
      statusBreakdown,
    };
  };
}

export default RevenueAnalyticsService;
