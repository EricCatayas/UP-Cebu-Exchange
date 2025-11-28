import { RentalOrderDTO, RentalOrderCreateDTO } from '@/models/RentalOrder';

export const rentalOrderApi = {
  createRentalOrder: async (data: RentalOrderCreateDTO): Promise<RentalOrderDTO> => {
    const response = await fetch('/api/rental-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create rental order');
    }
    return (await response.json()).rentalOrder;
  },
  updateRentalOrderStatus: async (orderId: number, status: string): Promise<RentalOrderDTO> => {
    const response = await fetch(`/api/rental-order/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update rental order status');
    }
    return (await response.json()).rentalOrder;
  },
};
