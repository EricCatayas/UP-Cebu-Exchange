import { RentalOrderDTO } from '@/models/RentalOrder';
import { getDaysRemaining, getOrderStatus } from '@/lib/order';
import { fmtDate } from '@/lib/formatter';

const RentalOrderCard = ({ order, children }: { order: RentalOrderDTO; children?: React.ReactNode }) => {
  const daysLeft = getDaysRemaining(order);
  const orderStatus = getOrderStatus(order);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.55)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50 px-5 py-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rental Order</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Order #{order.id}</h3>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatus.color}`}>{orderStatus.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Remaining</p>
            <p className="mt-1 font-semibold text-slate-900">{daysLeft} days</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Artworks</p>
            <p className="mt-1 font-semibold text-slate-900">{order.items.length}</p>
          </div>
        </div>
      </div>

      <dl className="space-y-2 p-5 text-sm">
        {order.user && (
          <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
            <dt className="text-slate-500">From</dt>
            <dd className="text-right font-semibold text-slate-900">{order.user.fullName}</dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Order Date</dt>
          <dd className="text-right font-semibold text-slate-900">{fmtDate(order.createdAt)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
          <dt className="text-slate-500">Rental Period</dt>
          <dd className="text-right font-semibold text-slate-900">
            {fmtDate(order.startDate)} → {fmtDate(order.endDate)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Duration</dt>
          <dd className="text-right font-semibold text-slate-900">{order.durationMonths} months</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
          <dt className="text-slate-500">Remaining</dt>
          <dd className="text-right font-semibold text-slate-900">{daysLeft} days</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Status</dt>
          <dd className="text-right font-semibold text-slate-900">{orderStatus.label}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
          <dt className="text-slate-500">Payment Method</dt>
          <dd className="text-right font-semibold text-slate-900">{order.payment.method}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Artworks</dt>
          <dd className="text-right font-semibold text-slate-900">{order.items.length}</dd>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Amount</dt>
          <dd className="text-lg font-bold text-primary">₱{order.payment.amount.toLocaleString('en-PH')}</dd>
        </div>
      </dl>

      {children && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm">
          <div className="flex flex-wrap gap-3">{children}</div>
        </div>
      )}
    </article>
  );
};

export default RentalOrderCard;
