/**
 * NEXORA — FeaturedCollection Component
 * Curated 4-piece editorial spotlight with GSAP ScrollTrigger animations
 * and hover-revealed wishlist action on cards.
 */
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import ProductSkeleton from '../products/ProductSkeleton';
import { fetchProducts, normalizeProduct } from '../../services/productService';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedCollection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Fetch 4 curated standout objects for a clean, spacious homepage row
    fetchProducts(4, 5)
      .then((data) => {
        setProducts((data.products ?? []).map(normalizeProduct));
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load products.');
      })
      .finally(() => setLoading(false));
  }, []);

  /* ScrollTrigger animations */
  useGSAP(
    () => {
      if (!headerRef.current || !gridRef.current) return;

      /* Header fade up */
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Stagger cards in */
      const cards = gridRef.current.querySelectorAll('article.card');
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: sectionRef, dependencies: [loading] }
  );

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="featured-heading"
      style={{
        background: 'var(--color-surface)',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 4vw, 3rem)',
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.5rem',
              }}
            >
              <Sparkles size={12} color="var(--color-accent)" />
              <span className="section-label" style={{ margin: 0 }}>
                CURATED FOR YOU
              </span>
            </div>
            <h2
              id="featured-heading"
              className="text-display-md"
              style={{ marginBottom: '0.6rem' }}
            >
              The Objects Edit
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Four seasonal essentials — unexpected form, enduring quality.
            </p>
          </div>

          <Link
            to="/shop"
            className="btn-secondary"
            style={{ flexShrink: 0 }}
            aria-label="View all products in the shop"
          >
            Explore All
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-elevated)',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
            }}
          >
            <p style={{ marginBottom: '0.75rem', fontWeight: 500 }}>
              Couldn't load products right now.
            </p>
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

        {/* Product Grid — 4 Columns on desktop, 2 on tablet, horizontal swipe on mobile */}
        {!error && (
          <>
            <style>{`
              .featured-grid-wide {
                display: none;
              }
              @media (min-width: 640px) {
                .featured-grid-wide {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 1.5rem;
                }
                .featured-scroll {
                  display: none !important;
                }
              }
              @media (min-width: 1024px) {
                .featured-grid-wide {
                  grid-template-columns: repeat(4, 1fr) !important;
                  gap: 1.75rem !important;
                }
              }
            `}</style>

            {/* Mobile: horizontal scroll */}
            <div
              className="scroll-x featured-scroll"
              role="list"
              aria-label="Featured products"
              style={{ gap: '1rem', paddingBottom: '1rem' }}
            >
              {loading
                ? Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      style={{ minWidth: '260px', flex: '0 0 260px' }}
                      role="listitem"
                    >
                      <ProductSkeleton count={1} />
                    </div>
                  ))
                : products.map((p) => (
                    <div
                      key={p.id}
                      style={{ minWidth: '260px', flex: '0 0 260px' }}
                      role="listitem"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
            </div>

            {/* Desktop & Tablet: Balanced 4-Item Grid */}
            <div
              ref={gridRef}
              className="featured-grid-wide"
              role="list"
              aria-label="Featured products"
            >
              {loading ? (
                <ProductSkeleton count={4} />
              ) : (
                products.map((p) => (
                  <div key={p.id} role="listitem">
                    <ProductCard product={p} />
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
