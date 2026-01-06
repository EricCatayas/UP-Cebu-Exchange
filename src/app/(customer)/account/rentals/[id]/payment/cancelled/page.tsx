'use client';
import { useRouter } from 'next/navigation';
import { FaTimesCircle, FaCreditCard, FaEnvelope, FaPhone, FaExclamationTriangle } from 'react-icons/fa';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getDimension, getImageUrl } from '@/lib/artwork';
import { APP_SUPPORT_EMAIL } from '@/lib/constants';

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cancelled Message */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <FaTimesCircle className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Payment Cancelled</h1>
                <p className="text-red-50 mt-1">
                  Your payment was cancelled. If you wish to complete the payment, please try again.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happened */}
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FaExclamationTriangle className="w-5 h-5 text-red-600" />
            What Happened?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span>Your payment was not completed and has been cancelled</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span>Your rental order request is still pending. You may retry the payment to complete your order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span>No charges were made to your payment method</span>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-8 py-4">
            <h2 className="text-2xl font-bold text-white">Need Help?</h2>
          </div>

          <div className="px-8 py-6">
            <p className="text-gray-700 mb-4">
              If you encountered an issue or need assistance with payment, contact us at:
            </p>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/account/rentals')}
            className="flex-1 bg-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
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
