import React from 'react';
import Link from 'next/link';
import ArtworkPopularityCarousel from '@/components/ArtworkCarousel/ArtworkPopularityCarousel';
import EditUser from '@/components/form/User/EditUser';
import RentalOrderCard from '@/components/cards/RentalOrder/RentalOrder';
import UserMilestones from '@/components/Milestones/Milestones';
import NotFound from '@/components/NotFound/NotFound';
import ProductDemandService from '@/services/ProductDemandService';
import FunnelAnalyticsService from '@/services/FunnelAnalyticsService';
import RentalOrderService from '@/services/RentalOrderService';
import UserService from '@/services/UserService';
import { isCustomer } from '@/lib/role';
import { isOrderPaid } from '@/lib/order';

export default async function UserPage({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);

  const userService = new UserService();
  const userData = await userService.getUserById(id);

  if (!userData) {
    return <NotFound header="User not found" linkText="Back to Users" linkHref="/users" />;
  }

  if (isCustomer(userData)) {
    const funnelAnalyticsService = new FunnelAnalyticsService();
    const userMilestones = await funnelAnalyticsService.getUserMilestones(id);

    const productDemandService = new ProductDemandService();
    const { artworksWithScore, popularityScores } = await productDemandService.getUserDemandAnalytics(id, { limit: 5 });

    const rentalOrderService = new RentalOrderService();
    const rentalOrders = await rentalOrderService.getUserOrders(id);

    console.log('Milestones for User:', userMilestones);

    return (
      <div className="container px-8 py-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 slide-right-delay-600">User Milestones</h2>
        <UserMilestones milestones={userMilestones} />
        <h2 className="text-3xl font-bold mb-6 slide-right-delay-600">Interests</h2>
        <ArtworkPopularityCarousel artworks={artworksWithScore} popularityScores={popularityScores} />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Customer Details</h1>
        <EditUser user={userData} canEditRole={false} />
        <h2 className="text-2xl font-semibold mt-10 mb-4">Rental Orders</h2>
        <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rentalOrders.map((order) => (
            <RentalOrderCard key={order.id} order={order}>
              <>
                <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                  View Products
                </Link>
                {isOrderPaid(order) && (
                  <Link href={`/payments/${order.paymentId}`} className="text-blue-600 hover:underline">
                    View Receipt
                  </Link>
                )}
              </>
            </RentalOrderCard>
          ))}
          {rentalOrders.length === 0 && (
            <p className="col-span-full text-center text-gray-600">User has no rental orders.</p>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        <EditUser user={userData} canEditRole={true} />
      </div>
    );
  }
}
