'use client';

import RentalPeriodCard from '@/components/cards/RentalPeriod/RentalPeriod';
import PaymentMethodCard from '@/components/cards/PaymentMethod/PaymentMethod';
import RentalSummaryCard from '@/components/cards/RentalSummary/RentalSummary';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { ArtworkDTO } from '@/models/Artwork';
import { AddressDTO } from '@/models/Address';
import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';
import { fmtDate, fmtMoney } from '@/lib/formatter';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { DELIVERY_METHOD } from '@/lib/constants';

function ExtendRental({
  artworks,
  address,
  rentalOrderId,
  fixedStartDate,
}: {
  artworks: ArtworkDTO[];
  address: AddressDTO;
  rentalOrderId: number;
  fixedStartDate: string | Date;
}) {
  const {
    setArtworks,
    setAddress,
    duration,
    setDuration,
    startDate,
    setStartDate,
    endDate,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    contractSigned,
    setContractSigned,
    subtotal,
    total,
  } = useRentalOrder();

  useEffect(() => {
    setArtworks(artworks);
  }, [artworks, setArtworks]);

  useEffect(() => {
    setStartDate(typeof fixedStartDate === 'string' ? fixedStartDate : fixedStartDate.toISOString().split('T')[0]);
  }, [fixedStartDate]);

  useEffect(() => {
    setAddress(address);
  }, [address, setAddress]);

  useEffect(() => {
    setDeliveryMethod(DELIVERY_METHOD.NONE);
  }, [setDeliveryMethod]);

  const router = useRouter();

  const canCheckout = useMemo(() => {
    return contractSigned;
  }, [contractSigned]);

  const canSignContract = useMemo(() => {
    return address !== null && address !== undefined;
  }, [address]);

  const navigateToArtwork = (artworkId: number) => {
    router.push(`/artworks/${artworkId}`);
  };

  const navigateToContract = () => {
    router.push(`/account/rentals/${rentalOrderId}/extend/rental-agreement`);
  };

  const handleCheckout = async () => {
    const rentalOrder = {
      id: rentalOrderId,
      durationMonths: duration,
      startDate,
      endDate,
      paymentMethod,
      totalAmount: total,
    };

    try {
      const response = await rentalOrderApi.extend(rentalOrder);
      console.log('Extend response:', response);
      const { rentalOrder: newRentalOrder } = response;
      router.push(`/accounts/rentals/${newRentalOrder.id}/extend/success`);
    } catch (error) {
      alert(`Error during checkout: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Extend Rental Plan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RentalPeriodCard
            duration={duration}
            onDurationChange={setDuration}
            startDate={startDate}
            endDate={endDate}
          />

          {/* Select Artworks */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Artworks</h2>

            {/* Select All */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <label className="flex items-center space-x-2 cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                  disabled={true}
                  className="w-5 h-5 rounded border-gray-300 cursor-not-allowed"
                />
                <span className="font-semibold">Select All</span>
              </label>
              <span className="font-semibold mr-4">Charge</span>
            </div>

            {/* Artwork List */}
            <div className="space-y-3">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                      disabled={true}
                      className="w-5 h-5 rounded border-gray-300 cursor-not-allowed"
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
                  <div className="font-semibold text-lg mr-4">{fmtMoney(getRentalFee(artwork, duration))}</div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="font-semibold text-lg">Subtotal:</span>
              <span className="font-bold text-xl">₱{subtotal}</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Order Address</h2>
            <div className="mt-2 text-gray-700">
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}, {address.province}, {address.postalCode}
              </p>
            </div>
          </div>

          <PaymentMethodCard selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />
        </div>

        {/* Right Column - Rental Summary */}
        <div className="lg:col-span-1">
          <RentalSummaryCard
            artworks={artworks}
            duration={duration}
            startDate={startDate}
            endDate={endDate}
            paymentMethod={paymentMethod}
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

export default ExtendRental;
