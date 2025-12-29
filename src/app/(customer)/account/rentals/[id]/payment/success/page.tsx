import PaymentSuccess from '@/components/PaymentSuccess/PaymentSuccess';
import { notFound } from 'next/navigation';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';

export default async function PaymentSuccessPage({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  if (!order) {
    notFound();
  }

  return <PaymentSuccess rentalOrder={order} />;
}
