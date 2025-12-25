import { CheckoutDTO, RentalOrderDTO, RentalOrderCreateDTO, ExtendRentalOrderDTO } from '@/models/RentalOrder';

export const rentalOrderApi = {
  checkout: async (data: CheckoutDTO): Promise<RentalOrderDTO> => {
    const response = await fetch('/api/checkout', {
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
  create: async (data: RentalOrderCreateDTO): Promise<RentalOrderDTO> => {
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
  updateStatus: async (orderId: number, status: string): Promise<RentalOrderDTO> => {
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
  cancel: async (orderId: number): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/rental-order/${orderId}/cancel`, {
      method: 'POST',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to cancel rental order');
    }
    return await response.json();
  },
  return: async (orderId: number): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/rental-order/${orderId}/return`, {
      method: 'POST',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to process rental order return');
    }
    return await response.json();
  },
  delete: async (orderId: number): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/rental-order/${orderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete rental order');
    }
    return await response.json();
  },
  pay: async (orderId: number): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/rental-order/${orderId}/pay/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to initiate payment');
    }
    const { url } = await response.json();
    if (url) {
      // Redirect to Stripe checkout
      window.location.href = url;
    }
    return { success: true };
  },
  extend: async (data: ExtendRentalOrderDTO): Promise<{ success: boolean; rentalOrder: RentalOrderDTO }> => {
    const response = await fetch(`/api/rental-order/${data.id}/extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const resData = await response.json();
      throw new Error(resData.error || 'Failed to extend rental order');
    }
    return await response.json();
  },
  hasExtension: async (orderId: number): Promise<boolean> => {
    const response = await fetch(`/api/rental-order/${orderId}/extend`, {
      method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to check existing extension');
    }
    const { existingExtension } = data;
    return existingExtension;
  },
};
