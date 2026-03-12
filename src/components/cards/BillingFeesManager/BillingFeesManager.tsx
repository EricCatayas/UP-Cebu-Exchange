'use client';

import { useEffect, useMemo, useState } from 'react';
import { billingFeeTypes } from '@/lib/labels';
import { BillingFeeCreateDTO, BillingFeeDTO } from '@/models/BillingFee';

interface BillingFeesManagerProps {
  orderId: number;
  fees: BillingFeeDTO[];
}

const createEmptyFee = (): BillingFeeCreateDTO => ({
  rentalOrderId: null,
  type: '',
  label: '',
  amount: 0,
});

export default function BillingFeesManager({ orderId, fees }: BillingFeesManagerProps) {
  const [managedFees, setManagedFees] = useState<BillingFeeDTO[]>(fees || []);
  const [newFee, setNewFee] = useState<BillingFeeCreateDTO>(createEmptyFee());
  const [creating, setCreating] = useState(false);
  const [updatingFeeId, setUpdatingFeeId] = useState<number | null>(null);
  const [deletingFeeId, setDeletingFeeId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setManagedFees(fees || []);
  }, [fees]);

  const isNewFeeValid = useMemo(() => {
    return Boolean(newFee.type && newFee.label.trim()) && Number(newFee.amount) >= 0;
  }, [newFee]);

  const handleDraftFeeChange = (feeId: number, key: keyof BillingFeeDTO, value: string | number) => {
    setManagedFees((prev) =>
      prev.map((fee) => {
        if (fee.id !== feeId) return fee;
        return {
          ...fee,
          [key]: value,
        };
      })
    );
  };

  const handleCreateFee = async () => {
    if (!isNewFeeValid) {
      setError('Type, label, and a valid amount are required.');
      return;
    }

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/rental-order/${orderId}/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newFee.type,
          label: newFee.label.trim(),
          amount: Number(newFee.amount),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create fee');
      }

      setManagedFees((prev) => [...prev, data.fee as BillingFeeDTO]);
      setNewFee(createEmptyFee());
      setMessage('Billing fee created successfully.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create fee');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateFee = async (fee: BillingFeeDTO) => {
    if (!fee.type || !fee.label.trim() || Number(fee.amount) < 0) {
      setError('Type, label, and a valid amount are required.');
      return;
    }

    setUpdatingFeeId(fee.id);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/rental-order/${orderId}/fees`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fee.id,
          type: fee.type,
          label: fee.label.trim(),
          amount: Number(fee.amount),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update fee');
      }

      setManagedFees((prev) => prev.map((item) => (item.id === fee.id ? (data.fee as BillingFeeDTO) : item)));
      setMessage('Billing fee updated successfully.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update fee');
    } finally {
      setUpdatingFeeId(null);
    }
  };

  const handleDeleteFee = async (feeId: number) => {
    setDeletingFeeId(feeId);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/rental-order/${orderId}/fees`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feeId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete fee');
      }

      setManagedFees((prev) => prev.filter((fee) => fee.id !== feeId));
      setMessage('Billing fee deleted successfully.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete fee');
    } finally {
      setDeletingFeeId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Manage Billing Fees</h2>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}
      {message && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">{message}</div>
      )}

      <div className="space-y-3">
        {managedFees.length === 0 ? (
          <p className="text-sm text-gray-600">No billing fees for this order.</p>
        ) : (
          managedFees.map((fee) => (
            <div
              key={fee.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border rounded-lg p-4 bg-gray-50"
            >
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Type</label>
                <select
                  value={fee.type || ''}
                  onChange={(e) => handleDraftFeeChange(fee.id, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Type</option>
                  {billingFeeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Label</label>
                <input
                  type="text"
                  value={fee.label}
                  onChange={(e) => handleDraftFeeChange(fee.id, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Amount</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={fee.amount}
                  onChange={(e) => handleDraftFeeChange(fee.id, 'amount', Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateFee(fee)}
                  disabled={updatingFeeId === fee.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-3 rounded-md transition-colors"
                >
                  {updatingFeeId === fee.id ? 'Saving...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFee(fee.id)}
                  disabled={deletingFeeId === fee.id}
                  className="flex-1 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 font-semibold py-2 px-3 rounded-md transition-colors"
                >
                  {deletingFeeId === fee.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Add New Fee</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Type</label>
            <select
              value={newFee.type || ''}
              onChange={(e) => setNewFee((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Type</option>
              {billingFeeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Label</label>
            <input
              type="text"
              value={newFee.label}
              onChange={(e) => setNewFee((prev) => ({ ...prev, label: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Local Delivery Fee"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Amount</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={newFee.amount}
              onChange={(e) => setNewFee((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="button"
              onClick={handleCreateFee}
              disabled={creating}
              className="w-full bg-secondary hover:bg-secondary-dark disabled:bg-gray-400 text-white font-bold py-2 px-3 rounded-md transition-colors"
            >
              {creating ? 'Creating...' : 'Add Fee'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
