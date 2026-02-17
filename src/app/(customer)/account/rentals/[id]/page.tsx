import RentalOrderDetailsWrapper from '@/components/customer/RentalOrderDetails';
import RentalOrderService from '@/services/RentalOrderService';
import NotFound from '@/components/errors/NotFound';
import Forbidden from '@/components/errors/Forbidden';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';

async function UserRentalOrderDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  const query = await searchParams;

  const action = (query.action as string) || undefined;

  if (!order) {
    return <NotFound header="Rental Order Not Found" linkText="Back to Rentals" linkHref="/account/rentals" />;
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

  return <RentalOrderDetailsWrapper order={order} action={action} />;
}

export default UserRentalOrderDetails;
