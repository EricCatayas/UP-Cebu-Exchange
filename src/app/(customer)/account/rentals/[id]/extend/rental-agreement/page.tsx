'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useRentalOrder } from '@/contexts/RentalOrderContext';
import { DELIVERY_FEE, DELIVERY_METHOD } from '@/lib/constants';
import { getDimension, getImageUrl } from '@/lib/artwork';

function RentalAgreement() {
  const {
    artworks,
    address,
    duration,
    startDate,
    endDate,
    deliveryMethod,
    paymentMethod,
    subtotal,
    total,
    setContractSigned,
  } = useRentalOrder();

  const router = useRouter();

  const handleSignAgreement = () => {
    setContractSigned(true);
    router.back();
  };

  // todo: update rental agreement content for extension

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-6">
          <h1 className="text-3xl font-bold">UP Cebu Exchange – Rental Agreement</h1>
          <p className="text-blue-100 mt-2 text-lg">Terms and Conditions</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Introduction */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Welcome to UP Cebu Exchange. Please read these Terms and Conditions ("Agreement") carefully before
              proceeding. By using our rental services or clicking "I Agree", you acknowledge that you have read,
              understood, and agree to be bound by these terms.
            </p>
          </div>

          {/* Section 1 */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Agreement Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              This Rental Agreement ("Agreement") is a legally binding contract between the Lessor ("Owner") and the
              Lessee ("Renter") for the temporary rental of an artwork or item through the UP Cebu Exchange platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              If you do not agree with these terms, you must not proceed with the rental.
            </p>
          </div>

          {/* Section 2 - Items Description */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Items Description</h2>
            <p className="text-gray-700 mb-4">The item being rented includes:</p>

            <div className="space-y-4">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex gap-4">
                    <img src={getImageUrl(artwork)} alt={artwork.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        <span className="text-gray-600">Artwork Title:</span> {artwork.title}
                      </p>
                      <p className="text-gray-700">
                        <span className="text-gray-600">Artist:</span> {artwork.artist?.name || 'N/A'}
                      </p>
                      <p className="text-gray-700">
                        <span className="text-gray-600">Dimension:</span> {getDimension(artwork)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-700 mt-4 leading-relaxed">
              <span className="font-medium">Condition:</span> All artworks/items listed on UP Cebu Exchange are verified
              by their respective owners to be in good condition at the time of listing.
            </p>
            <p className="text-gray-700 mt-2 leading-relaxed">
              Since UP Cebu Exchange operates entirely online, the Lessee acknowledges that they are renting the item
              based on the information and images provided within the platform and accepts the condition as described.
            </p>
          </div>

          {/* Section 3 - Rental Term */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Rental Term</h2>
            <div className="bg-blue-50 p-4 rounded-lg space-y-1">
              <p className="text-gray-900">
                <span className="font-medium">Start Date:</span> {startDate}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">End Date:</span> {endDate}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">Duration:</span> {duration} months
              </p>
            </div>
            <p className="text-gray-700 mt-3 leading-relaxed">
              The rental is valid only for the specified period unless renewed or extended through the UP Cebu Exchange
              platform by both parties.
            </p>
          </div>

          {/* Section 4 - Payment Terms */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Payment Terms</h2>
            <div className="bg-green-50 p-4 rounded-lg space-y-1">
              <p className="text-gray-900">
                <span className="font-medium">Subtotal:</span> ₱{subtotal.toFixed(2)}
              </p>
              {deliveryMethod === DELIVERY_METHOD.DELIVERY && (
                <p className="text-gray-900">
                  <span className="font-medium">Delivery Fee:</span> ₱{DELIVERY_FEE.toFixed(2)}
                </p>
              )}
              <p className="text-gray-900 text-lg font-semibold border-t border-green-200 pt-2 mt-2">
                <span className="font-bold">Total Rental Fee:</span> ₱{total.toFixed(2)}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">Payment Method:</span> {paymentMethod}
              </p>
              {/* <p className="text-gray-900">
                <span className="font-medium">Payment Schedule:</span> Before [Date]
              </p> */}
              <p className="text-gray-900">
                <span className="font-medium">Delivery Method:</span> {deliveryMethod}
              </p>
              {address && (
                <p className="text-gray-900">
                  <span className="font-medium">Customer Address:</span> {address.addressLine1},{' '}
                  {address.addressLine2 ? address.addressLine2 + ', ' : ''}
                  {address.city}, {address.province}, {address.postalCode}
                </p>
              )}
            </div>
            <p className="text-gray-700 mt-3 leading-relaxed">
              The item will only be reserved, scheduled for delivery, or made available for pickup after full payment
              has been successfully made.
            </p>
            <p className="text-gray-700 mt-2 leading-relaxed">
              Failure to complete the payment will automatically cancel the rental request.
            </p>
          </div>

          {/* Section 5 - Responsibilities */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Responsibilities</h2>

            <h3 className="text-lg font-medium text-gray-900 mt-3 mb-2">Lessor Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
              <li>Ensure that the artwork/item listed is in good condition at the time of posting</li>
              <li>Provide accurate descriptions and images of the item</li>
              <li>Make the item available for delivery or pickup once payment is confirmed</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Lessee Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
              <li>Use the rented artwork/item only for its intended purpose</li>
              <li>Handle and store the item with proper care</li>
              <li>Report any damage or issues immediately through the UP Cebu Exchange platform</li>
              <li>Return the item by the agreed-upon date in the same condition, considering normal wear</li>
            </ul>
          </div>

          {/* Section 6 - Restrictions */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Restrictions</h2>
            <p className="text-gray-700 mb-2">
              The Lessee agrees <span className="font-semibold">NOT</span> to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
              <li>Sublease, lend, or transfer the item to another party</li>
              <li>Modify, repair, or alter the artwork/item in any form</li>
              <li>Use the artwork/item for illegal activities, misrepresentation, or actions that may cause damage</li>
            </ul>
          </div>

          {/* Section 7 - Termination */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Termination</h2>
            <p className="text-gray-700 mb-2">This Agreement may be terminated:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
              <li>By mutual consent via the platform</li>
              <li>By either party with prior notice before the rental period begins</li>
              <li>Immediately, in case of violation of any terms stated in this Agreement</li>
            </ul>
            <p className="text-gray-700 mt-3 leading-relaxed">
              Upon termination or upon reaching the end of the rental term, the Lessee must return the artwork/item in
              the same condition as received, aside from normal wear.
            </p>
          </div>

          {/* Section 8 - Liability */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Liability</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>
                The Lessee is responsible for any loss, theft, or damage beyond normal wear during the rental period.
              </li>
              <li>
                The Lessor is not liable for any accidents, damages, or losses arising from misuse or negligence by the
                Lessee.
              </li>
            </ul>
          </div>

          {/* Section 9 - Governing Law */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              This Agreement is governed by the laws of the Republic of the Philippines. Any disputes will be resolved
              in the appropriate courts within the jurisdiction of Cebu City, unless otherwise mutually agreed.
            </p>
          </div>

          {/* Section 10 - Acceptance */}
          <div className="pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Acceptance</h2>
            <p className="text-gray-700 mb-2">
              By clicking "I Agree" or proceeding with the rental, you confirm that you:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
              <li>Have read and understood this Agreement</li>
              <li>Agree to comply with all terms and conditions stated herein</li>
            </ul>
          </div>
        </div>

        {/* Footer with Action Button */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSignAgreement}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              I Agree - Sign Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentalAgreement;
