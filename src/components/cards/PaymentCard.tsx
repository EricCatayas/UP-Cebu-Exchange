'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import { PaymentDTO } from '@/models/Payment';
import { paymentApi } from '@/lib/api/payment';
import { paymentMethods } from '@/lib/labels';
import { PAYMENT_STATUSES } from '@/lib/constants';

export default function PaymentCard({ payment, isReadOnly = false }: { payment: PaymentDTO; isReadOnly?: boolean }) {
  const router = useRouter();
  const [hasEdited, setHasEdited] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(payment.status || '');
  const [amount, setAmount] = useState(payment.amount || 0);
  const [method, setMethod] = useState(payment.method || '');

  const { openConfirmation } = useModal();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
    setHasEdited(true);
  };

  const handleSelectPaymentMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value;
    setMethod(newMethod);
    setHasEdited(true);
  };

  const handleSelectPaymentStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setPaymentStatus(newStatus);
    setHasEdited(true);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!hasEdited) return;

      openConfirmation(
        {
          title: 'Confirm Status Update',
          message: `Are you sure you want to make changes to the payment?`,
        },
        async () => {
          try {
            const updatedPayment = await paymentApi.update(payment.id, { amount, method, status: paymentStatus });
            // page refresh to reflect changes
            alert(`Payment has been updated`);
          } catch (error) {
            alert(error.message);
          }
        }
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Amount</p>
          {isReadOnly ? (
            <p className="text-gray-900 font-medium mt-1">₱{amount}</p>
          ) : (
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Status</p>
          {isReadOnly ? (
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full font-semibold text-sm ${getPaymentStatusColor(payment.status)}`}
            >
              {payment.status}
            </span>
          ) : (
            <select
              id="paymentStatus"
              className="inline-block mt-1 px-3 py-1 border border-gray-300 rounded-full font-semibold text-sm"
              value={paymentStatus}
              onChange={handleSelectPaymentStatus}
            >
              {PAYMENT_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Method</p>
          {isReadOnly ? (
            <p className="text-gray-900 font-medium mt-1">{method}</p>
          ) : (
            <select
              id="paymentMethod"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={method}
              onChange={handleSelectPaymentMethod}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Updated On</p>
          <p className="text-gray-900 font-medium mt-1">
            {new Date(payment.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Customer Info */}
      {payment.user && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Customer</p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-gray-900 font-medium">{payment.user.fullName}</p>
              <p className="text-sm text-gray-600">{payment.user.email}</p>
            </div>
          </div>
        </div>
      )}

      {hasEdited && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Update Changes</p>

          <button
            onClick={handleSaveChanges}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

          <button
            onClick={() => router.refresh()}
            className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
