import { AddressDTO, AddressCreateDTO } from '@/models/Address';

export const addressApi = {
  create: async (address: AddressCreateDTO): Promise<AddressDTO> => {
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });

      const data = await res.json();
      if (res.ok) {
        const newAddress = data.address;
        return newAddress;
      } else {
        throw new Error(data.error || 'Failed to create address');
      }
    } catch (error) {
      throw error;
    }
  },
  getByUserId: async (userId: number): Promise<AddressDTO | null> => {
    const response = await fetch(`/api/user/${userId}/address`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to fetch address');
    }
    return (await response.json()).address;
  },
};
