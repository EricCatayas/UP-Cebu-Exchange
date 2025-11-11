'use client';

import React, { useState, useMemo } from 'react';

// Mock data types - adjust these based on your actual data structure
interface RentalPlan {
  durationMonths: number;
  rentalFee: number;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}

interface CartItem {
  id: string;
  title: string;
  heightCm: number;
  widthCm: number;
  imageUrl: string;
  rentalPlans: RentalPlan[];
}

// Mock cart data - replace with actual cart data from your store/context
const mockCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Painting 1',
    heightCm: 100,
    widthCm: 80,
    imageUrl:
      'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-4x5.png',
    rentalPlans: [
      { durationMonths: 3, rentalFee: 200 },
      { durationMonths: 6, rentalFee: 250 },
      { durationMonths: 12, rentalFee: 300 },
    ],
  },
  {
    id: '2',
    title: 'Painting 2',
    heightCm: 60,
    widthCm: 120,
    imageUrl:
      'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-2x1.png',
    rentalPlans: [
      { durationMonths: 3, rentalFee: 800 },
      { durationMonths: 6, rentalFee: 900 },
      { durationMonths: 12, rentalFee: 1000 },
    ],
  },
  {
    id: '3',
    title: 'Painting 3',
    heightCm: 50,
    widthCm: 50,
    imageUrl:
      'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-1x1.png',
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1500 },
      { durationMonths: 6, rentalFee: 1800 },
      { durationMonths: 12, rentalFee: 2000 },
    ],
  },
];

const DURATION_OPTIONS = [3, 6, 12];
const DELIVERY_FEE = 50;

function Checkout() {
  const [selectedDuration, setSelectedDuration] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>('2025-10-09');
  const [selectedArtworks, setSelectedArtworks] = useState<Set<string>>(
    new Set(['1', '2'])
  );
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');

  // Calculate end date based on start date and duration
  const endDate = useMemo(() => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + selectedDuration);
    return date.toISOString().split('T')[0];
  }, [startDate, selectedDuration]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Toggle artwork selection
  const toggleArtwork = (id: string) => {
    const newSelected = new Set(selectedArtworks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArtworks(newSelected);
  };

  // Toggle all artworks
  const toggleAll = () => {
    if (selectedArtworks.size === mockCartItems.length) {
      setSelectedArtworks(new Set());
    } else {
      setSelectedArtworks(new Set(mockCartItems.map((item) => item.id)));
    }
  };

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return mockCartItems
      .filter((item) => selectedArtworks.has(item.id))
      .reduce((sum, item) => {
        const plan = item.rentalPlans.find(
          (p) => p.durationMonths === selectedDuration
        );
        return sum + (plan?.rentalFee || 0);
      }, 0);
  }, [selectedArtworks, selectedDuration]);

  // Calculate total
  const total = subtotal + (deliveryMethod === 'Delivery' ? DELIVERY_FEE : 0);

  // Get rental fee for an item
  const getRentalFee = (item: CartItem) => {
    const plan = item.rentalPlans.find(
      (p) => p.durationMonths === selectedDuration
    );
    return plan?.rentalFee || 0;
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Checkout:', {
      selectedDuration,
      startDate,
      endDate,
      selectedArtworks: Array.from(selectedArtworks),
      deliveryMethod,
      paymentMethod,
      total,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rental Period */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Rental Period</h2>

            <div className="space-y-4">
              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DURATION_OPTIONS.map((months) => (
                    <option key={months} value={months}>
                      {months} Months
                    </option>
                  ))}
                </select>
              </div>

              {/* Date inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    End Date
                  </label>
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
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Select Artworks</h2>

            {/* Select All Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedArtworks.size === mockCartItems.length}
                  onChange={toggleAll}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
                <span className="font-semibold">Select All</span>
              </label>
              <span className="font-semibold">Charge</span>
            </div>

            {/* Artwork List */}
            <div className="space-y-3">
              {mockCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedArtworks.has(item.id)}
                      onChange={() => toggleArtwork(item.id)}
                      className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                    />
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                      {/* Placeholder for artwork image */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Image
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.artist}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-lg">
                    ₱{getRentalFee(item)}
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="font-semibold text-lg">Subtotal:</span>
              <span className="font-bold text-xl">₱{subtotal}</span>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
            <div className="flex gap-6">
              {['Delivery', 'Pickup'].map((method) => (
                <label
                  key={method}
                  className="flex items-center space-x-2 cursor-pointer"
                >
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                animi ullam pariatur tempore natus, eligendi sit in asperiores
                doloribus. Aliquam obcaecati iure debitis, nemo earum in
                quisquam fugit corporis minus!
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="flex gap-6">
              {['Cash', 'Credit Card'].map((method) => (
                <label
                  key={method}
                  className="flex items-center space-x-2 cursor-pointer"
                >
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
                <span className="font-semibold">{selectedDuration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-semibold">{formatDate(startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-semibold">{formatDate(endDate)}</span>
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
                {mockCartItems
                  .filter((item) => selectedArtworks.has(item.id))
                  .map((item) => (
                    <div key={item.id} className="flex justify-between mb-2">
                      <span className="text-gray-600">{item.title}</span>
                      <span className="font-semibold">
                        ₱{getRentalFee(item)}
                      </span>
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
                <span className="font-bold text-2xl text-blue-600">
                  ₱{total}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedArtworks.size === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>SIGN CONTRACT</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
