/**
 * NEXORA — WishlistButton Component
 * Reusable animated heart toggle button for adding/removing wishlist items.
 */
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

// ── Animation variants ────────────────────────────────────────────────────────
const heartVariants = {
  idle: { scale: 1 },
  toggled: {
    scale: [1, 1.4, 0.9, 1.1, 1],
    transition: {
      duration: 0.38,
      ease: 'easeInOut',
      times: [0, 0.3, 0.55, 0.75, 1],
    },
  },
};

/**
 * WishlistButton
 * @param {{
 *   product: object,
 *   className?: string,
 *   size?: number
 * }} props
 */
export default function WishlistButton({ product, className = '', size = 18 }) {
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product?.id);

  const handleToggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (product) toggleItem(product);
    },
    [toggleItem, product]
  );

  return (
    <motion.button
      className={`icon-btn${className ? ` ${className}` : ''}`}
      onClick={handleToggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wishlisted}
      variants={heartVariants}
      animate={wishlisted ? 'toggled' : 'idle'}
      whileTap={{ scale: 0.85 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.35rem',
        borderRadius: '50%',
        lineHeight: 1,
      }}
    >
      <Heart
        size={size}
        aria-hidden="true"
        style={{
          fill: wishlisted ? 'var(--color-accent)' : 'none',
          color: wishlisted ? 'var(--color-accent)' : 'currentColor',
          transition: 'fill 0.2s ease, color 0.2s ease',
          pointerEvents: 'none',
        }}
      />
    </motion.button>
  );
}
