import React from 'react';
import RentalOrderService from '@/services/RentalOrderService';

async function OrdersDetails({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const rentalOrderService = new RentalOrderService();
  const order = await rentalOrderService.getOrderDetails(id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Order not found</p>
      </div>
    );
  }

  const formattedOrder = {
    id: order.id,
    userId: order.userId,
    userName: (order as any).user?.fullName || 'N/A',
    userEmail: (order as any).user?.email || 'N/A',
    status: order.status,
    startDate: order.startDate,
    endDate: order.endDate,
    deliveryMethod: order.deliveryMethod || 'N/A',
    addressId: order.addressId || 'N/A',
    address: (order as any).address || null,
    durationMonths: order.durationMonths,
    paymentAmount: (order as any).payment?.amount || '0.00',
    paymentStatus: (order as any).payment?.status || 'Pending',
    paymentMethod: (order as any).payment?.method || 'N/A',
    createdAt: order.createdAt,
    items:
      (order as any).rentalOrderItems?.map((item: any) => ({
        id: item.id,
        artworkId: item.artworkId,
        artworkTitle: item.artwork?.title || 'Unknown',
        artworkImage: item.artwork?.images?.[0]?.imageUrl || null,
        amount: item.amount,
      })) || [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Order Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Order ID: {formattedOrder.id}</h2>
        <p className="mb-2">
          <strong>User:</strong> {formattedOrder.userName} ({formattedOrder.userEmail})
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {formattedOrder.status}
        </p>
        <p className="mb-2">
          <strong>Rental Period:</strong> {new Date(formattedOrder.startDate).toLocaleDateString()} -{' '}
          {new Date(formattedOrder.endDate).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong>Delivery Method:</strong> {formattedOrder.deliveryMethod}
        </p>
        <p className="mb-2">
          <strong>Duration (Months):</strong> {formattedOrder.durationMonths}
        </p>
        <p className="mb-2">
          <strong>Payment Amount:</strong> ₱{formattedOrder.paymentAmount}
        </p>
        <p className="mb-2">
          <strong>Payment Status:</strong> {formattedOrder.paymentStatus}
        </p>
        <p className="mb-2">
          <strong>Payment Method:</strong> {formattedOrder.paymentMethod}
        </p>
        {formattedOrder.address ? (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-6 mb-2">Delivery Address</h3>
            <p>{formattedOrder.address.addressLine1}</p>
            {formattedOrder.address.addressLine2 && <p>{formattedOrder.address.addressLine2}</p>}
            <p>
              {formattedOrder.address.city}, {formattedOrder.address.province}, {formattedOrder.address.postalCode}
            </p>
          </div>
        ) : (
          <p className="mb-4">
            <strong>Address:</strong> N/A
          </p>
        )}
        <h3 className="text-xl font-semibold mt-6 mb-4">Items</h3>
        <ul>
          {formattedOrder.items.map((item) => (
            <li key={item.id} className="mb-4 flex items-center">
              {item.artworkImage && (
                <img src={item.artworkImage} alt={item.artworkTitle} className="w-16 h-16 object-cover rounded mr-4" />
              )}
              <div>
                <p className="font-semibold">{item.artworkTitle}</p>
                <p>Amount: ₱{item.amount}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrdersDetails;
