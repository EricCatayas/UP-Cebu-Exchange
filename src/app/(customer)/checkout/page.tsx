'use client';

import DeliveryMethodCard from '@/components/cards/DeliveryMethod/DeliveryMethod';
import RentalPeriodCard from '@/components/cards/RentalPeriod/RentalPeriod';
import PaymentMethodCard from '@/components/cards/PaymentMethod/PaymentMethod';
import RentalSummaryCard from '@/components/cards/RentalSummary/RentalSummary';
import { FaExclamationTriangle } from 'react-icons/fa';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { useUserAddress } from '@/contexts/UserAddressContext';
import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';
import { fmtDate, fmtMoney } from '@/lib/formatter';
import { getUnavailableReason } from '@/lib/order';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { DELIVERY_FEE, DELIVERY_METHOD } from '@/lib/constants';

function RentalCheckout() {
  const { isLoggedIn } = useAuth();
  const { cartItems, selectedArtworkIds, toggleCartItem, toggleAllCartItems, removeItemFromCart } = useCart();
  const { address } = useUserAddress();

  const {
    artworks,
    setArtworks,
    setAddress,
    duration,
    setDuration,
    startDate,
    endDate,
    setStartDate,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    additionalFees,
    setAdditionalFees,
    contractSigned,
    setContractSigned,
    subtotal,
    total,
  } = useRentalOrder();

  useEffect(() => {
    const selectedArtworks = cartItems
      .filter((item) => selectedArtworkIds.has(item.artworkId))
      .map((item) => item.artwork);
    setArtworks(selectedArtworks);
  }, [cartItems, selectedArtworkIds, setArtworks]);

  useEffect(() => {
    setAddress(address);
  }, [address, setAddress]);

  const router = useRouter();

  const canCheckout = useMemo(() => {
    return selectedArtworkIds.size > 0 && contractSigned && isLoggedIn;
  }, [selectedArtworkIds, contractSigned, isLoggedIn]);

  const canSignContract = useMemo(() => {
    return selectedArtworkIds.size > 0 && address !== null && address !== undefined && isLoggedIn;
  }, [selectedArtworkIds, address, isLoggedIn]);

  const navigateToArtwork = (artworkId: number) => {
    router.push(`/artworks/${artworkId}`);
  };

  const navigateToContract = () => {
    router.push('/checkout/rental-agreement');
  };

  const navigateToCreateAccount = () => {
    router.push('/register');
  };

  const navigateToAddress = () => {
    router.push('/checkout/address');
  };

  const handleRemoveCartItem = async (cartItem: any) => {
    const artworkId = cartItem.artworkId;
    await removeItemFromCart(artworkId);
  };

  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethod(method);
    if (method === DELIVERY_METHOD.DELIVERY) {
      setAdditionalFees([{ rentalOrderId: null, type: 'delivery', label: 'Delivery Fee', amount: DELIVERY_FEE }]);
    } else {
      setAdditionalFees([]);
    }
  };

  const handleCheckout = async () => {
    const selectedCartItemIds = cartItems
      .filter((item) => selectedArtworkIds.has(item.artworkId))
      .map((item) => item.id);

    const rentalOrder = {
      durationMonths: duration,
      startDate,
      endDate,
      cartItemIds: Array.from(selectedCartItemIds),
      deliveryMethod,
      paymentMethod,
      totalAmount: total,
      addressId: address?.id,
      fees: additionalFees,
    };

    try {
      const newRentalOrder = await rentalOrderApi.checkout(rentalOrder);
      router.push(`/checkout/success/${newRentalOrder.id}`);
    } catch (error) {
      alert(`Error during checkout: ${error.message}`);
    }
  };

  return (
    <div className="mt-12 mb-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
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
                    checked={selectedArtworkIds.size === cartItems.length && cartItems.length > 0}
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
                    key={item.artworkId}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {item.isAvailable ? (
                        <input
                          type="checkbox"
                          checked={selectedArtworkIds.has(item.artworkId)}
                          onChange={() => toggleCartItem(item.artworkId)}
                          className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                        />
                      ) : (
                        <div title={getUnavailableReason(item.status)}>
                          <FaExclamationTriangle className="text-red-500 w-5 h-5" />
                        </div>
                      )}
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

          <PaymentMethodCard selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />

          <DeliveryMethodCard onMethodChange={handleDeliveryMethodChange} selectedMethod={deliveryMethod}>
            <div className="mt-6 pt-4 border-t">
              <span className="font-semibold text-lg">Customer Address:</span>
              <div className="mt-2 text-gray-700">
                {address ? (
                  <>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.province}, {address.postalCode}
                    </p>
                    <button onClick={navigateToAddress} className="text-blue-600 hover:underline mt-2">
                      Edit Address
                    </button>
                  </>
                ) : (
                  <>
                    <p>Address is required</p>
                    <button onClick={navigateToAddress} className="text-blue-600 hover:underline mt-2">
                      Add Address
                    </button>
                  </>
                )}
              </div>
            </div>
          </DeliveryMethodCard>
        </div>

        {/* Right Column - Rental Summary */}
        <div className="lg:col-span-1">
          <RentalSummaryCard
            artworks={artworks}
            duration={duration}
            startDate={startDate}
            endDate={endDate}
            deliveryMethod={deliveryMethod}
            paymentMethod={paymentMethod}
            additionalFees={additionalFees}
            total={total}
          >
            {canCheckout ? (
              <button
                onClick={handleCheckout}
                disabled={!canCheckout}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>CHECKOUT</span>
                <span>→</span>
              </button>
            ) : isLoggedIn ? (
              <button
                onClick={navigateToContract}
                disabled={!canSignContract}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>SIGN CONTRACT</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={navigateToCreateAccount}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>CREATE AN ACCOUNT</span>
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
