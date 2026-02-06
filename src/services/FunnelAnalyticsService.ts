import UserService from './UserService';
import { Op } from 'sequelize';
import { Event, RentalOrder, Payment, Session, User } from '@/models/sequelize';
import { FunnelMetrics, MilestoneMetrics } from '@/types/analytics';
import { EVENT_NAME, ORDER_STATUS, PAYMENT_STATUS, USER_ROLE } from '@/lib/constants';
import { getConversionRate, getFunnelMilestones } from '@/lib/analytics';
import { opTimeframe } from '@/lib/orm';

class FunnelAnalyticsService {
  private timeframe?: string;
  private customerRoleId?: number;

  constructor(timeframe?: string, customerRoleId?: number) {
    this.timeframe = timeframe;
    this.customerRoleId = customerRoleId;
  }

  // Ensure customerRoleId is initialized before any method that needs it is called
  private async initializeCustomerRoleId() {
    if (!this.customerRoleId) {
      const userService = new UserService();
      const customerRoleId = await userService.getCustomerRoleId();
      this.customerRoleId = customerRoleId ?? undefined;
    }
  }

  async getFunnelMetrics({ unique = false }: { unique?: boolean } = {}): Promise<FunnelMetrics> {
    await this.initializeCustomerRoleId();

    const { count: visitCount } = await this.getVisitCount({ unique });
    const { count: browseCount } = await this.getBrowseArtworksCount({ unique });
    const { count: viewCount } = await this.getArtworkViewCount({ unique });
    const { count: createAccountCount } = await this.getCreateAccountCount({ unique });
    const { count: verifyEmailCount } = await this.getVerifyEmailCount({ unique });
    const { count: beginCheckoutCount } = await this.getBeginCheckoutCount({ unique });
    const { count: signRentalAgreementCount } = await this.getSignRentalAgreementCount({ unique });
    const { count: placeOrderCount } = await this.getPlaceOrderCount({ unique });
    const { count: completePaymentCount } = await this.getCompletePaymentCount({ unique });
    const { count: completeOrderCount } = await this.getCompleteOrderCount({ unique });

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

  async getUserMilestones(userId: number): Promise<MilestoneMetrics> {
    await this.initializeCustomerRoleId();
    const sessionIds = await this.getUserSessionIds(userId);

    const { count: visitCount, startDate: visitStartDate } = await this.getVisitCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: browseCount, startDate: browseStartDate } = await this.getBrowseArtworksCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: viewCount, startDate: viewStartDate } = await this.getArtworkViewCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: createAccountCount, startDate: createAccountStartDate } = await this.getCreateAccountCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: verifyEmailCount, startDate: verifyEmailStartDate } = await this.getVerifyEmailCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: beginCheckoutCount, startDate: beginCheckoutStartDate } = await this.getBeginCheckoutCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: signRentalAgreementCount, startDate: signRentalAgreementStartDate } =
      await this.getSignRentalAgreementCount({
        where: {
          sessionId: {
            [Op.in]: sessionIds,
          },
        },
      });
    const { count: placeOrderCount, startDate: placeOrderStartDate } = await this.getPlaceOrderCount({
      where: {
        sessionId: {
          [Op.in]: sessionIds,
        },
      },
    });
    const { count: completePaymentCount, startDate: completePaymentStartDate } = await this.getCompletePaymentCount({
      where: {
        userId: userId,
      },
    });
    const { count: completeOrderCount, startDate: completeOrderStartDate } = await this.getCompleteOrderCount({
      where: {
        userId: userId,
      },
    });

    const userFunnelMetrics = {
      [EVENT_NAME.VISIT_SITE]: {
        count: visitCount,
        reachedAt: visitStartDate,
      },
      [EVENT_NAME.BROWSE_ARTWORKS]: {
        count: browseCount,
        reachedAt: browseStartDate,
      },
      [EVENT_NAME.VIEW_ARTWORK]: {
        count: viewCount,
        reachedAt: viewStartDate,
      },
      [EVENT_NAME.BEGIN_CHECKOUT]: {
        count: beginCheckoutCount,
        reachedAt: beginCheckoutStartDate,
      },
      [EVENT_NAME.CREATE_ACCOUNT]: {
        count: createAccountCount,
        reachedAt: createAccountStartDate,
      },
      [EVENT_NAME.VERIFY_EMAIL]: {
        count: verifyEmailCount,
        reachedAt: verifyEmailStartDate,
      },
      [EVENT_NAME.SIGN_RENTAL_AGREEMENT]: {
        count: signRentalAgreementCount,
        reachedAt: signRentalAgreementStartDate,
      },
      [EVENT_NAME.PLACE_ORDER]: {
        count: placeOrderCount,
        reachedAt: placeOrderStartDate,
      },
      [EVENT_NAME.COMPLETE_PAYMENT]: {
        count: completePaymentCount,
        reachedAt: completePaymentStartDate,
      },
      [EVENT_NAME.COMPLETE_ORDER]: {
        count: completeOrderCount,
        reachedAt: completeOrderStartDate,
      },
    };

    const milestones = getFunnelMilestones(userFunnelMetrics);
    return milestones;
  }

  private async getEventCount(eventName: string, options: { unique?: boolean; where?: any } = {}) {
    const { unique = false, where = {} } = options;
    const events = await Event.findAll({
      where: {
        name: eventName,
        ...where,
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
      attributes: ['id', 'sessionId', 'createdAt'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const filteredEvents = events.filter((event: any) => {
      // Only guests (no user) and customers; Exclude admins
      return !event['session.userId'] || event['session.user.roleId'] === this.customerRoleId;
    });

    const count = unique
      ? new Set(filteredEvents.map((event: any) => event['session.userId'] || event['session.sessionId'])).size
      : filteredEvents.length;

    const latestDate = events.length > 0 ? events[0].createdAt : null;

    return { count, startDate: latestDate ? latestDate : null };
  }

  private async getVisitCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.VISIT_SITE, options);
  }

  private async getBrowseArtworksCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.BROWSE_ARTWORKS, options);
  }

  private async getArtworkViewCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.VIEW_ARTWORK, options);
  }

  private async getCreateAccountCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.CREATE_ACCOUNT, options);
  }

  private async getVerifyEmailCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.VERIFY_EMAIL, options);
  }

  private async getBeginCheckoutCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.BEGIN_CHECKOUT, options);
  }

  private async getSignRentalAgreementCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.SIGN_RENTAL_AGREEMENT, options);
  }

  private async getPlaceOrderCount(options: { unique?: boolean; where?: any } = {}) {
    return this.getEventCount(EVENT_NAME.PLACE_ORDER, options);
  }

  private async getCompletePaymentCount(options: { unique?: boolean; where?: any } = {}) {
    const { unique = false, where = {} } = options;
    const completePayments = await Payment.findAll({
      where: {
        status: PAYMENT_STATUS.COMPLETED,
        ...where,
        ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
      },
      order: [['updatedAt', 'DESC']],
    });

    const latestDate = completePayments.length > 0 ? completePayments[0].updatedAt : null;

    const count = unique
      ? new Set(completePayments.map((payment: any) => payment.userId)).size
      : completePayments.length;

    return { count, startDate: latestDate ? latestDate : null };
  }

  private async getCompleteOrderCount(options: { unique?: boolean; where?: any } = {}) {
    const { unique = false, where = {} } = options;

    const completeOrders = await RentalOrder.findAll({
      where: {
        status: ORDER_STATUS.COMPLETED,
        ...where,
        ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
      },
    });

    const latestDate = completeOrders.length > 0 ? completeOrders[0].updatedAt : null;

    const count = unique ? new Set(completeOrders.map((order: any) => order.userId)).size : completeOrders.length;

    return { count, startDate: latestDate ? latestDate : null };
  }

  private async getUserSessionIds(userId: number) {
    const sessions = await Session.findAll({
      where: {
        userId,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      attributes: ['id'],
      raw: true,
    });
    return sessions.map((session) => session.id);
  }
}

export default FunnelAnalyticsService;
