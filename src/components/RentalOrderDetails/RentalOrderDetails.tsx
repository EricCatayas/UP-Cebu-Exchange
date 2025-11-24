'use client';
import { redirect } from 'next/navigation';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getImageUrl } from '@/lib/artwork';

export default function RentalOrderDetails({
  order,
  onItemClicked,
}: {
  order: RentalOrderDTO;
  onItemClicked?: (item: any) => void;
}) {
  function handleRentalItemClick(item) {
    if (onItemClicked) {
      onItemClicked(item);
      return;
    }

    redirect(`/artworks/${item.artwork.id}`);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Order ID: {order.id}</h2>
      <p className="mb-2">
        <strong>User:</strong> {order.user?.fullName || 'N/A'} ({order.user?.email || 'N/A'})
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {order.status}
      </p>
      <p className="mb-2">
        <strong>Rental Period:</strong> {new Date(order.startDate).toLocaleDateString()} -{' '}
        {new Date(order.endDate).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>Delivery Method:</strong> {order.deliveryMethod}
      </p>
      <p className="mb-2">
        <strong>Duration (Months):</strong> {order.durationMonths}
      </p>
      <p className="mb-2">
        <strong>Payment Amount:</strong> ₱{order.payment?.amount || '-'}
      </p>
      <p className="mb-2">
        <strong>Payment Status:</strong> {order.payment?.status || '-'}
      </p>
      <p className="mb-2">
        <strong>Payment Method:</strong> {order.payment?.method || '-'}
      </p>
      {order.address ? (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mt-6 mb-2">Delivery Address</h3>
          <p>{order.address.addressLine1}</p>
          {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
          <p>
            {order.address.city}, {order.address.province}, {order.address.postalCode}
          </p>
        </div>
      ) : (
        <p className="mb-4">
          <strong>Address:</strong> N/A
        </p>
      )}
      <h3 className="text-xl font-semibold mt-6 mb-4">Items</h3>
      <ul>
        {order.rentalOrderItems?.map((item) => (
          <li key={item.id} className="mb-4 flex items-center" onClick={() => handleRentalItemClick(item)}>
            {item.artwork?.images && (
              <img
                src={getImageUrl(item.artwork)}
                alt={item.artwork.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
            )}
            <div>
              <h4 className="text-lg font-medium">{item.artwork?.title}</h4>
              <p>Amount: ₱{item.amount}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
