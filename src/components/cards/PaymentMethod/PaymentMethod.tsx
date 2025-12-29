import { PAYMENT_METHODS } from '@/lib/constants';

export default function PaymentMethodCard({
  selectedMethod,
  onMethodChange,
}: {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      <div className="flex gap-6">
        {PAYMENT_METHODS.map((method) => (
          <label key={method} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={() => onMethodChange(method)}
            />
            <span>{method}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
