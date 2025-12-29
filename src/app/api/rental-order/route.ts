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
import { RentalOrderCreateDTO } from '@/models/RentalOrder';
import { getCurrentUser, isAdmin, canEditContent } from '@/lib/auth';
import { getRentalFee } from '@/lib/artwork';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!isAdmin(currentUser) || !canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      durationMonths,
      startDate,
      endDate,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      artworkIds,
      address,
      customerId,
    }: RentalOrderCreateDTO = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required for order' }, { status: 400 });
    }
    if (!address.addressLine1 || !address.city || !address.province || !address.postalCode) {
      return NextResponse.json({ error: 'Incomplete address information' }, { status: 400 });
    }
    if (!artworkIds || artworkIds.length === 0) {
      return NextResponse.json({ error: 'At least one artwork is required' }, { status: 400 });
    }
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
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
    // Create new address record
    const newAddress = await Address.create({
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
    });
    // Create Payment here
    const newPayment = await Payment.create({
      userId: customerId,
      amount: totalAmount,
      method: paymentMethod,
      status: PAYMENT_STATUS.PENDING,
    });
    // Create rental order
    const newRentalOrder = await RentalOrder.create({
      userId: customerId,
      paymentId: newPayment.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      deliveryMethod,
      durationMonths: durationMonths,
      addressId: newAddress.id,
      status: ORDER_STATUS.PENDING,
    });

    const artworks = await Artwork.findAll({
      where: {
        id: artworkIds,
      },
      include: ['rentalPlans'],
    });

    // Create rental order items
    for (const artwork of artworks) {
      await RentalOrderItem.create({
        rentalOrderId: newRentalOrder.id,
        artworkId: artwork.id,
        amount: getRentalFee(artwork, durationMonths),
      });
    }

    return NextResponse.json(
      { message: 'Rental order created successfully', rentalOrder: newRentalOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating rental order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
