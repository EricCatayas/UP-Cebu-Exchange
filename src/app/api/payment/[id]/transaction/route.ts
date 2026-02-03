import PaymentTransactionService from '@/services/PaymentTransactionService';
import ImageService from '@/services/ImageService';
import RentalOrderService from '@/services/RentalOrderService';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/role';
import { Payment, RentalOrder } from '@/models/sequelize';
import { PAYMENT_STATUS, ORDER_STATUS, ARTWORK_STATUS } from '@/lib/constants';

/**
 * POST /api/payments/[id]/transaction
 * Record a manual payment transaction
 * Used when admin receives payment through cash, bank transfer, or other offline methods
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const paymentId = parseInt((await params).id);

    const formData = await request.formData();
    const imageFile = formData.get('imageFile') as File | null;
    const amount = formData.get('amount') as string;
    const currency = (formData.get('currency') as string) || 'PHP';
    const transactionType = (formData.get('transactionType') as string) || 'cash';
    const paymentProofUrl = (formData.get('paymentProofUrl') as string) || '';
    const notes = (formData.get('notes') as string) || '';
    const transactionDate = formData.get('transactionDate') as string;

    // Validate required fields
    if (!paymentId || isNaN(Number(paymentId))) {
      return new Response(JSON.stringify({ error: 'Valid paymentId is required' }), { status: 400 });
    }

    if (!amount) {
      return NextResponse.json({ error: 'Missing required fields: amount is required' }, { status: 400 });
    }

    if (!paymentProofUrl && !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields: image file or payment proof url is required' },
        { status: 400 }
      );
    }

    if (imageFile) {
      // must be a valid image type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(imageFile.type)) {
        return NextResponse.json({ error: 'Invalid image file type. Allowed types: JPEG, PNG, WEBP' }, { status: 400 });
      }
    }

    // Get payment and associated rental order
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check if payment is already completed
    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      return NextResponse.json({ error: 'Payment has already been completed' }, { status: 400 });
    }

    let imageUrl = '';
    // If image file is provided, upload it and get the URL
    if (imageFile) {
      const arrayBuffer = await Promise.resolve(imageFile.arrayBuffer());
      const buffer = new Uint8Array(arrayBuffer);

      const imageService = new ImageService();
      const { success: imageUploadSuccess, result: imageUploadResult } = await imageService.uploadImage(buffer);
      if (imageUploadSuccess && imageUploadResult) {
        imageUrl = imageUploadResult.secure_url;
      } else {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    } else {
      imageUrl = paymentProofUrl;
    }

    console.log('\n\nPayment Proof Image URL:', imageUrl);

    // Create the manual transaction
    const paymentTransactionService = new PaymentTransactionService();
    const transaction = await paymentTransactionService.createManualTransaction({
      paymentId,
      amount: parseFloat(amount),
      currency: currency,
      transactionType: transactionType,
      recordedByUserId: user.userId,
      paymentProofUrl: imageUrl,
      notes,
      transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
    });

    return NextResponse.json(
      {
        message: 'Manual payment recorded successfully',
        transaction: {
          id: transaction.id,
          paymentId: transaction.paymentId,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          transactionDate: transaction.transactionDate,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error recording manual payment:', error);
    return NextResponse.json({ error: error.message || 'Failed to record manual payment' }, { status: 500 });
  }
}
