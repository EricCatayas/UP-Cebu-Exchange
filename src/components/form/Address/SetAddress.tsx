'use client';
import React, { useState, useEffect } from 'react';
import { AddressCreateDTO } from '@/models/Address';
import { getProvinces, getCitiesByProvince } from '@/lib/address/address';

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

  const provinces = getProvinces();
  const [selectedProvinceCode, setSelectedProvinceCode] = useState(
    () => provinces.find((p) => p.name === (initialData?.province || ''))?.code || ''
  );
  const cities = getCitiesByProvince(selectedProvinceCode);

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
    setSelectedProvinceCode(provinces.find((p) => p.name === (initialData?.province || ''))?.code || '');
  }, [initialData]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = provinces.find((p) => p.code === code)?.name || '';
    setSelectedProvinceCode(code);
    setFormData((prev) => ({ ...prev, province: name, city: '' }));
    if (onInputChange) {
      onInputChange({ ...formData, province: name, city: '' });
    }
  };

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
        <select
          value={selectedProvinceCode}
          name="province"
          onChange={handleProvinceChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Select a province</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="city">
          City:
        </label>
        <select
          value={formData.city}
          name="city"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
          disabled={!selectedProvinceCode}
        >
          <option value="">Select a city/municipality</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
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
