import sequelize from '@/config/database';
import crypto from 'crypto';
import EventService from '@/services/EventService';
import {
  generatePassword,
  generateEmail,
  generateSessionId,
  generateFullName,
  generatePhoneNumber,
  generateRandomDuration,
  generateRandomNumber,
  generateRandomString,
} from '@/lib/seed';
import {
  Artwork,
  Address,
  Event,
  Session,
  User,
  Role,
  Payment,
  RentalOrder,
  RentalOrderItem,
} from '@/models/sequelize/index';
import {
  EVENT_CATEGORY,
  EVENT_NAME,
  EVENT_ENTITY_TYPE,
  USER_ROLE,
  USER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  DELIVERY_METHOD,
  ORDER_STATUS,
} from '@/lib/constants';
import { getRentalFee } from '@/lib/artwork';

export async function seedEvents() {
  try {
    console.log('🌱 Seeding events...');

    const customerRole = await Role.findOne({
      where: { name: USER_ROLE.CUSTOMER },
    });

    const sessionFactory = new VisitorFactory(customerRole!.id);

    // Seed multiple sessions with varying events
    for (let i = 1; i <= 40; i++) {
      const randomNumber = Math.floor(Math.random() * Math.random() * 11);
      await sessionFactory.CreateNewVisitorSession(randomNumber);
    }

    for (let i = 1; i <= 5; i++) {
      const randomNumber = Math.floor(Math.random() * Math.random() * 11);
      await sessionFactory.CreateReturningVisitorSession(randomNumber);
    }

    await sessionFactory.CreateNewVisitorSession(12); // Full funnel session
    await sessionFactory.CreateReturningVisitorSession(12); // Full funnel session
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    throw error;
  }
}

class VisitorFactory {
  customerRoleId: number;
  withinLastDays: number = 30; // Days range for session creation date

  constructor(customerRoleId: number) {
    this.customerRoleId = customerRoleId;
  }

  // event 1 - user browses site
  // event 2 - user views artwork
  // event 3 - user adds artwork to cart
  // event 4 - user begins checkout
  // event 5 - user creates account
  // event 6 - user verifies email
  // event 7 - user logs in
  // event 8 - signs agreement
  // event 9 - user places order
  // event 10 - user completes payment
  // event 11 - user completes order
  async CreateNewVisitorSession(eventNumber: number) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * this.withinLastDays));

    const session = await Session.create({
      sessionId: generateSessionId(),
      createdAt: createdAt,
    });

    const eventService = new EventService(session.id);

    await eventService.visitSite();

    if (eventNumber > 0) {
      await eventService.browseArtworks();

      if (eventNumber > 1) {
        const artwork = await Artwork.findOne({
          order: [sequelize.literal('RAND()')],
        });
        if (!artwork) return;

        await eventService.viewArtwork(artwork.id);

        if (eventNumber > 2) {
          await eventService.addArtworkToCart(artwork.id);

          if (eventNumber > 3) {
            await eventService.beginCheckout();

            if (eventNumber > 4) {
              const password = await generatePassword();
              const user = await User.create({
                email: generateEmail(),
                password: password,
                status: 'Pending',
                fullName: generateFullName(),
                phoneNumber: generatePhoneNumber(),
                roleId: this.customerRoleId,
              });

              await eventService.createAccount(user.id);

              if (eventNumber > 5) {
                await eventService.verifyEmail(user.id);

                if (eventNumber > 6) {
                  await eventService.login(user.id);
                  await session.update({ userId: user.id });

                  if (eventNumber > 7) {
                    await eventService.signRentalAgreement();

                    if (eventNumber > 8) {
                      const address1 = await Address.create({
                        city: generateRandomString(6),
                        province: generateRandomString(6),
                        postalCode: generateRandomString(6),
                        addressLine1: generateRandomString(12),
                        addressLine2: generateRandomString(12),
                      });

                      const payment = await Payment.create({
                        userId: user.id,
                        amount: generateRandomNumber(100, 1000),
                        status: PAYMENT_STATUS.COMPLETED,
                        method: PAYMENT_METHOD.ONLINE,
                      });

                      const rentalOrder = await RentalOrder.create({
                        userId: user.id,
                        addressId: address1.id,
                        paymentId: payment.id,
                        startDate: new Date(),
                        endDate: new Date(),
                        durationMonths: generateRandomDuration(),
                        deliveryMethod: DELIVERY_METHOD.DELIVERY,
                        status: ORDER_STATUS.PENDING,
                      });

                      await eventService.placeOrder(rentalOrder.id);

                      if (eventNumber > 9) {
                        await eventService.completePayment(payment.id);

                        if (eventNumber > 10) {
                          await eventService.completeOrder(rentalOrder.id);

                          rentalOrder.update({ status: ORDER_STATUS.COMPLETED });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Mirrors CreateNewVisitorSession but reuses an existing customer user instead of creating a new one
  async CreateReturningVisitorSession(eventNumber: number) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * this.withinLastDays));

    const user = await User.findOne({
      where: { roleId: this.customerRoleId },
      order: [sequelize.literal('RAND()')],
    });

    if (!user) return;

    const session = await Session.create({
      sessionId: generateSessionId(),
      createdAt: createdAt,
      userId: user.id,
    });

    const eventService = new EventService(session.id);

    await eventService.visitSite();

    if (eventNumber > 0) {
      await eventService.browseArtworks();

      if (eventNumber > 1) {
        const artwork = await Artwork.findOne({
          // MySQL uses RAND() for random ordering
          order: [sequelize.literal('RAND()')],
        });
        if (!artwork) return;

        await eventService.viewArtwork(artwork.id);

        if (eventNumber > 2) {
          await eventService.addArtworkToCart(artwork.id);

          if (eventNumber > 3) {
            await eventService.beginCheckout();

            if (eventNumber > 4) {
              if (eventNumber > 5 && user.status === USER_STATUS.PENDING) {
                await eventService.verifyEmail(user.id);
                await user.update({ status: USER_STATUS.ACTIVE });
              }

              if (eventNumber > 6) {
                // await eventService.login(user.id);
                // await session.update({ userId: user.id });

                if (eventNumber > 7) {
                  await eventService.signRentalAgreement();

                  if (eventNumber > 8) {
                    const address1 = await Address.create({
                      city: generateRandomString(6),
                      province: generateRandomString(6),
                      postalCode: generateRandomString(6),
                      addressLine1: generateRandomString(12),
                      addressLine2: generateRandomString(12),
                    });

                    const payment = await Payment.create({
                      userId: user.id,
                      amount: generateRandomNumber(100, 1000),
                      status: PAYMENT_STATUS.COMPLETED,
                      method: PAYMENT_METHOD.ONLINE,
                    });

                    const rentalOrder = await RentalOrder.create({
                      userId: user.id,
                      addressId: address1.id,
                      paymentId: payment.id,
                      startDate: new Date(),
                      endDate: new Date(),
                      durationMonths: generateRandomDuration(),
                      deliveryMethod: DELIVERY_METHOD.DELIVERY,
                      status: ORDER_STATUS.PENDING,
                    });

                    await eventService.placeOrder(rentalOrder.id);

                    if (eventNumber > 9) {
                      await eventService.completePayment(payment.id);

                      if (eventNumber > 10) {
                        await eventService.completeOrder(rentalOrder.id);

                        rentalOrder.update({ status: ORDER_STATUS.COMPLETED });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
