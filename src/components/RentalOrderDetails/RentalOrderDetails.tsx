'use client';
import { redirect } from 'next/navigation';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getImageUrl } from '@/lib/artwork';
import { getOrderStatus, getReturnDueDate } from '@/lib/order';
import { fmtDate } from '@/lib/formatter';

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

export default function RentalOrderDetails({
  order,
  onItemClicked,
  userButton,
  paymentButton,
}: {
  order: RentalOrderDTO;
  onItemClicked?: (item: any) => void;
  userButton?: {
    label: string;
    classes: string;
    onClick: (user: any) => void;
  } | null;
  paymentButton?: {
    label: string;
    classes: string;
    onClick: (payment: any) => void;
  } | null;
}) {
  function handleRentalItemClick(item) {
    if (onItemClicked) {
      onItemClicked(item);
      return;
    }

    redirect(`/artworks/${item.artwork.id}`);
  }

  const orderStatus = getOrderStatus(order);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold text-sm ${orderStatus.color}`}>
            {orderStatus.label}
          </span>
        </div>
      </div>

      {/* User & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Full Name</p>
              <p className="text-gray-900 font-medium">{order.user?.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</p>
              <p className="text-gray-900 break-all">{order.user?.email || 'N/A'}</p>
            </div>
          </div>
          {userButton && (
            <button
              onClick={() => userButton.onClick(order.user)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {userButton.label}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Duration</p>
              <p className="text-gray-900 font-medium">{order.durationMonths} months</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Delivery Method</p>
              <p className="text-gray-900 font-medium">{order.deliveryMethod}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Return Date</p>
              <p className="text-gray-900 font-medium">{fmtDate(getReturnDueDate(order))}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Amount</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₱{order.payment?.amount || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Payment Status</p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full font-semibold text-sm ${getPaymentStatusColor(order.payment?.status)}`}
            >
              {order.payment?.status || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Method</p>
            <p className="text-gray-900 font-medium mt-1">{order.payment?.method || 'N/A'}</p>
          </div>
        </div>
        {paymentButton && (
          <button
            onClick={() => paymentButton.onClick(order.payment)}
            className={`mt-4 px-4 py-2 ${paymentButton.classes}`}
          >
            {paymentButton.label}
          </button>
        )}
      </div>

      {/* Delivery Address */}
      {order.address ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <p className="text-gray-900 font-medium">{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p className="text-gray-700">{order.address.addressLine2}</p>}
            <p className="text-gray-700 mt-2">
              {order.address.city}, {order.address.province} {order.address.postalCode}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p className="font-medium">Delivery Address: N/A</p>
        </div>
      )}

      {/* Rental Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
        <div className="space-y-3">
          {order.items?.length ? (
            order.items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRentalItemClick(item)}
                className="flex items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-200 hover:border-blue-300"
              >
                {item.artwork?.images && (
                  <img
                    src={getImageUrl(item.artwork)}
                    alt={item.artwork.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">{item.artwork?.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">ID: {item.artwork?.id}</p>
                </div>
                <div className="flex-shrink-0 text-right ml-4">
                  <p className="text-xl font-bold text-gray-900">₱{item.amount}</p>
                  <p className="text-xs text-gray-500 mt-1">Rental Amount</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">No items in this order</p>
          )}
        </div>
      </div>
    </div>
  );
}
