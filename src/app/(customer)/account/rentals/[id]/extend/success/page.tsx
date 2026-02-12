import React from 'react';
import ExtendRentalSuccess from '@/components/ExtendRental/ExtendRentalSuccess';
import RentalOrderService from '@/services/RentalOrderService';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import { RentalOrderDTO } from '@/models/RentalOrder';

async function ExtendRentalSuccessPage({
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
    return notFound();
  }
  return <ExtendRentalSuccess rentalOrder={order} />;
}
export default ExtendRentalSuccessPage;
