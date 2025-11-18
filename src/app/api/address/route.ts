import { NextRequest, NextResponse } from 'next/server';
import { Address, UserAddress } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = currentUser.userId;
    const { city, province, postalCode, addressLine1, addressLine2 } = await request.json();

    const newAddress = await Address.create({
      city,
      province,
      postalCode,
      addressLine1,
      addressLine2,
    });

    await UserAddress.create({
      userId,
      addressId: newAddress.id,
    });
    return NextResponse.json({ message: 'Address created successfully', address: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ message: 'Failed to create address' }, { status: 500 });
  }
}
