import RentalOrderService from '@/services/RentalOrderService';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import { getCurrentUser } from '@/lib/auth';
import { APP_SUPPORT_EMAIL, ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';

export default async function OrderReturnRequestPage({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const currentUser = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();
  const order: RentalOrderDTO | null = await rentalOrderService.getUserOrderDetails(currentUser?.userId, id);

  if (!order) {
    notFound();
  }

  if (order.status !== ORDER_STATUS.TORETURN) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <FaCheckCircle className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Return Request Sent</h1>
                <p className="text-green-50 mt-1">Your order has been marked for return.</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-green-50 border-t border-green-100">
            <p className="text-gray-700 flex items-center gap-2">
              <FaEnvelope className="w-5 h-5 text-green-600" />
              The owner has been notified about your return request. Please follow the return instructions below. We've
              also sent a confirmation email to your registered email address.
            </p>
          </div>
        </div>

        {/* Return Instructions */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-8 py-4">
            <h2 className="text-2xl font-bold text-white">Return Instructions</h2>
          </div>
          <div className="px-8 py-6">
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-semibold">Prepare the Items:</span> Ensure all rented items are securely packed in
                their original packaging, including any accessories or documentation.
              </li>
              <li>
                <span className="font-semibold">Schedule a Pickup:</span> Contact our support team at{' '}
                <a href={`mailto:${APP_SUPPORT_EMAIL}`} className="text-blue-600 hover:underline font-medium">
                  {APP_SUPPORT_EMAIL}
                </a>{' '}
                to arrange a convenient pickup time for the return of your items.
              </li>
              <li>
                <span className="font-semibold">Handover the Items:</span> On the scheduled pickup date, hand over the
                packed items to our delivery personnel. Ensure you receive a confirmation receipt for the return.
              </li>
              <li>
                <span className="font-semibold">Return Confirmation:</span> Once the items are received and inspected,
                we will send you a confirmation email regarding the successful return of your rental order.
              </li>
            </ol>
          </div>
        </div>

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

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account/rentals"
            className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-center"
          >
            View My Rentals
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
