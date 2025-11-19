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
import { getCurrentUser } from '@/lib/auth';
import { getRentalFee } from '@/lib/artwork';
import { DELIVERY_METHOD } from '@/lib/constants';

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
    }: RentalOrderCreateDTO = await request.json();
    const cart = await Cart.findOne({
      where: {
        userId: currentUser.userId,
      },
    });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
    if (deliveryMethod === DELIVERY_METHOD.DELIVERY && !addressId) {
      return NextResponse.json({ error: 'Address is required for delivery method' }, { status: 400 });
    }
    let newAddressId = addressId;
    if (addressId) {
      // Create new copy of address
      const existingAddress = await Address.findOne({
        where: { id: addressId },
      });
      if (!existingAddress) {
        return NextResponse.json({ error: 'Address not found' }, { status: 404 });
      }
      const newAddress = await Address.create({
        city: existingAddress.city,
        province: existingAddress.province,
        postalCode: existingAddress.postalCode,
        addressLine1: existingAddress.addressLine1,
        addressLine2: existingAddress.addressLine2,
      });
      newAddressId = newAddress.id;
    }
    // Create Payment here
    const newPayment = await Payment.create({
      userId: currentUser.userId,
      amount: totalAmount,
      method: paymentMethod,
      status: 'Pending',
    });
    // Create rental order
    const newRentalOrder = await RentalOrder.create({
      userId: currentUser.userId,
      paymentId: newPayment.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      deliveryMethod,
      durationMonths: durationMonths,
      addressId: newAddressId,
      status: 'Pending',
    });

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
      { message: 'Rental order created successfully', rentalOrderId: newRentalOrder.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating rental order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
