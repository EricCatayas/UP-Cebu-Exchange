'use client';
import { redirect } from 'next/navigation';
import BaseRentalOrderDetails from '../RentalOrderDetails/RentalOrderDetails';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getImageUrl } from '@/lib/artwork';

export default function RentalOrderDetails({ order }: { order: RentalOrderDTO; onItemClicked?: (item: any) => void }) {
  function handleRentalItemClick(item) {
    redirect(`/inventory/${item.artwork.id}`);
  }

  return <BaseRentalOrderDetails order={order} onItemClicked={handleRentalItemClick} />;
}
