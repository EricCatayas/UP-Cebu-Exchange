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
      throw new Error('Failed to create rental order');
    }
    return (await response.json()).rentalOrder;
  },
};
