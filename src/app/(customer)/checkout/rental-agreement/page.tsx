'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { useUserAddress } from '@/contexts/UserAddressContext';
import { DELIVERY_FEE, DELIVERY_METHOD } from '@/lib/constants';

function RentalAgreement() {
  const { cartItems } = useCart();
  const { address } = useUserAddress();

  const { selectedDuration, startDate, endDate, deliveryMethod, paymentMethod, subtotal, total, setContractSigned } =
    useRentalOrder();

  const router = useRouter();

  const handleSignContract = () => {
    setContractSigned(true);
    router.push('/checkout');
  };

  return (
    <div>
      <h1>Rental Agreement</h1>
      <div>
        <h2>Rented Items</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>{item.artwork.title}</li>
          ))}
        </ul>
        <p>Subtotal: ₱{subtotal}</p>
      </div>
      <div>
        <h2>Rental Details</h2>
        <p>Duration: {selectedDuration} months</p>
        <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
        <p>
          Delivery Method: {deliveryMethod} {deliveryMethod === DELIVERY_METHOD.DELIVERY ? `(₱${DELIVERY_FEE})` : ''}
        </p>
        {deliveryMethod === DELIVERY_METHOD.DELIVERY ? (
          <>
            <p>
              Delivery Address:{' '}
              {address
                ? `${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${
                    address.city
                  }, ${address.province}, ${address.postalCode}`
                : 'N/A'}
            </p>
            <p>Payment Method: {paymentMethod}</p>
            <p>Total: ₱{total}</p>
          </>
        ) : (
          <p>Delivery Address: N/A</p>
        )}
        <p>Total: ₱{total}</p>
      </div>
      <div>
        <h2>Contract</h2>
        <p>Please read and sign the rental agreement contract to proceed with your rental.</p>
        <button onClick={handleSignContract}>Sign Contract</button>
      </div>
    </div>
  );
}

export default RentalAgreement;
