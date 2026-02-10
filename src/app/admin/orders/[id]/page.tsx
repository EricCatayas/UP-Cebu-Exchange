import RentalOrderDetailsWrapper from '@/components/admin/RentalOrderDetails';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { notFound } from 'next/navigation';

async function OrdersDetails({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getOrderDetails(id);

  if (!order) {
    return notFound();
  }

  return <RentalOrderDetailsWrapper order={order} />;
}

export default OrdersDetails;
