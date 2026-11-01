import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button
 *
 * Props:
 *   variant   – 'primary' | 'secondary' | 'ghost'  (default: 'primary')
 *   size      – 'sm' | 'md' | 'lg'                 (default: 'md')
 *   loading   – boolean; shows spinner and disables interaction
 *   disabled  – boolean; reduces opacity
 *   className – additional class names
 *   children  – button content
 *   as        – element type or component (e.g. Link); default is 'button'
 *   ...rest   – all other standard button / anchor / Link props
 */
const SIZE_STYLES = {
  sm: { padding: '6px 14px',  fontSize: '0.8125rem', gap: 6  },
  md: { padding: '10px 22px', fontSize: '0.9375rem', gap: 8  },
  lg: { padding: '13px 30px', fontSize: '1.0625rem', gap: 10 },
};

const VARIANT_CLASS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
};

const Button = React.forwardRef(function Button(
  {
    variant   = 'primary',
    size      = 'md',
    loading   = false,
    disabled  = false,
    className = '',
    children,
    as: Component = 'button',
    style,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const sizeStyle  = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const variantCls = VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary;

  // Compose classes
  const classes = [variantCls, className].filter(Boolean).join(' ');

  // Extra props for native <button> elements
  const buttonProps =
    Component === 'button'
      ? { type: rest.type ?? 'button', disabled: isDisabled }
      : {};

  return (
    <Component
      ref={ref}
      className={classes}
      aria-disabled={isDisabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'opacity 0.15s, background 0.15s, color 0.15s',
        textDecoration: 'none',
        ...style,
      }}
      {...buttonProps}
      {...rest}
    >
      {/* Spinner */}
      {loading && (
        <Loader2
          size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
          style={{
            animation: 'spin 0.75s linear infinite',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      {children}
    </Component>
  );
});

export default Button;
