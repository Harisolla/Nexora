/**
 * NEXORA — ShopPage
 * Luxury Editorial Archive & Catalogue
 * Features:
 * - Architectural header with live collection statistics
 * - Curated horizontal discipline pills (quick category switching)
 * - Sticky blurred utility toolbar with instant search, sort, and grid density toggles
 * - Slide-out off-canvas luxury filter drawer (categories, price presets, rating)
 * - Active filter tags with 1-click removal
 * - Framer Motion animated product grid reflow (editorial 3-col vs catalog 4-col)
 * - Visual collection progress tracker with smooth pagination
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Search,
  X,
  LayoutGrid,
  Grid3X3,
  Sparkles,
  ChevronDown
} from 'lucide-react';

import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { fetchCategories } from '../services/productService';
import PageTransition from '../components/animations/PageTransition';

// ─── Primary Curated Category Disciplines ─────────────────────────────────────
const CURATED_CATEGORIES = [
  { slug: '', name: 'All Objects' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'fragrances', name: 'Fragrances' },
  { slug: 'home-decoration', name: 'Home Decor' },
  { slug: 'mens-watches', name: 'Watches' },
  { slug: 'sunglasses', name: 'Eyewear' },
  { slug: 'kitchen-accessories', name: 'Kitchen' },
  { slug: 'laptops', name: 'Technology' },
];

// ─── Price Preset Options ────────────────────────────────────────────────────
const PRICE_PRESETS = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $50', min: '', max: '50' },
  { label: '$50 – $150', min: '50', max: '150' },
  { label: '$150 – $300', min: '150', max: '300' },
  { label: '$300+', min: '300', max: '' },
];

// ─── Sort Options ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'default', label: 'Featured / Curated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Customer Rating' },
  { value: 'name-asc', label: 'Alphabetical: A–Z' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ─── Filter & Search State ─────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('minPrice') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') ? Number(searchParams.get('rating')) : 0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');
  const [rawSearch, setRawSearch] = useState(searchParams.get('q') || '');
  const [gridDensity, setGridDensity] = useState('compact'); // 'compact' (4 cols) | 'spacious' (3 cols)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');

  const query = useDebounce(rawSearch, 350);

  // ─── Fetch All Categories for Filter Drawer ───────────────────────────────
  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((c) =>
              typeof c === 'string'
                ? { slug: c, name: c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }
                : { slug: c.slug, name: c.name }
            )
          : [];
        setAllCategories(normalized);
      })
      .catch(() => {});
  }, []);

  // ─── Products Hook ────────────────────────────────────────────────────────
  const { products, total, loading, loadingMore, error, hasMore, loadMore } =
    useProducts({ category: activeCategory, query, sortBy });

  // ─── Client-side Refinements (Price & Rating) ──────────────────────────────
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      const min = priceMin !== '' ? parseFloat(priceMin) : null;
      const max = priceMax !== '' ? parseFloat(priceMax) : null;
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      if (minRating > 0 && (p.rating || 0) < minRating) return false;
      return true;
    });
  }, [products, priceMin, priceMax, minRating]);

  // ─── URL Synchronization ──────────────────────────────────────────────────
  const syncUrlParams = useCallback(
    ({ cat = activeCategory, q = rawSearch, s = sortBy, pMin = priceMin, pMax = priceMax, r = minRating } = {}) => {
      const params = {};
      if (cat) params.category = cat;
      if (q) params.q = q;
      if (s && s !== 'default') params.sort = s;
      if (pMin) params.minPrice = pMin;
      if (pMax) params.maxPrice = pMax;
      if (r > 0) params.rating = r.toString();
      setSearchParams(params, { replace: true });
    },
    [activeCategory, rawSearch, sortBy, priceMin, priceMax, minRating, setSearchParams]
  );

  const handleCategorySelect = (slug) => {
    setActiveCategory(slug);
    syncUrlParams({ cat: slug });
  };

  const handleResetFilters = () => {
    setActiveCategory('');
    setPriceMin('');
    setPriceMax('');
    setMinRating(0);
    setRawSearch('');
    setSortBy('default');
    setSearchParams({});
  };

  // ─── Active Filters Count ──────────────────────────────────────────────────
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory) count += 1;
    if (priceMin !== '' || priceMax !== '') count += 1;
    if (minRating > 0) count += 1;
    if (rawSearch) count += 1;
    return count;
  }, [activeCategory, priceMin, priceMax, minRating, rawSearch]);

  const filteredCategoriesList = useMemo(() => {
    if (!categorySearch.trim()) return allCategories;
    return allCategories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [allCategories, categorySearch]);

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          paddingTop: 'calc(64px + 1.5rem)',
          paddingBottom: '6rem',
        }}
      >
        <style>{`
          .shop-category-scroll {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0.5rem 0;
          }
          .shop-category-scroll::-webkit-scrollbar {
            display: none;
          }

          .category-pill-btn {
            padding: 0.55rem 1.15rem;
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            white-space: nowrap;
            transition: all 0.25s ease;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
          }
          .category-pill-btn:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
            background: var(--color-highlight);
          }
          .category-pill-btn.is-active {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: #FAF7F1;
            box-shadow: 0 4px 14px rgba(169, 80, 50, 0.22);
          }

          .shop-toolbar {
            position: sticky;
            top: 64px;
            z-index: 25;
            background: var(--color-bg);
            border-bottom: 1px solid var(--color-border);
            transition: all 0.3s ease;
          }

          .filter-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.3rem 0.75rem;
            background: var(--color-elevated);
            border: 1px solid var(--color-border);
            border-radius: 20px;
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--color-text-primary);
          }
          .filter-chip button {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-text-secondary);
            display: flex;
            align-items: center;
            padding: 1px;
          }
          .filter-chip button:hover {
            color: var(--color-accent);
          }

          .view-toggle-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            background: transparent;
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .view-toggle-btn:hover {
            color: var(--color-text-primary);
            background: var(--color-surface);
          }
          .view-toggle-btn.is-active {
            background: var(--color-elevated);
            color: var(--color-accent);
            border-color: var(--color-accent);
          }
        `}</style>

        {/* ── 1. Architectural Header ── */}
        <header
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '2rem clamp(1.25rem, 4vw, 3rem) 2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '0.6rem',
                }}
              >
                <span className="section-label" style={{ margin: 0 }}>
                  ARCHIVE & CATALOGUE
                </span>
                <span style={{ color: 'var(--color-border)' }}>/</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  ALL DISCIPLINES
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                Objects for Living
              </h1>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '1rem',
                  marginTop: '0.75rem',
                  maxWidth: '56ch',
                  lineHeight: 1.6,
                }}
              >
                A continuous survey of modern industrial craft, functional design editions, and essential daily objects.
              </p>
            </div>

            {/* Total Objects Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.15rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Sparkles size={13} color="var(--color-accent)" />
              <span>
                {loading ? 'Curating Archive…' : `${visibleProducts.length} of ${total} Objects`}
              </span>
            </div>
          </div>

          {/* ── Curated Category Discipline Pills ── */}
          <div style={{ marginTop: '2.5rem' }}>
            <div className="shop-category-scroll" role="tablist" aria-label="Curated Categories">
              {CURATED_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    role="tab"
                    aria-selected={isActive}
                    className={`category-pill-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ── 2. Sticky Control Toolbar ── */}
        <div className="shop-toolbar">
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0.9rem clamp(1.25rem, 4vw, 3rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Left: Filter Trigger Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '2px',
                  fontWeight: 600,
                }}
                aria-label="Open filter drawer"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span
                    style={{
                      background: 'var(--color-accent)',
                      color: '#FAF7F1',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      marginLeft: '0.2rem',
                    }}
                  >
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {activeCategory && (
                    <span className="filter-chip">
                      <span>Category: {activeCategory.replace(/-/g, ' ')}</span>
                      <button onClick={() => handleCategorySelect('')} aria-label="Clear category">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {(priceMin !== '' || priceMax !== '') && (
                    <span className="filter-chip">
                      <span>
                        ${priceMin || '0'} – {priceMax ? `$${priceMax}` : 'Max'}
                      </span>
                      <button
                        onClick={() => {
                          setPriceMin('');
                          setPriceMax('');
                          syncUrlParams({ pMin: '', pMax: '' });
                        }}
                        aria-label="Clear price"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="filter-chip">
                      <span>★ {minRating}+</span>
                      <button
                        onClick={() => {
                          setMinRating(0);
                          syncUrlParams({ r: 0 });
                        }}
                        aria-label="Clear rating"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {rawSearch && (
                    <span className="filter-chip">
                      <span>"{rawSearch}"</span>
                      <button
                        onClick={() => {
                          setRawSearch('');
                          syncUrlParams({ q: '' });
                        }}
                        aria-label="Clear search"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleResetFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-accent)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '0.25rem 0.5rem',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Search + Sort + Density */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              {/* Live Search Field */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-secondary)',
                    pointerEvents: 'none',
                  }}
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search objects…"
                  value={rawSearch}
                  onChange={(e) => {
                    setRawSearch(e.target.value);
                    syncUrlParams({ q: e.target.value });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 2.25rem',
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  aria-label="Search objects"
                />
                {rawSearch && (
                  <button
                    onClick={() => {
                      setRawSearch('');
                      syncUrlParams({ q: '' });
                    }}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                    aria-label="Clear search query"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Sort Select */}
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    syncUrlParams({ s: e.target.value });
                  }}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    padding: '0.55rem 2.2rem 0.55rem 1rem',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label="Sort objects by"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--color-text-secondary)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* View Density Switcher (Desktop) */}
              <div
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
                className="desktop-density-switch"
              >
                <button
                  onClick={() => setGridDensity('spacious')}
                  className={`view-toggle-btn ${gridDensity === 'spacious' ? 'is-active' : ''}`}
                  title="Spacious Editorial View (3 Columns)"
                  aria-label="Spacious 3-column view"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setGridDensity('compact')}
                  className={`view-toggle-btn ${gridDensity === 'compact' ? 'is-active' : ''}`}
                  title="Compact Catalog View (4 Columns)"
                  aria-label="Compact 4-column view"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Main Product Grid Section ── */}
        <main
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '3rem clamp(1.25rem, 4vw, 3rem)',
          }}
        >
          {error ? (
            <EmptyState
              title="Catalogue Error"
              description={error}
              actionLabel="Reload Archive"
              onAction={() => window.location.reload()}
            />
          ) : loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  gridDensity === 'spacious'
                    ? 'repeat(auto-fill, minmax(310px, 1fr))'
                    : 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: gridDensity === 'spacious' ? '2.5rem' : '1.75rem',
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div style={{ padding: '5rem 0' }}>
              <EmptyState
                title="No Objects Match Your Criteria"
                description="Try loosening your filters, adjusting the price boundaries, or exploring other disciplines."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            </div>
          ) : (
            <>
              {/* Product Grid with Framer Motion Reflow */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    gridDensity === 'spacious'
                      ? 'repeat(auto-fill, minmax(310px, 1fr))'
                      : 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: gridDensity === 'spacious' ? '2.5rem' : '1.75rem',
                }}
              >
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ── 4. Pagination / Load More ── */}
              <div
                style={{
                  marginTop: '5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem',
                }}
              >
                {/* Visual Progress Bar */}
                <div style={{ width: '240px', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span>Archive Explored</span>
                    <span>{Math.min(100, Math.round((visibleProducts.length / (total || 1)) * 100))}%</span>
                  </div>
                  <div
                    style={{
                      height: '3px',
                      background: 'var(--color-border)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, Math.round((visibleProducts.length / (total || 1)) * 100))}%`,
                        background: 'var(--color-accent)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="btn-secondary"
                    style={{
                      minWidth: '200px',
                      padding: '0.9rem 2rem',
                      borderRadius: '2px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {loadingMore ? 'Retrieving Objects…' : 'Load More Objects'}
                  </button>
                )}
              </div>
            </>
          )}
        </main>

        {/* ── 5. Slide-Out Luxury Filter Drawer ── */}
        <AnimatePresence>
          {filterDrawerOpen && (
            <>
              {/* Dimmed Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFilterDrawerOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 60,
                  backgroundColor: 'rgba(37, 27, 22, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                aria-hidden="true"
              />

              {/* Side Panel Drawer */}
              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-label="Filter archive"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 'min(440px, 92vw)',
                  zIndex: 70,
                  background: 'var(--color-surface)',
                  borderLeft: '1px solid var(--color-border)',
                  boxShadow: '-12px 0 50px rgba(53, 39, 32, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Drawer Header */}
                <div
                  style={{
                    padding: '1.75rem 2rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="section-label" style={{ margin: 0 }}>
                      SPECIFICATION
                    </span>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        margin: '0.2rem 0 0',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Filter Archive
                    </h2>
                  </div>

                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="icon-btn"
                    aria-label="Close filter drawer"
                    style={{
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-elevated)',
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Scrollable Body */}
                <div
                  style={{
                    padding: '2rem',
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2.5rem',
                  }}
                >
                  {/* Category Filter Section */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.78rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          margin: 0,
                        }}
                      >
                        Category Discipline
                      </h3>
                      {activeCategory && (
                        <button
                          onClick={() => handleCategorySelect('')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-accent)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Category Search Input */}
                    <input
                      type="text"
                      placeholder="Search disciplines…"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.78rem',
                        borderRadius: '2px',
                        background: 'var(--color-elevated)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.85rem',
                        outline: 'none',
                      }}
                    />

                    {/* Categories Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }}>
                      <button
                        onClick={() => handleCategorySelect('')}
                        className={`category-pill-btn ${!activeCategory ? 'is-active' : ''}`}
                        style={{ fontSize: '0.72rem', padding: '0.4rem 0.85rem' }}
                      >
                        All Categories
                      </button>
                      {filteredCategoriesList.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        return (
                          <button
                            key={cat.slug}
                            onClick={() => handleCategorySelect(cat.slug)}
                            className={`category-pill-btn ${isActive ? 'is-active' : ''}`}
                            style={{ fontSize: '0.72rem', padding: '0.4rem 0.85rem' }}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range Filter Section */}
                  <div>
                    <h3
                      style={{
                        fontSize: '0.78rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      Price Range ($ USD)
                    </h3>

                    {/* Presets */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                      {PRICE_PRESETS.map((preset) => {
                        const isPresetActive = priceMin === preset.min && priceMax === preset.max;
                        return (
                          <button
                            key={preset.label}
                            onClick={() => {
                              setPriceMin(preset.min);
                              setPriceMax(preset.max);
                              syncUrlParams({ pMin: preset.min, pMax: preset.max });
                            }}
                            className={`category-pill-btn ${isPresetActive ? 'is-active' : ''}`}
                            style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Manual Min/Max Inputs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                          Min Price
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={priceMin}
                          onChange={(e) => {
                            setPriceMin(e.target.value);
                            syncUrlParams({ pMin: e.target.value });
                          }}
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            fontSize: '0.82rem',
                            borderRadius: '2px',
                            background: 'var(--color-elevated)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <span style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>–</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                          Max Price
                        </span>
                        <input
                          type="number"
                          placeholder="No limit"
                          value={priceMax}
                          onChange={(e) => {
                            setPriceMax(e.target.value);
                            syncUrlParams({ pMax: e.target.value });
                          }}
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            fontSize: '0.82rem',
                            borderRadius: '2px',
                            background: 'var(--color-elevated)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter Section */}
                  <div>
                    <h3
                      style={{
                        fontSize: '0.78rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      Customer Excellence
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Any Rating', val: 0 },
                        { label: '★ 4.5 & up', val: 4.5 },
                        { label: '★ 4.0 & up', val: 4.0 },
                      ].map((r) => {
                        const isActive = minRating === r.val;
                        return (
                          <button
                            key={r.label}
                            onClick={() => {
                              setMinRating(r.val);
                              syncUrlParams({ r: r.val });
                            }}
                            className={`category-pill-btn ${isActive ? 'is-active' : ''}`}
                            style={{ fontSize: '0.72rem', padding: '0.4rem 0.85rem' }}
                          >
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div
                  style={{
                    padding: '1.5rem 2rem',
                    borderTop: '1px solid var(--color-border)',
                    background: 'var(--color-elevated)',
                    display: 'flex',
                    gap: '1rem',
                  }}
                >
                  <button
                    onClick={handleResetFilters}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.85rem 1rem', fontSize: '0.78rem', borderRadius: '2px' }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="btn-primary"
                    style={{ flex: 2, padding: '0.85rem 1rem', fontSize: '0.78rem', borderRadius: '2px' }}
                  >
                    View {visibleProducts.length} Objects
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <style>{`
          @media (min-width: 960px) {
            .desktop-density-switch {
              display: flex !important;
            }
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
