import { NextRequest, NextResponse } from 'next/server';
import RentalOrderService from '@/services/RentalOrderService';
import { Address, RentalOrder, RentalOrderExtension, RentalOrderItem, Payment } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { getRentalFee, hasOngoingRental, isUnavailableForRental } from '@/lib/artwork';
import { ExtendRentalOrderDTO } from '@/models/RentalOrder';
import { fmtDate } from '@/lib/formatter';
import { DELIVERY_METHOD, PAYMENT_STATUS } from '@/lib/constants';
import { Op } from 'sequelize';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const orderId = parseInt((await params).id);

    const rentalOrderService = new RentalOrderService();
    const rentalOrder = await rentalOrderService.getOrderDetails(orderId);

    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    const { durationMonths, startDate, endDate, totalAmount, paymentMethod }: ExtendRentalOrderDTO =
      await request.json();
    // Validate input
    if (!durationMonths || durationMonths <= 0) {
      return new Response(JSON.stringify({ error: 'Valid duration in months is required' }), { status: 400 });
    }
    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ error: 'Start and end dates are required' }), { status: 400 });
    }
    if (!totalAmount || totalAmount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid total amount is required' }), { status: 400 });
    }
    if (!paymentMethod) {
      return new Response(JSON.stringify({ error: 'Payment method is required' }), { status: 400 });
    }
    if (startDate <= rentalOrder.endDate.toISOString()) {
      return new Response(JSON.stringify({ error: 'Start date must be after current end date' }), { status: 400 });
    }

    const orderArtworks = rentalOrder.items.map((item) => item.artwork);
    for (const artwork of orderArtworks) {
      if (hasOngoingRental(artwork)) {
        const ongoingRental = await rentalOrderService.getOngoingRentalByArtworkId(artwork.id);
        if (ongoingRental && startDate < ongoingRental.endDate.toISOString()) {
          return NextResponse.json(
            {
              error: `Artwork ${artwork.title} is currently rented until ${fmtDate(ongoingRental.endDate)}`,
            },
            { status: 400 }
          );
        } else if (isUnavailableForRental(artwork)) {
          return NextResponse.json({ error: `Artwork ${artwork.title} is not available for rental` }, { status: 400 });
        }
      }
    }

    if (rentalOrder.extension) {
      return new Response(JSON.stringify({ error: 'An extension for this rental order already exists' }), {
        status: 400,
      });
    }

    const address = rentalOrder.address!;

    const newAddress = await Address.create({
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
    });

    const newPayment = await Payment.create({
      userId: rentalOrder.userId,
      amount: totalAmount,
      method: paymentMethod,
      status: PAYMENT_STATUS.PENDING,
    });

    // Create new rental order as extension
    const newRentalOrder = await RentalOrder.create({
      userId: rentalOrder.userId,
      addressId: newAddress.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      durationMonths,
      deliveryMethod: DELIVERY_METHOD.NONE,
      paymentId: newPayment.id,
    });

    // Copy rental order items from original order
    for (const artwork of orderArtworks) {
      await RentalOrderItem.create({
        rentalOrderId: newRentalOrder.id,
        artworkId: artwork.id,
        amount: getRentalFee(artwork, durationMonths),
      });
    }

    // Create RentalOrderExtension record
    await RentalOrderExtension.create({
      originalOrderId: rentalOrder.id,
      extensionOrderId: newRentalOrder.id,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Rental order extended successfully', rentalOrder: newRentalOrder }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error updating payment status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
