'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { DURATION_OPTIONS, DELIVERY_FEE, DELIVERY_METHODS, PAYMENT_METHODS } from '@/lib/constants';
import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';

function Checkout() {
  const { cartItems, selectedCartItemIds, toggleCartItem, toggleAllCartItems, removeFromCart } = useCart();

  const {
    selectedDuration,
    setSelectedDuration,
    startDate,
    endDate,
    setStartDate,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    contractSigned,
    setContractSigned,
    subtotal,
    total,
  } = useRentalOrder();

  const router = useRouter();

  const deliveryMethods = DELIVERY_METHODS;
  const paymentMethods = PAYMENT_METHODS;

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

  const navigateToArtwork = (artworkId: number) => {
    router.push(`/artworks/${artworkId}`);
  };

  const navigateToContract = () => {
    router.push('/checkout/rental-agreement');
  };

  const getRentalPlanFee = (item: any) => {
    return getRentalFee(item.artwork, selectedDuration);
  };

  const handleRemoveCartItem = async (id: number) => {
    fetch('/api/cart/remove-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItemId: id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }
        console.log('Item removed from cart');
        removeFromCart(id);
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleCheckout = () => {
    // TODO: post order data to backend
    console.log('Checkout:', {
      selectedDuration,
      startDate,
      endDate,
      selectedArtworks: Array.from(selectedCartItemIds),
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
                <label className="block text-sm font-semibold mb-2">Duration</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
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
          {cartItems.length > 0 ? (
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Select Artworks from Cart</h2>

              {/* Select All */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCartItemIds.size === cartItems.length && cartItems.length > 0}
                    onChange={toggleAllCartItems}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="font-semibold">Select All</span>
                </label>
                <span className="font-semibold mr-4">Charge</span>
              </div>

              {/* Artwork List */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedCartItemIds.has(item.id)}
                        onChange={() => toggleCartItem(item.id)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />
                      <div
                        className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"
                        onClick={() => navigateToArtwork(item.artworkId)}
                      >
                        {item.artwork.images && item.artwork.images.length > 0 ? (
                          <img
                            src={getImageUrl(item.artwork)}
                            alt={item.artwork.title}
                            className="w-full h-full object-cover rounded-md cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs cursor-pointer">
                            Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => navigateToArtwork(item.artworkId)}>
                        <h3 className="font-semibold">{item.artwork.title}</h3>
                        <p className="text-sm text-gray-600">{getDimension(item.artwork)}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-lg mr-4">₱{getRentalPlanFee(item)}</div>
                    <button onClick={() => handleRemoveCartItem(item.id)} className="text-red-500 hover:text-red-700">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <span className="font-semibold text-lg">Subtotal:</span>
                <span className="font-bold text-xl">₱{subtotal}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Your cart is empty.</h2>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/artworks')}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Browse Artworks
                </button>
              </div>
            </div>
          )}

          {/* Delivery Method */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
            <div className="flex gap-6">
              {deliveryMethods.map((method) => (
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis animi ullam pariatur tempore natus,
                eligendi sit in asperiores doloribus. Aliquam obcaecati iure debitis, nemo earum in quisquam fugit
                corporis minus!
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="flex gap-6">
              {paymentMethods.map((method) => (
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
                {cartItems
                  .filter((item) => selectedCartItemIds.has(item.id))
                  .map((item) => (
                    <div key={item.id} className="flex justify-between mb-2">
                      <span className="text-gray-600">{item.artwork.title}</span>
                      <span className="font-semibold">₱{getRentalPlanFee(item)}</span>
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

            {contractSigned ? (
              <button
                onClick={handleCheckout}
                disabled={selectedCartItemIds.size === 0}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>CHECKOUT</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={navigateToContract}
                disabled={selectedCartItemIds.size === 0}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>SIGN CONTRACT</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
