/**
 * NEXORA — MobileMenu
 * App-Style Modern Retail Navigation Drawer (Nike / Retail App inspired).
 * Features quick search, visual category cards, quick utility dock (Bag / Wishlist / Checkout),
 * and an account status card.
 */
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Search, 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  User, 
  CreditCard,
  Sparkles,
  LogOut,
  Armchair,
  Watch,
  Flower2,
  Sparkle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 28, stiffness: 300 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const CATEGORY_CARDS = [
  {
    label: 'Furniture',
    desc: 'Living & studio',
    icon: Armchair,
    to: '/shop?category=furniture',
    color: '#8B4513',
  },
  {
    label: 'Fragrances',
    desc: 'Artisanal scents',
    icon: Flower2,
    to: '/shop?category=fragrances',
    color: '#C49A76',
  },
  {
    label: 'Watches',
    desc: 'Timepieces',
    icon: Watch,
    to: '/shop?category=mens-watches',
    color: '#A95032',
  },
  {
    label: 'Home Decor',
    desc: 'Objects & accents',
    icon: Sparkle,
    to: '/shop?category=home-decoration',
    color: '#766354',
  },
];

export default function MobileMenu({ isOpen, onClose, onSearchOpen }) {
  const location = useLocation();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(37, 27, 22, 0.65)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              zIndex: 90,
            }}
          />

          {/* App-Style Slide-in Drawer */}
          <motion.nav
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="App Navigation"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              height: '100dvh',
              width: 'min(360px, 86vw)',
              backgroundColor: 'var(--color-bg)',
              borderLeft: '1px solid var(--color-border)',
              zIndex: 95,
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              overflowY: 'auto',
              boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: 'var(--color-accent)',
                    lineHeight: 1,
                  }}
                >
                  NEXORA
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    backgroundColor: 'var(--color-highlight)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Store
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Search Bar */}
            {onSearchOpen && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSearchOpen();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 0.9rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginBottom: '1.25rem',
                  transition: 'border-color 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <Search size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>Search catalogue, styles…</span>
              </button>
            )}

            {/* Primary Navigation Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Link
                to="/shop"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: location.pathname === '/shop' ? 'var(--color-highlight)' : 'var(--color-surface)',
                  border: `1.5px solid ${location.pathname === '/shop' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-display)',
                }}
              >
                <span>Shop All Catalogue</span>
                <ArrowRight size={16} style={{ color: 'var(--color-accent)' }} />
              </Link>

              <Link
                to="/collections"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: location.pathname === '/collections' ? 'var(--color-highlight)' : 'var(--color-surface)',
                  border: `1.5px solid ${location.pathname === '/collections' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-display)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Curated Collections</span>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--color-accent)' }} />
              </Link>
            </div>

            {/* Categories App Grid */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.6rem',
                  paddingLeft: '0.2rem',
                }}
              >
                Featured Categories
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.6rem',
                }}
              >
                {CATEGORY_CARDS.map(({ label, desc, icon: IconComponent, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      color: 'var(--color-text-primary)',
                      transition: 'transform 0.18s ease, border-color 0.18s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        color: 'var(--color-accent)',
                      }}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                      {desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* App Dock: Bag & Wishlist & Checkout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border)',
                marginBottom: '1rem',
              }}
            >
              {/* Bag */}
              <Link
                to="/cart"
                onClick={onClose}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.7rem 0.4rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  position: 'relative',
                }}
              >
                <ShoppingBag size={18} style={{ color: 'var(--color-accent)', marginBottom: '0.3rem' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Bag</span>
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '8px',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--color-accent)',
                      color: '#FAF7F1',
                      borderRadius: '999px',
                      padding: '0.1rem 0.35rem',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                onClick={onClose}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.7rem 0.4rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  position: 'relative',
                }}
              >
                <Heart size={18} style={{ color: 'var(--color-accent)', marginBottom: '0.3rem' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Wishlist</span>
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '8px',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--color-accent)',
                      color: '#FAF7F1',
                      borderRadius: '999px',
                      padding: '0.1rem 0.35rem',
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Checkout */}
              <Link
                to="/checkout"
                onClick={onClose}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.7rem 0.4rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                }}
              >
                <CreditCard size={18} style={{ color: 'var(--color-accent)', marginBottom: '0.3rem' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Checkout</span>
              </Link>
            </div>

            {/* Bottom Account Profile Bar */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '0.75rem',
              }}
            >
              {isAuthenticated ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                  }}
                >
                  <Link
                    to="/login"
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      textDecoration: 'none',
                      color: 'inherit',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        color: '#FAF7F1',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {user?.avatarInitial || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>
                        Account Settings
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    title="Sign Out"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <User size={16} style={{ color: 'var(--color-accent)' }} />
                  <span>Sign In / Create Account</span>
                </Link>
              )}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
