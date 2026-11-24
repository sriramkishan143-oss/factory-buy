import { FormEvent, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpDown, Search, X } from 'lucide-react';
import { ComparisonTable } from './components/ComparisonTable';
import { LoginModal } from './components/LoginModal';
import { MaterialImage } from './components/MaterialImage';
import { Navbar } from './components/Navbar';
import { QuoteModal } from './components/QuoteModal';
import { ReviewsSection } from './components/ReviewsSection';
import { SupplierCard } from './components/SupplierCard';
import { SupplierDetailModal } from './components/SupplierDetailModal';
import {
  HERO_WAREHOUSE_IMAGE,
  INITIAL_REVIEWS,
  INITIAL_SUPPLIERS,
  MATERIAL_CATEGORIES,
} from './data/suppliers';
import {
  BuyerAccount,
  CategoryFilter,
  CustomerReview,
  QuoteRequest,
  SortOption,
  Supplier,
} from './types/marketplace';

const MAX_COMPARE_SUPPLIERS = 3;

export default function App() {
  // Core marketplace state
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  // Search, filter, and sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

  // Side-by-side supplier comparison state (max 3 suppliers)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareFeedback, setCompareFeedback] = useState<string | null>(null);

  // Interactive modals and buyer workspace state
  const [activeDetailSupplierId, setActiveDetailSupplierId] = useState<string | null>(
    null
  );
  const [quoteSupplier, setQuoteSupplier] = useState<Supplier | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [buyer, setBuyer] = useState<BuyerAccount | null>(null);
  const [submittedQuotes, setSubmittedQuotes] = useState<QuoteRequest[]>([]);

  // Count how many suppliers exist per category for the current search term
  const categoryCounts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const counts: Record<CategoryFilter, number> = {
      All: 0,
      Steel: 0,
      Aluminium: 0,
      Copper: 0,
      Plastic: 0,
      Rubber: 0,
      Cement: 0,
    };

    for (const supplier of suppliers) {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        supplier.materialName.toLowerCase().includes(normalizedQuery) ||
        supplier.name.toLowerCase().includes(normalizedQuery) ||
        supplier.category.toLowerCase().includes(normalizedQuery) ||
        supplier.location.toLowerCase().includes(normalizedQuery) ||
        supplier.region.toLowerCase().includes(normalizedQuery) ||
        supplier.qualityGrade.toLowerCase().includes(normalizedQuery);

      if (matchesSearch) {
        counts.All += 1;
        counts[supplier.category] += 1;
      }
    }

    return counts;
  }, [suppliers, searchQuery]);

  // Filtered and sorted suppliers for the catalog grid
  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matching = suppliers.filter((supplier) => {
      const matchesCategory =
        activeCategory === 'All' || supplier.category === activeCategory;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      return (
        supplier.materialName.toLowerCase().includes(normalizedQuery) ||
        supplier.name.toLowerCase().includes(normalizedQuery) ||
        supplier.category.toLowerCase().includes(normalizedQuery) ||
        supplier.location.toLowerCase().includes(normalizedQuery) ||
        supplier.region.toLowerCase().includes(normalizedQuery) ||
        supplier.qualityGrade.toLowerCase().includes(normalizedQuery)
      );
    });

    return [...matching].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.pricePerUnit - b.pricePerUnit;
        case 'delivery-asc':
          return a.deliveryDaysMin - b.deliveryDaysMin;
        case 'stock-desc':
          return b.availableStock - a.availableStock;
        case 'rating-desc':
        default:
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
      }
    });
  }, [suppliers, searchQuery, activeCategory, sortBy]);

  // Resolve selected suppliers for the side-by-side comparison table
  const comparedSuppliers = useMemo(() => {
    return compareIds
      .map((id) => suppliers.find((s) => s.id === id))
      .filter((s): s is Supplier => Boolean(s));
  }, [compareIds, suppliers]);

  const activeDetailSupplier = useMemo(() => {
    if (!activeDetailSupplierId) return null;
    return suppliers.find((s) => s.id === activeDetailSupplierId) ?? null;
  }, [activeDetailSupplierId, suppliers]);

  const scrollToElement = (elementId: string) => {
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'compare') {
      if (compareIds.length > 0) {
        scrollToElement('compare');
      } else {
        setCompareFeedback(
          'Select up to 3 suppliers using "Compare Supplier" below to generate the side-by-side comparison table.'
        );
        scrollToElement('suppliers');
      }
      return;
    }

    if (sectionId === 'suppliers' || sectionId === 'marketplace') {
      scrollToElement('marketplace');
      return;
    }

    scrollToElement(sectionId);
  };

  const handleHeroSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    scrollToElement('marketplace');
  };

  const handleToggleCompare = (supplierId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(supplierId)) {
        setCompareFeedback(null);
        return prev.filter((id) => id !== supplierId);
      }

      if (prev.length >= MAX_COMPARE_SUPPLIERS) {
        setCompareFeedback(
          'You can compare up to 3 suppliers at once. Remove one supplier from your comparison to add another.'
        );
        return prev;
      }

      setCompareFeedback(null);
      return [...prev, supplierId];
    });
  };

  const handleRemoveFromCompare = (supplierId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== supplierId));
    setCompareFeedback(null);
  };

  const handleClearCompare = () => {
    setCompareIds([]);
    setCompareFeedback(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setSortBy('rating-desc');
  };

  const handleAddReview = (
    supplierId: string,
    newReviewInput: Omit<
      CustomerReview,
      'id' | 'supplierId' | 'date' | 'verifiedDelivery'
    >
  ) => {
    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      supplierId,
      ...newReviewInput,
      date: 'November 2026',
      verifiedDelivery: true,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate supplier rating and increment review count immediately
    setSuppliers((prev) =>
      prev.map((supplier) => {
        if (supplier.id !== supplierId) return supplier;
        const nextCount = supplier.reviewCount + 1;
        const nextRating = Number(
          (
            (supplier.rating * supplier.reviewCount + newReviewInput.rating) /
            nextCount
          ).toFixed(1)
        );
        return {
          ...supplier,
          rating: nextRating,
          reviewCount: nextCount,
        };
      })
    );
  };

  const handleSubmitQuote = (quote: QuoteRequest) => {
    setSubmittedQuotes((prev) => [quote, ...prev]);
  };

  const totalInventoryTons = useMemo(
    () => suppliers.reduce((sum, s) => sum + s.availableStock, 0),
    [suppliers]
  );

  const avgOnTimeRate = useMemo(() => {
    const sum = suppliers.reduce((acc, s) => acc + s.onTimeDeliveryRate, 0);
    return Math.round(sum / suppliers.length);
  }, [suppliers]);

  return (
    <div id="top" className="min-h-screen bg-[#090F1B] text-slate-100">
      <Navbar
        buyer={buyer}
        compareCount={compareIds.length}
        onOpenLogin={() => setLoginModalOpen(true)}
        onNavigate={handleNavigate}
      />

      <main>
        {/* Hero Section: Balanced 2-column split on desktop */}
        <section className="border-b border-slate-800/80 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* Left focal column */}
              <div className="flex flex-col justify-center lg:col-span-6">
                <p className="text-xs font-medium text-emerald-400">
                  Industrial Raw-Material Procurement Marketplace · Prototype Sample Catalog
                </p>

                <h1 className="mt-3 max-w-xl text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl">
                  Source and compare verified industrial suppliers with confidence.
                </h1>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                  Built for small factories and manufacturers. Compare steel, aluminium, copper, plastic, rubber, and cement suppliers side by side on price, grade, ratings, lead times, and live stock.
                </p>

                {/* Smart Search Bar */}
                <form
                  onSubmit={handleHeroSearchSubmit}
                  role="search"
                  aria-label="Search industrial materials and suppliers"
                  className="mt-7 w-full max-w-xl"
                >
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <div className="relative flex-1">
                      <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        id="smart-search-input"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search material, supplier, grade, or city..."
                        className="min-h-[46px] w-full rounded-lg border border-slate-700 bg-[#0F172A] pl-10 pr-10 text-sm text-white placeholder-slate-400 transition-colors focus:border-emerald-400 focus:outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search query"
                          className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap shrink-0"
                    >
                      Search Suppliers
                    </button>
                  </div>

                  {/* Quick example queries */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                    <span>Try:</span>
                    {['Steel', 'Copper', 'Pittsburgh', '6061-T6', 'Cement'].map(
                      (term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            setActiveCategory('All');
                            scrollToElement('marketplace');
                          }}
                          className="text-slate-300 underline decoration-slate-700 underline-offset-4 transition-colors hover:text-emerald-400 hover:decoration-emerald-400"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </form>
              </div>

              {/* Right architectural media column */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A] lg:aspect-auto lg:h-full lg:min-h-[360px]">
                  <MaterialImage
                    src={HERO_WAREHOUSE_IMAGE}
                    alt="Modern industrial raw materials warehouse stocked with precision cold-rolled steel coils and brushed aluminium ingots"
                    fallbackLabel="FactoryBuy Industrial Supply Network"
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090F1B]/85 via-[#090F1B]/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-emerald-400">
                        Direct Mill &amp; Distributor Stock
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        Mill certificates, verified grades, and transparent ex-works pricing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width 4-column procurement metrics strip below hero split */}
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-800/80 pt-8 lg:grid-cols-4">
              <div>
                <dt className="text-xs text-slate-400">Sample Verified Suppliers</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  {suppliers.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Raw Material Categories</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  {MATERIAL_CATEGORIES.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Ready Inventory (Sample)</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-emerald-400 tabular-nums">
                  {totalInventoryTons.toLocaleString()} MT
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Avg. On-Time Delivery</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                  {avgOnTimeRate}%
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Dynamic Supplier Comparison Table — mounts only when 1–3 suppliers are selected */}
        <ComparisonTable
          suppliers={comparedSuppliers}
          onRemoveSupplier={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          onRequestQuote={(supplier) => setQuoteSupplier(supplier)}
          onOpenDetails={(supplier) => setActiveDetailSupplierId(supplier.id)}
        />

        {/* Marketplace Catalog & Category Filtering */}
        <section
          id="marketplace"
          aria-labelledby="marketplace-heading"
          className="scroll-mt-20 py-14"
        >
          <div
            id="suppliers"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-400">
                  Industrial Material Directory · Prototype Sample Data
                </p>
                <h2
                  id="marketplace-heading"
                  className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  Browse &amp; Filter Raw-Material Suppliers
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Filter by raw material category, sort by price or lead time, and select up to three suppliers for side-by-side comparison.
                </p>
              </div>

              {/* Sort control */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <label
                  htmlFor="supplier-sort"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sort by</span>
                </label>
                <select
                  id="supplier-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="min-h-[40px] rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-xs font-medium text-slate-100 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="delivery-asc">Fastest Delivery</option>
                  <option value="stock-desc">Highest Stock</option>
                </select>
              </div>
            </div>

            {/* Category filter bar */}
            <div
              className="mt-7 flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter suppliers by material category"
            >
              {(['All', ...MATERIAL_CATEGORIES] as CategoryFilter[]).map(
                (category) => {
                  const isActive = activeCategory === category;
                  const count = categoryCounts[category];
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={isActive}
                      className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                        isActive
                          ? 'bg-emerald-500 font-semibold text-slate-950'
                          : 'border border-slate-800 bg-[#0F172A] text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <span>{category === 'All' ? 'All Materials' : category}</span>
                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          isActive ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {/* Active filters & shortlist status strip */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-slate-800/80 py-3.5 text-xs">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
                <span className="font-mono text-slate-200 tabular-nums">
                  Showing {filteredSuppliers.length} of {suppliers.length} suppliers
                </span>
                {activeCategory !== 'All' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Category:{' '}
                      <strong className="font-medium text-white">
                        {activeCategory}
                      </strong>
                    </span>
                  </>
                )}
                {searchQuery.trim() && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Query:{' '}
                      <strong className="font-medium text-white">
                        &ldquo;{searchQuery.trim()}&rdquo;
                      </strong>
                    </span>
                  </>
                )}
                {(activeCategory !== 'All' || searchQuery.trim() !== '') && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="font-medium text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {comparedSuppliers.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-emerald-400 tabular-nums">
                    {comparedSuppliers.length} / {MAX_COMPARE_SUPPLIERS} selected for comparison
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToElement('compare')}
                    className="inline-flex items-center gap-1 font-semibold text-white underline decoration-emerald-400 underline-offset-4 hover:text-emerald-300"
                  >
                    <span>Jump to Table</span>
                    <ArrowDown className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Contextual feedback banner for comparison limit or guidance */}
            {compareFeedback && (
              <div
                role="status"
                className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200"
              >
                <span>{compareFeedback}</span>
                <button
                  type="button"
                  onClick={() => setCompareFeedback(null)}
                  aria-label="Dismiss notice"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-amber-200 hover:bg-amber-500/20"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Supplier Grid or Helpful Empty State */}
            {filteredSuppliers.length === 0 ? (
              <div className="mt-8 rounded-xl border border-slate-800 bg-[#0F172A] px-6 py-14 text-center">
                <h3 className="text-lg font-semibold text-white">
                  No matching suppliers found
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  We could not find any industrial suppliers matching{' '}
                  {searchQuery.trim()
                    ? `"${searchQuery.trim()}"`
                    : 'your current filter'}
                  {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}. Try a broader material name, another city, or clear your filters.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                  >
                    Reset Search &amp; Filters
                  </button>
                  {activeCategory !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setActiveCategory('All')}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
                    >
                      Search Across All Categories
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    isSelectedForCompare={compareIds.includes(supplier.id)}
                    compareLimitReached={
                      compareIds.length >= MAX_COMPARE_SUPPLIERS
                    }
                    onToggleCompare={handleToggleCompare}
                    onOpenDetails={(item) => setActiveDetailSupplierId(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Supplier Ratings & Verified Customer Reviews */}
        <ReviewsSection
          suppliers={suppliers}
          reviews={reviews}
          onOpenSupplier={(supplier) => setActiveDetailSupplierId(supplier.id)}
        />
      </main>

      {/* Clean Industrial Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070C16] py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-display text-lg font-bold text-white">
              Factory<span className="text-emerald-400">Buy</span>
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-400">
              Industrial raw-material procurement prototype. All supplier profiles, pricing, stock quantities, ratings, and reviews shown are sample demonstration data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => handleNavigate('marketplace')}
              className="transition-colors hover:text-white"
            >
              Marketplace
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('compare')}
              className="transition-colors hover:text-white"
            >
              Compare Suppliers
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('reviews')}
              className="transition-colors hover:text-white"
            >
              Buyer Reviews
            </button>
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="transition-colors hover:text-white"
            >
              Buyer Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <SupplierDetailModal
        supplier={activeDetailSupplier}
        reviews={reviews}
        isSelectedForCompare={
          activeDetailSupplier
            ? compareIds.includes(activeDetailSupplier.id)
            : false
        }
        onClose={() => setActiveDetailSupplierId(null)}
        onToggleCompare={handleToggleCompare}
        onRequestQuote={(supplier) => {
          setActiveDetailSupplierId(null);
          setQuoteSupplier(supplier);
        }}
        onAddReview={handleAddReview}
      />

      <QuoteModal
        supplier={quoteSupplier}
        buyer={buyer}
        onClose={() => setQuoteSupplier(null)}
        onSubmitQuote={handleSubmitQuote}
      />

      <LoginModal
        isOpen={loginModalOpen}
        buyer={buyer}
        submittedQuotes={submittedQuotes}
        onClose={() => setLoginModalOpen(false)}
        onLogin={(account) => setBuyer(account)}
        onLogout={() => setBuyer(null)}
      />
    </div>
  );
}
