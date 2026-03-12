import { PAYMENT_METHODS } from '@/lib/constants';
import { FaInfoCircle } from 'react-icons/fa';

export default function PaymentMethodCard({
  selectedMethod,
  onMethodChange,
}: {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}) {
  const tooltipText = {
    online: 'Online Payment: Pay securely through our app using credit/debit cards or other online payment options.',
    cash: 'Cash Payment: Pay in cash at our store during pickup or delivery. Please note that cash payments may require additional verification and may not be available for all orders.',
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payment Method</h2>
        <div className="group relative">
          <FaInfoCircle className="text-gray-400 w-5 h-5 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 w-48 z-10">
            {tooltipText.online}
            <br />
            {tooltipText.cash}
          </div>
        </div>
      </div>
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
