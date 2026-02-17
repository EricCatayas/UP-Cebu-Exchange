import RentalOrderDetailsWrapper from '@/components/admin/RentalOrderDetails';
import RentalOrderService from '@/services/RentalOrderService';
import NotFound from '@/components/errors/NotFound';
import { RentalOrderDTO } from '@/models/RentalOrder';

async function OrdersDetails({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getOrderDetails(id);

  if (!order) {
    return <NotFound header="Order Not Found" linkText="Back to Orders" linkHref="/admin/orders" />;
  }

  return <RentalOrderDetailsWrapper order={order} />;
}

export default OrdersDetails;
