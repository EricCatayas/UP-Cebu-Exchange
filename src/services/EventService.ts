import { Event } from '@/models/sequelize';
import { EVENT_CATEGORY, EVENT_ENTITY_TYPE, EVENT_NAME } from '@/lib/constants';
class EventService {
  sessionId: number;

  constructor(sessionId: number) {
    this.sessionId = sessionId;
  }

  async hasVisitedSite(): Promise<boolean> {
    const event = await Event.findOne({
      where: {
        sessionId: this.sessionId,
        name: EVENT_NAME.VISIT_SITE,
      },
    });
    return event !== null;
  }

  async visitSite() {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.VISIT_SITE,
      category: EVENT_CATEGORY.DISCOVERY,
    });
  }

  async createAccount(userId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.CREATE_ACCOUNT,
      category: EVENT_CATEGORY.INTENT,
      entityType: EVENT_ENTITY_TYPE.USER,
      entityId: userId,
    });
  }

  async verifyEmail(userId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.VERIFY_EMAIL,
      category: EVENT_CATEGORY.INTENT,
      entityType: EVENT_ENTITY_TYPE.USER,
      entityId: userId,
    });
  }

  async login(userId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.LOGIN,
      category: EVENT_CATEGORY.INTENT,
      entityType: EVENT_ENTITY_TYPE.USER,
      entityId: userId,
    });
  }

  async placeOrder(rentalOrderId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.PLACE_ORDER,
      category: EVENT_CATEGORY.INTENT,
      entityType: EVENT_ENTITY_TYPE.RENTAL_ORDER,
      entityId: rentalOrderId,
    });
  }

  async cancelOrder(rentalOrderId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.CANCEL_ORDER,
      category: EVENT_CATEGORY.INTENT,
      entityType: EVENT_ENTITY_TYPE.RENTAL_ORDER,
      entityId: rentalOrderId,
    });
  }

  async completePayment(paymentId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.COMPLETE_PAYMENT,
      category: EVENT_CATEGORY.CONVERSION,
      entityType: EVENT_ENTITY_TYPE.PAYMENT,
      entityId: paymentId,
    });
  }

  async completeOrder(rentalOrderId: number) {
    await Event.create({
      sessionId: this.sessionId,
      name: EVENT_NAME.COMPLETE_ORDER,
      category: EVENT_CATEGORY.CONVERSION,
      entityType: EVENT_ENTITY_TYPE.RENTAL_ORDER,
      entityId: rentalOrderId,
    });
  }

  async logEvent(
    eventName: string,
    category: string,
    entityType?: string,
    entityId?: number,
    metadata?: Record<string, any>
  ) {
    await Event.create({
      sessionId: this.sessionId,
      name: eventName,
      category,
      entityType: entityType,
      entityId: entityId,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    });
  }
}

export default EventService;
