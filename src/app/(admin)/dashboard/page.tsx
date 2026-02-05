import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import Header from '@/components/admin/Header';
import VisitorCountGraph from '@/components/admin/analytics/VisitorCountGraph';
import ToggleSession from '@/components/admin/analytics/ToggleSession';
import ArtworkService from '@/services/ArtworkService';
import FunnelAnalyticsService from '@/services/FunnelAnalyticsService';
import PaymentAnalyticsService from '@/services/PaymentAnalyticsService';
import RentalOrderAnalyticsService from '@/services/RentalOrderAnalyticsService';
import { fmtMoney, fmtDate } from '@/lib/formatter';
import { recentTimeframe } from '@/lib/labels';

async function Dashboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const timeframe = (query.timeframe as string) || undefined;
  const year = (query.year as string) ? parseInt(query.year as string) : new Date().getFullYear();
  const month = (query.month as string) ? parseInt(query.month as string) : new Date().getMonth() + 1;
  const uniqueSession = (query.session as string) === 'unique' ? true : false;

  const funnelAnalysisService = new FunnelAnalyticsService(timeframe);
  const { count, monthly, daily } = await funnelAnalysisService.getVisitorMetrics(year, month, uniqueSession);
  const { count: individualCount } = await funnelAnalysisService.getVisitorMetrics(year, month, true);

  const paymentAnalyticsService = new PaymentAnalyticsService();
  const { totalRevenue, completedPayments, pendingPayments } = await paymentAnalyticsService.getAnalyticsData();

  const rentalOrderAnalyticsService = new RentalOrderAnalyticsService(timeframe);
  const orderAnalytics = await rentalOrderAnalyticsService.getAnalyticsData();
  const {
    totalOrders,
    completedOrders,
    pendingOrders,
    reservedOrders,
    toReceiveOrders,
    ongoingOrders,
    toReturnOrders,
    cancelledOrders,
  } = orderAnalytics;

  console.log('Order Analytics in Dashboard page:', orderAnalytics);

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <Header title="Overview">
        <ToggleSession />
      </Header>

      <div className="mt-8 space-y-12">
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Orders</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Total Revenue" value={fmtMoney(totalRevenue)} />
            {pendingOrders.count > 0 && (
              <AnalyticsCard
                header={`${pendingOrders.count} New Order`}
                value={`${fmtDate(pendingOrders.nextDueOrder.dueDate)}`}
                subheader="Payment Due"
              />
            )}
            {reservedOrders.count > 0 && (
              <AnalyticsCard
                header="Reserved Order"
                value={`${fmtDate(reservedOrders.nextDueOrder.dueDate)}`}
                subheader="Start Date"
              />
            )}
            {toReceiveOrders.count > 0 && (
              <AnalyticsCard
                header="Due Receive"
                value={`${fmtDate(toReceiveOrders.nextDueOrder.dueDate)}`}
                subheader="Start Date"
              />
            )}
            {ongoingOrders.count > 0 && (
              <AnalyticsCard
                header="Ongoing Order"
                value={`${fmtDate(ongoingOrders.nextDueOrder.dueDate)}`}
                subheader="Return Date"
              />
            )}
            {toReturnOrders.count > 0 && (
              <AnalyticsCard
                header="Finished Order"
                value={`${fmtDate(toReturnOrders.nextDueOrder.dueDate)}`}
                subheader="Return Date"
              />
            )}
          </div>
        </section>
        <section>
          <VisitorCountGraph
            year={year}
            month={month}
            customers={count.customers}
            guests={count.guests}
            monthly={monthly}
            daily={daily}
          />
        </section>
        {/* Orders */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Orders</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard
              header="New"
              value={pendingOrders.count}
              subheader={pendingOrders.nextDueOrder ? `Due: ${fmtDate(pendingOrders.nextDueOrder.dueDate)}` : undefined}
            />

            <AnalyticsCard
              header="Paid"
              value={reservedOrders.count}
              subheader={
                reservedOrders.nextDueOrder ? `Due: ${fmtDate(reservedOrders.nextDueOrder.dueDate)}` : undefined
              }
            />

            <AnalyticsCard
              header="To Receive"
              value={toReceiveOrders.count}
              subheader={
                toReceiveOrders.nextDueOrder ? `Receive: ${fmtDate(toReceiveOrders.nextDueOrder.dueDate)}` : undefined
              }
            />
            <AnalyticsCard
              header="Ongoing"
              value={ongoingOrders.count}
              subheader={
                ongoingOrders.nextDueOrder ? `Return: ${fmtDate(ongoingOrders.nextDueOrder.dueDate)}` : undefined
              }
            />
            <AnalyticsCard
              header="To Return"
              value={toReturnOrders.count}
              subheader={
                toReturnOrders.nextDueOrder ? `Return: ${fmtDate(toReturnOrders.nextDueOrder.dueDate)}` : undefined
              }
            />
            <AnalyticsCard header="Completed" value={completedOrders} />
            <AnalyticsCard header="Cancelled" value={cancelledOrders} />
          </div>
        </section>

        {/* Users */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Users</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Guests" value={individualCount.guests} />
            <AnalyticsCard header="Customers" value={individualCount.customers} />
            <AnalyticsCard
              header="New Customers"
              value={individualCount.newCustomers}
              subheader={recentTimeframe.label}
            />
            <AnalyticsCard header="Returning Customers" value={individualCount.returningCustomers} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
