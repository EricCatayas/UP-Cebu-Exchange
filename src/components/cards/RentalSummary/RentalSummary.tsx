import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';
import { DELIVERY_FEE } from '@/lib/constants';
import { fmtDate, fmtMoney } from '@/lib/formatter';
import { ArtworkDTO } from '@/models/Artwork';
import { UserDTO } from '@/models/User';
export default function RentalSummaryCard({
  artworks,
  duration,
  startDate,
  endDate,
  deliveryMethod,
  paymentMethod,
  total,
  customer,
  children,
}: {
  artworks: ArtworkDTO[];
  duration: number;
  startDate: string | Date;
  endDate: string | Date;
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  customer?: UserDTO;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm sticky top-6">
      <h2 className="text-xl font-bold mb-4">Rental Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span className="font-semibold">{duration} months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Start Date:</span>
          <span className="font-semibold">{fmtDate(startDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">End Date:</span>
          <span className="font-semibold">{fmtDate(endDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Method:</span>
          <span className="font-semibold">{deliveryMethod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-semibold">{paymentMethod}</span>
        </div>
        {customer && (
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-semibold">{customer.fullName}</span>
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          {artworks.length > 0 &&
            artworks.map((artwork) => (
              <div key={artwork.id} className="flex justify-between mb-2">
                <span className="text-gray-600">{artwork.title}</span>
                <span className="font-semibold">{fmtMoney(getRentalFee(artwork, duration))}</span>
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

      {children}
    </div>
  );
}
