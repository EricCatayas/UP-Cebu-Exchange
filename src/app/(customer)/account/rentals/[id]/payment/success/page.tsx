import PaymentSuccess from '@/components/PaymentSuccess/PaymentSuccess';
import NotFound from '@/components/errors/NotFound';
import Forbidden from '@/components/errors/Forbidden';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';

export default async function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  if (!order) {
    return <NotFound header="Order Not Found" linkText="Back to Rentals" linkHref="/account/rentals" />;
  }

  if (order.userId !== currentUser?.userId) {
    return (
      <Forbidden
        header="Unauthorized Access"
        subheader="You do not have permission to view this rental order."
        linkText="Back to Rentals"
        linkHref="/account/rentals"
      />
    );
  }

  return <PaymentSuccess rentalOrder={order} />;
}
