import RentalOrderService from '@/services/RentalOrderService';
import CheckoutSuccess from '@/components/CheckoutSuccess/CheckoutSuccess';
import { getCurrentUser } from '@/lib/auth';

async function CheckoutSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();

  const rentalOrderService = new RentalOrderService();
  const order = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Order not found</p>
      </div>
    );
  }

  return <CheckoutSuccess rentalOrder={order} />;
}

export default CheckoutSuccessPage;
