import { FormEvent, useEffect, useState } from 'react';
import { LogOut, X } from 'lucide-react';
import { BuyerAccount, QuoteRequest } from '../types/marketplace';

interface LoginModalProps {
  isOpen: boolean;
  buyer: BuyerAccount | null;
  submittedQuotes: QuoteRequest[];
  onClose: () => void;
  onLogin: (account: BuyerAccount) => void;
  onLogout: () => void;
}

export function LoginModal({
  isOpen,
  buyer,
  submittedQuotes,
  onClose,
  onLogin,
  onLogout,
}: LoginModalProps) {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid business email address.');
      return;
    }
    if (password.trim().length < 4) {
      setError('Please enter a password of at least 4 characters.');
      return;
    }

    onLogin({
      fullName: fullName.trim() || 'Procurement Buyer',
      companyName: companyName.trim() || 'Industrial Manufacturing Co.',
      email: email.trim(),
      role: 'Verified Buyer (Prototype)',
    });
    setError('');
    setPassword('');
    onClose();
  };

  const handleDemoLogin = () => {
    onLogin({
      fullName: 'Arjun Mehta',
      companyName: 'Mehta Precision Works',
      email: 'procurement@mehtaprecision.example',
      role: 'Head of Procurement (Sample Account)',
    });
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-400">
              FactoryBuy Buyer Portal
            </p>
            <h2
              id="login-modal-title"
              className="mt-1 text-xl font-bold text-white"
            >
              {buyer ? 'Buyer Workspace Account' : 'Sign In to FactoryBuy'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {buyer ? (
          <div className="mt-6 space-y-5">
            <dl className="space-y-2.5 border-y border-slate-800 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Name</dt>
                <dd className="font-medium text-white">{buyer.fullName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Company</dt>
                <dd className="font-medium text-slate-200">{buyer.companyName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Business Email</dt>
                <dd className="text-slate-300">{buyer.email}</dd>
              </div>
            </dl>

            <div>
              <h3 className="text-xs font-semibold text-slate-300">
                Session Quote Requests ({submittedQuotes.length})
              </h3>
              {submittedQuotes.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400">
                  No quote requests submitted yet. Compare suppliers and click Request Quote to log an RFQ here.
                </p>
              ) : (
                <ul className="mt-2 max-h-44 space-y-2 overflow-y-auto">
                  {submittedQuotes.map((quote) => (
                    <li
                      key={quote.id}
                      className="rounded-lg border border-slate-800 bg-[#0B1221] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white">
                          #{quote.id} · {quote.supplierName}
                        </span>
                        <span className="font-mono text-emerald-400 tabular-nums">
                          ${quote.estimatedTotal.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-400 tabular-nums">
                        {quote.materialName} · {quote.quantity} {quote.unit} ·{' '}
                        {quote.deliveryLocation}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <p className="text-xs leading-relaxed text-slate-400">
              Sign in to manage factory RFQs and save procurement shortlists. Prototype mode runs locally in your browser.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="login-name"
                  className="block text-xs font-medium text-slate-300"
                >
                  Full Name
                </label>
                <input
                  id="login-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="login-company"
                  className="block text-xs font-medium text-slate-300"
                >
                  Factory / Company
                </label>
                <input
                  id="login-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Rivera Fabrication"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-slate-300"
              >
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@factory.com"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090F1B] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-amber-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex min-h-[42px] w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Sign In
            </button>

            <div className="border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="inline-flex min-h-[42px] w-full items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/70 hover:text-emerald-300"
              >
                Continue with Demo Buyer Account (Mehta Precision Works)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
