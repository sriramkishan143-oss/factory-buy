import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeftRight, Check, Star, X } from 'lucide-react';
import { CustomerReview, Supplier } from '../types/marketplace';
import { MaterialImage } from './MaterialImage';
import { StarRating } from './StarRating';

interface SupplierDetailModalProps {
  supplier: Supplier | null;
  reviews: CustomerReview[];
  isSelectedForCompare: boolean;
  onClose: () => void;
  onToggleCompare: (supplierId: string) => void;
  onRequestQuote: (supplier: Supplier) => void;
  onAddReview: (
    supplierId: string,
    review: Omit<CustomerReview, 'id' | 'supplierId' | 'date' | 'verifiedDelivery'>
  ) => void;
}

export function SupplierDetailModal({
  supplier,
  reviews,
  isSelectedForCompare,
  onClose,
  onToggleCompare,
  onRequestQuote,
  onAddReview,
}: SupplierDetailModalProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Procurement Manager');
  const [orderVolume, setOrderVolume] = useState('10 MT');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!supplier) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [supplier, onClose]);

  useEffect(() => {
    setShowReviewForm(false);
    setFormError('');
  }, [supplier?.id]);

  if (!supplier) {
    return null;
  }

  const supplierReviews = reviews.filter((r) => r.supplierId === supplier.id);

  const handleSubmitReview = (event: FormEvent) => {
    event.preventDefault();
    if (!reviewerName.trim() || !companyName.trim() || comment.trim().length < 10) {
      setFormError(
        'Please enter your name, company name, and a review of at least 10 characters.'
      );
      return;
    }

    onAddReview(supplier.id, {
      reviewerName: reviewerName.trim(),
      companyName: companyName.trim(),
      role: role.trim() || 'Buyer',
      orderVolume: orderVolume.trim() || `${supplier.minOrderQty} ${supplier.unit}`,
      rating,
      comment: comment.trim(),
    });

    setReviewerName('');
    setCompanyName('');
    setComment('');
    setRating(5);
    setFormError('');
    setShowReviewForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="supplier-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-800 bg-[#0F172A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image & title */}
        <div className="relative h-52 w-full overflow-hidden bg-[#0B1221] sm:h-60">
          <MaterialImage
            src={supplier.imageUrl}
            alt={supplier.imageAlt}
            fallbackLabel={supplier.materialName}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close supplier details"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-[#090F1B]/85 text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="absolute bottom-5 left-6 right-6">
            <p className="text-xs text-slate-300">
              <span className="font-medium text-emerald-400">{supplier.category}</span>
              <span aria-hidden="true"> · </span>
              <span>{supplier.location}</span>
              <span aria-hidden="true"> · </span>
              <span>Sample prototype listing</span>
            </p>
            <h2
              id="supplier-detail-title"
              className="mt-1 text-2xl font-bold text-white sm:text-3xl"
            >
              {supplier.name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-300">{supplier.materialName}</p>
          </div>
        </div>

        {/* Main body */}
        <div className="p-6">
          <p className="text-sm leading-relaxed text-slate-300">
            {supplier.summary}
          </p>

          {/* Key metrics grid */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-800 py-5 sm:grid-cols-4">
            <div>
              <dt className="text-xs text-slate-400">Unit price</dt>
              <dd className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
                ${supplier.pricePerUnit.toLocaleString()}
                <span className="text-xs font-normal text-slate-400">
                  /{supplier.unit}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Delivery time</dt>
              <dd className="mt-1 font-mono text-base font-semibold text-slate-100 tabular-nums">
                {supplier.deliveryDaysMin}–{supplier.deliveryDaysMax} days
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">On-time dispatch</dt>
              <dd className="mt-1 font-mono text-base font-semibold text-emerald-400 tabular-nums">
                {supplier.onTimeDeliveryRate}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Available stock</dt>
              <dd className="mt-1 font-mono text-base font-semibold text-slate-100 tabular-nums">
                {supplier.availableStock.toLocaleString()} {supplier.unit}
              </dd>
            </div>
          </dl>

          {/* Quality & compliance details */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Quality &amp; Material Specifications
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Material Grade</dt>
                  <dd className="text-right font-medium text-slate-100">
                    {supplier.qualityGrade}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Certifications</dt>
                  <dd className="text-right font-medium text-slate-100">
                    {supplier.certifications.join(', ')}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Defect-Free Lot Rate</dt>
                  <dd className="font-mono font-medium text-emerald-400 tabular-nums">
                    {supplier.defectFreeRate}%
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Fulfillment &amp; Operations
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Minimum Order Qty</dt>
                  <dd className="font-mono font-medium text-slate-100 tabular-nums">
                    {supplier.minOrderQty} {supplier.unit}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Average Quote Response</dt>
                  <dd className="font-mono font-medium text-slate-100 tabular-nums">
                    Under {supplier.responseTimeHours} hrs
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Dispatch Facility</dt>
                  <dd className="text-right font-medium text-slate-100">
                    {supplier.location} ({supplier.region})
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Primary actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onRequestQuote(supplier)}
              className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap"
            >
              Request Quote
            </button>
            <button
              type="button"
              onClick={() => onToggleCompare(supplier.id)}
              className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isSelectedForCompare
                  ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white'
              }`}
            >
              {isSelectedForCompare ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Added to Comparison</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                  <span>Compare Supplier</span>
                </>
              )}
            </button>
          </div>

          {/* Customer Reviews section inside modal */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Verified Buyer Reviews
                </h3>
                <div className="mt-1">
                  <StarRating
                    rating={supplier.rating}
                    reviewCount={supplier.reviewCount}
                    size="md"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm((prev) => !prev)}
                className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/70 hover:text-emerald-300 whitespace-nowrap"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mt-5 space-y-4 rounded-lg border border-slate-800 bg-[#0B1221] p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="review-name"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Your Name
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Jordan Patel"
                      className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="review-company"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Factory / Company Name
                    </label>
                    <input
                      id="review-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Precision Metalworks LLC"
                      className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="review-role"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Role
                    </label>
                    <input
                      id="review-role"
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="review-volume"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Order Volume
                    </label>
                    <input
                      id="review-volume"
                      type="text"
                      value={orderVolume}
                      onChange={(e) => setOrderVolume(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-300">
                      Rating
                    </span>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          aria-label={`Rate ${starValue} out of 5 stars`}
                          className="p-1"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              starValue <= rating
                                ? 'fill-emerald-400 text-emerald-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Material Quality &amp; Delivery Experience
                  </label>
                  <textarea
                    id="review-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share material consistency, packaging quality, and delivery punctuality..."
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-medium text-amber-400" role="alert">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 divide-y divide-slate-800/80">
              {supplierReviews.length === 0 ? (
                <p className="py-4 text-sm text-slate-400">
                  No written buyer reviews yet for this sample supplier. Use &ldquo;Write a Review&rdquo; above to add the first review.
                </p>
              ) : (
                supplierReviews.map((review) => (
                  <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-white">
                          {review.reviewerName}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>
                          {review.role}, {review.companyName}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-slate-500 tabular-nums">
                      Order volume: {review.orderVolume} · {review.date}
                      {review.verifiedDelivery ? ' · Verified sample delivery' : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
