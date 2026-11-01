/**
 * NEXORA — ProductCard Component
 * Displays a single product in a vertical card layout with image,
 * wishlist toggle, rating stars, pricing, and add-to-cart action.
 */
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatPrice';
import { getDiscountedPrice } from '../../services/productService';

/**
 * Renders 5 star icons filled proportionally to the rating value.
 * Uses an SVG clip-path technique for partial fills on the last star.
 */
function RatingStars({ rating }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = Math.min(Math.max(rating - i, 0), 1); // 0, partial, or 1
    return filled;
  });

  return (
    <span className="stars" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
      {stars.map((fill, i) => (
        <span
          key={i}
          style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}
          aria-hidden="true"
        >
          {/* Empty star background */}
          <Star
            size={13}
            strokeWidth={1.5}
            style={{ color: 'var(--color-border)', fill: 'none' }}
          />
          {/* Filled star overlay clipped to fill fraction */}
          {fill > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'hidden',
                width: `${fill * 100}%`,
                display: 'inline-block',
              }}
            >
              <Star
                size={13}
                strokeWidth={1.5}
                style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }}
              />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * ProductCard
 * @param {{ product: import('../../services/productService').NormalizedProduct }} props
 */
export default function ProductCard({ product }) {
  const { id, title, price, discountPercentage, rating, category, thumbnail, brand } = product;

  const { addItem, isInCart } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const [imgError, setImgError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const wishlisted = isWishlisted(id);
  const inCart = isInCart(id);

  const discountedPrice = discountPercentage > 0
    ? getDiscountedPrice(price, discountPercentage)
    : null;

  const displayPrice = discountedPrice ?? price;

  /** Category display label — replace dashes with spaces, title-case */
  const categoryLabel = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

  /** Fallback initial for missing images */
  const initial = (title?.[0] ?? category?.[0] ?? 'N').toUpperCase();

  const handleAddToCart = useCallback(() => {
    addItem({
      id,
      title,
      price: displayPrice,
      image: thumbnail,
      thumbnail: thumbnail,
      brand: brand ?? '',
      category: category ?? '',
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  }, [addItem, id, title, displayPrice, thumbnail, brand, category]);

  const handleWishlist = useCallback(
    (e) => {
      e.preventDefault(); // prevent Link navigation
      e.stopPropagation();
      toggleItem(product);
      setHeartAnimating(true);
      setTimeout(() => setHeartAnimating(false), 300);
    },
    [toggleItem, product]
  );

  return (
    <article className="card" aria-label={title}>
      {/* ── Image Area ── */}
      <div className="product-image-wrap">
        <Link
          to={`/product/${id}`}
          className="aspect-product"
          aria-label={`View ${title}`}
          tabIndex={-1}
        >
          {!imgError && thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              onError={() => setImgError(true)}
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-elevated)',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                letterSpacing: '-0.02em',
              }}
            >
              {initial}
            </div>
          )}
        </Link>

        {/* Discount badge — top-left */}
        {discountPercentage > 0 && (
          <span className="discount-badge" aria-label={`${Math.round(discountPercentage)}% off`}>
            -{Math.round(discountPercentage)}%
          </span>
        )}

        {/* Wishlist button — top-right (revealed on card hover, persists when wishlisted) */}
        <button
          className={`icon-btn product-card-wishlist ${wishlisted ? 'is-wishlisted' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            transform: heartAnimating ? 'scale(1.35)' : undefined,
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 3,
            background: 'rgba(37, 27, 22, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 240, 231, 0.2)',
            borderRadius: '50%',
            width: '2.25rem',
            height: '2.25rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Heart
            size={16}
            aria-hidden="true"
            style={{
              fill: wishlisted ? 'var(--color-accent)' : 'none',
              color: wishlisted ? 'var(--color-accent)' : '#FAF7F1',
              transition: 'fill 0.2s ease, color 0.2s ease',
            }}
          />
        </button>
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {/* Category label */}
        {categoryLabel && (
          <span
            className="text-label text-theme-accent-secondary"
            style={{ display: 'block', marginBottom: '0.1rem' }}
          >
            {categoryLabel}
          </span>
        )}

        {/* Product title — linked, 2-line clamp */}
        <Link
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h3
            style={{
              fontWeight: 600,
              fontSize: '0.9rem',
              lineHeight: 1.35,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </h3>
        </Link>

        {/* Rating row */}
        {rating != null && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '0.15rem',
            }}
          >
            <RatingStars rating={rating} />
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {rating.toFixed(1)}
            </span>
            <Star
              size={11}
              aria-hidden="true"
              style={{
                color: 'var(--color-accent)',
                fill: 'var(--color-accent)',
              }}
            />
          </div>
        )}

        {/* Spacer pushes price + button to bottom */}
        <div style={{ flex: 1 }} />

        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginTop: '0.4rem',
          }}
        >
          <span className="price">{formatPrice(displayPrice)}</span>
          {discountPercentage > 0 && (
            <span className="price-original" aria-label={`Original price ${formatPrice(price)}`}>
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          className="btn-primary"
          onClick={handleAddToCart}
          aria-label={inCart ? `Add another ${title} to cart` : `Add ${title} to cart`}
          style={{
            width: '100%',
            marginTop: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            padding: '0.55rem 0.75rem',
            transition: 'opacity 0.2s ease, transform 0.15s ease',
            ...(addedFeedback && { opacity: 0.75, transform: 'scale(0.97)' }),
          }}
        >
          <ShoppingBag size={15} aria-hidden="true" />
          {addedFeedback ? 'Added!' : inCart ? 'Add Again' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
