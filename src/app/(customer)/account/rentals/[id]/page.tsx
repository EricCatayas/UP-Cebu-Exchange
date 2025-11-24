import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import { notFound, redirect } from 'next/navigation';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getCurrentUser } from '@/lib/auth';

async function UserRentalOrderDetails({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  const handleRentalItemClicked = (item) => {
    redirect(`/artworks/${item.artwork.id}`);
  };

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Order Details</h1>
      <RentalOrderDetails order={order} onItemClicked={handleRentalItemClicked} />
    </div>
  );
}

export default UserRentalOrderDetails;
