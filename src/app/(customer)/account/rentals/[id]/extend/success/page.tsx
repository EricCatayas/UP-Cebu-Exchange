import React from 'react';
import ExtendRentalSuccess from '@/components/ExtendRental/ExtendRentalSuccess';
import RentalOrderService from '@/services/RentalOrderService';
import NotFound from '@/components/errors/NotFound';
import Forbidden from '@/components/errors/Forbidden';
import { getCurrentUser } from '@/lib/auth';
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import { RentalOrderDTO } from '@/models/RentalOrder';

async function ExtendRentalSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

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

  return <ExtendRentalSuccess rentalOrder={order} />;
}
export default ExtendRentalSuccessPage;
