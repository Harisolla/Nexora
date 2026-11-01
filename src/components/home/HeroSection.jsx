/**
 * NEXORA — HeroSection Component
 * Full cinematic hero with GSAP entrance, parallax scrolling,
 * and seamless auto-scrolling exhibition showcase (no manual buttons).
 * Positioned cleanly below the fixed navbar.
 */
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { fetchProduct, fetchProducts, normalizeProduct } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/* Curated showcase objects with sculptural appeal */
const CURATED_HERO_IDS = [
  { id: 7, edition: '01', concept: 'Essence & Shadow' },
  { id: 14, edition: '02', concept: 'Architectural Form' },
  { id: 13, edition: '03', concept: 'Organic Living' },
];

/* Auto-scroll interval in milliseconds */
const AUTO_SCROLL_DELAY = 4500;

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Floating glassmorphic metadata pill overlaid on the hero image */
function FloatingPill({ children, style, className = '' }) {
  return (
    <div
      className={`hero-pill ${className}`}
      style={{
        position: 'absolute',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.5rem 0.95rem',
        background: 'rgba(37, 27, 22, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 240, 231, 0.22)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.22)',
        borderRadius: '3px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: '#FAF7F1',
        zIndex: 5,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Animated bouncing scroll indicator */
function ScrollIndicator() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      y: 8,
      duration: 1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        color: 'var(--color-text-secondary)',
        opacity: 0.75,
        cursor: 'default',
        userSelect: 'none',
      }}
      aria-label="Scroll down to explore"
    >
      <span
        style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
          marginBottom: '0.4rem',
        }}
      >
        Scroll
      </span>
      <ChevronDown size={15} aria-hidden="true" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main HeroSection
───────────────────────────────────────────── */

export default function HeroSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const supportRef = useRef(null);
  const ctaRef = useRef(null);
  const indicatorRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);
  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);
  const pill3Ref = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const auraRef = useRef(null);

  const [curatedProducts, setCuratedProducts] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* Fetch curated aesthetic products */
  useEffect(() => {
    let active = true;

    async function loadCurated() {
      try {
        const results = await Promise.all(
          CURATED_HERO_IDS.map(async (c) => {
            try {
              const res = await fetchProduct(c.id);
              return { ...normalizeProduct(res), ...c };
            } catch {
              return null;
            }
          })
        );
        const valid = results.filter(Boolean);
        if (valid.length > 0 && active) {
          setCuratedProducts(valid);
          return;
        }
      } catch {}

      // Fallback
      try {
        const fallback = await fetchProducts(3, 5);
        if (active && fallback.products?.length) {
          setCuratedProducts(
            fallback.products.map((p, i) => ({
              ...normalizeProduct(p),
              edition: `0${i + 1}`,
              concept: 'Curated Object',
            }))
          );
        }
      } catch {}
    }

    loadCurated();
    return () => {
      active = false;
    };
  }, []);

  /* ── Auto-scroll / Auto-rotation effect ── */
  useEffect(() => {
    if (curatedProducts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % curatedProducts.length);
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(timer);
  }, [curatedProducts.length, isPaused]);

  /* Smooth crossfade / scale transition whenever active product changes */
  useEffect(() => {
    if (!imageRef.current || reduced) return;

    gsap.fromTo(
      imageRef.current,
      { opacity: 0.25, scale: 0.95, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out' }
    );
  }, [activeIdx, reduced]);

  const activeProduct = curatedProducts[activeIdx] || null;

  /* ── GSAP Entrance Timeline ── */
  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Section label */
      tl.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.15
      );

      /* 2. Headline line-by-line reveal */
      tl.fromTo(
        [line1Ref.current, line2Ref.current],
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
        },
        0.35
      );

      /* 3. Product image entrance */
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
          0.25
        );
      }

      /* 4. Ambient aura glow */
      if (auraRef.current) {
        tl.fromTo(
          auraRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0.3
        );
      }

      /* 5. Floating pills */
      const pills = [pill1Ref.current, pill2Ref.current, pill3Ref.current].filter(Boolean);
      if (pills.length) {
        tl.fromTo(
          pills,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.12 },
          0.85
        );
      }

      /* 6. Supporting text */
      tl.fromTo(
        supportRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.95
      );

      /* 7. Auto-progress tracker */
      if (indicatorRef.current) {
        tl.fromTo(
          indicatorRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          1.1
        );
      }

      /* 8. CTA buttons */
      const ctaBtns = ctaRef.current?.querySelectorAll('a, button');
      if (ctaBtns?.length) {
        tl.fromTo(
          ctaBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          1.25
        );
      }

      /* 9. Scroll indicator */
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.4
      );

      /* ── ScrollTrigger Parallax for Product Image (fluid inertia) ── */
      if (imageWrapRef.current && imageRef.current) {
        gsap.to(imageRef.current, {
          y: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  const categoryLabel = activeProduct?.category
    ? activeProduct.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Curated Object';

  return (
    <section
      ref={sectionRef}
      aria-label="Nexora Hero — Curated Design Objects"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: 'var(--color-bg)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @media (min-width: 960px) {
          .hero-inner {
            grid-template-columns: 1.05fr 0.95fr !important;
            min-height: 100svh;
          }
          .hero-image-col {
            min-height: 100svh !important;
          }
        }
        @media (max-width: 959px) {
          .hero-image-col {
            min-height: 80vw !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .hero-pill-top-left,
          .hero-pill-top-right {
            top: 1rem !important;
          }
          .hero-pill-top-left {
            left: 1rem !important;
          }
          .hero-pill-top-right {
            right: 1rem !important;
          }
          .hero-pill-bottom-left {
            bottom: 1rem !important;
            left: 1rem !important;
          }
          .hero-pill-bottom-right {
            bottom: 1rem !important;
            right: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .hero-pill-bottom-left {
            display: none !important;
          }
          .hero-pill-top-left,
          .hero-pill-top-right,
          .hero-pill-bottom-right {
            font-size: 0.65rem !important;
            padding: 0.35rem 0.65rem !important;
          }
        }

        @keyframes heroBarProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      <div
        className="hero-inner"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          minHeight: '100svh',
          width: '100%',
        }}
      >
        {/* ── LEFT: Editorial Typography & Auto-Progress ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(2rem, 5vw, 5rem) clamp(1.5rem, 5vw, 4.5rem)',
            paddingTop: 'calc(64px + clamp(1.5rem, 3vw, 3rem))', /* navbar clearance */
            zIndex: 3,
            position: 'relative',
          }}
        >
          {/* Editorial Meta */}
          <div
            ref={labelRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              opacity: reduced ? 1 : 0,
            }}
          >
            <span className="section-label" style={{ margin: 0 }}>
              EST. 2025 • OBJECT ARCHIVE
            </span>
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                opacity: 0.6,
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
              }}
            >
              EDITION 04
            </span>
          </div>

          {/* Headline */}
          <h1
            aria-label="DESIGNED TO MOVE YOU."
            style={{ overflow: 'hidden', marginBottom: '0.1em' }}
          >
            <div style={{ overflow: 'hidden' }}>
              <div
                ref={line1Ref}
                className="text-display-xl"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                DESIGNED TO
              </div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                ref={line2Ref}
                className="text-display-xl"
                style={{
                  color: 'var(--color-accent)',
                  opacity: reduced ? 1 : 0,
                }}
              >
                MOVE YOU.
              </div>
            </div>
          </h1>

          {/* Supporting Text */}
          <p
            ref={supportRef}
            style={{
              marginTop: '1.5rem',
              maxWidth: '42ch',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              opacity: reduced ? 1 : 0,
            }}
          >
            Discover the next generation of everyday essentials — sculpted forms,
            rich tactile materials, and honest craftsmanship for modern living.
          </p>

          {/* Minimal Editorial Auto-Scroll Progress Tracker */}
          {curatedProducts.length > 1 && (
            <div
              ref={indicatorRef}
              style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: reduced ? 1 : 0,
              }}
            >
              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                {curatedProducts.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      width: idx === activeIdx ? '28px' : '10px',
                      height: '2px',
                      borderRadius: '1px',
                      background: idx === activeIdx ? 'var(--color-accent)' : 'var(--color-border)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                }}
              >
                0{activeIdx + 1} / 0{curatedProducts.length} • {activeProduct?.concept || 'Permanent Collection'}
              </span>
            </div>
          )}

          {/* CTA Actions */}
          <div
            ref={ctaRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.875rem',
              marginTop: '2.5rem',
              alignItems: 'center',
            }}
          >
            <Link
              to="/shop"
              className="btn-primary"
              style={{ opacity: reduced ? 1 : 0 }}
            >
              Explore Collection
              <ArrowRight size={15} aria-hidden="true" />
            </Link>

            {activeProduct && (
              <Link
                to={`/product/${activeProduct.id}`}
                className="btn-secondary"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                Inspect Piece
              </Link>
            )}
          </div>

          {/* Scroll Indicator */}
          <div
            ref={scrollIndicatorRef}
            style={{
              marginTop: 'auto',
              paddingTop: '2.5rem',
              opacity: reduced ? 0.7 : 0,
            }}
          >
            <ScrollIndicator />
          </div>
        </div>

        {/* ── RIGHT: Cinematic Studio Stage with Clear Navbar Padding ── */}
        <div
          ref={imageWrapRef}
          className="hero-image-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '60vh',
            background: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            /* Generous padding ensures all content sits well below 64px fixed navbar */
            paddingTop: 'calc(64px + 1.5rem)',
            paddingBottom: '2.5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }}
        >
          {/* Subtle Architectural Watermark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '55%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 15vw, 12rem)',
              fontWeight: 800,
              color: 'var(--color-border)',
              opacity: 0.22,
              letterSpacing: '-0.05em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            NEXORA
          </div>

          {/* Ambient Warm Studio Radial Glow */}
          <div
            ref={auraRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              top: '64px',
              background:
                'radial-gradient(circle at 50% 52%, rgba(169, 80, 50, 0.22) 0%, rgba(196, 154, 118, 0.08) 45%, transparent 75%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Warm Gradient Vignette */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, var(--color-bg) 0%, transparent 25%), linear-gradient(to top, rgba(37,27,22,0.45) 0%, transparent 40%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Exhibition Top Label Badge — safely positioned below 64px navbar */}
          <div
            className="hero-pill-top-left"
            style={{
              position: 'absolute',
              top: 'calc(64px + 1.25rem)',
              left: '1.5rem',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '2px',
              background: 'rgba(37, 27, 22, 0.55)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(245, 240, 231, 0.18)',
              color: '#FAF7F1',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
              }}
            />
            {activeProduct?.concept || 'Permanent Collection'}
          </div>

          {/* Top-Right Category Pill — safely below 64px navbar */}
          {activeProduct && (
            <FloatingPill
              ref={pill1Ref}
              className="hero-pill-top-right"
              style={{ top: 'calc(64px + 1.25rem)', right: '1.5rem' }}
            >
              <span
                style={{
                  color: 'var(--color-accent-secondary)',
                  fontWeight: 700,
                }}
              >
                {categoryLabel}
              </span>
            </FloatingPill>
          )}

          {/* Product Image Stage — strictly bounded so it NEVER touches the navbar */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              maxHeight: 'min(460px, calc(100svh - 220px))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeProduct?.thumbnail ? (
              <Link
                to={`/product/${activeProduct.id}`}
                aria-label={`Inspect ${activeProduct.title}`}
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
                  ref={imageRef}
                  src={activeProduct.images?.[0] ?? activeProduct.thumbnail}
                  alt={activeProduct.title}
                  loading="eager"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.22))',
                    transition: 'filter 0.4s ease',
                    willChange: 'transform',
                    opacity: reduced ? 1 : 0,
                  }}
                />
              </Link>
            ) : (
              <div
                className="skeleton"
                style={{ width: '70%', height: '70%', borderRadius: '4px' }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Bottom Floating Metadata Pills */}
          {activeProduct && (
            <>
              {/* Price & Title pill — bottom right */}
              <FloatingPill
                ref={pill2Ref}
                className="hero-pill-bottom-right"
                style={{
                  bottom: '1.5rem',
                  right: '1.5rem',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.15rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: 'rgba(245, 240, 231, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {activeProduct.title.length > 25
                    ? `${activeProduct.title.slice(0, 25)}…`
                    : activeProduct.title}
                </span>
                <span
                  style={{
                    color: 'var(--color-accent)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  {formatPrice(activeProduct.price)}
                </span>
              </FloatingPill>

              {/* Edition stamp — bottom left */}
              <FloatingPill
                ref={pill3Ref}
                className="hero-pill-bottom-left"
                style={{ bottom: '1.5rem', left: '1.5rem' }}
              >
                <span style={{ opacity: 0.8 }}>ARCHIVE</span>
                <span style={{ color: 'var(--color-accent)' }}>
                  {activeProduct.edition || '01'}
                </span>
              </FloatingPill>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
