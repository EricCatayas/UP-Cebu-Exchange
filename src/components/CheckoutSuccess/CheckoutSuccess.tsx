'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { DELIVERY_METHOD, PAYMENT_METHOD } from '@/lib/constants';
import { getDimension, getImageUrl } from '@/lib/artwork';
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { APP_SUPPORT_EMAIL } from '@/lib/constants';

function CheckoutSuccess({ rentalOrder }: { rentalOrder: RentalOrderDTO }) {
  const router = useRouter();
  const { user } = useAuth();

  if (!rentalOrder) {
    return null;
  }

  const { startDate, endDate, deliveryMethod, payment } = rentalOrder;
  const total = rentalOrder.payment?.amount;

  const isPickup = deliveryMethod === DELIVERY_METHOD.PICKUP;
  const isDelivery = deliveryMethod === DELIVERY_METHOD.DELIVERY;
  const isOnlinePayment = payment?.method === PAYMENT_METHOD.ONLINE;
  const orderNumber = rentalOrder?.id ? `#${String(rentalOrder.id).padStart(6, '0')}` : '#000000';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <FaCheckCircle className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Order Created Successfully!</h1>
                <p className="text-green-50 mt-1">
                  Your rental order has been submitted and is currently pending payment.
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 py-4 bg-green-50 border-t border-green-100">
            <p className="text-gray-700 flex items-center gap-2">
              <FaEnvelope className="w-5 h-5 text-green-600" />A confirmation email has been sent to{' '}
              <span className="font-semibold">{user?.email || 'your email'}</span>
            </p>
          </div>
        </div>

        {/* Rental Order Summary */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-8 py-4">
            <h2 className="text-2xl font-bold text-white">Rental Order Summary</h2>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Order Number */}
            <div className="pb-4 border-b border-gray-200">
              <p className="text-lg">
                <span className="text-gray-600">Order Number:</span>{' '}
                <span className="font-bold text-gray-900 text-xl">{orderNumber}</span>
              </p>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {rentalOrder?.items?.map((item: any) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex gap-4">
                    <img
                      src={getImageUrl(item.artwork)}
                      alt={item.artwork.title}
                      className="w-32 h-32 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.artwork.title}</h3>
                      <p className="text-gray-700">
                        <span className="text-gray-600">Artist:</span> {item.artwork.artist?.title || 'N/A'}
                      </p>
                      <p className="text-gray-700">
                        <span className="text-gray-600">Dimension:</span> {getDimension(item.artwork)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rental Details */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-900">
                <span className="font-medium">Rental Period:</span> {new Date(startDate).toLocaleDateString()} →{' '}
                {new Date(endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-900 text-xl font-bold border-t border-blue-200 pt-2">
                <span className="font-bold">Total Amount Due:</span> ₱{total}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">Method:</span>{' '}
                <span className="inline-flex items-center gap-1">
                  {isPickup ? <FaBox className="w-4 h-4" /> : <FaMapMarkerAlt className="w-4 h-4" />}
                  {deliveryMethod}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps - Pickup */}
        {isPickup && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-500 px-8 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaMapMarkerAlt className="w-6 h-6" />
                Pickup Instructions
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              <p className="text-gray-700 text-lg">You may pick up your item once your payment has been confirmed.</p>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">Pickup Location:</h3>
                <p className="text-gray-800 leading-relaxed">
                  <strong>UP Cebu Business Incubator for Information Technology (UP Cebu inIT)</strong>
                  <br />
                  University of the Philippines Cebu
                  <br />
                  Cebu City, 6000 Cebu
                </p>

                <div className="mt-4 flex items-start gap-2 text-gray-700">
                  <FaClock className="w-5 h-5 mt-0.5 text-orange-600" />
                  <div>
                    <p className="font-medium">Pickup Hours:</p>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-gray-800 font-medium">⚠️ Reminder:</p>
                <p className="text-gray-700 mt-1">
                  Please bring your <strong>Order Number ({orderNumber})</strong> and a <strong>valid ID</strong> during
                  pickup.
                </p>
              </div>

              <button
                onClick={() => router.push('/payment')}
                className="w-full bg-orange-600 text-white font-semibold py-4 rounded-lg hover:bg-orange-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <FaCreditCard className="w-5 h-5" />
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Next Steps - Delivery */}
        {isOnlinePayment && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-600 px-8 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaCreditCard className="w-6 h-6" />
                Complete Your Payment
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              <p className="text-gray-700 text-lg">
                To {isDelivery ? 'schedule your delivery' : 'reserve your artworks'}, please complete your payment.
              </p>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500 space-y-3">
                <p className="text-gray-800">
                  You can complete your payment by clicking the button below or using the payment link sent to your
                  email. After successful payment:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    Your rental will be marked as <strong>Paid</strong>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    The delivery schedule will be arranged
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    You will receive a delivery confirmation email
                  </li>
                </ul>
              </div>

              <button
                onClick={() => router.push(`/account/rentals/${rentalOrder.id}?action=pay`)}
                className="w-full bg-purple-600 text-white font-semibold py-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <FaCreditCard className="w-5 h-5" />
                Complete Payment
              </button>
            </div>
          </div>
        )}

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-8 py-4">
            <h2 className="text-2xl font-bold text-white">Need Help?</h2>
          </div>

          <div className="px-8 py-6">
            <p className="text-gray-700 mb-4">If you have questions or need assistance, contact us at:</p>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-800">
                <FaEnvelope className="w-5 h-5 text-blue-600" />
                <a href={`mailto:${APP_SUPPORT_EMAIL}`} className="text-blue-600 hover:underline font-medium">
                  {APP_SUPPORT_EMAIL}
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaPhone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Contact us through our Facebook page</span>
              </p>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 What Happens Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span>
                Your rental will remain in <strong>"Pending Payment"</strong> status until payment is completed
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span>
                Items will be reserved, scheduled for delivery, or made available once you've completed your payment
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span>
                You can view your rental status anytime inside <strong>My Rentals</strong> in your account
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/account/rentals')}
            className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            View My Rentals
          </button>
          <button
            onClick={() => router.push(`/account/rentals/${rentalOrder.id}?action=pay`)}
            className="flex-1 bg-green-600 text-white font-semibold py-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
