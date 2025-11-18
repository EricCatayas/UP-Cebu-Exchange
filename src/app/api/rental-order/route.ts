import { NextRequest, NextResponse } from 'next/server';
import { Cart, CartItem, RentalOrder, RentalOrderItem, Payment, Artwork, RentalPlan } from '@/models/sequelize';
import { RentalOrderCreateDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';
import { getRentalFee } from '@/lib/artwork';

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
    }: RentalOrderCreateDTO = await request.json();
    const cart = await Cart.findOne({
      where: {
        userId: currentUser.userId,
      },
    });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
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
