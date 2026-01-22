'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaCheckCircle,
  FaBox,
  FaMapMarkerAlt,
  FaCreditCard,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCalendarAlt,
} from 'react-icons/fa';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getDimension, getImageUrl } from '@/lib/artwork';
import { APP_CONTACT_EMAIL, DELIVERY_METHOD } from '@/lib/constants';
import { fmtDate } from '@/lib/formatter';

export default function PaymentSuccess({ rentalOrder }: { rentalOrder: RentalOrderDTO }) {
  const router = useRouter();

  const { startDate, endDate, deliveryMethod, payment } = rentalOrder;
  const total = rentalOrder.payment?.amount || 0;
  const isPickup = deliveryMethod === DELIVERY_METHOD.PICKUP;
  const isDelivery = deliveryMethod === DELIVERY_METHOD.DELIVERY;
  const isExtendDuration = deliveryMethod === DELIVERY_METHOD.NONE;
  const orderNumber = rentalOrder?.id ? `#${String(rentalOrder.id).padStart(6, '0')}` : '#000000';
  const paymentDate = payment?.updatedAt ? fmtDate(payment.updatedAt) : fmtDate(new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <FaCheckCircle className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
                <p className="text-green-50 mt-1">
                  Your payment has been processed successfully. Your rental is now confirmed.
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 py-4 bg-green-50 border-t border-green-100">
            <p className="text-gray-700 flex items-center gap-2">
              <FaEnvelope className="w-5 h-5 text-green-600" />A payment confirmation has been sent to your email.
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-8 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaCreditCard className="w-6 h-6" />
              Payment Details
            </h2>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Date</p>
                <p className="text-lg font-semibold text-gray-900">{paymentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900">{payment?.method || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-lg font-bold text-green-600">₱{total.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-4">
              <p className="text-gray-900">
                <span className="font-medium flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  Rental Period:
                </span>
                <span className="ml-6">
                  {new Date(startDate).toLocaleDateString()} → {new Date(endDate).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Rental Order Summary */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-600 px-8 py-4">
            <h2 className="text-2xl font-bold text-white">Your Rental Items</h2>
          </div>

          <div className="px-8 py-6 space-y-4">
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
                      <span className="text-gray-600">Artist:</span> {item.artwork.artist?.name || 'N/A'}
                    </p>
                    <p className="text-gray-700">
                      <span className="text-gray-600">Dimension:</span> {getDimension(item.artwork)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps - Pickup */}
        {isPickup && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-500 px-8 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaBox className="w-6 h-6" />
                Pickup Instructions
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              <p className="text-gray-700 text-lg">
                The items you rented are being prepared for your pickup at our location. We will contact you to schedule
                pickup within 24-48 hours.
              </p>

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
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
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
            </div>
          </div>
        )}

        {/* Next Steps - Delivery */}
        {isDelivery && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-600 px-8 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaMapMarkerAlt className="w-6 h-6" />
                Delivery Information
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              <p className="text-gray-700 text-lg">Your items will be delivered to your registered address.</p>

              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500 space-y-3">
                <p className="text-gray-800">
                  Our team will contact you within 24-48 hours to schedule the delivery. You will receive:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-600 font-bold">✓</span>A call or SMS to confirm your delivery address
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-600 font-bold">✓</span>
                    Delivery date and time confirmation
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-800 font-medium">📦 Delivery Instructions:</p>
                <p className="text-gray-700 mt-1">
                  Please ensure someone is available to receive the items during the scheduled delivery time.
                </p>
              </div>
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
                <a href={`mailto:${APP_CONTACT_EMAIL}`} className="text-blue-600 hover:underline font-medium">
                  {APP_CONTACT_EMAIL}
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaPhone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Contact us through our Facebook page</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/account/rentals/${rentalOrder.id}`)}
            className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            View Rental Details
          </button>
          <button
            onClick={() => router.push('/account/rentals')}
            className="flex-1 bg-purple-600 text-white font-semibold py-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            View All Rentals
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
