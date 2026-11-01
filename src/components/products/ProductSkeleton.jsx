/**
 * NEXORA — ProductSkeleton Component
 * Loading placeholder cards with shimmer animation.
 * Mirrors the exact layout of ProductCard.
 */

/**
 * A single skeleton card
 */
function SkeletonCard() {
  return (
    <article
      className="card"
      aria-hidden="true"
      style={{ overflow: 'hidden', pointerEvents: 'none' }}
    >
      {/* Image placeholder */}
      <div
        className="skeleton aspect-product"
        style={{ borderRadius: 0 }}
        role="presentation"
      />

      {/* Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Category label */}
        <div
          className="skeleton"
          style={{ height: '0.65rem', width: '40%', borderRadius: '4px' }}
        />

        {/* Title — 2 lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div
            className="skeleton"
            style={{ height: '0.85rem', width: '90%', borderRadius: '4px' }}
          />
          <div
            className="skeleton"
            style={{ height: '0.85rem', width: '70%', borderRadius: '4px' }}
          />
        </div>

        {/* Stars row */}
        <div
          className="skeleton"
          style={{ height: '0.7rem', width: '55%', borderRadius: '4px' }}
        />

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: '0.5rem' }} />

        {/* Price line */}
        <div
          className="skeleton"
          style={{ height: '1rem', width: '45%', borderRadius: '4px', marginTop: '0.25rem' }}
        />

        {/* Button placeholder */}
        <div
          className="skeleton"
          style={{ height: '2.25rem', width: '100%', borderRadius: '6px', marginTop: '0.35rem' }}
        />
      </div>
    </article>
  );
}

/**
 * ProductSkeleton
 * Renders `count` skeleton cards in a responsive grid.
 *
 * @param {{ count?: number }} props
 */
export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
