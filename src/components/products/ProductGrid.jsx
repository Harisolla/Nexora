/**
 * NEXORA — Product Grid
 * Renders a responsive grid of ProductCard components.
 */
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

export default function ProductGrid({ products, loading, error, onRetry }) {
  if (loading) {
    return <ProductSkeleton count={12} />;
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          {error}
        </p>
        {onRetry && (
          <button className="btn-secondary" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>🔍</div>
        <p style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
          No products found
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

