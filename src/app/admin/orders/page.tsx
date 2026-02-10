import React from 'react';
import Link from 'next/link';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import RentalOrderService from '@/services/RentalOrderService';
import RentalOrderAnalyticsService from '@/services/RentalOrderAnalyticsService';
import RentalOrderCard from '@/components/cards/RentalOrder/RentalOrder';
import { getOrderStatus } from '@/lib/order';
import { fmtMoney, fmtDate } from '@/lib/formatter';
import { ORDER_STATUS } from '@/lib/constants';

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

  const rentalOrderAnalyticsService = new RentalOrderAnalyticsService();
  const orderAnalytics = await rentalOrderAnalyticsService.getAnalyticsData();
  const { count: orderCount, currentOrders } = orderAnalytics;

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rental Orders</h1>
        <Link
          href={`/admin/orders/create`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create New Order
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Ongoing</div>
          <div className="flex flex-wrap gap-6">
            {currentOrders.length > 0 &&
              currentOrders.map((order) => {
                let header = '';
                let value = '';
                let subheader = '';
                switch (order.status) {
                  case ORDER_STATUS.PENDING:
                    header = `New Order #${order.id}`;
                    value = `${fmtDate(order.dueDate)}`;
                    subheader = `Payment Due`;
                    break;
                  case ORDER_STATUS.RESERVED:
                    header = `Reserved Order #${order.id}`;
                    value = `${fmtDate(order.dueDate)}`;
                    subheader = `Start Date`;
                    break;
                  case ORDER_STATUS.TORECEIVE:
                    header = `To Receive #${order.id}`;
                    value = `${fmtDate(order.dueDate)}`;
                    subheader = `Start Date`;
                    break;
                  case ORDER_STATUS.ONGOING:
                    header = `Ongoing Order #${order.id}`;
                    value = `${fmtDate(order.dueDate)}`;
                    subheader = `Return Date - ${order.daysRemaining} days left`;
                    break;
                  case ORDER_STATUS.TORETURN:
                    header = `To Return #${order.id}`;
                    value = `${fmtDate(order.dueDate)}`;
                    subheader = `Return Date - ${order.daysRemaining} days left`;
                    break;

                  default:
                    header = `Finished Order #${order.id}`;
                    value = `${fmtDate(order.dueDate)}`;
                    subheader = `Return Date`;
                }
                return <AnalyticsCard key={order.id} header={header} value={value} subheader={subheader} />;
              })}
          </div>
        </section>
        <section className="rounded-lg shadow overflow-hidden">
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
                          <Link href={`/admin/orders/${order.id}`}>
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
        </section>
        <section>
          <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rentalOrders.map((order) => (
              <RentalOrderCard key={order.id} order={order}>
                <>
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                </>
              </RentalOrderCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrdersPage;
