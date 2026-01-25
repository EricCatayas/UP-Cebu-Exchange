import sequelize from '@/config/database';
import { User, Role, Session, Event, RentalOrderItem, Artwork, RentalOrder, Address, Payment } from '@/models/sequelize';
import { ARTWORK_MEDIUM, ARTWORK_STATUS, DELIVERY_FEE, DELIVERY_METHOD, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, USER_ROLE } from '@/lib/constants';
import { hashPassword } from '@/lib/auth';
import { getRentalFee } from '@/lib/artwork';
import EventService from '@/services/EventService';


async function seedUsers() {
    try {
      const user1Email = 'user1@test.com';
      const user2Email = 'user2@test.com';
      const user3Email = 'user3@test.com';
    const customerRole = await Role.findOne({
      where: { name: USER_ROLE.CUSTOMER },
    });

    // customer account
    const userPassword = await hashPassword('user123');
    await User.findOrCreate({
      where: { email: user1Email },
      defaults: {
        email: user1Email,
        fullName: 'User One',
        password: userPassword,
        phoneNumber: '123-456-7890',
        roleId: customerRole.id,
        status: 'Active',
      },
    });
    await User.findOrCreate({
      where: { email: user2Email },
      defaults: {
        email: user2Email,
        fullName: 'User Two',
        password: userPassword,
        phoneNumber: '123-456-7890',
        roleId: customerRole.id,
        status: 'Active',
      },
    });
    await User.findOrCreate({
      where: { email: user3Email },
      defaults: {
        email: user3Email,
        fullName: 'User Three',
        password: userPassword,
        phoneNumber: '123-456-7890',
        roleId: customerRole.id,
        status: 'Active',
      },
    });

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

async function user1CompletesOrder() {
    try {
        // 
        const duration = 12;
        const session = await Session.create();
        const artwork1 = await Artwork.findOne();
        if(!artwork1) return;
        const customerRole = await Role.findOne({
            where: { name: USER_ROLE.CUSTOMER },
        });

        const eventService = new EventService(session.id)

        // USER VISITS PAGE
        await eventService.visitSite();

        // USER BROWSE ARTWORKS
        // await eventService.browseArtworks();

        // USER VIEWS ARTWORK
        // await eventService.viewArtwork();

        // USER ADDS ARTWORK TO CART
        // await eventService.addArtworkToCart(artwork1);

        // USER CREATES ACCOUNT
        const userPassword = await hashPassword('user123');
        const user1 = await User.create({
            email: 'user1@email.com',
            password: userPassword,
            status: "Pending",
            fullName: 'User1',
            phoneNumber: '123-456-7890',
            roleId: customerRole.id,
        })
        await eventService.createAccount(user1.id);

        // USER VERIFIES EMAIL
        user1.status = "Active";
        await user1.save();
        await eventService.verifyEmail(user1.id);

        // USER LOGS IN
        session.userId = user1.id;
        await session.save();
        await eventService.login(user1.id);

        // USER BEGINS CHECKOUT 
        // await eventService.beginCheckout();

        const amount = getRentalFee(artwork1, duration)
        const address1 = await Address.create({
            city: "City",
            province: "Province",
            postalCode: "Postal Code",
            addressLine1: "Address Line 1",
            addressLine2: "Address Line 2"
        })

        const payment1 = await Payment.create({
            userId: user1.id,
            amount: amount,
            status: PAYMENT_STATUS.PENDING,
            method: PAYMENT_METHOD.CREDIT_CARD
        })

        // USER CREATES ORDER
        const rentalOrder = await RentalOrder.create({
            userId: user1?.id,
            addressId: address1.id,
            paymentId: payment1.id,
            startDate: new Date(),
            endDate: new Date(),
            durationMonths: duration,
            deliveryMethod: DELIVERY_METHOD.DELIVERY,
            status: ORDER_STATUS.PENDING

        })

        const rentalOrderItem1 = await RentalOrderItem.create({
            artworkId: artwork1?.id,
            amount: amount,
            rentalOrderId: rentalOrder.id
        });

        await eventService.placeOrder(rentalOrder.id);

        // USER PAYS ORDER
        payment1.status = PAYMENT_STATUS.COMPLETED;
        await payment1.save();

        rentalOrder.status = ORDER_STATUS.CONFIRMED;
        await rentalOrder.save();

        await eventService.completePayment(payment1.id);
        
        // USER RECEIVES ORDER
        rentalOrder.status = ORDER_STATUS.ONGOING;
        await rentalOrder.save();

        // await eventService.orderReceived(rentalOrder.id);

        // USER RETURNS ORDER - ORDER COMPLETED
        rentalOrder.status = ORDER_STATUS.COMPLETED;
        await rentalOrder.save();

        await eventService.completeOrder(rentalOrder.id);

    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
}


async function seedSession() {
    try {
        // User1 completes order
        
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
}
