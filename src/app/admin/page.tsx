import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import Header from '@/components/admin/Header';
import VisitorCountGraph from '@/components/admin/analytics/VisitorCountGraph';
import NotificationsList from '@/components/admin/notifications/NotificationsList';
import ToggleSession from '@/components/admin/analytics/ToggleSession';
import ArtworkService from '@/services/ArtworkService';
import FunnelAnalyticsService from '@/services/FunnelAnalyticsService';
import RentalOrderAnalyticsService from '@/services/RentalOrderAnalyticsService';
import NotificationService from '@/services/NotificationService';
import PaymentAnalyticsService from '@/services/PaymentAnalyticsService';
import UserAnalyticsService from '@/services/UserAnalyticsService';
import { fmtMoney, fmtDate } from '@/lib/formatter';
import { ORDER_STATUS } from '@/lib/constants';
import { recentTimeframe, getMostRecentTimeframe } from '@/lib/labels';

async function Dashboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const timeframe = (query.timeframe as string) || undefined;
  const year = (query.year as string) ? parseInt(query.year as string) : new Date().getFullYear();
  const month = (query.month as string) ? parseInt(query.month as string) : new Date().getMonth() + 1;
  const uniqueSession = (query.session as string) === 'unique' ? true : false;

  const mostRecentTimeframe = getMostRecentTimeframe(timeframe, recentTimeframe.value);

  const funnelAnalysisService = new FunnelAnalyticsService(timeframe);

  const userAnalyticsService = new UserAnalyticsService(timeframe);
  const {
    count: visitorCount,
    monthly,
    daily,
  } = await userAnalyticsService.getVisitorMetrics(year, month, uniqueSession);
  const { customers: customerCount, guests: guestCount } = await userAnalyticsService.getAnalyticsData();

  const paymentAnalyticsService = new PaymentAnalyticsService(timeframe);
  const { totalRevenue, completedPayments, pendingPayments } = await paymentAnalyticsService.getAnalyticsData();

  const rentalOrderAnalyticsService = new RentalOrderAnalyticsService(timeframe);
  const orderAnalytics = await rentalOrderAnalyticsService.getAnalyticsData();
  const { count: orderCount, currentOrders } = orderAnalytics;

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <Header title="Overview">
        <ToggleSession />
      </Header>

      <div className="mt-8 space-y-8">
        <section className="grid items-start gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 pl-3">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap gap-6">
                <AnalyticsCard header="Total Revenue" value={fmtMoney(totalRevenue)} />
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
            </div>
            <div className="">
              <NotificationsList newOnly={true} />
            </div>
          </div>
        </section>
        <section className="p-6 bg-gray-50">
          <VisitorCountGraph
            year={year}
            month={month}
            customers={visitorCount.customers}
            guests={visitorCount.guests}
            monthly={monthly}
            daily={daily}
          />
        </section>
        {/* Orders */}
        <section className="grid grid-cols-[112px_1fr] items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Orders</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="New" value={orderCount.pending} />

            <AnalyticsCard header="Paid" value={orderCount.reserved} />

            <AnalyticsCard header="To Receive" value={orderCount.toReceive} />
            <AnalyticsCard header="Ongoing" value={orderCount.ongoing} />
            <AnalyticsCard header="To Return" value={orderCount.toReturn} />
            <AnalyticsCard header="Completed" value={orderCount.completed} />
            <AnalyticsCard header="Cancelled" value={orderCount.cancelled} />
          </div>
        </section>

        {/* Users */}
        <section className="grid grid-cols-[112px_1fr] items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Users</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Guests" value={visitorCount.guests} />
            <AnalyticsCard header="Customers" value={customerCount.total} />
            <AnalyticsCard
              header="Recently Registered"
              value={customerCount.new}
              subheader={mostRecentTimeframe.label}
            />
            <AnalyticsCard header="Returning Customers" value={customerCount.returning} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
