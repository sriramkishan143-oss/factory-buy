import { useMemo, useState } from 'react';
import { CategoryFilter, CustomerReview, Supplier } from '../types/marketplace';
import { MATERIAL_CATEGORIES } from '../data/suppliers';
import { StarRating } from './StarRating';

interface ReviewsSectionProps {
  suppliers: Supplier[];
  reviews: CustomerReview[];
  onOpenSupplier: (supplier: Supplier) => void;
}

export function ReviewsSection({
  suppliers,
  reviews,
  onOpenSupplier,
}: ReviewsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const supplierMap = useMemo(() => {
    const map = new Map<string, Supplier>();
    for (const supplier of suppliers) {
      map.set(supplier.id, supplier);
    }
    return map;
  }, [suppliers]);

  const filteredReviews = useMemo(() => {
    if (selectedCategory === 'All') {
      return reviews;
    }
    return reviews.filter((review) => {
      const supplier = supplierMap.get(review.supplierId);
      return supplier?.category === selectedCategory;
    });
  }, [reviews, selectedCategory, supplierMap]);

  const avgOnTimeRate = useMemo(() => {
    if (suppliers.length === 0) return 0;
    const sum = suppliers.reduce((acc, s) => acc + s.onTimeDeliveryRate, 0);
    return Math.round(sum / suppliers.length);
  }, [suppliers]);

  const avgDefectFree = useMemo(() => {
    if (suppliers.length === 0) return 0;
    const sum = suppliers.reduce((acc, s) => acc + s.defectFreeRate, 0);
    return (sum / suppliers.length).toFixed(1);
  }, [suppliers]);

  const avgRating = useMemo(() => {
    if (suppliers.length === 0) return 0;
    const sum = suppliers.reduce((acc, s) => acc + s.rating, 0);
    return (sum / suppliers.length).toFixed(1);
  }, [suppliers]);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="scroll-mt-24 border-t border-slate-800/80 py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium text-emerald-400">
              Supplier Reliability &amp; Buyer Feedback · Sample prototype data
            </p>
            <h2
              id="reviews-heading"
              className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Verified Ratings &amp; Delivery Performance
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Every supplier listing tracks on-time dispatch rate, defect-free material lot audits, and buyer reviews from industrial orders so factory teams avoid costly line stoppages.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-5 lg:col-span-5 lg:border-t-0 lg:pt-0">
            <div>
              <dt className="text-xs text-slate-400">Avg. Supplier Rating</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                {avgRating} / 5
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">On-Time Dispatch</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-emerald-400 tabular-nums">
                {avgOnTimeRate}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Defect-Free Lots</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                {avgDefectFree}%
              </dd>
            </div>
          </dl>
        </div>

        {/* Interactive category filter for customer reviews */}
        <div
          className="mt-8 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter buyer reviews by material category"
        >
          {(['All', ...MATERIAL_CATEGORIES] as CategoryFilter[]).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'border border-slate-800 bg-[#0F172A] text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Reviews' : cat}
              </button>
            );
          })}
        </div>

        {/* Review cards */}
        {filteredReviews.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-800 bg-[#0F172A] p-8 text-center">
            <p className="text-sm font-medium text-white">
              No written reviews match {selectedCategory} yet.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-emerald-500/70 hover:text-emerald-300"
            >
              Show All Reviews
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) => {
              const supplier = supplierMap.get(review.supplierId);
              return (
                <article
                  key={review.id}
                  className="flex h-full flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0F172A] p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-slate-400 tabular-nums">
                        {review.date}
                      </span>
                    </div>

                    {supplier && (
                      <div className="mt-3 text-xs text-slate-400">
                        <button
                          type="button"
                          onClick={() => onOpenSupplier(supplier)}
                          className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
                        >
                          {supplier.name}
                        </button>
                        <span aria-hidden="true"> · </span>
                        <span>{supplier.category}</span>
                      </div>
                    )}

                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-800/80 pt-3.5 text-xs">
                    <p className="font-semibold text-white">
                      {review.reviewerName}
                    </p>
                    <p className="mt-0.5 text-slate-400">
                      {review.role}, {review.companyName}
                    </p>
                    <p className="mt-1 text-slate-500 tabular-nums">
                      Order: {review.orderVolume} · Sample buyer review
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
