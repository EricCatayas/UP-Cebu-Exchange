import { AddressDTO } from '@/models/Address';
import { DELIVERY_FEE, DELIVERY_METHODS, PAYMENT_METHODS, DELIVERY_METHOD } from '@/lib/constants';

export default function DeliveryMethodCard({
  selectedMethod,
  onMethodChange,
  children,
}: {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
      <div className="flex gap-6">
        {DELIVERY_METHODS.map((method) => (
          <label key={method} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="deliveryMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={() => onMethodChange(method)}
            />
            <span>{method}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <span className="font-semibold text-lg">Instructions:</span>
        <p className="text-sm text-gray-600 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis animi ullam pariatur tempore natus, eligendi sit
          in asperiores doloribus. Aliquam obcaecati iure debitis, nemo earum in quisquam fugit corporis minus!
        </p>
      </div>
      {children}
    </div>
  );
}
