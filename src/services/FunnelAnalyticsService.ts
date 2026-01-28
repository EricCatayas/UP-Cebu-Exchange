import UserService from './UserService';
import sequelize from '@/config/database';
import { Op } from 'sequelize';
import { Event, RentalOrder, Payment, Session, User } from '@/models/sequelize';
import { FunnelMetrics } from '@/types/analytics';
import { EVENT_NAME, ORDER_STATUS, PAYMENT_STATUS, USER_ROLE } from '@/lib/constants';
import { getConversionRate } from '@/lib/analytics';
import { opTimeframe } from '@/lib/orm';
import { fmtDate } from '@/lib/formatter';

class FunnelAnalyticsService {
  private timeframe?: string;
  private customerRoleId?: number;

  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  async getFunnelMetrics({ unique = false }: { unique?: boolean } = {}): Promise<FunnelMetrics> {
    const userService = new UserService();
    const customerRoleId = await userService.getRoleIdByName(USER_ROLE.CUSTOMER);
    this.customerRoleId = customerRoleId ?? undefined;

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

  getVisitorMetrics = async (
    year: number,
    month: number,
    unique: boolean = false
  ): Promise<{
    count: {
      total: number;
      registered: number;
      guests: number;
      customers: number;
      admins: number;
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
    const customerRoleId = await userService.getRoleIdByName(USER_ROLE.CUSTOMER);
    this.customerRoleId = customerRoleId ?? undefined;
    const guests = await Session.count({
      where: {
        userId: {
          [Op.is]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    const customers = await this.getCustomerVisitorCount(unique);
    const admins = await this.getAdminVisitorCount(unique);

    const registered = customers + admins;

    const total = guests + registered;

    // Get visitors per month for selected year and month
    const monthlySessionData = await this.getMonthlySessions(year);

    const monthlyLabels = [];
    const monthlyData = [];

    for (let m = 1; m <= 12; m++) {
      const monthData = monthlySessionData.find((data) => parseInt(data.month) === m);
      const date = new Date(year, m - 1, 1);
      monthlyLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      monthlyData.push(monthData ? monthData.count : 0);
    }

    // Get visitors per day for selected month
    const dailySessionData = await this.getDailySessions(year, month);

    const dailyLabels = (dailySessionData as any[]).map((row) => {
      return row.day;
    });
    const dailyData = (dailySessionData as any[]).map((row) => parseInt(row.count));

    return {
      count: { total, registered, guests, customers, admins },
      monthly: { labels: monthlyLabels, data: monthlyData },
      daily: { labels: dailyLabels, data: dailyData },
    };
  };
  getUserRetentionMetrics = async (): Promise<any> => {
    // Implementation for user retention metrics can be added here
  };

  private async getCustomerVisitorCount(unique: boolean) {
    const customerSessions = await Session.findAll({
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
            roleId: this.customerRoleId,
          },
        },
      ],
    });

    return unique ? new Set(customerSessions.map((session) => session.userId)).size : customerSessions.length;
  }

  private async getAdminVisitorCount(unique: boolean) {
    const customerSessions = await Session.findAll({
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
            roleId: { [Op.ne]: this.customerRoleId },
          },
        },
      ],
    });

    return unique ? new Set(customerSessions.map((session) => session.userId)).size : customerSessions.length;
  }

  private async getMonthlySessions(year: number) {
    const monthlySessions = await Session.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['roleId'],
          required: false,
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
        [Op.or]: [
          { userId: { [Op.is]: null } },
          sequelize.where(sequelize.col('user.roleId'), Op.eq, this.customerRoleId),
        ],
      },
      raw: true,
    });
    // Group by month in JavaScript
    const monthlyMap = new Map<string, number>();
    monthlySessions.forEach((session: any) => {
      const monthNumber = new Date(session.createdAt).getMonth() + 1;
      monthlyMap.set(monthNumber.toString(), (monthlyMap.get(monthNumber.toString()) || 0) + 1);
    });

    const monthlySessionData = Array.from(monthlyMap).map(([month, count]) => ({
      month,
      count,
    }));

    return monthlySessionData;
  }

  private async getDailySessions(year: number, month: number) {
    const dailySessions = await Session.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['roleId'],
          required: false,
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(year, month - 1, 1),
          [Op.lt]: new Date(year, month, 1),
        },
        [Op.or]: [
          { userId: { [Op.is]: null } },
          sequelize.where(sequelize.col('user.roleId'), Op.eq, this.customerRoleId),
        ],
      },
      raw: true,
    });
    // fix: start from 1 to end of month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Group by day in JavaScript
    const dailyMap = new Map<string, number>();
    for (let day = 1; day <= daysInMonth; day++) {
      const daySessions = dailySessions.filter((session: any) => {
        return new Date(session.createdAt).getDate() === day;
      });
      dailyMap.set(day.toString(), daySessions.length);
    }

    const dailySessionData = Array.from(dailyMap).map(([day, count]) => ({
      day,
      count,
    }));

    return dailySessionData;
  }

  private async getEventCount(eventName: string, unique: boolean) {
    const events = await Event.findAll({
      where: {
        name: eventName,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      include: [
        {
          model: Session,
          as: 'session',
          attributes: ['userId', 'sessionId'],
          required: true,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['roleId'],
              required: false,
            },
          ],
        },
      ],
      attributes: ['sessionId'],
      raw: true,
    });

    const filteredEvents = events.filter((event: any) => {
      // Include guests (no user) or customers (exclude admins)
      return !event['session.userId'] || event['session.user.roleId'] === this.customerRoleId;
    });

    return unique
      ? new Set(filteredEvents.map((event: any) => event['session.userId'] || event['session.sessionId'])).size
      : filteredEvents.length;
  }

  private async getVisitCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.VISIT_SITE, unique);
  }

  private async getBrowseArtworksCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.BROWSE_ARTWORKS, unique);
  }

  private async getArtworkViewCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.VIEW_ARTWORK, unique);
  }

  private async getCreateAccountCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.CREATE_ACCOUNT, unique);
  }

  private async getVerifyEmailCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.VERIFY_EMAIL, unique);
  }

  private async getBeginCheckoutCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.BEGIN_CHECKOUT, unique);
  }

  private async getSignRentalAgreementCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.SIGN_RENTAL_AGREEMENT, unique);
  }

  private async getPlaceOrderCount(unique: boolean) {
    return this.getEventCount(EVENT_NAME.PLACE_ORDER, unique);
  }

  private async getCompletePaymentCount(unique: boolean) {
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
  }

  private async getCompleteOrderCount(unique: boolean) {
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
  }
}

export default FunnelAnalyticsService;
