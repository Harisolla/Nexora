/**
 * NEXORA — CartDrawer Component
 * Premium slide-in cart drawer from the right side with framer-motion
 * animation, scrollable item list, quantity controls, and checkout CTA.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';

// ── Animation variants ────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 340, damping: 36 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.24, ease: [0.4, 0, 0.6, 1] },
  },
};

// ── CartItem subcomponent ─────────────────────────────────────────────────────
function CartItem({ item, onClose }) {
  const { updateQty, removeItem } = useCart();
  const { id, title, price, category, quantity } = item;
  const [imgFailed, setImgFailed] = useState(false);

  const displayImage =
    item.image ||
    item.thumbnail ||
    (Array.isArray(item.images) ? item.images[0] : null) ||
    '';

  const categoryLabel = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

  const initial = (title?.[0] ?? 'N').toUpperCase();

  return (
    <li
      style={{
        display: 'flex',
        gap: '0.85rem',
        padding: '1rem 0',
        borderBottom: '1px solid var(--color-border)',
        alignItems: 'flex-start',
      }}
    >
      {/* Thumbnail */}
      <Link
        to={`/product/${id}`}
        onClick={onClose}
        style={{
          width: 76,
          height: 76,
          borderRadius: '4px',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'var(--color-elevated)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          padding: '4px',
          position: 'relative',
        }}
        aria-label={`View ${title}`}
      >
        {!imgFailed && displayImage ? (
          <img
            src={displayImage}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span>{initial}</span>
        )}
      </Link>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {/* Category */}
        {categoryLabel && (
          <span
            className="text-label"
            style={{ display: 'block', color: 'var(--color-text-secondary)' }}
          >
            {categoryLabel}
          </span>
        )}

        {/* Title */}
        <Link
          to={`/product/${id}`}
          onClick={onClose}
          style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
          }}
        >
          {title}
        </Link>

        {/* Price × qty */}
        <p
          style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}
          aria-label={`${formatPrice(price)} each, ${quantity} in cart`}
        >
          {formatPrice(price)} × {quantity}
        </p>

        {/* Qty controls + remove */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.35rem',
          }}
        >
          <div className="qty-control" role="group" aria-label={`Quantity for ${title}`}>
            <button
              className="qty-btn"
              onClick={() => updateQty(id, quantity - 1)}
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              <Minus size={13} aria-hidden="true" />
            </button>
            <span className="qty-value" aria-live="polite" aria-atomic="true">
              {quantity}
            </span>
            <button
              className="qty-btn"
              onClick={() => updateQty(id, quantity + 1)}
              aria-label="Increase quantity"
              disabled={quantity >= 99}
            >
              <Plus size={13} aria-hidden="true" />
            </button>
          </div>

          <button
            onClick={() => removeItem(id)}
            className="icon-btn"
            aria-label={`Remove ${title} from cart`}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Line total */}
      <span
        className="price"
        style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '0.15rem' }}
        aria-label={`Item total: ${formatPrice(price * quantity)}`}
      >
        {formatPrice(price * quantity)}
      </span>
    </li>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onClose }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: '1rem',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <ShoppingBag
        size={52}
        aria-hidden="true"
        style={{ color: 'var(--color-border)', strokeWidth: 1.2 }}
      />
      <div>
        <p
          style={{
            fontWeight: 600,
            fontSize: '1.05rem',
            margin: '0 0 0.35rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Your bag is empty
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Add items to get started
        </p>
      </div>
      <button className="btn-primary" onClick={onClose} style={{ marginTop: '0.5rem' }}>
        Start Shopping
      </button>
    </div>
  );
}

// ── Main CartDrawer ───────────────────────────────────────────────────────────

/**
 * CartDrawer
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Remove all items from your bag?')) {
      clearCart();
    }
  }, [clearCart]);

  const hasItems = items.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="cart-backdrop"
            className="overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            style={{ zIndex: 1100 }}
          />

          {/* ── Drawer panel ── */}
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Shopping Bag, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(420px, 100vw)',
              background: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border)',
              zIndex: 1101,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
            }}
          >
            {/* ── Header ── */}
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingBag
                  size={20}
                  aria-hidden="true"
                  style={{ color: 'var(--color-accent)' }}
                />
                <h2
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Shopping Bag
                </h2>
                {totalItems > 0 && (
                  <span
                    style={{
                      background: 'var(--color-accent)',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '999px',
                      padding: '0.15rem 0.55rem',
                      lineHeight: 1.4,
                    }}
                    aria-label={`${totalItems} items`}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                className="icon-btn"
                onClick={onClose}
                aria-label="Close shopping bag"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            {/* ── Body ── */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: hasItems ? '0 1.5rem' : 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {hasItems ? (
                <>
                  <ul
                    style={{ margin: 0, padding: 0, listStyle: 'none' }}
                    aria-label="Cart items"
                  >
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} onClose={onClose} />
                    ))}
                  </ul>

                  {/* Clear bag */}
                  <div style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <button
                      onClick={handleClearAll}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                      }}
                    >
                      Clear bag
                    </button>
                  </div>
                </>
              ) : (
                <EmptyState onClose={onClose} />
              )}
            </div>

            {/* ── Footer ── */}
            {hasItems && (
              <footer
                style={{
                  borderTop: '1px solid var(--color-border)',
                  padding: '1.25rem 1.5rem',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {/* Subtotal */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="price"
                    style={{ fontSize: '1.1rem' }}
                    aria-label={`Subtotal: ${formatPrice(totalPrice)}`}
                  >
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  Taxes and shipping calculated at checkout
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <Link
                    to="/cart"
                    className="btn-secondary"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      textDecoration: 'none',
                      padding: '0.85rem',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      borderRadius: '3px',
                    }}
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    className="btn-primary"
                    onClick={onClose}
                    style={{
                      flex: 1.4,
                      textAlign: 'center',
                      textDecoration: 'none',
                      padding: '0.85rem',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      borderRadius: '3px',
                    }}
                  >
                    Checkout
                  </Link>
                </div>

                {/* Continue shopping */}
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '0.25rem',
                    textDecoration: 'underline',
                  }}
                >
                  Continue Shopping
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
