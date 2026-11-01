import React from 'react';

/**
 * IconButton
 *
 * Accessible icon-only button with optional badge.
 *
 * Props:
 *   icon      – React element (e.g. <ShoppingCart />) or component
 *   label     – aria-label string (required for accessibility)
 *   onClick   – click handler
 *   active    – boolean; tints the icon with var(--color-accent)
 *   className – additional class names
 *   size      – icon pixel size (default 20)
 *   badge     – number; when provided and > 0, shows a count badge
 *   ...rest   – any other button props
 */
const IconButton = React.forwardRef(function IconButton(
  {
    icon,
    label,
    onClick,
    active = false,
    className = '',
    size = 20,
    badge,
    style,
    ...rest
  },
  ref,
) {
  // Render icon: support both element and component
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon, { size, 'aria-hidden': true })
    : icon
    ? React.createElement(icon, { size, 'aria-hidden': true })
    : null;

  const showBadge = badge !== undefined && badge !== null && Number(badge) > 0;

  return (
    <button
      ref={ref}
      type="button"
      className={['icon-btn', className].filter(Boolean).join(' ')}
      aria-label={label}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 6,
        borderRadius: 8,
        color: active ? 'var(--color-accent)' : 'inherit',
        transition: 'color 0.15s, background 0.15s',
        ...style,
      }}
      {...rest}
    >
      {/* Icon */}
      {renderedIcon}

      {/* Badge */}
      {showBadge && (
        <span
          className="badge"
          aria-label={`${badge} items`}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 8,
            fontSize: '0.65rem',
            fontWeight: 700,
            lineHeight: '16px',
            textAlign: 'center',
            background: 'var(--color-accent)',
            color: '#fff',
            pointerEvents: 'none',
          }}
        >
          {Number(badge) > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
});

export default IconButton;
