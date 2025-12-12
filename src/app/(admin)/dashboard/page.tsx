import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';

function Dashboard() {
  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
      </div>

      <div className="mt-8 space-y-12">
        {/* Sales */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Sales</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard title="Sales" value="₱5000.00" wide />
          </div>
        </section>

        {/* Orders */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Orders</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard title="Upcoming" value={50} />
            <AnalyticsCard title="Ongoing" value={50} />
            <AnalyticsCard title="To Return" value={50} />
            <AnalyticsCard title="Completed" value={50} />
            <AnalyticsCard title="Cancelled" value={50} />
          </div>
        </section>

        {/* Inventory */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Inventory</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard title="Available" value={50} />
            <AnalyticsCard title="Rented" value={50} />
            <AnalyticsCard title="Unavailable" value={50} />
          </div>
        </section>

        {/* Users */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Users</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard title="New" value={50} />
            <AnalyticsCard title="Registered" value={50} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
