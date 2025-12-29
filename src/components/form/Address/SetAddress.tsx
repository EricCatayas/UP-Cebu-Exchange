'use client';
import React, { useState, useEffect } from 'react';
import { AddressCreateDTO } from '@/models/Address';

export default function SetAddressForm({
  initialData,
  onInputChange,
  onSetAddress,
}: {
  initialData?: AddressCreateDTO;
  onInputChange?: (address: AddressCreateDTO) => void;
  onSetAddress?: (address: AddressCreateDTO) => void;
}) {
  const [formData, setFormData] = useState<AddressCreateDTO>({
    city: initialData?.city || '',
    province: initialData?.province || '',
    postalCode: initialData?.postalCode || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
  });

  useEffect(() => {
    setFormData(
      initialData || {
        city: '',
        province: '',
        postalCode: '',
        addressLine1: '',
        addressLine2: '',
      }
    );
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (onInputChange) {
      onInputChange({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address: AddressCreateDTO = {
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
    };
    onSetAddress(address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="province">
          Province:
        </label>
        <input
          type="text"
          value={formData.province}
          name="province"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="city">
          City:
        </label>
        <input
          type="text"
          value={formData.city}
          name="city"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="postalCode">
          Postal Code:
        </label>
        <input
          type="text"
          value={formData.postalCode}
          name="postalCode"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="addressLine1">
          Address Line 1:
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          name="addressLine1"
          placeholder="Street / House No. / Building"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="addressLine2">
          Address Line 2:
        </label>
        <input
          type="text"
          value={formData.addressLine2}
          name="addressLine2"
          placeholder="Additional info (e.g., room, floor, or landmark) (optional)"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      {onSetAddress && (
        <button type="submit" className="px-4 py-2 rounded text-white transition bg-blue-600 hover:bg-blue-700">
          Set Address
        </button>
      )}
    </form>
  );
}
