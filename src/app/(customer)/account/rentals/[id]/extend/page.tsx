import ExtendRental from '@/components/ExtendRental/ExtendRental';
import RentalOrderService from '@/services/RentalOrderService';
import { getCurrentUser } from '@/lib/auth';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { notFound } from 'next/navigation';

async function ExtendRentalPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  if (!order) {
    return notFound();
  }

  const artworks = order.items.map((item) => item.artwork);
  const address = order.address;
  // start date is end date of current order + 1 day
  const startDate = new Date(order.endDate);
  startDate.setDate(startDate.getDate() + 1);
  return <ExtendRental rentalOrderId={order.id} artworks={artworks} address={address} fixedStartDate={startDate} />;
}

export default ExtendRentalPage;
