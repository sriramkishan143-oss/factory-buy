import { Trash2, X } from 'lucide-react';
import { Supplier } from '../types/marketplace';
import { StarRating } from './StarRating';

interface ComparisonTableProps {
  suppliers: Supplier[];
  onRemoveSupplier: (supplierId: string) => void;
  onClearAll: () => void;
  onRequestQuote: (supplier: Supplier) => void;
  onOpenDetails: (supplier: Supplier) => void;
}

export function ComparisonTable({
  suppliers,
  onRemoveSupplier,
  onClearAll,
  onRequestQuote,
  onOpenDetails,
}: ComparisonTableProps) {
  // Requirement: Remove the comparison table completely when no suppliers are selected.
  if (suppliers.length === 0) {
    return null;
  }

  const lowestPrice = Math.min(...suppliers.map((s) => s.pricePerUnit));
  const highestRating = Math.max(...suppliers.map((s) => s.rating));
  const fastestDelivery = Math.min(...suppliers.map((s) => s.deliveryDaysMin));
  const showBestIndicators = suppliers.length >= 2;

  return (
    <section
      id="compare"
      aria-labelledby="comparison-heading"
      className="scroll-mt-24 border-t border-slate-800/80 py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-400">
              Side-by-Side Procurement Matrix · {suppliers.length} of 3 selected · Sample data
            </p>
            <h2
              id="comparison-heading"
              className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Supplier Comparison
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Compare unit pricing, material grade, customer ratings, lead times, and available inventory across your shortlisted suppliers.
            </p>
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex min-h-[40px] items-center justify-center gap-2 self-start rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white whitespace-nowrap shrink-0 sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear Comparison</span>
          </button>
        </div>

        {/* Horizontal scroll wrapper for mobile and tablet viewports */}
        <div className="comparison-scroll mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-[#0F172A]">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-[#121D33]">
                <th
                  scope="col"
                  className="w-48 px-5 py-4 text-xs font-semibold text-slate-400"
                >
                  Comparison Field
                </th>
                {suppliers.map((supplier) => (
                  <th
                    key={supplier.id}
                    scope="col"
                    className="min-w-[210px] border-l border-slate-800/80 px-5 py-4 align-top"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenDetails(supplier)}
                          className="text-left font-display text-base font-semibold text-white transition-colors hover:text-emerald-400"
                        >
                          {supplier.name}
                        </button>
                        <p className="mt-0.5 text-xs font-normal text-slate-400">
                          {supplier.category} · {supplier.yearsOperating} yrs operating
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveSupplier(supplier.id)}
                        aria-label={`Remove ${supplier.name} from comparison`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70 text-sm">
              {/* Material */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Material
                </th>
                {suppliers.map((supplier) => (
                  <td
                    key={supplier.id}
                    className="border-l border-slate-800/80 px-5 py-3.5 font-medium text-slate-100"
                  >
                    {supplier.materialName}
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Price
                </th>
                {suppliers.map((supplier) => {
                  const isLowest =
                    showBestIndicators && supplier.pricePerUnit === lowestPrice;
                  return (
                    <td
                      key={supplier.id}
                      className="border-l border-slate-800/80 px-5 py-3.5"
                    >
                      <div className="font-mono text-base font-semibold text-white tabular-nums">
                        ${supplier.pricePerUnit.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">
                          {' '}
                          / {supplier.unit}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="text-slate-400 tabular-nums">
                          MOQ: {supplier.minOrderQty} {supplier.unit}
                        </span>
                        {isLowest && (
                          <>
                            <span className="text-slate-600" aria-hidden="true">·</span>
                            <span className="font-semibold text-emerald-400">
                              Lowest price
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Quality / Grade */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Quality / Grade
                </th>
                {suppliers.map((supplier) => (
                  <td
                    key={supplier.id}
                    className="border-l border-slate-800/80 px-5 py-3.5"
                  >
                    <div className="font-medium text-slate-100">
                      {supplier.qualityGrade}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {supplier.certifications.join(' · ')}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Customer Rating */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Customer Rating
                </th>
                {suppliers.map((supplier) => {
                  const isTopRated =
                    showBestIndicators && supplier.rating === highestRating;
                  return (
                    <td
                      key={supplier.id}
                      className="border-l border-slate-800/80 px-5 py-3.5"
                    >
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <StarRating rating={supplier.rating} size="sm" />
                        {isTopRated && (
                          <span className="text-xs font-semibold text-emerald-400">
                            · Top rated
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Number of Reviews */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Number of Reviews
                </th>
                {suppliers.map((supplier) => (
                  <td
                    key={supplier.id}
                    className="border-l border-slate-800/80 px-5 py-3.5 font-mono text-sm text-slate-200 tabular-nums"
                  >
                    {supplier.reviewCount} verified reviews
                  </td>
                ))}
              </tr>

              {/* Delivery Time */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Delivery Time
                </th>
                {suppliers.map((supplier) => {
                  const isFastest =
                    showBestIndicators &&
                    supplier.deliveryDaysMin === fastestDelivery;
                  return (
                    <td
                      key={supplier.id}
                      className="border-l border-slate-800/80 px-5 py-3.5"
                    >
                      <div className="font-mono text-sm font-medium text-slate-100 tabular-nums">
                        {supplier.deliveryDaysMin}–{supplier.deliveryDaysMax} business days
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="text-slate-400 tabular-nums">
                          {supplier.onTimeDeliveryRate}% on-time rate
                        </span>
                        {isFastest && (
                          <>
                            <span className="text-slate-600" aria-hidden="true">·</span>
                            <span className="font-semibold text-emerald-400">
                              Fastest lead time
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Available Stock */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Available Stock
                </th>
                {suppliers.map((supplier) => (
                  <td
                    key={supplier.id}
                    className="border-l border-slate-800/80 px-5 py-3.5 font-mono text-sm text-slate-100 tabular-nums"
                  >
                    {supplier.availableStock.toLocaleString()} {supplier.unit} ready
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr className="hover:bg-slate-800/20">
                <th scope="row" className="px-5 py-3.5 text-xs font-medium text-slate-400">
                  Location
                </th>
                {suppliers.map((supplier) => (
                  <td
                    key={supplier.id}
                    className="border-l border-slate-800/80 px-5 py-3.5 text-slate-200"
                  >
                    <div>{supplier.location}</div>
                    <div className="text-xs text-slate-400">{supplier.region}</div>
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr className="bg-[#0C1424]">
                <th scope="row" className="px-5 py-4 text-xs font-medium text-slate-400">
                  Procurement Action
                </th>
                {suppliers.map((supplier) => (
                  <td
                    key={supplier.id}
                    className="border-l border-slate-800/80 px-5 py-4"
                  >
                    <button
                      type="button"
                      onClick={() => onRequestQuote(supplier)}
                      className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap"
                    >
                      Request Quote
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
