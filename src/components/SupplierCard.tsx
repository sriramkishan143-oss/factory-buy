import { ArrowLeftRight, Check } from 'lucide-react';
import { Supplier } from '../types/marketplace';
import { MaterialImage } from './MaterialImage';
import { StarRating } from './StarRating';

interface SupplierCardProps {
  supplier: Supplier;
  isSelectedForCompare: boolean;
  compareLimitReached: boolean;
  onToggleCompare: (supplierId: string) => void;
  onOpenDetails: (supplier: Supplier) => void;
}

export function SupplierCard({
  supplier,
  isSelectedForCompare,
  compareLimitReached,
  onToggleCompare,
  onOpenDetails,
}: SupplierCardProps) {
  const isCompareDisabled = !isSelectedForCompare && compareLimitReached;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-[#0F172A] transition-transform duration-150 hover:-translate-y-0.5 ${
        isSelectedForCompare
          ? 'border-emerald-500/70'
          : 'border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* 4:3 material photograph with clean contrast scrim */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B1221]">
        <MaterialImage
          src={supplier.imageUrl}
          alt={supplier.imageAlt}
          fallbackLabel={`${supplier.category} — ${supplier.materialName}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Card body with consistent field order across every grid item */}
      <div className="flex flex-1 flex-col p-5">
        {/* Quiet unboxed 1-line metadata kicker */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
          <span className="font-medium text-emerald-400">{supplier.category}</span>
          <span aria-hidden="true">·</span>
          <span>{supplier.location}</span>
          <span aria-hidden="true">·</span>
          <span>Sample data</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-snug text-white">
          {supplier.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-300">
          {supplier.materialName}
        </p>

        {/* Rating & delivery performance */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <StarRating
            rating={supplier.rating}
            reviewCount={supplier.reviewCount}
            size="sm"
          />
          <span className="text-xs text-slate-400 tabular-nums">
            {supplier.onTimeDeliveryRate}% on-time
          </span>
        </div>

        {/* Structured specification summary separated by hairline dividers */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-800/80 pt-4 text-xs">
          <div>
            <dt className="text-slate-400">Unit price</dt>
            <dd className="mt-0.5 font-mono text-base font-semibold text-white tabular-nums">
              ${supplier.pricePerUnit.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">
                /{supplier.unit}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Delivery lead time</dt>
            <dd className="mt-0.5 font-mono text-sm font-medium text-slate-100 tabular-nums">
              {supplier.deliveryDaysMin}–{supplier.deliveryDaysMax} days
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Quality grade</dt>
            <dd className="mt-0.5 truncate font-medium text-slate-200" title={supplier.qualityGrade}>
              {supplier.qualityGrade}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Available stock</dt>
            <dd className="mt-0.5 font-mono text-sm font-medium text-slate-100 tabular-nums">
              {supplier.availableStock.toLocaleString()} {supplier.unit}
            </dd>
          </div>
        </dl>

        {/* Action controls anchored at bottom */}
        <div className="mt-5 flex items-center gap-3 border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => onToggleCompare(supplier.id)}
            aria-pressed={isSelectedForCompare}
            className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
              isSelectedForCompare
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : isCompareDisabled
                ? 'border border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                : 'border border-slate-700 bg-slate-900/80 text-slate-100 hover:border-emerald-500/70 hover:text-emerald-300'
            }`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Comparing</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Compare Supplier</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(supplier)}
            className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors duration-150 hover:border-slate-600 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Details &amp; Reviews
          </button>
        </div>
      </div>
    </article>
  );
}
