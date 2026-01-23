import { NextRequest, NextResponse } from 'next/server';
import { Address, UserAddress } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = parseInt((await params).id);

    const userAddress = await UserAddress.findOne({ where: { userId } });

    if (!userAddress) {
      return NextResponse.json({ error: 'Address not found for user' }, { status: 404 });
    }

    const address = await Address.findByPk(userAddress.addressId);

    if (!address) {
      return NextResponse.json({ error: 'Address record not found' }, { status: 404 });
    }

    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
