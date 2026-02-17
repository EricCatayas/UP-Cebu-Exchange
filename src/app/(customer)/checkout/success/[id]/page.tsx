import RentalOrderService from '@/services/RentalOrderService';
import CheckoutSuccess from '@/components/CheckoutSuccess/CheckoutSuccess';
import NotFound from '@/components/errors/NotFound';
import { getCurrentUser } from '@/lib/auth';

async function CheckoutSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();

  const rentalOrderService = new RentalOrderService();
  const order = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  if (!order) {
    return <NotFound header="Rental Order Not Found" linkText="Back to Rentals" linkHref="/account/rentals" />;
  }

  return <CheckoutSuccess rentalOrder={order} />;
}

export default CheckoutSuccessPage;
