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

  async getFunnelMetrics({ unique = false }: { unique?: boolean } = {}): Promise<FunnelMetrics> {
    const visitCount = await this.getVisitCount(unique);
    const browseCount = await this.getBrowseArtworksCount(unique);
    const viewCount = await this.getArtworkViewCount(unique);
    const createAccountCount = await this.getCreateAccountCount(unique);
    const verifyEmailCount = await this.getVerifyEmailCount(unique);
    const beginCheckoutCount = await this.getBeginCheckoutCount(unique);
    const signRentalAgreementCount = await this.getSignRentalAgreementCount(unique);
    const placeOrderCount = await this.getPlaceOrderCount(unique);
    const completePaymentCount = await this.getCompletePaymentCount(unique);
    const completeOrderCount = await this.getCompleteOrderCount(unique);

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
      [EVENT_NAME.BEGIN_CHECKOUT]: {
        count: beginCheckoutCount,
        conversionRate: getConversionRate(beginCheckoutCount, viewCount),
        cumulativeConversionRate: getConversionRate(beginCheckoutCount, visitCount),
      },
      [EVENT_NAME.CREATE_ACCOUNT]: {
        count: createAccountCount,
        conversionRate: getConversionRate(createAccountCount, beginCheckoutCount),
        cumulativeConversionRate: getConversionRate(createAccountCount, visitCount),
      },
      [EVENT_NAME.VERIFY_EMAIL]: {
        count: verifyEmailCount,
        conversionRate: getConversionRate(verifyEmailCount, createAccountCount),
        cumulativeConversionRate: getConversionRate(verifyEmailCount, visitCount),
      },
      [EVENT_NAME.SIGN_RENTAL_AGREEMENT]: {
        count: signRentalAgreementCount,
        conversionRate: getConversionRate(signRentalAgreementCount, verifyEmailCount),
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
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d'), 'ASC']],
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

  private async getVisitCount(unique: boolean = false) {
    if (unique) {
      const uniqueVisitCount = await Event.count({
        where: {
          name: EVENT_NAME.VISIT_SITE,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const visitCount = Array.isArray(uniqueVisitCount) ? uniqueVisitCount.length : 0;
      return visitCount;
    }

    const visitCount = await Event.count({
      where: {
        name: EVENT_NAME.VISIT_SITE,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });

    return visitCount;
  }

  private async getBrowseArtworksCount(unique: boolean = false) {
    if (unique) {
      const uniqueBrowseArtworksCount = await Event.count({
        where: {
          name: EVENT_NAME.BROWSE_ARTWORKS,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const browseArtworksCount = Array.isArray(uniqueBrowseArtworksCount) ? uniqueBrowseArtworksCount.length : 0;
      return browseArtworksCount;
    }

    const browseArtworksCount = await Event.count({
      where: {
        name: EVENT_NAME.BROWSE_ARTWORKS,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    return browseArtworksCount;
  }

  private async getArtworkViewCount(unique: boolean = false) {
    if (unique) {
      const uniqueArtworkViewCount = await Event.count({
        where: {
          name: EVENT_NAME.VIEW_ARTWORK,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const artworkViewCount = Array.isArray(uniqueArtworkViewCount) ? uniqueArtworkViewCount.length : 0;
      return artworkViewCount;
    }

    const artworkViewCount = await Event.count({
      where: {
        name: EVENT_NAME.VIEW_ARTWORK,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });

    return artworkViewCount;
  }
  private async getCreateAccountCount(unique: boolean = false) {
    if (unique) {
      const uniqueCreateAccountCount = await Event.count({
        where: {
          name: EVENT_NAME.CREATE_ACCOUNT,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const createAccountCount = Array.isArray(uniqueCreateAccountCount) ? uniqueCreateAccountCount.length : 0;
      return createAccountCount;
    }

    const createAccountCount = await Event.count({
      where: {
        name: EVENT_NAME.CREATE_ACCOUNT,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    return createAccountCount;
  }

  private async getVerifyEmailCount(unique: boolean = false) {
    if (unique) {
      const uniqueVerifyEmailCount = await Event.count({
        where: {
          name: EVENT_NAME.VERIFY_EMAIL,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const verifyEmailCount = Array.isArray(uniqueVerifyEmailCount) ? uniqueVerifyEmailCount.length : 0;
      return verifyEmailCount;
    }

    const verifyEmailCount = await Event.count({
      where: {
        name: EVENT_NAME.VERIFY_EMAIL,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    return verifyEmailCount;
  }

  private async getBeginCheckoutCount(unique: boolean = false) {
    if (unique) {
      const uniqueBeginCheckoutCount = await Event.count({
        where: {
          name: EVENT_NAME.BEGIN_CHECKOUT,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const beginCheckoutCount = Array.isArray(uniqueBeginCheckoutCount) ? uniqueBeginCheckoutCount.length : 0;
      return beginCheckoutCount;
    }

    const beginCheckoutCount = await Event.count({
      where: {
        name: EVENT_NAME.BEGIN_CHECKOUT,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    return beginCheckoutCount;
  }

  private async getSignRentalAgreementCount(unique: boolean = false) {
    if (unique) {
      const uniqueSignRentalAgreementCount = await Event.count({
        where: {
          name: EVENT_NAME.SIGN_RENTAL_AGREEMENT,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const signRentalAgreementCount = Array.isArray(uniqueSignRentalAgreementCount)
        ? uniqueSignRentalAgreementCount.length
        : 0;
      return signRentalAgreementCount;
    }

    const signRentalAgreementCount = await Event.count({
      where: {
        name: EVENT_NAME.SIGN_RENTAL_AGREEMENT,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    return signRentalAgreementCount;
  }

  private async getPlaceOrderCount(unique: boolean = false) {
    if (unique) {
      const uniquePlaceOrderCount = await Event.count({
        where: {
          name: EVENT_NAME.PLACE_ORDER,
          ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        },
        include: [
          {
            model: Session,
            as: 'session',
            attributes: [],
          },
        ],
        group: [sequelize.fn('COALESCE', sequelize.col('session.userId'), sequelize.col('session.sessionId'))],
        distinct: true,
      });
      const placeOrderCount = Array.isArray(uniquePlaceOrderCount) ? uniquePlaceOrderCount.length : 0;
      return placeOrderCount;
    }

    const placeOrderCount = await Event.count({
      where: {
        name: EVENT_NAME.PLACE_ORDER,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    return placeOrderCount;
  }

  private async getCompletePaymentCount(unique: boolean = false) {
    if (unique) {
      const uniqueCompletePaymentCount = await Payment.count({
        where: {
          status: PAYMENT_STATUS.COMPLETED,
          ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
        },
        group: ['userId'],
        distinct: true,
      });
      const completePaymentCount = Array.isArray(uniqueCompletePaymentCount) ? uniqueCompletePaymentCount.length : 0;
      return completePaymentCount;
    }

    const completePaymentCount = await Payment.count({
      where: {
        status: PAYMENT_STATUS.COMPLETED,
        ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
      },
    });
    return completePaymentCount;
    // return await Event.count({
    //   where: {
    //     name: EVENT_NAME.COMPLETE_PAYMENT,
    //     ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
    //   },
    // });
  }

  private async getCompleteOrderCount(unique: boolean = false) {
    if (unique) {
      const uniqueCompleteOrderCount = await RentalOrder.count({
        where: {
          status: ORDER_STATUS.COMPLETED,
          ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
        },
        group: ['userId'],
        distinct: true,
      });
      const completeOrderCount = Array.isArray(uniqueCompleteOrderCount) ? uniqueCompleteOrderCount.length : 0;
      return completeOrderCount;
    }

    const completeOrderCount = await RentalOrder.count({
      where: {
        status: ORDER_STATUS.COMPLETED,
        ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
      },
    });
    return completeOrderCount;
    // return await Event.count({
    //   where: {
    //     name: EVENT_NAME.COMPLETE_ORDER,
    //     ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
    //   },
    // });
  }
}

export default FunnelAnalyticsService;
