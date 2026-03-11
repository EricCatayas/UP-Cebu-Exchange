import { NextResponse } from 'next/server';
import { RentalOrder, BillingFee } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const orderId = parseInt((await params).id);

    if (!orderId || isNaN(Number(orderId))) {
      return new Response(JSON.stringify({ error: 'Valid orderId is required' }), { status: 400 });
    }

    const rentalOrder = await RentalOrder.findByPk(orderId);

    if (!rentalOrder) {
      return new Response(JSON.stringify({ error: 'Rental order not found' }), { status: 404 });
    }

    const { type, label, amount } = await request.json();

    if (!type || !label || amount === undefined) {
      return new Response(JSON.stringify({ error: 'Type, label, and amount are required' }), { status: 400 });
    }

    const newFee = await BillingFee.create({
      rentalOrderId: orderId,
      type,
      label,
      amount,
    });

    return new Response(JSON.stringify({ message: 'Fee created successfully', fee: newFee }), { status: 201 });
  } catch (error) {
    console.error('Error creating rental order fees:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const orderId = parseInt((await params).id);

    if (!orderId || isNaN(Number(orderId))) {
      return new Response(JSON.stringify({ error: 'Valid orderId is required' }), { status: 400 });
    }

    const { id, type, label, amount } = await request.json();

    if (!id || isNaN(Number(id)) || !type || !label || amount === undefined) {
      return new Response(JSON.stringify({ error: 'Valid fee ID, type, label, and amount are required' }), {
        status: 400,
      });
    }

    const billingFee = await BillingFee.findOne({ where: { id, rentalOrderId: orderId } });

    if (!billingFee) {
      return new Response(JSON.stringify({ error: 'Fee not found for this order' }), { status: 404 });
    }

    billingFee.type = type;
    billingFee.label = label;
    billingFee.amount = amount;
    await billingFee.save();

    return new Response(JSON.stringify({ message: 'Fee updated successfully', fee: billingFee }), { status: 200 });
  } catch (error) {
    console.error('Error updating rental order fees:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const orderId = parseInt((await params).id);

    if (!orderId || isNaN(Number(orderId))) {
      return new Response(JSON.stringify({ error: 'Valid orderId is required' }), { status: 400 });
    }

    const { id } = await request.json();

    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Valid fee ID is required' }), { status: 400 });
    }

    const billingFee = await BillingFee.findOne({ where: { id, rentalOrderId: orderId } });

    if (!billingFee) {
      return new Response(JSON.stringify({ error: 'Fee not found for this order' }), { status: 404 });
    }

    await billingFee.destroy();

    return new Response(JSON.stringify({ message: 'Fee deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting rental order fees:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
