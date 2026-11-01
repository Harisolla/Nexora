import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import PageTransition from '../components/animations/PageTransition';

const FREE_SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING_FEE = 15;
const ESTIMATED_TAX_RATE = 0.08;

// ── Single Cart Item Row ───────────────────────────────────────────────────────
function CartItemRow({ item }) {
  const { updateQty, removeItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const displayImage =
    item.image ||
    item.thumbnail ||
    (Array.isArray(item.images) ? item.images[0] : null) ||
    '';

  const categoryLabel = item.category
    ? item.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Archival Collection';

  const initial = (item.title?.[0] ?? 'N').toUpperCase();

  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '100px minmax(0, 1fr) auto',
        gap: '1.25rem',
        padding: '1.5rem',
        backgroundColor: 'var(--color-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        alignItems: 'center',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      className="cart-item-card"
    >
      {/* Product Image */}
      <Link
        to={`/product/${item.id}`}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          padding: '6px',
          flexShrink: 0,
        }}
        aria-label={`View ${item.title}`}
      >
        {!imgError && displayImage ? (
          <img
            src={displayImage}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              transition: 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform',
            }}
            loading="lazy"
            onError={() => setImgError(true)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <span
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--color-text-secondary)',
            }}
          >
            {initial}
          </span>
        )}
      </Link>

      {/* Product Details & Quantity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
        {/* Category & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            className="text-label"
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-accent)',
              letterSpacing: '0.08em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {categoryLabel}
          </span>
          {item.brand && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              • {item.brand}
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${item.id}`}
          style={{
            fontWeight: 600,
            fontSize: '1.05rem',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            lineHeight: 1.35,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={item.title}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
        >
          {item.title}
        </Link>

        {/* Unit Price */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Unit price: <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{formatPrice(item.price)}</span>
        </p>

        {/* Stepper + Remove */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Quantity Controls */}
          <div className="qty-control" role="group" aria-label={`Quantity for ${item.title}`}>
            <button
              className="qty-btn"
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus size={13} aria-hidden="true" />
            </button>
            <span className="qty-value" aria-live="polite" aria-atomic="true">
              {item.quantity}
            </span>
            <button
              className="qty-btn"
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={item.quantity >= 99}
            >
              <Plus size={13} aria-hidden="true" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(item.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              padding: '0.35rem 0.5rem',
              borderRadius: '4px',
              transition: 'color 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#c0392b';
              e.currentTarget.style.backgroundColor = 'rgba(192, 57, 43, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div
        style={{
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '0.25rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {formatPrice(item.price * item.quantity)}
        </span>
        {item.quantity > 1 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            ({item.quantity} × {formatPrice(item.price)})
          </span>
        )}
      </div>
    </article>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyCartState() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        maxWidth: '680px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--color-accent)',
        }}
      >
        <ShoppingBag size={40} strokeWidth={1.4} />
      </div>

      <p className="section-label" style={{ marginBottom: '0.5rem' }}>
        ARCHIVE BAG
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}
      >
        Your Shopping Bag is Empty
      </h2>

      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '440px',
          lineHeight: 1.6,
          fontSize: '0.95rem',
          marginBottom: '2rem',
        }}
      >
        Explore our curated selection of timeless design pieces, artisanal goods, and modern
        essentials to begin curating your collection.
      </p>

      <button
        className="btn-primary"
        onClick={() => navigate('/shop')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.85rem 2rem',
          fontSize: '0.95rem',
        }}
      >
        <span>Explore Collection</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ── Main Cart Page Component ──────────────────────────────────────────────────
export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Shipping logic
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : FLAT_SHIPPING_FEE;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  // Discount & Tax calculations
  const discountedSubtotal = Math.max(0, totalPrice - promoDiscount);
  const estimatedTax = items.length === 0 ? 0 : discountedSubtotal * ESTIMATED_TAX_RATE;
  const grandTotal = discountedSubtotal + shippingFee + estimatedTax;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a promotion code.');
      return;
    }

    if (code === 'NEXORA10' || code === 'WELCOME10') {
      const discount = totalPrice * 0.1;
      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoError('');
    } else if (code === 'ARCHIVE' || code === 'SAVE20') {
      const discount = Math.min(20, totalPrice * 0.5);
      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promotion code. Try NEXORA10 or ARCHIVE.');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
    setPromoError('');
  };

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          paddingTop: '6rem',
          paddingBottom: '5rem',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Breadcrumb Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
            }}
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              Home
            </Link>
            <ChevronRight size={13} />
            <Link
              to="/shop"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              Shop
            </Link>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              Shopping Bag
            </span>
          </nav>

          {/* Page Heading */}
          <header
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginBottom: '2.5rem',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '1.5rem',
            }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: '0.35rem' }}>
                REVIEW & CHECKOUT
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.025em',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                Shopping Bag
                {totalItems > 0 && (
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-body)',
                      backgroundColor: 'var(--color-accent)',
                      color: '#ffffff',
                      borderRadius: '999px',
                      padding: '0.2rem 0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h1>
            </div>

            {items.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link
                  to="/shop"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'underline',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c0392b';
                    e.currentTarget.style.color = '#c0392b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Clear Bag
                </button>
              </div>
            )}
          </header>

          {/* Main Content: If empty, show empty state; else show 2-column layout */}
          {items.length === 0 ? (
            <EmptyCartState />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
                gap: '2.5rem',
                alignItems: 'start',
              }}
              className="cart-grid-layout"
            >
              {/* LEFT COLUMN: Item List & Shipping Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Free Shipping Progress Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '1.25rem 1.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Truck size={17} style={{ color: 'var(--color-accent)' }} />
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {isFreeShipping ? (
                          <span style={{ color: '#4A8C5C' }}>
                            You qualify for Complimentary Archival Shipping!
                          </span>
                        ) : (
                          <>
                            Add <strong style={{ color: 'var(--color-accent)' }}>{formatPrice(amountToFreeShipping)}</strong> more to enjoy Free Shipping
                          </>
                        )}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Goal: {formatPrice(FREE_SHIPPING_THRESHOLD)}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${freeShippingProgress}%`,
                        height: '100%',
                        backgroundColor: isFreeShipping ? '#4A8C5C' : 'var(--color-accent)',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Trust Features Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem',
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        Authenticity Guaranteed
                      </p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        Direct archival provenance
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <RotateCcw size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        30-Day Returns
                      </p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        Complimentary return postage
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Truck size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        Insured Transit
                      </p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        Signature on courier delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Order Summary Card (Sticky) */}
              <div style={{ position: 'sticky', top: '5.5rem' }}>
                <aside
                  style={{
                    backgroundColor: 'var(--color-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '2rem 1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                  aria-label="Order Summary"
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                      margin: 0,
                      paddingBottom: '1rem',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    Order Summary
                  </h2>

                  {/* Summary Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* Subtotal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Items Subtotal</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    {/* Promo Discount */}
                    {promoApplied && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.925rem',
                          color: '#4A8C5C',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Tag size={13} />
                          Promo ({promoCode.toUpperCase()})
                        </span>
                        <span style={{ fontWeight: 600 }}>-{formatPrice(promoDiscount)}</span>
                      </div>
                    )}

                    {/* Shipping */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Estimated Shipping</span>
                      <span style={{ color: isFreeShipping ? '#4A8C5C' : 'var(--color-text-primary)', fontWeight: 600 }}>
                        {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                      </span>
                    </div>

                    {/* Tax */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Estimated Tax (8%)</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>
                        {formatPrice(estimatedTax)}
                      </span>
                    </div>

                    {/* Total Line */}
                    <div
                      style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '1.25rem',
                        marginTop: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: 'var(--color-text-primary)',
                            display: 'block',
                          }}
                        >
                          Estimated Total
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          Including taxes & shipping
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.65rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code Box */}
                  <div
                    style={{
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '1.25rem',
                    }}
                  >
                    {promoApplied ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'rgba(74, 140, 92, 0.1)',
                          border: '1px solid rgba(74, 140, 92, 0.3)',
                          borderRadius: '6px',
                          padding: '0.6rem 0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4A8C5C' }}>
                          <Sparkles size={15} />
                          <span>Code <strong>{promoCode}</strong> applied</span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Promo code (e.g. NEXORA10)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '0.65rem 0.85rem',
                              fontSize: '0.85rem',
                              border: '1px solid var(--color-border)',
                              borderRadius: '4px',
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-text-primary)',
                              outline: 'none',
                            }}
                          />
                          <button
                            type="submit"
                            className="btn-secondary"
                            style={{
                              padding: '0.65rem 1rem',
                              fontSize: '0.825rem',
                              whiteSpace: 'nowrap',
                              cursor: 'pointer',
                            }}
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <span style={{ fontSize: '0.75rem', color: '#c0392b' }}>
                            {promoError}
                          </span>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/checkout')}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={17} />
                  </button>

                  <p
                    style={{
                      fontSize: '0.72rem',
                      textAlign: 'center',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                    }}
                  >
                    Taxes and duty verified at secure final step.
                  </p>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

