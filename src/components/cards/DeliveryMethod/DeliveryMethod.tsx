import { AddressDTO } from '@/models/Address';
import { FaInfoCircle } from 'react-icons/fa';
import { DELIVERY_FEE, DELIVERY_METHODS, PAYMENT_METHODS, DELIVERY_METHOD, PAYMENT_METHOD } from '@/lib/constants';
import { useRentalOrder } from '@/contexts/RentalOrderContext';

export default function DeliveryMethodCard({
  selectedMethod,
  onMethodChange,
  children,
  showInstructions = true,
}: {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  children?: React.ReactNode;
  showInstructions?: boolean;
}) {
  const { paymentMethod, deliveryMethod } = useRentalOrder();

  const isDelivery = deliveryMethod === DELIVERY_METHOD.DELIVERY;

  const tooltipText = {
    delivery: `Delivery Fee: A flat fee of ₱${DELIVERY_FEE} applies for delivery orders. This fee covers the cost of shipping and handling to your provided address. Delivery times may vary based on your location and courier availability.`,
    pickup:
      'Store Pickup: No additional fees. Pick up your rental items directly from our store at your scheduled time.',
  };

  const instructions = {
    [DELIVERY_METHOD.PICKUP]: {
      // Scenario 1: Pickup with Online Payment
      [PAYMENT_METHOD.ONLINE]: [
        {
          title: '1. Place Your Order',
          description: 'Complete your rental order through our app.',
        },
        {
          title: '2. Order Confirmation',
          description:
            'Our team will contact you to confirm your order, provide rental instructions, and schedule your pickup date and time.',
        },
        {
          title: '3. Online Payment',
          description: 'Settle your payment securely through our online payment options.',
        },
        {
          title: '4. Store Pickup & Inspection',
          description: 'Visit our store at the scheduled time to inspect the items and complete the pickup.',
        },
        {
          title: '5. Receive Your Items',
          description: "Once everything is confirmed, you'll receive your rental items and may begin using them.",
        },
      ],
      // Scenario 2: Pickup with Cash Payment
      [PAYMENT_METHOD.CASH]: [
        {
          title: '1. Place Your Order',
          description: 'Complete your rental order through our app.',
        },
        {
          title: '2. Order Confirmation',
          description:
            'Our team will contact you to confirm your order, provide rental instructions, and schedule your pickup date and time.',
        },
        {
          title: '3. Store Visit, Inspection & Payment',
          description: 'Visit our store to inspect the items, complete the cash payment, and finalize the rental.',
        },
        {
          title: '4. Receive Your Items',
          description: "After payment, you'll receive your rental items.",
        },
      ],
    },
    [DELIVERY_METHOD.DELIVERY]: {
      // Scenario 3: Delivery with Online Payment
      [PAYMENT_METHOD.ONLINE]: [
        {
          title: '1. Place Your Order',
          description: 'Complete your rental order through our app.',
        },
        {
          title: '2. Order Confirmation',
          description:
            'Our team will contact you to confirm your order, explain the rental process, and schedule the delivery.',
        },
        {
          title: '3. Online Payment',
          description: 'Complete your payment securely through our online payment options.',
        },
        {
          title: '4. Shipping & Delivery',
          description: 'Your rental items will be prepared and shipped to your provided address.',
        },
        {
          title: '5. Receive Your Items',
          description: 'Once delivered, you may inspect and start using your rental items.',
        },
      ],
      // Scenario 4: Delivery with Cash Payment
      [PAYMENT_METHOD.CASH]: [
        {
          title: '1. Place Your Order',
          description: 'Complete your rental order through our app.',
        },
        {
          title: '2. Order Confirmation',
          description:
            'Our team will contact you to confirm your order, explain the rental process, and schedule the delivery.',
        },
        {
          title: '3. Store Visit, Inspection & Payment',
          description: 'Visit our store to inspect the items and complete the cash payment.',
        },
        {
          title: '4. Shipping & Delivery',
          description: 'After payment, your rental items will be shipped to your address.',
        },
        {
          title: '5. Receive Your Items',
          description: 'Once delivered, you may inspect and start using your rental items.',
        },
      ],
    },
  };
  const deliveryRiskNotice = {
    title: 'Delivery Risk Notice:',
    description:
      'By selecting delivery, you acknowledge that all risks during transit (including loss, damage, theft, or delays) are the customer’s responsibility once the item is handed to the courier. The Lessor is not liable for any transit-related issues.',
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Delivery Method</h2>
        <div className="group relative">
          <FaInfoCircle className="text-gray-400 w-5 h-5 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 w-48 z-10">
            {tooltipText.delivery}
            <br />
            {tooltipText.pickup}
          </div>
        </div>
      </div>
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
      {children}
      {showInstructions && (
        <div className="mt-6 pt-4 border-t">
          <span className="font-semibold text-lg">Instructions:</span>
          {instructions[selectedMethod][paymentMethod].map((step, index) => (
            <ol>
              <li key={index} className="mt-4">
                <h4 className="text-md font-semibold">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </li>
            </ol>
          ))}
          {isDelivery && (
            <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-800">{deliveryRiskNotice.title}</h3>
              <p className="text-sm text-yellow-700">{deliveryRiskNotice.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
