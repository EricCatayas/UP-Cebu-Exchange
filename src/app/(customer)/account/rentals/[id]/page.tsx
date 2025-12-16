import RentalOrderDetailsWrapper from '@/components/customer/RentalOrderDetails';
import { notFound, redirect } from 'next/navigation';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';

async function UserRentalOrderDetails({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  const query = await searchParams;

  const action = (query.action as string) || undefined;

  if (!order) {
    return notFound();
  }

  return <RentalOrderDetailsWrapper order={order} action={action} />;
}

export default UserRentalOrderDetails;
