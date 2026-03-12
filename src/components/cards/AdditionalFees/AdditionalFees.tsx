import { BillingFeeCreateDTO } from '@/models/BillingFee';
import { billingFeeTypes } from '@/lib/labels';

interface AdditionalFeesCardProps {
  fees: BillingFeeCreateDTO[];
  onFeesChange: (fees: BillingFeeCreateDTO[]) => void;
}

const createEmptyFee = (): BillingFeeCreateDTO => ({
  rentalOrderId: null,
  type: '',
  label: '',
  amount: 0,
});

export default function AdditionalFeesCard({ fees, onFeesChange }: AdditionalFeesCardProps) {
  const handleAddFee = () => {
    onFeesChange([...fees, createEmptyFee()]);
  };

  const handleRemoveFee = (index: number) => {
    onFeesChange(fees.filter((_, i) => i !== index));
  };

  const handleFeeChange = (index: number, key: keyof BillingFeeCreateDTO, value: string | number) => {
    onFeesChange(
      fees.map((fee, i) => {
        if (i !== index) return fee;
        return {
          ...fee,
          [key]: value,
        };
      })
    );
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Additional Fees</h2>
        <button
          type="button"
          onClick={handleAddFee}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Add Fee
        </button>
      </div>

      {fees.length === 0 ? (
        <p className="text-sm text-gray-600">No additional fees added.</p>
      ) : (
        <div className="space-y-4">
          {fees.map((fee, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border rounded-lg p-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select
                  value={fee.type}
                  onChange={(e) => handleFeeChange(index, 'type', e.target.value)}
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

              <div className="md:col-span-5">
                <label className="block text-sm font-semibold mb-1">Label</label>
                <input
                  type="text"
                  value={fee.label}
                  onChange={(e) => handleFeeChange(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Local Delivery Fee"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={fee.amount}
                  onChange={(e) => handleFeeChange(index, 'amount', Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-1">
                <button
                  type="button"
                  onClick={() => handleRemoveFee(index)}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-3 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
