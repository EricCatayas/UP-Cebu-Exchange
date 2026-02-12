import { NextRequest, NextResponse } from 'next/server';
import { Address, RentalOrder, Payment } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!isAdmin(currentUser) || !canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const orderId = parseInt((await params).id);
    const rentalOrder = await RentalOrder.findByPk(orderId);
    if (!rentalOrder) {
      return NextResponse.json({ error: 'Rental order not found' }, { status: 404 });
    }
    await rentalOrder.destroy();
    const orderPayment = await Payment.findByPk(rentalOrder.paymentId);
    if (orderPayment) {
      await orderPayment.destroy();
    }
    const address = await Address.findByPk(rentalOrder.addressId);
    if (address) {
      await address.destroy();
    }

    return NextResponse.json({ message: 'Rental order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting rental order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
