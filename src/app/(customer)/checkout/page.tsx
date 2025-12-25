'use client';

import DeliveryMethodCard from '@/components/cards/DeliveryMethod/DeliveryMethod';
import RentalPeriodCard from '@/components/cards/RentalPeriod/RentalPeriod';
import PaymentMethodCard from '@/components/cards/PaymentMethod/PaymentMethod';
import RentalSummaryCard from '@/components/cards/RentalSummary/RentalSummary';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { useUserAddress } from '@/contexts/UserAddressContext';
import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';
import { fmtDate, fmtMoney } from '@/lib/formatter';
import { rentalOrderApi } from '@/lib/api/rentalOrder';

function RentalCheckout() {
  const { cartItems, selectedCartItemIds, toggleCartItem, toggleAllCartItems, removeFromCart } = useCart();
  const { address } = useUserAddress();

  const {
    duration,
    setDuration,
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

  const canCheckout = useMemo(() => {
    return selectedCartItemIds.size > 0 && contractSigned;
  }, [selectedCartItemIds, contractSigned]);

  const canSignContract = useMemo(() => {
    return selectedCartItemIds.size > 0 && address !== null && address !== undefined;
  }, [selectedCartItemIds, address]);

  const selectedArtworks = useMemo(() => {
    return cartItems.filter((item) => selectedCartItemIds.has(item.id)).map((item) => item.artwork);
  }, [cartItems, selectedCartItemIds]);

  const navigateToArtwork = (artworkId: number) => {
    router.push(`/artworks/${artworkId}`);
  };

  const navigateToContract = () => {
    router.push('/checkout/rental-agreement');
  };

  const navigateToAddress = () => {
    router.push('/checkout/address');
  };

  const handleRemoveCartItem = async (cartItem: any) => {
    const artworkId = cartItem.artworkId;
    fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }
        console.log('Item removed from cart');
        removeFromCart(cartItem.id);
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleCheckout = async () => {
    const rentalOrder = {
      durationMonths: duration,
      startDate,
      endDate,
      cartItemIds: Array.from(selectedCartItemIds),
      deliveryMethod,
      paymentMethod,
      totalAmount: total,
      addressId: address?.id,
    };

    if (!canCheckout) {
      alert('Please ensure you have selected artworks and signed the contract before checking out.');
    }

    try {
      const newRentalOrder = await rentalOrderApi.checkout(rentalOrder);
      router.push(`/checkout/success/${newRentalOrder.id}`);
    } catch (error) {
      alert(`Error during checkout: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rental Period */}
          <RentalPeriodCard
            duration={duration}
            onDurationChange={setDuration}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
          />

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
                    <div className="font-semibold text-lg mr-4">{fmtMoney(getRentalFee(item.artwork, duration))}</div>
                    <button onClick={() => handleRemoveCartItem(item)} className="text-red-500 hover:text-red-700">
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
          <DeliveryMethodCard
            onMethodChange={setDeliveryMethod}
            selectedMethod={deliveryMethod}
            address={address}
            onEditAddress={navigateToAddress}
            onAddAddress={navigateToAddress}
          />

          {/* Payment Method */}
          <PaymentMethodCard selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />
        </div>

        {/* Right Column - Rental Summary */}
        <div className="lg:col-span-1">
          <RentalSummaryCard
            artworks={selectedArtworks}
            duration={duration}
            startDate={startDate}
            endDate={endDate}
            deliveryMethod={deliveryMethod}
            paymentMethod={paymentMethod}
            total={total}
          >
            {contractSigned ? (
              <button
                onClick={handleCheckout}
                disabled={!canCheckout}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>CHECKOUT</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={navigateToContract}
                disabled={!canSignContract}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>SIGN CONTRACT</span>
                <span>→</span>
              </button>
            )}
          </RentalSummaryCard>
        </div>
      </div>
    </div>
  );
}

export default RentalCheckout;
