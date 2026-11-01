/**
 * NEXORA — CategoriesSection
 * Dynamic category showcase fetched from DummyJSON API.
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { fetchCategories, fetchProductsByCategory } from '../../services/productService';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesSection() {
  const reduced = useReducedMotion();
  const [categories, setCategories] = useState([]);
  const [catImages, setCatImages] = useState({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const cats = await fetchCategories();
        // Prioritize aesthetic design categories on homepage
        const PRIORITY_SLUGS = [
          'furniture',
          'fragrances',
          'home-decoration',
          'sunglasses',
          'mens-watches',
          'womens-watches',
          'laptops',
          'kitchen-accessories',
        ];

        const sorted = [...cats].sort((a, b) => {
          const slugA = typeof a === 'string' ? a : a.slug;
          const slugB = typeof b === 'string' ? b : b.slug;
          const idxA = PRIORITY_SLUGS.indexOf(slugA);
          const idxB = PRIORITY_SLUGS.indexOf(slugB);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });

        // Limit to top 8 aesthetic categories
        const limited = sorted.slice(0, 8);
        setCategories(limited);

        // Fetch one product image per category in parallel
        const imageMap = {};
        await Promise.allSettled(
          limited.map(async (cat) => {
            try {
              const slug = typeof cat === 'string' ? cat : cat.slug;
              const data = await fetchProductsByCategory(slug, 1, 0);
              const first = data.products?.[0];
              if (first?.thumbnail) imageMap[slug] = first.thumbnail;
            } catch {}
          })
        );
        setCatImages(imageMap);
      } catch (err) {
        console.error('Categories fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getCatSlug = (cat) => (typeof cat === 'string' ? cat : cat.slug);
  const getCatName = (cat) => {
    if (typeof cat === 'string') return cat.replace(/-/g, ' ');
    return cat.name || cat.slug?.replace(/-/g, ' ') || cat;
  };

  /* ── GSAP ScrollTrigger Animations ── */
  useGSAP(
    () => {
      if (loading || reduced || !categories.length) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (gridRef.current) {
        const cards = gridRef.current.children;
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.07,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 85%',
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
    { scope: sectionRef, dependencies: [loading, categories.length, reduced] }
  );

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1rem, 4vw, 1.5rem)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <style>{`
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .categories-grid .explore-cat-card,
          .categories-grid .skeleton {
            height: 190px !important;
          }
          .categories-grid .cat-label-wrap {
            padding: 0.85rem !important;
          }
          .categories-grid .cat-label-title {
            font-size: 0.85rem !important;
          }
        }
        @media (max-width: 360px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 'clamp(1.75rem, 4vw, 3rem)' }}>
          <p className="section-label">EXPLORE</p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              marginTop: '0.5rem',
            }}
          >
            FIND YOUR NEXT<br />FAVORITE.
          </h2>
        </div>

        {/* Category Grid */}
        {loading ? (
          <div className="categories-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: '280px', borderRadius: '4px' }}
              />
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="categories-grid"
          >
            {categories.map((cat) => {
              const slug = getCatSlug(cat);
              const name = getCatName(cat);
              const img = catImages[slug];

              return (
                <Link
                  key={slug}
                  to={`/shop?category=${slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div className="explore-cat-card">
                    {img ? (
                      <img
                        src={img}
                        alt={name}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '4rem',
                          fontWeight: 800,
                          color: 'var(--color-border)',
                          fontFamily: 'var(--font-display)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {name.charAt(0)}
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="cat-overlay" />

                    {/* Label */}
                    <div
                      className="cat-label-wrap"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        className="cat-label-title"
                        style={{
                          color: '#F5F0E7',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '1rem',
                          letterSpacing: '-0.01em',
                          textTransform: 'capitalize',
                        }}
                      >
                        {name}
                      </span>
                      <ArrowRight
                        size={18}
                        color="#F5F0E7"
                        className="cat-arrow"
                        style={{ transition: 'transform 0.3s ease', flexShrink: 0 }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

