/**
 * NEXORA — CollectionsPage (/collections)
 * Thematic Anthology & Editorial Lookbook
 * Features:
 * - Curated thematic capsule collections with rich architectural concepts
 * - Live DummyJSON category product integration with image previews
 * - Asymmetric editorial layout with GSAP ScrollTrigger stagger entrance
 * - Interactive category discipline filters
 * - Direct commerce pathways linking into /shop with pre-filtered parameters
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import PageTransition from '../components/animations/PageTransition';
import { fetchProductsByCategory, normalizeProduct } from '../services/productService';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// ─── 6 Editorial Capsule Definitions ─────────────────────────────────────────
const CAPSULES = [
  {
    id: '01',
    slug: 'furniture',
    title: 'The Architectural Living Edit',
    tagline: 'Sculptural seating, structural balance, and brutalist woodforms.',
    description:
      'A study in proportion, volume, and material presence. Designed for spaces that celebrate quiet geometry, timeless craftsmanship, and structural restraint.',
    highlights: ['Lounge Seating', 'Solid Walnut', 'Architectural Form', 'Tactile Linen'],
    curatorNote: 'Saarinen & Mid-Century Design Archive',
    theme: 'living',
    featured: true,
  },
  {
    id: '02',
    slug: 'fragrances',
    title: 'Nocturne & Botanical Essences',
    tagline: 'Olfactory landscapes of smoky cedar, black tea, and morning dew.',
    description:
      'Sensory compositions extracted from rare botanicals and woody resins. Ethereal, grounded, and formulated to leave an intimate, evolving sillage.',
    highlights: ['Extrait de Parfum', 'Smoky Cedar', 'Glass Flaçon', 'Black Tea'],
    curatorNote: 'The Olfactory Laboratory',
    theme: 'wear',
    featured: false,
  },
  {
    id: '03',
    slug: 'mens-watches',
    title: 'Horology & Mechanical Precision',
    tagline: 'Satin-brushed steel, sapphire crystal, and tactile geometry.',
    description:
      'Instrument-grade timepieces engineered for lifelong wear. Minimalist indices and mechanical calibers celebrate the intersection of art and engineering.',
    highlights: ['Automatic Caliber', 'Sapphire Glass', 'Satin Steel', 'Water Resistance'],
    curatorNote: 'Precision Instruments Division',
    theme: 'wear',
    featured: false,
  },
  {
    id: '04',
    slug: 'home-decoration',
    title: 'The Domestic Sanctuary',
    tagline: 'Sculptural ceramics, acoustic forms, and unglazed stoneware.',
    description:
      'Tactile vessels, ceramic sculptures, and lighting objects crafted to introduce warmth, shadow play, and contemplative tranquility to daily living.',
    highlights: ['Unglazed Terracotta', 'Organic Vessels', 'Hand-Thrown Ceramic', 'Shadow Play'],
    curatorNote: 'Studio Ceramics & Objects',
    theme: 'living',
    featured: true,
  },
  {
    id: '05',
    slug: 'sunglasses',
    title: 'Optical Balance & Geometry',
    tagline: 'Beveled Italian acetate, mineral lenses, and custom core wire.',
    description:
      'Refined eyewear silhouettes balancing architectural weight with ergonomic lightness. Mineral glass lenses provide optical clarity and subtle tinting.',
    highlights: ['Italian Acetate', 'UV400 Mineral Glass', 'Custom Wire Core', 'Hand-Beveled'],
    curatorNote: 'Optical Atelier Series',
    theme: 'wear',
    featured: false,
  },
  {
    id: '06',
    slug: 'kitchen-accessories',
    title: 'Functional Utilitarianism',
    tagline: 'Heavy-gauge stainless tools, forged cutlery, and daily ergonomics.',
    description:
      'Culinary essentials engineered without superfluous embellishment. Designed to perform with satisfying weight, balanced leverage, and enduring durability.',
    highlights: ['Forged Steel', 'Ergonomic Balance', 'Everyday Functional', 'Matte Porcelain'],
    curatorNote: 'Culinary Craft Series',
    theme: 'ritual',
    featured: false,
  },
];

const THEME_FILTERS = [
  { id: 'all', label: 'All Capsules' },
  { id: 'living', label: 'Living & Space' },
  { id: 'wear', label: 'Objects of Wear' },
  { id: 'ritual', label: 'Daily Rituals' },
];

export default function CollectionsPage() {
  const reduced = useReducedMotion();
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const capsulesGridRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('all');
  const [capsuleProducts, setCapsuleProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // ─── Fetch Preview Products for Each Capsule ──────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function loadPreviews() {
      const results = {};
      await Promise.allSettled(
        CAPSULES.map(async (cap) => {
          try {
            const data = await fetchProductsByCategory(cap.slug, 3, 0);
            if (data?.products) {
              results[cap.slug] = data.products.map(normalizeProduct);
            }
          } catch {}
        })
      );
      if (isMounted) {
        setCapsuleProducts(results);
        setLoading(false);
      }
    }
    loadPreviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCapsules =
    activeTheme === 'all'
      ? CAPSULES
      : CAPSULES.filter((c) => c.theme === activeTheme);

  // ─── GSAP ScrollTrigger Entrance ──────────────────────────────────────────
  useGSAP(
    () => {
      if (reduced) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      if (capsulesGridRef.current) {
        const cards = capsulesGridRef.current.children;
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: capsulesGridRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: pageRef, dependencies: [loading, activeTheme, reduced] }
  );

  return (
    <PageTransition>
      <div
        ref={pageRef}
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          paddingTop: 'calc(64px + 2rem)',
          paddingBottom: '8rem',
        }}
      >
        <style>{`
          .capsule-card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 4px;
            overflow: hidden;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: inherit;
          }
          .capsule-card:hover {
            transform: translateY(-4px);
            border-color: var(--color-accent);
            box-shadow: 0 20px 50px rgba(53, 39, 32, 0.09);
          }
          .capsule-card.is-featured {
            grid-column: 1 / -1;
          }
          @media (min-width: 960px) {
            .capsule-card.is-featured {
              display: grid;
              grid-template-columns: 1.15fr 0.85fr;
              align-items: center;
            }
          }

          .theme-pill-btn {
            padding: 0.55rem 1.25rem;
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 600;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            cursor: pointer;
            transition: all 0.25s ease;
          }
          .theme-pill-btn:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
            background: var(--color-highlight);
          }
          .theme-pill-btn.is-active {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: #FAF7F1;
            box-shadow: 0 4px 14px rgba(169, 80, 50, 0.22);
          }
        `}</style>

        {/* ── 1. Page Header ── */}
        <header
          ref={headerRef}
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '2rem clamp(1.25rem, 4vw, 3rem) 3.5rem',
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
                  THE ANTHOLOGY
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
                  CURATED CAPSULES
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                The Collections
              </h1>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '1.05rem',
                  marginTop: '0.85rem',
                  maxWidth: '58ch',
                  lineHeight: 1.6,
                }}
              >
                Independent thematic studies in material honesty, structural balance, and everyday ritual. Each capsule brings together objects designed to exist in dialogue.
              </p>
            </div>

            {/* Badge Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
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
              <span>6 Curated Editions • 2025</span>
            </div>
          </div>

          {/* ── Theme Filter Tabs ── */}
          <div style={{ marginTop: '3rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {THEME_FILTERS.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`theme-pill-btn ${isActive ? 'is-active' : ''}`}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ── 2. Thematic Capsules Grid ── */}
        <main
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(1.25rem, 4vw, 3rem)',
          }}
        >
          <div
            ref={capsulesGridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {filteredCapsules.map((capsule) => {
              const previewItems = capsuleProducts[capsule.slug] || [];
              const heroProduct = previewItems[0] || null;

              return (
                <article
                  key={capsule.id}
                  className={`capsule-card ${capsule.featured ? 'is-featured' : ''}`}
                >
                  {/* Left / Top: Hero Visual Canvas */}
                  <div
                    style={{
                      position: 'relative',
                      background: 'radial-gradient(circle at center, var(--color-highlight) 0%, transparent 75%)',
                      padding: 'clamp(2rem, 5vw, 3.5rem)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: capsule.featured ? '380px' : '300px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Background Index Monogram */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(7rem, 16vw, 12rem)',
                        fontWeight: 800,
                        color: 'var(--color-border)',
                        opacity: 0.35,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        letterSpacing: '-0.05em',
                        lineHeight: 1,
                      }}
                    >
                      {capsule.id}
                    </div>

                    {/* Monograph Tag */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        left: '1.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.35rem 0.75rem',
                        background: 'var(--color-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '20px',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                      }}
                    >
                      <Layers size={11} />
                      CAPSULE NO. {capsule.id}
                    </div>

                    {/* Curator Note */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1.25rem',
                        left: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <ShieldCheck size={13} color="var(--color-accent)" />
                      {capsule.curatorNote}
                    </div>

                    {/* Product Image */}
                    {heroProduct ? (
                      <img
                        src={heroProduct.thumbnail || heroProduct.images?.[0]}
                        alt={capsule.title}
                        loading="lazy"
                        style={{
                          maxHeight: capsule.featured ? '320px' : '240px',
                          maxWidth: '85%',
                          objectFit: 'contain',
                          position: 'relative',
                          zIndex: 2,
                          filter: 'drop-shadow(0 20px 40px rgba(53, 39, 32, 0.16))',
                          transition: 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
                          willChange: 'transform',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    ) : (
                      <div
                        style={{
                          width: '180px',
                          height: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-display)',
                          fontSize: '3rem',
                          color: 'var(--color-border)',
                        }}
                      >
                        {capsule.id}
                      </div>
                    )}
                  </div>

                  {/* Right / Bottom: Editorial Details */}
                  <div
                    style={{
                      padding: 'clamp(1.75rem, 4vw, 2.5rem)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flex: 1,
                    }}
                  >
                    <p
                      className="section-label"
                      style={{
                        marginBottom: '0.5rem',
                        color: 'var(--color-accent-secondary)',
                      }}
                    >
                      {capsule.slug.replace(/-/g, ' ')}
                    </p>

                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: capsule.featured ? 'clamp(1.8rem, 3vw, 2.4rem)' : '1.5rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        margin: '0 0 0.75rem',
                      }}
                    >
                      {capsule.title}
                    </h2>

                    <p
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      {capsule.tagline}
                    </p>

                    <p
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        marginBottom: '1.75rem',
                      }}
                    >
                      {capsule.description}
                    </p>

                    {/* Capsule Highlights Tags */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.45rem',
                        marginBottom: '2rem',
                      }}
                    >
                      {capsule.highlights.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.65rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            padding: '0.25rem 0.6rem',
                            background: 'var(--color-elevated)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '2px',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Direct Commerce Action */}
                    <div>
                      <Link
                        to={`/shop?category=${capsule.slug}`}
                        className="btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.85rem 1.6rem',
                          borderRadius: '2px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Explore {capsule.title}
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ── 3. Bottom Anthology Manifesto & Shop Pathway ── */}
          <section
            style={{
              marginTop: '6rem',
              padding: '4.5rem 2rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <p className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              COMPLETE ARCHIVE
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                marginBottom: '1rem',
              }}
            >
              Seeking a Specific Object?
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1rem',
                maxWidth: '52ch',
                margin: '0 auto 2.25rem',
                lineHeight: 1.6,
              }}
            >
              Beyond our seasonal capsules, explore the full catalogue of 190+ design objects, complete with filtering, specifications, and live availability.
            </p>
            <Link
              to="/shop"
              className="btn-primary"
              style={{ padding: '0.95rem 2.25rem', borderRadius: '2px', fontSize: '0.85rem' }}
            >
              Enter The Full Shop
            </Link>
          </section>
        </main>
      </div>
    </PageTransition>
  );
}

