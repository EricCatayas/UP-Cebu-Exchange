import UserService from './UserService';
import sequelize from '@/config/database';
import { Op } from 'sequelize';
import { Event, RentalOrder, Payment, Session, User } from '@/models/sequelize';
import { FunnelMetrics } from '@/types/analytics';
import { EVENT_NAME, ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { getConversionRate } from '@/lib/analytics';
import { opTimeframe } from '@/lib/orm';

class FunnelAnalyticsService {
  private timeframe?: string;

  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  async getFunnelMetrics(): Promise<FunnelMetrics> {
    const visitCount = await this.getVisitCount();
    const browseCount = await this.getBrowseArtworksCount();
    const viewCount = await this.getArtworkViewCount();
    const createAccountCount = await this.getCreateAccountCount();
    const verifyEmailCount = await this.getVerifyEmailCount();
    const beginCheckoutCount = await this.getBeginCheckoutCount();
    const signRentalAgreementCount = await this.getSignRentalAgreementCount();
    const placeOrderCount = await this.getPlaceOrderCount();
    const completePaymentCount = await this.getCompletePaymentCount();
    const completeOrderCount = await this.getCompleteOrderCount();

    const result = {
      [EVENT_NAME.VISIT_SITE]: {
        count: visitCount,
        conversionRate: 100,
        cumulativeConversionRate: 100,
      },
      [EVENT_NAME.BROWSE_ARTWORKS]: {
        count: browseCount,
        conversionRate: getConversionRate(browseCount, visitCount),
        cumulativeConversionRate: getConversionRate(browseCount, visitCount),
      },
      [EVENT_NAME.VIEW_ARTWORK]: {
        count: viewCount,
        conversionRate: getConversionRate(viewCount, browseCount),
        cumulativeConversionRate: getConversionRate(viewCount, visitCount),
      },
      [EVENT_NAME.CREATE_ACCOUNT]: {
        count: createAccountCount,
        conversionRate: getConversionRate(createAccountCount, viewCount),
        cumulativeConversionRate: getConversionRate(createAccountCount, visitCount),
      },
      [EVENT_NAME.VERIFY_EMAIL]: {
        count: verifyEmailCount,
        conversionRate: getConversionRate(verifyEmailCount, createAccountCount),
        cumulativeConversionRate: getConversionRate(verifyEmailCount, visitCount),
      },
      [EVENT_NAME.BEGIN_CHECKOUT]: {
        count: beginCheckoutCount,
        conversionRate: getConversionRate(beginCheckoutCount, verifyEmailCount),
        cumulativeConversionRate: getConversionRate(beginCheckoutCount, visitCount),
      },
      [EVENT_NAME.SIGN_RENTAL_AGREEMENT]: {
        count: signRentalAgreementCount,
        conversionRate: getConversionRate(signRentalAgreementCount, beginCheckoutCount),
        cumulativeConversionRate: getConversionRate(signRentalAgreementCount, visitCount),
      },
      [EVENT_NAME.PLACE_ORDER]: {
        count: placeOrderCount,
        conversionRate: getConversionRate(placeOrderCount, signRentalAgreementCount),
        cumulativeConversionRate: getConversionRate(placeOrderCount, visitCount),
      },
      [EVENT_NAME.COMPLETE_PAYMENT]: {
        count: completePaymentCount,
        conversionRate: getConversionRate(completePaymentCount, placeOrderCount),
        cumulativeConversionRate: getConversionRate(completePaymentCount, visitCount),
      },
      [EVENT_NAME.COMPLETE_ORDER]: {
        count: completeOrderCount,
        conversionRate: getConversionRate(completeOrderCount, completePaymentCount),
        cumulativeConversionRate: getConversionRate(completeOrderCount, visitCount),
      },
    };
    return result;
  }

  // todo: year, month filter
  getVisitorMetrics = async (
    year: number,
    month: number
  ): Promise<{
    count: {
      total: number;
      registered: number;
      guests: number;
    };
    monthly: {
      labels: string[];
      data: number[];
    };
    daily: {
      labels: string[];
      data: number[];
    };
  }> => {
    const userService = new UserService();
    const customerRoleId = await userService.getRoleIdByName('customer');
    const guests = await Session.count({
      where: {
        userId: {
          [Op.is]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    const registered = await Session.count({
      where: {
        userId: {
          [Op.not]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: {
            roleId: customerRoleId,
          },
        },
      ],
    });
    const total = guests + registered;

    // Get visitors per month for selected year and month
    const monthlySessionData = await Session.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      raw: true,
    });

    // Get visitors per day for selected month
    const dailySessionData = await Session.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d'), 'day'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(year, month - 1, 1),
          [Op.lt]: new Date(year, month, 1),
        },
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d')],
      raw: true,
    });

    const monthlyLabels = (monthlySessionData as any[]).map((row) => {
      const [y, m] = row.month.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const monthlyData = (monthlySessionData as any[]).map((row) => parseInt(row.count));

    const dailyLabels = (dailySessionData as any[]).map((row) => {
      const date = new Date(row.day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const dailyData = (dailySessionData as any[]).map((row) => parseInt(row.count));

    return {
      count: { total, registered, guests },
      monthly: { labels: monthlyLabels, data: monthlyData },
      daily: { labels: dailyLabels, data: dailyData },
    };
  };
  getUserRetentionMetrics = async (): Promise<any> => {
    // Implementation for user retention metrics can be added here
  };

  private async getVisitCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.VISIT_SITE,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getBrowseArtworksCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.BROWSE_ARTWORKS,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getArtworkViewCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.VIEW_ARTWORK,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getCreateAccountCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.CREATE_ACCOUNT,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getVerifyEmailCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.VERIFY_EMAIL,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getBeginCheckoutCount() {
    const groupedBeginCheckoutEvent = await Event.count({
      where: {
        name: EVENT_NAME.BEGIN_CHECKOUT,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      group: ['entityId'],
    });
    const beginCheckoutCount = Array.isArray(groupedBeginCheckoutEvent) ? groupedBeginCheckoutEvent.length : 0;
    return beginCheckoutCount;
  }

  private async getSignRentalAgreementCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.SIGN_RENTAL_AGREEMENT,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getPlaceOrderCount() {
    return await Event.count({
      where: {
        name: EVENT_NAME.PLACE_ORDER,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getCompletePaymentCount() {
    return await Payment.count({
      where: {
        status: PAYMENT_STATUS.COMPLETED,
        ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
      },
    });
    // return await Event.count({
    //   where: {
    //     name: EVENT_NAME.COMPLETE_PAYMENT,
    //     ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
    //   },
    // });
  }

  private async getCompleteOrderCount() {
    return await RentalOrder.count({
      where: {
        status: ORDER_STATUS.COMPLETED,
        ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
      },
    });
    // return await Event.count({
    //   where: {
    //     name: EVENT_NAME.COMPLETE_ORDER,
    //     ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
    //   },
    // });
  }
}

export default FunnelAnalyticsService;
