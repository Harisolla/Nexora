/**
 * NEXORA — WishlistPage
 * Displays all saved wishlist items with cart integration.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import PageTransition from '../components/animations/PageTransition';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem, isInCart } = useCart();
  const [addedIds, setAddedIds] = useState(new Set());

  function handleAddToCart(product) {
    addItem(product, 1);
    setAddedIds((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }

  function handleAddAll() {
    items.forEach((item) => addItem(item, 1));
    const ids = new Set(items.map((i) => i.id));
    setAddedIds(ids);
    setTimeout(() => setAddedIds(new Set()), 2000);
  }

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          paddingTop: '5rem',
        }}
      >
        <style>{`
          .wishlist-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5rem;
          }
          @media (max-width: 600px) {
            .wishlist-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.75rem !important;
            }
          }
          @media (max-width: 360px) {
            .wishlist-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            <div>
              <p className="section-label">SAVED ITEMS</p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.025em',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                Your Wishlist
                {items.length > 0 && (
                  <span className="badge" style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}>
                    {items.length}
                  </span>
                )}
              </h1>
            </div>
            {items.length > 0 && (
              <button className="btn-secondary" onClick={handleAddAll}>
                <ShoppingBag size={16} />
                Add All to Cart
              </button>
            )}
          </div>

          {/* Empty State */}
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 1rem',
                textAlign: 'center',
                gap: '1.25rem',
              }}
            >
              <Heart
                size={56}
                style={{ color: 'var(--color-accent)', opacity: 0.35 }}
              />
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                Nothing saved yet
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '320px', lineHeight: 1.6 }}>
                Tap the heart on any product to save it here for later.
              </p>
              <Link to="/shop" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {items.map((product) => {
                const img = product.thumbnail || product.images?.[0];
                const isAdded = addedIds.has(product.id);
                const inCart = isInCart(product.id);
                const discounted =
                  product.discountPercentage > 0
                    ? product.price * (1 - product.discountPercentage / 100)
                    : null;

                return (
                  <div
                    key={product.id}
                    className="card"
                    style={{ position: 'relative' }}
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove from wishlist"
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        zIndex: 2,
                        background: 'var(--color-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-accent)';
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                      }}
                    >
                      <X size={14} />
                    </button>

                    {/* Product image */}
                    <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                      <div
                        style={{
                          aspectRatio: '4/3',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-elevated)',
                        }}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={product.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
                              willChange: 'transform',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '2.5rem',
                              color: 'var(--color-border)',
                              fontWeight: 700,
                              fontFamily: 'var(--font-display)',
                            }}
                          >
                            {product.title?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div style={{ padding: '1rem' }}>
                      <p
                        className="text-label"
                        style={{ color: 'var(--color-accent-secondary)', marginBottom: '0.35rem' }}
                      >
                        {product.category}
                      </p>
                      <Link
                        to={`/product/${product.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            marginBottom: '0.5rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {product.title}
                        </p>
                      </Link>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '0.5rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <span className="price">
                          {formatPrice(discounted ?? product.price)}
                        </span>
                        {discounted && (
                          <span className="price-original">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <button
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag size={14} />
                        {isAdded ? 'Added ✓' : inCart ? 'In Bag' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

