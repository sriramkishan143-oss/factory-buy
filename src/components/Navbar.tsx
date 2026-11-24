import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BuyerAccount } from '../types/marketplace';

interface NavbarProps {
  buyer: BuyerAccount | null;
  compareCount: number;
  onOpenLogin: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({
  buyer,
  compareCount,
  onOpenLogin,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'marketplace', label: 'Marketplace' },
    {
      id: 'compare',
      label: compareCount > 0 ? `Compare (${compareCount})` : 'Compare',
    },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090F1B]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(false);
          }}
          className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          Factory<span className="text-emerald-400">Buy</span>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleLinkClick(link.id)}
              className="py-1 text-slate-300 transition-colors duration-150 hover:text-white underline-offset-8 hover:underline decoration-emerald-400/80 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenLogin}
            className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors duration-150 hover:bg-emerald-400 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            {buyer ? buyer.companyName : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-800 text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-800/60 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#0D1628] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className="flex min-h-[44px] w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800/70 hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              {buyer ? `Account: ${buyer.companyName}` : 'Sign In to Buyer Portal'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
