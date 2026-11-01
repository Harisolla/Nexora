/**
 * NEXORA — SearchOverlay Component
 * Full-screen animated search overlay with debounced API search,
 * keyboard navigation, focus trap, and accessible result list.
 */
import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Loader2, AlertCircle, CornerDownLeft, Sparkles } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchProducts } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';

// ── Popular searches for idle discovery ───────────────────────────────────────
const POPULAR_SEARCHES = [
  'Watches',
  'Fragrances',
  'Furniture',
  'Home Decor',
  'Laptops',
  'Beauty',
  'Sunglasses',
  'Lighting',
];

// ── Animation variants ────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -8,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// ── Skeleton row for search loading state ─────────────────────────────────────
function SearchSkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 0',
      }}
      aria-hidden="true"
    >
      <div
        className="skeleton"
        style={{ width: 48, height: 48, borderRadius: '6px', flexShrink: 0 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div className="skeleton" style={{ height: '0.8rem', width: '65%', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '0.7rem', width: '40%', borderRadius: '4px' }} />
      </div>
      <div className="skeleton" style={{ height: '0.85rem', width: '3.5rem', borderRadius: '4px' }} />
    </div>
  );
}

// ── Individual result row ─────────────────────────────────────────────────────
function ResultRow({ product, isHighlighted, onClick, innerRef }) {
  const { id, title, category, price, discountPercentage, thumbnail } = product;

  const displayPrice =
    discountPercentage > 0
      ? price * (1 - discountPercentage / 100)
      : price;

  const categoryLabel = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

  const initial = (title?.[0] ?? 'N').toUpperCase();

  return (
    <li
      ref={innerRef}
      role="option"
      aria-selected={isHighlighted}
      style={{
        listStyle: 'none',
        borderRadius: '8px',
        background: isHighlighted ? 'var(--color-highlight)' : 'transparent',
        border: isHighlighted ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
      }}
    >
      <button
        onClick={() => onClick(id)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '0.65rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          textAlign: 'left',
          borderRadius: '8px',
        }}
        tabIndex={-1} // Focus managed manually via keyboard nav
      >
        {/* Thumbnail */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
          }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            initial
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
          {categoryLabel && (
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-secondary)',
                marginTop: '0.15rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'var(--color-accent)' }} />
              {categoryLabel}
            </div>
          )}
        </div>

        {/* Price & selection hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <span
            className="price"
            style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {formatPrice(displayPrice)}
          </span>
          {isHighlighted && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'var(--color-accent)',
              }}
              aria-hidden="true"
            >
              <CornerDownLeft size={13} />
            </span>
          )}
        </div>
      </button>
    </li>
  );
}

// ── Main overlay ──────────────────────────────────────────────────────────────

/**
 * SearchOverlay
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function SearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  // ── Search effect ─────────────────────────────────────────────────────────
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults([]);
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setHighlightedIndex(-1);

    searchProducts(q, 8)
      .then(({ products }) => {
        if (cancelled) return;
        setResults(products ?? []);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMsg(err?.message ?? 'Something went wrong. Please try again.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // ── Autofocus + body scroll lock ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow animation to start before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setStatus('idle');
      setHighlightedIndex(-1);
      setIsFocused(false);
    }
  }, [isOpen]);

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleFocusTrap = (e) => {
      if (!panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  const handleNavigate = useCallback(
    (id) => {
      navigate(`/product/${id}`);
      onClose();
    },
    [navigate, onClose]
  );

  // ── Keyboard: Escape + arrow navigation ───────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const selected = results[highlightedIndex];
        if (selected) handleNavigate(selected.id);
      }
    },
    [results, highlightedIndex, onClose, handleNavigate]
  );

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setStatus('idle');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelectTag = (tag) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderBody = () => {
    if (status === 'idle' || !debouncedQuery.trim()) {
      return (
        <div style={{ padding: '0.6rem 0.2rem 1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.85rem',
            }}
          >
            <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
            <span>Popular Categories & Curations</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectTag(tag)}
                className="search-tag-chip"
              >
                <Search size={11} style={{ opacity: 0.5 }} />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span>Type any archival keyword or brand</span>
            <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
              <span>Press</span>
              <kbd className="search-kbd-badge">ESC</kbd>
              <span>to exit</span>
            </div>
          </div>
        </div>
      );
    }

    if (status === 'loading') {
      return (
        <div aria-live="polite" aria-label="Searching…" style={{ padding: '0.25rem 0' }}>
          {[0, 1, 2].map((i) => (
            <SearchSkeletonRow key={i} />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '2rem 1rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}
          role="alert"
        >
          <AlertCircle size={24} style={{ color: 'var(--color-accent)' }} />
          <p style={{ fontSize: '0.875rem', margin: 0 }}>{errorMsg}</p>
        </div>
      );
    }

    if (status === 'success' && results.length === 0) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: 'var(--color-text-secondary)',
          }}
          role="status"
          aria-live="polite"
        >
          <p style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-text-primary)' }}>
            No results for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <p style={{ fontSize: '0.82rem', margin: 0 }}>
            Try a different keyword or browse our{' '}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontSize: 'inherit',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              full catalogue
            </button>
            .
          </p>
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.2rem 0.4rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>Results ({results.length})</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>Press Enter or click to view</span>
        </div>

        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          style={{
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
          }}
          aria-live="polite"
        >
          {results.map((product, idx) => (
            <ResultRow
              key={product.id}
              product={product}
              isHighlighted={idx === highlightedIndex}
              onClick={handleNavigate}
              innerRef={null}
            />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(37, 27, 22, 0.85)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              zIndex: 1000,
            }}
          />

          {/* Centering wrapper for mobile, tablet & desktop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1001,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: 'clamp(1rem, 6vh, 4rem) 1rem',
              pointerEvents: 'none',
              overflowY: 'auto',
            }}
          >
            {/* Panel */}
            <motion.div
              key="search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Search Archive"
              ref={panelRef}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                maxWidth: '640px',
                background: 'var(--color-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: 'clamp(1rem, 2.5vw, 1.4rem)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
                pointerEvents: 'auto',
                maxHeight: 'min(84vh, 640px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Search input container */}
              <div
                className={`search-input-box ${isFocused ? 'is-focused' : ''}`}
                style={{
                  marginBottom: '0.85rem',
                }}
                onClick={() => inputRef.current?.focus()}
              >
                {status === 'loading' ? (
                  <Loader2
                    size={18}
                    aria-hidden="true"
                    style={{
                      color: 'var(--color-accent)',
                      flexShrink: 0,
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : (
                  <Search
                    size={18}
                    aria-hidden="true"
                    style={{
                      color: isFocused || query ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      flexShrink: 0,
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      transform: isFocused ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                )}

                <input
                  ref={inputRef}
                  className="search-native-input"
                  type="search"
                  value={query}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search catalogue, categories, products…"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-activedescendant={
                    highlightedIndex >= 0 ? `result-${highlightedIndex}` : undefined
                  }
                  autoComplete="off"
                  spellCheck={false}
                />

                {/* Clear query pill */}
                <AnimatePresence>
                  {query && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                      aria-label="Clear search"
                      title="Clear search"
                      className="search-clear-pill"
                    >
                      <X size={12} strokeWidth={2.5} aria-hidden="true" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Subtle vertical separator */}
                <div
                  style={{
                    width: '1px',
                    height: '18px',
                    backgroundColor: 'var(--color-border)',
                    opacity: 0.7,
                    margin: '0 0.15rem',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />

                {/* Close modal button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  aria-label="Close search"
                  title="Close search"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    padding: '0.3rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    flexShrink: 0,
                    transition: 'background-color 0.18s ease, color 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-highlight)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="search-close-label">Close</span>
                  <kbd className="search-kbd-badge search-kbd-badge-esc">
                    ESC
                  </kbd>
                  <span className="search-close-x">
                    <X size={16} aria-hidden="true" />
                  </span>
                </button>
              </div>

              {/* Results / states with internal scroll */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {renderBody()}
              </div>

              {/* Keyboard shortcuts footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  marginTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '0.72rem',
                  color: 'var(--color-text-secondary)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <kbd className="search-kbd-badge">↑</kbd>
                    <kbd className="search-kbd-badge">↓</kbd>
                    <span>Navigate</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <kbd className="search-kbd-badge">↵</kbd>
                    <span>Select</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <kbd className="search-kbd-badge">ESC</kbd>
                    <span>Close</span>
                  </span>
                </div>
                {query && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                    {query.length} char{query.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Keyframe for the spinner */}
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
