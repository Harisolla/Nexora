import { motion } from 'framer-motion';

/**
 * EmptyState
 *
 * Props:
 *   icon        – React component (e.g. lucide icon) rendered at 48×48
 *   title       – Heading text
 *   description – Supporting paragraph text
 *   actionLabel – Label for the optional CTA button
 *   onAction    – Click handler for the CTA (renders a <button>)
 *   actionHref  – Href for the CTA (renders an <a>); onAction takes precedence
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}) {
  const hasAction = Boolean(actionLabel && (onAction || actionHref));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        width: '100%',
      }}
    >
      {/* Icon */}
      {Icon && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            color: 'var(--color-accent)',
          }}
          aria-hidden="true"
        >
          <Icon size={36} strokeWidth={1.5} />
        </div>
      )}

      {/* Title */}
      {title && (
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 8px 0',
          }}
        >
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            maxWidth: 380,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}

      {/* Action */}
      {hasAction && (
        onAction ? (
          <button
            className="btn-primary"
            onClick={onAction}
            style={{ marginTop: 20 }}
          >
            {actionLabel}
          </button>
        ) : (
          <a
            href={actionHref}
            className="btn-secondary"
            style={{ marginTop: 20, display: 'inline-block', textDecoration: 'none' }}
          >
            {actionLabel}
          </a>
        )
      )}
    </motion.div>
  );
}
