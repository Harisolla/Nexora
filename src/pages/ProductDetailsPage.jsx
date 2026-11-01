/**
 * NEXORA — ProductDetailsPage
 * Full product detail view at /product/:id
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ChevronRight, Package } from 'lucide-react';
import {
  fetchProduct,
  fetchProductsByCategory,
  normalizeProduct,
  getDiscountedPrice,
} from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductGallery from '../components/products/ProductGallery';
import ProductCard from '../components/products/ProductCard';
import WishlistButton from '../components/wishlist/WishlistButton';
import PageTransition from '../components/animations/PageTransition';

function StarRating({ rating }) {
  return (
    <span className="stars" aria-label={`${rating?.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = Math.min(Math.max(rating - i, 0), 1);
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
            <Star size={14} fill="none" stroke="var(--color-camel, #C49A76)" strokeWidth={1.5} />
            {filled > 0 && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  width: `${filled * 100}%`,
                  display: 'flex',
                }}
              >
                <Star size={14} fill="var(--color-camel, #C49A76)" stroke="none" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

function SkeletonDetail() {
  return (
    <div className="pdp-skeleton-layout">
      <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: '4px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ height: '1rem', width: '40%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '2.5rem', width: '85%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '1rem', width: '30%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '5rem', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '1.5rem', width: '25%', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '3rem', borderRadius: '2px' }} />
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ onCartOpen }) {
  const { id } = useParams();
  const { addItem, isInCart } = useCart();
  const { isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setQuantity(1);
    setAdded(false);

    fetchProduct(id)
      .then((raw) => {
        if (cancelled) return;
        const p = normalizeProduct(raw);
        setProduct(p);

        // Fetch related products
        return fetchProductsByCategory(p.category, 5, 0).then((data) => {
          if (cancelled) return;
          const related = (data.products || [])
            .map(normalizeProduct)
            .filter((r) => r.id !== p.id)
            .slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Product not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    addItem(
      {
        id: product.id,
        title: product.title,
        price: discountedPrice ?? product.price,
        thumbnail: product.thumbnail || product.images?.[0] || '',
        image: product.thumbnail || product.images?.[0] || '',
        category: product.category,
        brand: product.brand,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const discountedPrice =
    product && product.discountPercentage > 0
      ? getDiscountedPrice(product.price, product.discountPercentage)
      : null;

  const maxQty = product?.stock ? Math.min(product.stock, 99) : 99;
  const inStock = product?.stock === null || product?.stock === undefined || product?.stock > 0;

  return (
    <PageTransition>
      <style>{`
        .pdp-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: clamp(1.75rem, 4vw, 3.5rem);
          align-items: start;
        }
        .pdp-skeleton-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 880px) {
          .pdp-grid-layout,
          .pdp-skeleton-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          paddingTop: '5rem',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

          {/* Loading */}
          {loading && <SkeletonDetail />}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <Package size={48} style={{ color: 'var(--color-accent)', opacity: 0.4, margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Product Not Found
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{error}</p>
              <Link to="/shop" className="btn-primary">Browse Shop</Link>
            </div>
          )}

          {/* Product Detail */}
          {!loading && product && (
            <>
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '2rem',
                  fontSize: '0.78rem',
                  color: 'var(--color-text-secondary)',
                  flexWrap: 'wrap',
                }}
              >
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  Home
                </Link>
                <ChevronRight size={12} />
                <Link to={`/shop?category=${product.category}`}
                  style={{ color: 'inherit', textDecoration: 'none', textTransform: 'capitalize' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  {product.category.replace(/-/g, ' ')}
                </Link>
                <ChevronRight size={12} />
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {product.title}
                </span>
              </nav>

              {/* Main 2-col layout */}
              <div className="pdp-grid-layout">
                {/* LEFT — Gallery */}
                <ProductGallery images={product.images} title={product.title} />

                {/* RIGHT — Details */}
                <div>
                  <p className="section-label" style={{ marginBottom: '0.75rem' }}>
                    {product.category.replace(/-/g, ' ')}
                  </p>

                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                      marginBottom: '1rem',
                    }}
                  >
                    {product.title}
                  </h1>

                  {/* Rating */}
                  {product.rating != null && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <StarRating rating={product.rating} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {product.rating.toFixed(1)} rating
                      </span>
                    </div>
                  )}

                  {/* Brand */}
                  {product.brand && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      By <strong style={{ color: 'var(--color-text-primary)' }}>{product.brand}</strong>
                    </p>
                  )}

                  {/* Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {formatPrice(discountedPrice ?? product.price)}
                    </span>
                    {discountedPrice != null && (
                      <>
                        <span className="price-original">{formatPrice(product.price)}</span>
                        <span className="discount-badge">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.75,
                      fontSize: '0.925rem',
                      marginBottom: '1.75rem',
                    }}
                  >
                    {product.description}
                  </p>

                  {/* Stock */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    {product.stock != null ? (
                      product.stock === 0 ? (
                        <span style={{ color: '#c0392b', fontSize: '0.8rem', fontWeight: 600 }}>
                          Out of Stock
                        </span>
                      ) : product.stock <= 10 ? (
                        <span style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                          Low Stock — only {product.stock} left
                        </span>
                      ) : (
                        <span style={{ color: '#4A8C5C', fontSize: '0.8rem', fontWeight: 600 }}>
                          In Stock ({product.stock} available)
                        </span>
                      )
                    ) : (
                      <span style={{ color: '#4A8C5C', fontSize: '0.8rem', fontWeight: 600 }}>In Stock</span>
                    )}
                  </div>

                  {/* Quantity + Add to Cart */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      {/* Quantity */}
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1 || !inStock}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value" aria-live="polite">{quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                          disabled={quantity >= maxQty || !inStock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        className="btn-primary"
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          minWidth: '180px',
                          opacity: !inStock ? 0.5 : 1,
                          cursor: !inStock ? 'not-allowed' : 'pointer',
                        }}
                        onClick={handleAddToCart}
                        disabled={!inStock}
                      >
                        <ShoppingBag size={16} />
                        {!inStock
                          ? 'Out of Stock'
                          : added
                          ? 'Added to Bag ✓'
                          : isInCart(product.id)
                          ? 'Update Bag'
                          : 'Add to Bag'}
                      </button>
                    </div>

                    {/* Wishlist */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <WishlistButton product={product} size={18} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {isWishlisted(product.id) ? 'Saved to Wishlist' : 'Save to Wishlist'}
                      </span>
                    </div>

                    {/* View bag link after adding */}
                    {added && onCartOpen && (
                      <button
                        className="btn-ghost"
                        onClick={onCartOpen}
                        style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
                      >
                        View Bag →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div style={{ marginTop: '5rem' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <p className="section-label">MORE LIKE THIS</p>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                        marginTop: '0.5rem',
                      }}
                    >
                      You Might Also Like
                    </h2>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {relatedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link
                      to={`/shop?category=${product.category}`}
                      className="btn-secondary"
                    >
                      See All in {product.category.replace(/-/g, ' ')}
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

