import { Payment, PaymentTransaction, User } from '@/models/sequelize';
import { PaymentTransactionAttributes } from '@/models/PaymentTransaction';

interface CreateManualTransactionParams {
  paymentId: number;
  transactionType: string;
  amount: number;
  method: string;
  currency?: string;
  recordedByUserId: number;
  imageUrl: string;
  notes?: string;
  transactionDate?: Date;
}

interface CreateStripeTransactionParams {
  paymentId: number;
  amount: number;
  currency?: string;
  transactionDate?: Date;
  metadata?: {
    paymentIntentId: string;
    paymentMethod: string;
    browserSessionId?: string;
  };
}

class PaymentTransactionService {
  /**
   * Create a manual payment transaction record
   * Used when admin/owner records a payment received outside the system
   */
  async createManualTransaction(params: CreateManualTransactionParams): Promise<PaymentTransaction> {
    const {
      paymentId,
      amount,
      currency,
      transactionType,
      method,
      recordedByUserId,
      imageUrl,
      notes,
      transactionDate = new Date(),
    } = params;

    // Verify payment exists
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }

    // Verify recording user exists and has appropriate role
    const recordingUser = await User.findByPk(recordedByUserId, { include: ['role'] });
    if (!recordingUser) {
      throw new Error(`User with ID ${recordedByUserId} not found`);
    }

    const transaction = await PaymentTransaction.create({
      paymentId,
      transactionType: transactionType,
      amount,
      currency,
      method,
      imageUrl,
      transactionDate,
      recordedByUserId,
      metadata: {
        recordedBy: {
          id: recordingUser.id,
          email: recordingUser.email,
          fullName: recordingUser.fullName,
        },
        notes,
      },
    });

    return transaction;
  }

  async createStripeTransaction(params: CreateStripeTransactionParams): Promise<PaymentTransaction> {
    const { paymentId, amount, currency, metadata, transactionDate = new Date() } = params;
    // Verify payment exists
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }
    const transaction = await PaymentTransaction.create({
      paymentId,
      transactionType: 'payment',
      amount,
      currency,
      method: 'stripe',
      metadata,
      transactionDate,
    });
    return transaction;
  }

  /**
   * Get all transactions for a specific payment
   */
  async getPaymentTransactions(paymentId: number): Promise<PaymentTransaction[]> {
    return await PaymentTransaction.findAll({
      where: { paymentId },
      include: [
        {
          association: 'recordedBy',
          attributes: ['id', 'email', 'fullName'],
        },
      ],
      order: [['transactionDate', 'DESC']],
    });
  }

  /**
   * Get a specific transaction by ID
   */
  async getTransactionById(transactionId: number): Promise<PaymentTransaction | null> {
    return await PaymentTransaction.findByPk(transactionId, {
      include: [
        {
          association: 'payment',
        },
        {
          association: 'recordedBy',
          attributes: ['id', 'email', 'fullName'],
        },
      ],
    });
  }

  /**
   * Get all manual transactions recorded by a specific user
   */
  async getManualTransactionsByRecorder(userId: number): Promise<PaymentTransaction[]> {
    return await PaymentTransaction.findAll({
      where: {
        transactionType: 'manual',
        recordedByUserId: userId,
      },
      include: ['payment'],
      order: [['transactionDate', 'DESC']],
    });
  }

  /**
   * Update transaction notes (for manual transactions)
   */
  async updateTransactionNotes(transactionId: number, notes: string): Promise<PaymentTransaction> {
    const transaction = await PaymentTransaction.findByPk(transactionId);
    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }

    if (transaction.transactionType !== 'manual') {
      throw new Error('Can only update notes for manual transactions');
    }

    await transaction.update({ notes });
    return transaction;
  }

  /**
   * Mark a transaction as refunded
   */
  async markAsRefunded(transactionId: number): Promise<PaymentTransaction> {
    const transaction = await PaymentTransaction.findByPk(transactionId);
    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }

    await transaction.update({ status: 'refunded' });
    return transaction;
  }
}

export default PaymentTransactionService;
