import { getDimension, getImageUrl, getRentalFee } from '@/lib/artwork';
import { fmtDate, fmtMoney } from '@/lib/formatter';
import { ArtworkDTO } from '@/models/Artwork';
import { BillingFeeCreateDTO } from '@/models/BillingFee';
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
  additionalFees,
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
  additionalFees?: BillingFeeCreateDTO[];
  children?: React.ReactNode;
}) {
  return (
    <aside className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.22)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 via-white to-sky-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Checkout</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Rental Summary</h2>
        <p className="mt-1 text-sm text-slate-600">Review your booking details before placing the order.</p>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-slate-100 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
            <p className="mt-1 font-semibold text-slate-900">{duration} months</p>
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Items</p>
            <p className="mt-1 font-semibold text-slate-900">{artworks.length}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-slate-600">Start date</span>
            <span className="font-semibold text-slate-900">{fmtDate(startDate)}</span>
          </div>
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-slate-600">End date</span>
            <span className="font-semibold text-slate-900">{fmtDate(endDate)}</span>
          </div>
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-slate-600">Delivery</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {deliveryMethod}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-slate-600">Payment</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {paymentMethod}
            </span>
          </div>
          {customer && (
            <div className="flex items-center justify-between py-1 text-sm">
              <span className="text-slate-600">Customer</span>
              <span className="font-semibold text-slate-900">{customer.fullName}</span>
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Artworks</p>
          <div className="space-y-3">
            {artworks.length > 0 &&
              artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={getImageUrl(artwork)}
                      alt={artwork.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{artwork.title}</p>
                      <p className="truncate text-xs text-slate-500">{getDimension(artwork)}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-slate-900">
                    {fmtMoney(getRentalFee(artwork, duration))}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {additionalFees?.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Additional Fees</p>
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              {additionalFees.map((fee, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{fee.label}</span>
                  <span className="font-semibold text-slate-900">{fmtMoney(fee.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Total Rental Cost</span>
            <span className="text-2xl font-bold text-primary">{fmtMoney(total)}</span>
          </div>
        </div>

        {children}
      </div>
    </aside>
  );
}
