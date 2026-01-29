import React from 'react';
import Link from 'next/link';
import RentalOrderService from '@/services/RentalOrderService';
import RentalOrderCard from '@/components/cards/RentalOrder/RentalOrder';
import { getOrderStatus } from '@/lib/order';

async function OrdersPage() {
  const rentalOrderService = new RentalOrderService();
  const rentalOrders = await rentalOrderService.getAllOrders();

  const formattedOrders = rentalOrders.map((order) => ({
    id: order.id,
    userId: order.userId,
    userName: order.user?.fullName || 'N/A',
    userEmail: order.user?.email || 'N/A',
    status: getOrderStatus(order).label,
    statusColor: getOrderStatus(order).color,
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
        <Link href={`/orders/create`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Create New Order
        </Link>
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
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}`}
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
        {rentalOrders.map((order) => (
          <RentalOrderCard key={order.id} order={order}>
            <>
              <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                View Details
              </Link>
            </>
          </RentalOrderCard>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
