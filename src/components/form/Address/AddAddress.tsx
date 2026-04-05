'use client';
import { AddressDTO } from '@/models/Address';
import React, { useState } from 'react';
import { addressApi } from '@/lib/api/address';
import { getProvinces, getCitiesByProvince, getZipCodeByCity } from '@/lib/address/utils';

export default function AddAddressForm({ handleSetAddress }: { handleSetAddress: (address: AddressDTO) => void }) {
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const provinces = getProvinces();
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const cities = getCitiesByProvince(selectedProvinceCode);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = provinces.find((p) => p.code === code)?.name || '';
    setSelectedProvinceCode(code);
    setProvince(name);
    setCity('');
    setPostalCode('');
  };
  
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const cityName = e.target.value;
      const postalCode = getZipCodeByCity(cityName) || '';
      setCity(cityName);
      if (postalCode) {
        setPostalCode(postalCode);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const address = { city, province, postalCode, addressLine1, addressLine2 };
      const newAddress = await addressApi.create(address);
      handleSetAddress(newAddress);
    } catch (error) {
      alert(error.message || 'Failed to create address');
      console.error('Error creating address:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Province:</label>
        <select
          value={selectedProvinceCode}
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
        <label className="block text-sm font-medium mb-1">City:</label>
        <select
          value={city}
          onChange={handleCityChange}
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
        <label className="block text-sm font-medium mb-1">Postal Code:</label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address Line 1:</label>
        <input
          type="text"
          value={addressLine1}
          placeholder="Street / House No. / Building"
          onChange={(e) => setAddressLine1(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address Line 2:</label>
        <input
          type="text"
          value={addressLine2}
          placeholder="Additional info (e.g., room, floor, or landmark) (optional)"
          onChange={(e) => setAddressLine2(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className={`px-4 py-2 rounded text-white transition ${
          submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {submitting ? 'Adding Address...' : 'Add Address'}
      </button>
    </form>
  );
}
