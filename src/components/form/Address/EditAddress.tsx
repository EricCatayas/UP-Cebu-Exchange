'use client';
import { AddressDTO } from '@/models/Address';
import React, { useState } from 'react';

export default function EditAddress({
  address,
  handleSetAddress,
}: {
  address: AddressDTO | null;
  handleSetAddress: (address: AddressDTO) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    city: address?.city || '',
    province: address?.province || '',
    postalCode: address?.postalCode || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
  });

  React.useEffect(() => {
    if (address) {
      setEditedAddress({
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
      });
    }
  }, [address]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedAddress),
      });
      if (res.ok) {
        const { address: updatedAddress } = await res.json();
        handleSetAddress(updatedAddress);
        setIsEditing(false);
      } else {
        console.error('Failed to update address');
      }
    } catch (err) {
      console.error('Error updating address:', err);
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
                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Province:</label>
              <input
                type="text"
                value={editedAddress.province}
                onChange={(e) => setEditedAddress({ ...editedAddress, province: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City:</label>
              <input
                type="text"
                value={editedAddress.city}
                onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
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
                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Save Changes
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
