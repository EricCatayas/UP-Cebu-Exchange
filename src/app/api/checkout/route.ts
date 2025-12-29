import { NextRequest, NextResponse } from 'next/server';
import {
  Address,
  Artwork,
  Cart,
  CartItem,
  RentalOrder,
  RentalOrderItem,
  Payment,
  RentalPlan,
} from '@/models/sequelize';
import RentalOrderService from '@/services/RentalOrderService';
import { CheckoutDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';
import { getRentalFee, hasOngoingRental, isUnavailableForRental } from '@/lib/artwork';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { fmtDate } from '@/lib/formatter';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const {
      durationMonths,
      startDate,
      endDate,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      cartItemIds,
      addressId,
    }: CheckoutDTO = await request.json();
    const cart = await Cart.findOne({
      where: {
        userId: currentUser.userId,
      },
    });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
    if (!cartItemIds || cartItemIds.length === 0) {
      return NextResponse.json({ error: 'At least one artwork is required' }, { status: 400 });
    }
    if (!durationMonths || durationMonths <= 0) {
      return NextResponse.json({ error: 'Valid duration in months is required' }, { status: 400 });
    }
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 });
    }
    if (!deliveryMethod) {
      return NextResponse.json({ error: 'Delivery method is required' }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }
    if (!addressId) {
      return NextResponse.json({ error: 'Address is required for order' }, { status: 400 });
    }
    const existingAddress = await Address.findOne({
      where: { id: addressId },
    });
    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    const cartItems = await CartItem.findAll({
      where: {
        id: cartItemIds,
        cartId: cart.id,
      },
      include: [
        {
          model: Artwork,
          as: 'artwork',
          include: [
            {
              model: RentalPlan,
              as: 'rentalPlans',
            },
          ],
        },
      ],
    });
    // Verify if artworks are available for rental
    const rentalOrderService = new RentalOrderService();
    for (const cartItem of cartItems) {
      if (hasOngoingRental(cartItem.artwork)) {
        const ongoingRental = await rentalOrderService.getOngoingRentalByArtworkId(cartItem.artwork.id);
        if (ongoingRental && startDate < ongoingRental.endDate.toISOString()) {
          return NextResponse.json(
            {
              error: `Artwork ${cartItem.artwork.title} is currently rented until ${fmtDate(ongoingRental.endDate)}`,
            },
            { status: 400 }
          );
        } else if (isUnavailableForRental(cartItem.artwork)) {
          return NextResponse.json(
            { error: `Artwork ${cartItem.artwork.title} is not available for rental` },
            { status: 400 }
          );
        }
      }
    }

    // Create new copy of address
    const newAddress = await Address.create({
      city: existingAddress.city,
      province: existingAddress.province,
      postalCode: existingAddress.postalCode,
      addressLine1: existingAddress.addressLine1,
      addressLine2: existingAddress.addressLine2,
    });
    // Create Payment here
    const newPayment = await Payment.create({
      userId: currentUser.userId,
      amount: totalAmount,
      method: paymentMethod,
      status: PAYMENT_STATUS.PENDING,
    });
    // Create rental order
    const newRentalOrder = await RentalOrder.create({
      userId: currentUser.userId,
      paymentId: newPayment.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      deliveryMethod,
      durationMonths: durationMonths,
      addressId: newAddress.id,
      status: ORDER_STATUS.PENDING,
    });

    // Create rental order items
    for (const cartItem of cartItems) {
      await RentalOrderItem.create({
        rentalOrderId: newRentalOrder.id,
        artworkId: cartItem.artworkId,
        amount: getRentalFee(cartItem.artwork, durationMonths),
      });
    }

    // Clear cart items
    await CartItem.destroy({
      where: {
        id: cartItemIds,
        cartId: cart.id,
      },
    });
    return NextResponse.json(
      { message: 'Rental order created successfully', rentalOrder: newRentalOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating rental order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
