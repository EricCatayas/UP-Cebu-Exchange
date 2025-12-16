'use client';
import { redirect } from 'next/navigation';
import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getImageUrl } from '@/lib/artwork';

export default function RentalOrderDetailsWrapper({
  order,
}: {
  order: RentalOrderDTO;
  onItemClicked?: (item: any) => void;
}) {
  function handleRentalItemClick(item) {
    redirect(`/inventory/${item.artwork.id}`);
  }

  return <RentalOrderDetails order={order} onItemClicked={handleRentalItemClick} />;
}
