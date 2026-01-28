import Link from 'next/link';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getDaysRemaining, getOrderStatus, isOrderCancelable, isOrderReturnable, isPaymentDue } from '@/lib/order';
import { fmtDate } from '@/lib/formatter';

const RentalOrderCard = ({ order, children }: { order: RentalOrderDTO; children?: React.ReactNode }) => {
  const daysLeft = getDaysRemaining(order);
  const orderStatus = getOrderStatus(order);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div
        className={`rounded-t-xl py-2 px-4 mb-4 flex items-center justify-between border-b border-b-gray-200 ${orderStatus.color}`}
      >
        <span className="text-sm text-gray-600">Order ID: {order.id}</span>
        <span className="text-sm font-medium text-gray-800">{daysLeft} days left</span>
      </div>

      {/* Content */}
      <dl className="text-sm space-y-2 px-4">
        {order.user && (
          <div className="flex justify-between">
            <dt className="text-gray-500">From</dt>
            <dd className="text-gray-900">{order.user.fullName}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-gray-500">Order Date</dt>
          <dd className="text-gray-900">{fmtDate(order.createdAt)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Rental Period</dt>
          <dd className="text-gray-900">
            {fmtDate(order.startDate)} → {fmtDate(order.endDate)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Duration</dt>
          <dd className="text-gray-900">{order.durationMonths} months</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Remaining</dt>
          <dd className="text-gray-900">{daysLeft} days</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Status</dt>
          <dd className="text-gray-900">{orderStatus.label}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Payment Method</dt>
          <dd className="text-gray-900">{order.payment.method}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Artworks</dt>
          <dd className="text-gray-900">{order.items.length}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Total Amount</dt>
          <dd className="text-gray-900">₱{order.payment.amount.toLocaleString('en-PH')}</dd>
        </div>
      </dl>
      {/* Links */}
      {children && <div className="px-4 my-4 flex flex-wrap gap-4 text-sm">{children}</div>}
    </div>
  );
};

export default RentalOrderCard;
