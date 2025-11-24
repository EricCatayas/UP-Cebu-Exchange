import React from 'react';
import RentalOrderDetails from '@/components/admin/RentalOrderDetails';
import RentalOrderService from '@/services/RentalOrderService';
import { RentalOrderDTO } from '@/models/RentalOrder';

async function OrdersDetails({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getOrderDetails(id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Order Details</h1>
      <RentalOrderDetails order={order} />
    </div>
  );
}

export default OrdersDetails;
