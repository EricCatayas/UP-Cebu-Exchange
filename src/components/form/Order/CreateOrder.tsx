'use client';
import SetAddressForm from '@/components/form/Address/SetAddress';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import { ArtworkDTO } from '@/models/Artwork';
import { UserDTO } from '@/models/User';
import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';
import { fmtDate, fmtMoney } from '@/lib/formatter';
import { addressApi } from '@/lib/api/address';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import {
  DURATION_OPTIONS,
  DELIVERY_FEE,
  DELIVERY_METHODS,
  PAYMENT_METHOD,
  PAYMENT_METHODS,
  DELIVERY_METHOD,
} from '@/lib/constants';
import { AddressCreateDTO } from '@/models/Address';

function CreateOrderForm({ artworks, customers }: { artworks: ArtworkDTO[]; customers: UserDTO[] }) {
  const router = useRouter();
  const { openConfirmation } = useModal();
  const [search, setSearch] = useState<string>('');
  const [address, setAddress] = useState<AddressCreateDTO | null>(null);
  const [customerAddress, setCustomerAddress] = useState<AddressCreateDTO | null>(null);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<Set<number>>(new Set());
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [useCustomerAddress, setUseCustomerAddress] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryMethod, setDeliveryMethod] = useState<string>(DELIVERY_METHOD.PICKUP);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHOD.CASH);

  const endDate = useMemo(() => {
    if (!startDate) return '';
    const date = new Date(startDate);
    if (duration === 12) {
      // 364 days for 12 months
      date.setDate(date.getDate() + 364);
    } else {
      date.setMonth(date.getMonth() + duration);
    }
    return date.toISOString().split('T')[0];
  }, [startDate, duration]);

  const filteredArtworks = useMemo(() => {
    if (!search.trim()) return artworks;
    const lowerSearch = search.toLowerCase();
    return artworks.filter((artwork) => {
      return (
        artwork.title?.toLowerCase().includes(lowerSearch) ||
        artwork.description?.toLowerCase().includes(lowerSearch) ||
        artwork.style?.name.toLowerCase().includes(lowerSearch) ||
        artwork.artist?.name.toLowerCase().includes(lowerSearch)
      );
    });
  }, [artworks, search]);

  const selectedArtworks = useMemo(() => {
    return artworks.filter((artwork) => selectedArtworkIds.has(artwork.id));
  }, [artworks, selectedArtworkIds]);

  const selectedCustomer = useMemo(() => {
    return customers.find((customer) => customer.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const subtotal = useMemo(() => {
    return artworks
      .filter((artwork) => selectedArtworkIds.has(artwork.id))
      .reduce((sum, artwork) => {
        return sum + getRentalFee(artwork, duration);
      }, 0);
  }, [artworks, selectedArtworkIds, duration]);

  const total = useMemo(() => {
    return subtotal + (deliveryMethod === DELIVERY_METHOD.DELIVERY ? DELIVERY_FEE : 0);
  }, [subtotal, deliveryMethod]);

  const navigateToArtwork = (artworkId: number) => {
    router.push(`/inventory/${artworkId}`);
  };

  const navigateToUserProfile = () => {
    if (selectedCustomer) {
      router.push(`/users/${selectedCustomer.id}`);
    }
  };

  const navigateToCreateUser = () => {
    router.push('/users/create');
  };

  const getRentalPlanFee = (artwork: any) => {
    return getRentalFee(artwork, duration);
  };

  const handleSelectCustomer = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value ? Number(e.target.value) : null;
    if (!customerId) {
      setSelectedCustomerId(null);
      setAddress(null);
      setUseCustomerAddress(false);
      return;
    }
    setSelectedCustomerId(customerId);
    // Fetch customer's saved address
    const existingAddress = await addressApi.getByUserId(customerId);
    if (existingAddress) {
      setCustomerAddress(existingAddress);
    }
  };

  const toggleArtwork = (id: number) => {
    setSelectedArtworkIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleUseCustomerAddress = () => {
    if (customerAddress && !useCustomerAddress) {
      setAddress({
        province: customerAddress.province,
        city: customerAddress.city,
        postalCode: customerAddress.postalCode,
        addressLine1: customerAddress.addressLine1,
        addressLine2: customerAddress.addressLine2,
      });
    } else {
      setAddress(null);
    }
    setUseCustomerAddress((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddressInputChange = (address: AddressCreateDTO) => {
    setAddress(address);
  };

  const handleSubmit = async () => {
    const rentalOrder = {
      durationMonths: duration,
      startDate,
      endDate,
      artworkIds: Array.from(selectedArtworkIds),
      deliveryMethod,
      paymentMethod,
      totalAmount: total,
      address: address,
      customerId: selectedCustomerId,
    };

    console.log('handleSubmit: ', rentalOrder);

    openConfirmation(
      {
        title: 'Confirm Order',
        message: 'Are you sure you want to create this rental order?',
      },
      async () => {
        try {
          const newRentalOrder = await rentalOrderApi.create(rentalOrder);
          router.push(`/orders/${newRentalOrder.id}`);
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Failed to create rental order');
        }
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Rental Period */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Rental Period</h2>

          <div className="space-y-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DURATION_OPTIONS.map((months) => (
                  <option key={months} value={months}>
                    {months} Months
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Select Artworks */}
        {artworks.length > 0 ? (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Select Available Artworks</h2>

            {/* Select All */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <span className="font-semibold">Select</span>
              <input
                type="text"
                placeholder="Search by artwork, artist, or style"
                value={search}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="font-semibold mr-4">Charge</span>
            </div>

            {/* Artwork List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredArtworks.length > 0 ? (
                filteredArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedArtworkIds.has(artwork.id)}
                        onChange={() => toggleArtwork(artwork.id)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />
                      <div
                        className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"
                        onClick={() => navigateToArtwork(artwork.id)}
                      >
                        {artwork.images && artwork.images.length > 0 ? (
                          <img
                            src={getImageUrl(artwork)}
                            alt={artwork.title}
                            className="w-full h-full object-cover rounded-md cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs cursor-pointer">
                            Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => navigateToArtwork(artwork.id)}>
                        <h3 className="font-semibold">{artwork.title}</h3>
                        <p className="text-sm text-gray-600">{getDimension(artwork)}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-lg mr-4">{fmtMoney(getRentalPlanFee(artwork))}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No artworks found matching your search.</p>
              )}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="font-semibold text-lg">Subtotal:</span>
              <span className="font-bold text-xl">₱{subtotal}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">No available artworks</h2>
          </div>
        )}

        {/* Select Customer  */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Select Customer</h2>
          <div>
            <select
              value={selectedCustomerId || ''}
              onChange={handleSelectCustomer}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName} ({customer.email})
                </option>
              ))}
            </select>
            <div className="mt-4">
              {selectedCustomer && (
                <button
                  onClick={navigateToUserProfile}
                  className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  View Customer Profile
                </button>
              )}
              <button
                onClick={navigateToCreateUser}
                className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Create New Customer
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
          <div className="flex gap-6">
            {DELIVERY_METHODS.map((method) => (
              <label key={method} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={method}
                  checked={deliveryMethod === method}
                  onChange={() => setDeliveryMethod(method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <span className="font-semibold text-lg">Instructions:</span>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis animi ullam pariatur tempore natus, eligendi
              sit in asperiores doloribus. Aliquam obcaecati iure debitis, nemo earum in quisquam fugit corporis minus!
            </p>
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between">
              <span className="font-semibold text-lg">Address:</span>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={useCustomerAddress}
                  disabled={!customerAddress}
                  onChange={toggleUseCustomerAddress}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
                <span className="ml-2">Use Customer's Saved Address</span>
              </label>
            </div>
            <div className="mt-2 text-gray-700">
              <SetAddressForm initialData={address} onInputChange={handleAddressInputChange} />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="flex gap-6">
            {PAYMENT_METHODS.map((method) => (
              <label key={method} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Rental Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm sticky top-6">
          <h2 className="text-xl font-bold mb-4">Rental Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{duration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-semibold">{fmtDate(startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-semibold">{fmtDate(endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method:</span>
              <span className="font-semibold">{deliveryMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>

            <div className="border-t pt-3 mt-3">
              {selectedArtworks.map((artwork) => (
                <div key={artwork.id} className="flex justify-between mb-2">
                  <span className="text-gray-600">{artwork.title}</span>
                  <span className="font-semibold">{fmtMoney(getRentalPlanFee(artwork))}</span>
                </div>
              ))}
            </div>

            {deliveryMethod === 'Delivery' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">₱{DELIVERY_FEE}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total Rental Cost</span>
              <span className="font-bold text-2xl text-primary">₱{total}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Create Order</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderForm;
