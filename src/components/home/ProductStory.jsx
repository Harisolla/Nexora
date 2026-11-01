/**
 * NEXORA — ProductStory Component
 * Editorial monographic spread featuring:
 * - Signature Oat Milk × Natural Linen two-tone color architecture
 * - Manifesto headline: "LESS ORDINARY. MORE EXTRAORDINARY."
 * - Asymmetric, modern editorial layout (clip-path reveal, parallax, generous whitespace)
 * - Tactile spec cards & direct commerce integration
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Check, Sparkles, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { fetchProduct, normalizeProduct } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Story Loading Skeleton
───────────────────────────────────────────── */
function StorySkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
      }}
      aria-hidden="true"
    >
      <div
        className="skeleton"
        style={{
          width: '100%',
          aspectRatio: '4/5',
          borderRadius: '4px',
          minHeight: '440px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
        <div className="skeleton" style={{ height: '0.9rem', width: '35%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '3.5rem', width: '85%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '1.2rem', width: '60%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '4rem', width: '100%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '3rem', width: '220px', borderRadius: '2px', marginTop: '1rem' }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main ProductStory Component
───────────────────────────────────────────── */
export default function ProductStory() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const contentColRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const descRef = useRef(null);
  const specMatrixRef = useRef(null);
  const ctaRef = useRef(null);

  const { addItem, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  /* Curate an architectural design object (ID 14: Saarinen Executive Chair or fallback ID 7: Coco Noir) */
  useEffect(() => {
    let active = true;

    fetchProduct(14)
      .then((data) => {
        if (active) setProduct(normalizeProduct(data));
      })
      .catch(() => {
        return fetchProduct(7).then((data) => {
          if (active) setProduct(normalizeProduct(data));
        });
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const discountedPrice =
    product && product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product?.price;

  const inCart = product ? isInCart(product.id) : false;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        title: product.title,
        price: discountedPrice ?? product.price,
        image: product.thumbnail,
        brand: product.brand || 'Nexora Archive',
        category: product.category,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }, [addItem, product, discountedPrice]);

  /* ── GSAP ScrollTrigger Animations ── */
  useGSAP(
    () => {
      if (loading || !product || reduced) return;

      /* 1. Organic float & fade entrance for borderless image stage */
      if (imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current,
          { opacity: 0, scale: 0.94, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* 2. Parallax scroll effect on product image */
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      /* 3. Staggered reveal for headline lines */
      if (line1Ref.current && line2Ref.current) {
        gsap.fromTo(
          [line1Ref.current, line2Ref.current],
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentColRef.current || sectionRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* 4. Description, specs, and CTAs */
      const storyEls = [
        descRef.current,
        specMatrixRef.current,
        ctaRef.current,
      ].filter(Boolean);

      if (storyEls.length) {
        gsap.fromTo(
          storyEls,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentColRef.current || sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Recalculate trigger positions once DOM content is mounted
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: sectionRef, dependencies: [loading, product, reduced] }
  );

  return (
    <section
      id="story"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="story-manifesto-heading"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* ── Signature Two-Tone Gradient (Oat Milk seamlessly merging into Natural Linen) ── */}
      <div
        aria-hidden="true"
        className="story-bg-split"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <style>{`
        .story-bg-split {
          background: linear-gradient(
            to bottom,
            var(--color-bg) 0%,
            var(--color-bg) 35%,
            var(--color-surface) 65%,
            var(--color-surface) 100%
          );
        }

        @media (min-width: 960px) {
          .story-bg-split {
            background: linear-gradient(
              to right,
              var(--color-bg) 0%,
              var(--color-bg) 28%,
              var(--color-surface) 68%,
              var(--color-surface) 100%
            ) !important;
          }
        }

        /* Modern Asymmetric Editorial Layout */
        .story-layout {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        @media (min-width: 960px) {
          .story-layout {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 4.5rem;
            align-items: center;
          }
        }

        .story-spec-card {
          background: var(--color-elevated);
          border: 1px solid var(--color-border);
          border-radius: 3px;
          padding: 1rem 1.25rem;
          transition: all 0.25s ease;
        }

        .story-spec-card:hover {
          border-color: var(--color-accent);
          background: var(--color-highlight);
          transform: translateY(-2px);
        }
      `}</style>

      {loading ? (
        <StorySkeleton />
      ) : !product ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            color: 'var(--color-text-secondary)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Story content unavailable.
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 5vw, 4rem)',
          }}
        >
          <div className="story-layout">
            {/* ── LEFT: Borderless Studio Stage Merging into Background ── */}
            <div style={{ position: 'relative' }}>
              <div
                ref={imageContainerRef}
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 4.6',
                  background: 'radial-gradient(circle at 50% 50%, var(--color-highlight) 0%, transparent 72%)',
                  border: 'none',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(1.5rem, 4vw, 3rem)',
                }}
              >
                {/* Background Archival Monogram */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(5rem, 16vw, 12rem)',
                    fontWeight: 800,
                    color: 'var(--color-border)',
                    opacity: 0.22,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                  }}
                >
                  NEXORA
                </div>

                {/* Product Image with Restrained Parallax & Soft Radial Edge Merge */}
                <img
                  ref={imageRef}
                  src={product.images?.[0] ?? product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                    filter: 'drop-shadow(0 24px 44px rgba(53, 39, 32, 0.16))',
                    maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 72%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 72%, transparent 100%)',
                    willChange: 'transform',
                  }}
                />

                {/* Top Corner Archival Museum Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    zIndex: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.75rem',
                    background: 'var(--color-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '20px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 14px rgba(53, 39, 32, 0.04)',
                  }}
                >
                  <Sparkles size={11} color="var(--color-accent)" />
                  ARCHIVE MONOGRAPH 2025
                </div>
              </div>

              {/* Floating Curator Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-0.75rem',
                  right: '1rem',
                  zIndex: 5,
                  padding: '0.75rem 1.15rem',
                  background: 'var(--color-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '3px',
                  boxShadow: '0 16px 36px rgba(53, 39, 32, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-highlight)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--color-accent)',
                  }}
                >
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                    }}
                  >
                    Curator Verified
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.2,
                    }}
                  >
                    Material Integrity
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Editorial Monograph & Living Narrative ── */}
            <div
              ref={contentColRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* Monograph Meta Label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <span className="section-label" style={{ margin: 0 }}>
                  MONOGRAPH NO. {product.id}
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
                  {product.category.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Manifesto Headline */}
              <h2
                id="story-manifesto-heading"
                aria-label="Less Ordinary. More Extraordinary."
                style={{
                  marginBottom: '1.25rem',
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div
                    ref={line1Ref}
                    className="text-display-lg"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    LESS ORDINARY.
                  </div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    ref={line2Ref}
                    className="text-display-lg"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    MORE EXTRAORDINARY.
                  </div>
                </div>
              </h2>

              {/* Subject Title & Brand */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.25rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {product.title}
                </span>
                {product.brand && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    by {product.brand}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                ref={descRef}
                style={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  fontSize: '0.97rem',
                  maxWidth: '46ch',
                  marginBottom: '2rem',
                }}
              >
                {product.description}
              </p>

              {/* Tactile Spec Matrix (Warm Porcelain Cards) */}
              <div
                ref={specMatrixRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.85rem',
                  marginBottom: '2.5rem',
                }}
              >
                {/* Spec 1: Rating */}
                <div className="story-spec-card">
                  <div
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '0.25rem',
                      fontWeight: 600,
                    }}
                  >
                    Excellence
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <Star size={14} fill="var(--color-accent)" stroke="none" />
                    <span>{product.rating != null ? product.rating.toFixed(1) : '4.9'} / 5.0</span>
                  </div>
                </div>

                {/* Spec 2: Discipline */}
                <div className="story-spec-card">
                  <div
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '0.25rem',
                      fontWeight: 600,
                    }}
                  >
                    Discipline
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: 'var(--color-text-primary)',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.category.replace(/-/g, ' ')}
                  </div>
                </div>

                {/* Spec 3: Price */}
                <div className="story-spec-card">
                  <div
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '0.25rem',
                      fontWeight: 600,
                    }}
                  >
                    Investment
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: 'var(--color-accent)',
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {formatPrice(discountedPrice)}
                  </div>
                </div>
              </div>

              {/* Dual Actions: Add to Bag + Monograph */}
              <div
                ref={ctaRef}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={{
                    padding: '0.9rem 2rem',
                    fontSize: '0.8rem',
                    borderRadius: '2px',
                  }}
                  aria-label={`Add ${product.title} to bag`}
                >
                  {added ? (
                    <>
                      <Check size={16} />
                      Added to Bag
                    </>
                  ) : inCart ? (
                    <>
                      <ShoppingBag size={16} />
                      In Your Bag • Add More
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Bag — {formatPrice(discountedPrice)}
                    </>
                  )}
                </button>

                <Link
                  to={`/product/${product.id}`}
                  className="btn-secondary"
                  style={{
                    padding: '0.9rem 1.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '2px',
                  }}
                >
                  Inspect Monograph
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
