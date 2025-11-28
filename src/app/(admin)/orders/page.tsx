import React from 'react';
import Link from 'next/link';
import RentalOrderService from '@/services/RentalOrderService';
import { fmt, getDaysRemaining, getOrderStatus } from '@/lib/date';

async function OrdersPage() {
  const rentalOrderService = new RentalOrderService();
  const rentalOrders = await rentalOrderService.getAllOrders();

  const formattedOrders = rentalOrders.map((order) => ({
    id: order.id,
    userId: order.userId,
    userName: order.user?.fullName || 'N/A',
    userEmail: order.user?.email || 'N/A',
    status: order.status,
    startDate: order.startDate,
    endDate: order.endDate,
    deliveryMethod: order.deliveryMethod || 'N/A',
    durationMonths: order.durationMonths,
    paymentAmount: order.payment?.amount || '0.00',
    paymentStatus: order.payment?.status || 'Pending',
    paymentMethod: order.payment?.method || 'N/A',
    createdAt: order.createdAt,
  }));

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rental Orders</h1>
      </div>

      <div className="mt-8 space-y-12">
        <div className="rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formattedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  formattedOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{order.userName}</div>
                          <div className="text-xs text-gray-500">{order.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ₱{
                            order.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₱
                          {Number(order.paymentAmount).toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ₱{
                            order.paymentStatus === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/orders/${order.id}`}>
                            <span className="text-indigo-600 hover:text-indigo-900">View Details</span>
                          </Link>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rentalOrders.map((order) => {
          const daysLeft = getDaysRemaining(order);
          return (
            <div key={order.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Header */}
              <div
                className={`rounded-t-xl py-2 px-4 mb-4 flex items-center justify-between border-b border-b-gray-200 bg-${order.status.toLowerCase()}`}
              >
                <span className="text-sm text-gray-600">Order ID: {order.id}</span>
                <span className="text-sm font-medium text-gray-800">{daysLeft} days left</span>
              </div>

              {/* Content */}
              <dl className="text-sm space-y-2 px-4">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name: {order.user?.fullName}</dt>
                  <dd className="text-gray-900">{order.user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Order Date</dt>
                  <dd className="text-gray-900">{fmt(order.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Rental Period</dt>
                  <dd className="text-gray-900">
                    {fmt(order.startDate)} → {fmt(order.endDate)}
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
                  <dd className="text-gray-900">{getOrderStatus(order)}</dd>
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
              <div className="px-4 my-4 flex flex-wrap gap-4 text-sm">
                <Link href={`/account/rentals/${order.id}`} className="text-blue-600 hover:underline">
                  View Products
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersPage;
