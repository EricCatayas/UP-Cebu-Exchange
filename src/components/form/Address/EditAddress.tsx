'use client';
import { AddressDTO } from '@/models/Address';
import React, { useState } from 'react';
import { getProvinces, getCitiesByProvince, getZipCodeByCity } from '@/lib/address/utils';

export default function EditAddress({
  address,
  handleSetAddress,
}: {
  address: AddressDTO | null;
  handleSetAddress: (address: AddressDTO) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    city: address?.city || '',
    province: address?.province || '',
    postalCode: address?.postalCode || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
  });

  const provinces = getProvinces();
  const [editProvinceCode, setEditProvinceCode] = useState(
    () => provinces.find((p) => p.name === (address?.province || ''))?.code || ''
  );
  const cities = getCitiesByProvince(editProvinceCode);

  React.useEffect(() => {
    if (address) {
      setEditedAddress({
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
      });
      setEditProvinceCode(provinces.find((p) => p.name === address.province)?.code || '');
    }
  }, [address]);

  const handleEditProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = provinces.find((p) => p.code === code)?.name || '';
    setEditProvinceCode(code);
    setEditedAddress((prev) => ({ ...prev, province: name, city: '', postalCode: '' }));
  };

  const handleEditCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const postalCode = getZipCodeByCity(cityName) || '';
    setEditedAddress((prev) => ({ ...prev, city: cityName, postalCode }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedAddress),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedAddress = data.address;
        handleSetAddress(updatedAddress);
        setIsEditing(false);
      } else {
        alert(data.error || 'Failed to update address');
      }
    } catch (err) {
      console.error('Error updating address:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (address) {
      setEditedAddress({
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
      });
      setEditProvinceCode(provinces.find((p) => p.name === address.province)?.code || '');
    }
    setIsEditing(false);
  };

  if (address) {
    return (
      <>
        {!isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Province:</label>
              <p className="font-medium">{address.province}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">City:</label>
              <p className="font-medium">{address.city}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Postal Code:</label>
              <p className="font-medium">{address.postalCode}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Address Line 1:</label>
              <p className="font-medium">{address.addressLine1}</p>
            </div>
            {address.addressLine2 && (
              <div>
                <label className="text-sm text-gray-600">Address Line 2:</label>
                <p className="font-medium">{address.addressLine2}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded text-white transition bg-blue-600 hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Province:</label>
              <select
                value={editProvinceCode}
                onChange={handleEditProvinceChange}
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
                value={editedAddress.city}
                onChange={handleEditCityChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
                disabled={!editProvinceCode}
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
                value={editedAddress.postalCode}
                onChange={(e) => setEditedAddress({ ...editedAddress, postalCode: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address Line 1:</label>
              <input
                type="text"
                value={editedAddress.addressLine1}
                onChange={(e) => setEditedAddress({ ...editedAddress, addressLine1: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address Line 2:</label>
              <input
                type="text"
                value={editedAddress.addressLine2}
                onChange={(e) => setEditedAddress({ ...editedAddress, addressLine2: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 rounded text-white transition ${
                  submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </>
    );
  } else {
    return <p>Loading address...</p>;
  }
}
