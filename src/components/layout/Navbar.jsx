/**
 * NEXORA — Navbar
 * Fixed top navigation bar with scroll-aware background,
 * centered nav links (desktop), refined mobile/tablet touch targets,
 * responsive action icons, and animated drawer trigger.
 */
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, User } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Discover', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
];

/**
 * @param {{ onSearchOpen: () => void, onCartOpen: () => void }} props
 */
export default function Navbar({ onSearchOpen, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  // Scroll listener — rAF-throttled with responsive threshold
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="navbar-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Glassmorphic backdrop with smooth fade on scroll */}
        <div
          className="navbar-backdrop"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--color-bg)',
            opacity: scrolled ? 0.94 : 0.7,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
            boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
            transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            zIndex: -1,
            willChange: 'opacity, border-color, box-shadow',
          }}
        />

        {/* ── LEFT: Wordmark ── */}
        <NavLink
          to="/"
          aria-label="NEXORA home"
          className="navbar-brand"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            flexShrink: 0,
            userSelect: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'opacity 0.2s ease',
          }}
        >
          <span>NEXORA</span>
        </NavLink>

        {/* ── CENTER: Desktop nav links ── */}
        <nav
          aria-label="Primary navigation"
          className="nav-center-links"
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                ['nav-link', isActive ? 'active' : ''].filter(Boolean).join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── RIGHT: Action icons ── */}
        <div className="nav-actions-group">
          {/* Search */}
          <button
            className="icon-btn nav-btn-item"
            onClick={onSearchOpen}
            aria-label="Open search"
            title="Search"
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          {/* Wishlist */}
          <button
            className="icon-btn nav-btn-item nav-action-wishlist"
            onClick={() => navigate('/wishlist')}
            aria-label={`Wishlist (${wishlistCount} items)`}
            title="Wishlist"
            style={{ position: 'relative' }}
          >
            <Heart size={18} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="navbar-badge" aria-hidden="true">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          <button
            className="icon-btn nav-btn-item nav-action-user"
            onClick={() => navigate('/login')}
            aria-label={isAuthenticated ? `Account (${user?.name})` : 'Sign in'}
            title={isAuthenticated ? `Account (${user?.name})` : 'Sign in'}
          >
            {isAuthenticated ? (
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  color: '#FAF7F1',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {user?.avatarInitial || 'U'}
              </span>
            ) : (
              <User size={18} strokeWidth={1.8} />
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <button
            className="icon-btn nav-btn-item"
            onClick={onCartOpen}
            aria-label={`Cart (${cartCount} items)`}
            title="Shopping cart"
            style={{ position: 'relative' }}
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="navbar-badge" aria-hidden="true">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile / Tablet Menu Button */}
          <button
            className="icon-btn nav-hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={19} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Responsive Styles tailored for Desktop, Tablet, and Mobile */}
      <style>{`
        /* Global Navbar Base */
        .navbar-container {
          height: 64px;
          padding: 0 clamp(1.25rem, 3vw, 2.5rem);
          transition: height 0.25s ease, padding 0.25s ease;
        }

        .navbar-brand {
          font-size: 1.3rem;
        }

        .nav-center-links {
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 2.5vw, 2.75rem);
        }

        .nav-actions-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }

        .nav-btn-item {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .navbar-badge {
          position: absolute;
          top: 3px;
          right: 3px;
          min-width: 1rem;
          height: 1rem;
          padding: 0 0.25rem;
          border-radius: 999px;
          background-color: var(--color-accent);
          color: #FAF7F1;
          font-size: 0.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justifyContent: center;
          line-height: 1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .nav-hamburger-btn {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background-color: transparent;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        /* ── Tablet Screens (768px – 1024px) ── */
        @media (max-width: 1024px) {
          .navbar-container {
            height: 60px;
            padding: 0 1.25rem;
          }
          .nav-center-links {
            display: none !important;
          }
          .nav-hamburger-btn {
            display: inline-flex !important;
            border-color: var(--color-border);
            background-color: var(--color-surface);
            margin-left: 0.2rem;
          }
          .nav-actions-group {
            gap: 0.3rem;
          }
        }

        /* ── Compact Tablet & Mobile (<= 768px) ── */
        @media (max-width: 768px) {
          .navbar-container {
            height: 58px;
            padding: 0 1rem;
          }
          .navbar-brand {
            font-size: 1.18rem;
          }
          .nav-action-wishlist {
            display: none !important;
          }
          .nav-btn-item {
            width: 36px;
            height: 36px;
          }
          .nav-hamburger-btn {
            width: 36px;
            height: 36px;
          }
        }

        /* ── Small Mobile Screens (<= 480px) ── */
        @media (max-width: 480px) {
          .navbar-container {
            height: 56px;
            padding: 0 0.85rem;
          }
          .navbar-brand {
            font-size: 1.12rem;
            letter-spacing: -0.03em;
          }
          .nav-action-user {
            display: none !important;
          }
          .nav-actions-group {
            gap: 0.2rem;
          }
          .nav-btn-item {
            width: 35px;
            height: 35px;
          }
          .nav-hamburger-btn {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>

      {/* Mobile menu drawer */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSearchOpen={onSearchOpen}
      />
    </>
  );
}
