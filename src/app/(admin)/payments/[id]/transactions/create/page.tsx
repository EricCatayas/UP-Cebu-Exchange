import Link from 'next/link';
import CreateTransaction from '@/components/form/PaymentTransaction/CreateTransaction';
import PaymentService from '@/services/PaymentService';

export default async function CreateTransactionPage({ params }: { params: { id: string } }) {
  const paymentId = parseInt((await params).id);

  const paymentService = new PaymentService();
  const paymentData = await paymentService.getPaymentById(paymentId);

  if (!paymentData) {
    return (
      <div className="px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Payment not found</p>
          <Link href="/payments" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Payments
          </Link>
        </div>
      </div>
    );
  }

  const payment = JSON.parse(JSON.stringify(paymentData));

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/payments" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Payments
          </Link>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Payment Transaction</h1>
        <CreateTransaction paymentId={paymentId} amount={payment.amount} />
      </div>
    </div>
  );
}
