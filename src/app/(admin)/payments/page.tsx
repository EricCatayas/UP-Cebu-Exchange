import React from 'react';
import Link from 'next/link';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import Header from '@/components/admin/Header';
import PaymentService from '@/services/PaymentService';
import PaymentAnalyticsService from '@/services/PaymentAnalyticsService';
import { fmtMoney } from '@/lib/formatter';

async function PaymentsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const timeframe = (query.timeframe as string) || undefined;

  const paymentService = new PaymentService(timeframe);
  const payments = await paymentService.getAllPayments();

  const paymentAnalyticsService = new PaymentAnalyticsService(timeframe);
  const { totalRevenue, completedPayments, pendingPayments } = await paymentAnalyticsService.getAnalyticsData();

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const formattedPayments = payments.map((payment) => ({
    id: payment.id,
    userId: payment.userId,
    userName: payment.user?.fullName || 'N/A',
    userEmail: payment.user?.email || 'N/A',
    status: payment.status,
    statusColor: getPaymentStatusColor(payment.status),
    amount: payment.amount,
    method: payment.method || 'N/A',
    createdAt: payment.createdAt,
  }));

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <Header title="Payments" />

      <div className="mt-8 space-y-8">
        {/* Analytics Cards */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Overview</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Total Revenue" value={fmtMoney(totalRevenue)} />
            <AnalyticsCard header="Completed Payments" value={completedPayments.toString()} />
            <AnalyticsCard header="Pending Payments" value={pendingPayments.toString()} />
          </div>
        </section>

        {/* Payments Table */}
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
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
                {formattedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  formattedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{payment.userName}</div>
                        <div className="text-xs text-gray-500">{payment.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.statusColor}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₱
                        {Number(payment.amount).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/payments/${payment.id}`}>
                          <span className="text-indigo-600 hover:text-indigo-900">View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentsPage;
