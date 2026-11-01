/**
 * NEXORA — TrendingSection (Seamless Editorial Stage)
 * Minimalist, borderless exhibition spotlight and filmstrip:
 * - Completely cardless: Left spotlight floats borderless directly on the canvas.
 * - Zero intrusive numbering or mechanical status text.
 * - Elegant, quiet auto-advancement with seamless interactive hover/select.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Check, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { fetchProducts, normalizeProduct } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import WishlistButton from '../wishlist/WishlistButton';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ROTATE_MS = 6000;
const TICK_MS = 100;

/* ─────────────────────────────────────────────
   Skeleton Loader (Matches Borderless Architecture)
───────────────────────────────────────────── */
function TrendingSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
      aria-hidden="true"
    >
      <div
        className="skeleton"
        style={{
          width: '100%',
          aspectRatio: '16/13',
          borderRadius: '4px',
          minHeight: '440px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: '76px',
              width: '100%',
              borderRadius: '2px',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main TrendingSection Component
───────────────────────────────────────────── */
export default function TrendingSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const spotlightImgRef = useRef(null);
  const spotlightInfoRef = useRef(null);
  const railRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [added, setAdded] = useState(false);

  const { addItem, isInCart } = useCart();

  /* Fetch curated trending archive */
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchProducts(5, 8)
      .then((data) => {
        if (!active) return;
        const normalized = (data.products || []).map(normalizeProduct);
        setProducts(normalized);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load trending objects.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeProduct = products[activeIdx] || null;
  const inCart = activeProduct ? isInCart(activeProduct.id) : false;

  const discountedPrice =
    activeProduct && activeProduct.discountPercentage > 0
      ? activeProduct.price * (1 - activeProduct.discountPercentage / 100)
      : activeProduct?.price;

  /* Silent auto-rotation timer */
  useEffect(() => {
    if (loading || products.length <= 1 || isPaused || reduced) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_MS / AUTO_ROTATE_MS) * 100;
        if (next >= 100) {
          setActiveIdx((current) => (current + 1) % products.length);
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [loading, products.length, isPaused, reduced]);

  /* Manual switch handler */
  const handleSelect = useCallback(
    (index) => {
      if (index === activeIdx) return;
      setActiveIdx(index);
      setProgress(0);
    },
    [activeIdx]
  );

  /* GSAP crossfade when active object changes */
  useEffect(() => {
    if (!activeProduct || reduced) return;

    if (spotlightImgRef.current) {
      gsap.fromTo(
        spotlightImgRef.current,
        { opacity: 0, scale: 0.95, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      );
    }

    if (spotlightInfoRef.current) {
      gsap.fromTo(
        spotlightInfoRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [activeIdx, activeProduct, reduced]);

  /* Initial ScrollTrigger Entrance */
  useGSAP(
    () => {
      if (loading || reduced || !products.length) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (stageRef.current && railRef.current) {
        gsap.fromTo(
          [stageRef.current, railRef.current],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: sectionRef, dependencies: [loading, products.length, reduced] }
  );

  /* Add to cart with feedback */
  const handleAddToCart = useCallback(() => {
    if (!activeProduct) return;
    addItem(
      {
        id: activeProduct.id,
        title: activeProduct.title,
        price: discountedPrice ?? activeProduct.price,
        image: activeProduct.thumbnail,
        brand: activeProduct.brand || 'Nexora Archive',
        category: activeProduct.category,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }, [addItem, activeProduct, discountedPrice]);

  return (
    <section
      id="trending"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="trending-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        .trending-split-layout {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        @media (min-width: 960px) {
          .trending-split-layout {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 4.5rem;
            align-items: center;
          }
        }

        .trending-rail-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.15rem 1rem;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          text-align: left;
          width: 100%;
        }

        .trending-rail-row:hover {
          background: var(--color-highlight);
          padding-left: 1.25rem;
        }

        .trending-rail-row.is-active {
          background: var(--color-surface);
          padding-left: 1.25rem;
        }

        .trending-rail-row.is-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 15%;
          bottom: 15%;
          width: 3px;
          background: var(--color-accent);
          border-radius: 2px;
        }

        .trending-progress-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--color-accent);
          transition: width 0.1s linear;
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 3rem)' }}>
        {/* Editorial Section Header (No Numbering) */}
        <div
          ref={headerRef}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: '0.6rem' }}>
              THE SEASONAL EDIT
            </p>

            <h2
              id="trending-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              Objects in Dialogue
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.98rem',
                marginTop: '0.6rem',
                maxWidth: '48ch',
                lineHeight: 1.6,
              }}
            >
              A living study in form, proportion, and quiet utility. Hover or select an object to inspect its monograph.
            </p>
          </div>

          {/* Header Link (No Numbering) */}
          <Link
            to="/shop"
            className="btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '0.75rem 1.4rem',
              borderRadius: '2px',
            }}
          >
            Explore Full Archive
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <TrendingSkeleton />
        ) : error || !activeProduct ? (
          <div
            style={{
              padding: '4rem 1rem',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
            }}
          >
            {error || 'Seasonal objects currently unavailable.'}
          </div>
        ) : (
          <div className="trending-split-layout">
            {/* ── LEFT: Borderless Spotlight Stage (No Card Box, No Numbering) ── */}
            <div
              ref={stageRef}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* Borderless Floating Product Image Stage with Ambient Glow */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 11',
                  maxHeight: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at 50% 50%, var(--color-highlight) 0%, transparent 74%)',
                  marginBottom: '1.5rem',
                }}
              >
                {/* Floating Wishlist Button */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    zIndex: 3,
                  }}
                >
                  <WishlistButton product={activeProduct} size={18} />
                </div>

                <Link
                  to={`/product/${activeProduct.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    textDecoration: 'none',
                  }}
                >
                  <img
                    ref={spotlightImgRef}
                    src={activeProduct.thumbnail || activeProduct.images?.[0]}
                    alt={activeProduct.title}
                    loading="lazy"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '85%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 24px 44px rgba(53, 39, 32, 0.16))',
                      maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 74%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 74%, transparent 100%)',
                      willChange: 'transform, opacity',
                    }}
                  />
                </Link>
              </div>

              {/* Product Info Directly on Canvas (No Card Wrapper) */}
              <div ref={spotlightInfoRef}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    marginBottom: '0.4rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                    }}
                  >
                    {activeProduct.category.replace(/-/g, ' ')}
                  </span>
                  {activeProduct.brand && (
                    <>
                      <span style={{ color: 'var(--color-border)' }}>•</span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--color-accent-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {activeProduct.brand}
                      </span>
                    </>
                  )}
                  {activeProduct.rating != null && (
                    <div
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <Star size={12} fill="var(--color-accent)" stroke="none" />
                      <span>{activeProduct.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/product/${activeProduct.id}`}
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    {activeProduct.title}
                  </h3>
                </Link>

                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    marginBottom: '1.75rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    maxWidth: '56ch',
                  }}
                >
                  {activeProduct.description}
                </p>

                {/* Actions & Price */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-secondary)',
                        display: 'block',
                        fontWeight: 600,
                      }}
                    >
                      Price
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                      <span
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: 'var(--color-accent)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatPrice(discountedPrice)}
                      </span>
                      {activeProduct.discountPercentage > 0 && (
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-secondary)',
                            textDecoration: 'line-through',
                            opacity: 0.7,
                          }}
                        >
                          {formatPrice(activeProduct.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={handleAddToCart}
                      className="btn-primary"
                      style={{
                        padding: '0.85rem 1.6rem',
                        fontSize: '0.78rem',
                        borderRadius: '2px',
                      }}
                      aria-label={`Add ${activeProduct.title} to bag`}
                    >
                      {added ? (
                        <>
                          <Check size={15} />
                          Added
                        </>
                      ) : inCart ? (
                        <>
                          <ShoppingBag size={15} />
                          In Bag • Add More
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} />
                          Add to Bag
                        </>
                      )}
                    </button>

                    <Link
                      to={`/product/${activeProduct.id}`}
                      className="btn-secondary"
                      style={{
                        padding: '0.85rem 1.25rem',
                        fontSize: '0.78rem',
                        borderRadius: '2px',
                      }}
                    >
                      Inspect
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Minimalist Filmstrip (No Numbering, No System Text) ── */}
            <div
              ref={railRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
              role="tablist"
              aria-label="Trending Objects Selection"
            >
              {products.map((item, index) => {
                const isActive = index === activeIdx;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="trending-spotlight"
                    className={`trending-rail-row ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelect(index)}
                    onMouseEnter={() => handleSelect(index)}
                  >
                    {/* Small Frameless Thumbnail Capsule */}
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        background: 'radial-gradient(circle at center, var(--color-highlight) 0%, transparent 70%)',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.thumbnail || item.images?.[0]}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 6px 12px rgba(53, 39, 32, 0.1))',
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.62rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--color-accent-secondary)',
                          fontWeight: 600,
                          marginBottom: '0.2rem',
                        }}
                      >
                        {item.category.replace(/-/g, ' ')}
                      </div>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: isActive ? 700 : 500,
                          color: 'var(--color-text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.25,
                        }}
                      >
                        {item.title}
                      </div>
                    </div>

                    {/* Price and Chevron */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatPrice(item.price)}
                      </span>
                      <ChevronRight
                        size={15}
                        color={isActive ? 'var(--color-accent)' : 'var(--color-border)'}
                        style={{
                          transform: isActive ? 'translateX(2px)' : 'none',
                          transition: 'transform 0.25s ease',
                        }}
                      />
                    </div>

                    {/* Silent Progress Line Indicator */}
                    {isActive && !isPaused && !reduced && (
                      <div className="trending-progress-line" style={{ width: `${progress}%` }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
