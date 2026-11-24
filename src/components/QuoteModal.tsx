import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { BuyerAccount, QuoteRequest, Supplier } from '../types/marketplace';

interface QuoteModalProps {
  supplier: Supplier | null;
  buyer: BuyerAccount | null;
  onClose: () => void;
  onSubmitQuote: (quote: QuoteRequest) => void;
}

export function QuoteModal({
  supplier,
  buyer,
  onClose,
  onSubmitQuote,
}: QuoteModalProps) {
  const [quantity, setQuantity] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState('Chicago, IL');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    if (!supplier) return;
    setQuantity(String(supplier.minOrderQty));
    setNotes('');
    setError('');
    setSubmittedQuote(null);
  }, [supplier]);

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

  if (!supplier) {
    return null;
  }

  const parsedQty = Number(quantity);
  const validQty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 0;
  const estimatedTotal = validQty * supplier.pricePerUnit;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!Number.isFinite(parsedQty) || parsedQty < supplier.minOrderQty) {
      setError(
        `Minimum order quantity for this supplier is ${supplier.minOrderQty} ${supplier.unit}.`
      );
      return;
    }
    if (parsedQty > supplier.availableStock) {
      setError(
        `Requested quantity exceeds current available stock (${supplier.availableStock.toLocaleString()} ${supplier.unit}).`
      );
      return;
    }
    if (!deliveryLocation.trim()) {
      setError('Please enter a factory delivery city or postal code.');
      return;
    }

    const newQuote: QuoteRequest = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      materialName: supplier.materialName,
      quantity: parsedQty,
      unit: supplier.unit,
      unitPrice: supplier.pricePerUnit,
      estimatedTotal,
      deliveryLocation: deliveryLocation.trim(),
      notes: notes.trim(),
      submittedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSubmitQuote(newQuote);
    setSubmittedQuote(newQuote);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-400">
              Request for Quote (Sample Prototype)
            </p>
            <h2
              id="quote-modal-title"
              className="mt-1 text-xl font-bold text-white"
            >
              {supplier.name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              {supplier.materialName} · {supplier.qualityGrade}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quote modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submittedQuote ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="font-semibold">
                  RFQ #{submittedQuote.id} Confirmed — Preparing Supplier Quote
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {supplier.name} typically responds within {supplier.responseTimeHours}{' '}
                hours. This inquiry has been saved to your current session account.
              </p>
            </div>

            <dl className="space-y-2.5 border-y border-slate-800 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Quantity</dt>
                <dd className="font-mono font-medium text-white tabular-nums">
                  {submittedQuote.quantity.toLocaleString()} {submittedQuote.unit}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Estimated Material Total</dt>
                <dd className="font-mono font-semibold text-emerald-400 tabular-nums">
                  ${submittedQuote.estimatedTotal.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Delivery Destination</dt>
                <dd className="text-slate-200">{submittedQuote.deliveryLocation}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Return to Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {buyer && (
              <p className="text-xs text-slate-400">
                Submitting as{' '}
                <span className="font-medium text-slate-200">
                  {buyer.fullName} ({buyer.companyName})
                </span>
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="quote-qty"
                  className="block text-xs font-medium text-slate-300"
                >
                  Order Quantity ({supplier.unit})
                </label>
                <input
                  id="quote-qty"
                  type="number"
                  min={supplier.minOrderQty}
                  max={supplier.availableStock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2.5 font-mono text-sm text-white tabular-nums focus:border-emerald-400 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-500 tabular-nums">
                  MOQ: {supplier.minOrderQty} {supplier.unit} · Stock:{' '}
                  {supplier.availableStock.toLocaleString()} {supplier.unit}
                </p>
              </div>

              <div>
                <label
                  htmlFor="quote-location"
                  className="block text-xs font-medium text-slate-300"
                >
                  Factory Delivery Location
                </label>
                <input
                  id="quote-location"
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="City, State"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-notes"
                className="block text-xs font-medium text-slate-300"
              >
                Tolerance, Packaging, or Delivery Notes (Optional)
              </label>
              <textarea
                id="quote-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include mill test certificate needs, pallet dimensions, or dock receiving hours..."
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between border-y border-slate-800 py-3.5 text-sm">
              <span className="text-slate-400">
                Estimated material subtotal (Ex-Works)
              </span>
              <span className="font-mono text-lg font-semibold text-white tabular-nums">
                ${estimatedTotal.toLocaleString()}
              </span>
            </div>

            {error && (
              <p className="text-xs font-medium text-amber-400" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                Submit Quote Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
