/**
 * NEXORA — Footer Component
 * Minimalist, elegant footer with essential navigation and back-to-top.
 */
import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'Cart', to: '/cart' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Account', to: '/login' },
];

const CATEGORIES = [
  { label: 'Furniture', to: '/shop?category=furniture' },
  { label: 'Fragrances', to: '/shop?category=fragrances' },
  { label: 'Watches', to: '/shop?category=mens-watches' },
  { label: 'Home Decor', to: '/shop?category=home-decoration' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem 2rem',
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: '360px' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: 'var(--color-accent)',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              NEXORA
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              Objects for what's next. Everyday essentials reimagined with purpose, craft, and intention.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}
            >
              Navigate
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="link-underline"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}
            >
              Categories
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {CATEGORIES.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="link-underline"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            © {new Date().getFullYear()} NEXORA. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="btn-ghost"
            aria-label="Back to top"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.75rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <ChevronUp size={15} />
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
