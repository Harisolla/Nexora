import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_TOASTS = 3;

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    color: 'sienna',          // var(--color-accent) alias in spec
    border: '#A0522D',
  },
  error: {
    icon: AlertCircle,
    color: '#E53E3E',
    border: '#C53030',
  },
  info: {
    icon: Info,
    color: '#C19A6B',         // camel
    border: '#A07850',
  },
};

// ─── Individual Toast ────────────────────────────────────────────────────────
function Toast({ id, message, type = 'success', onDismiss }) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{
        background: 'var(--color-elevated)',
        border: '1px solid var(--color-border)',
        borderLeft: `3px solid ${config.border}`,
        borderRadius: 8,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 280,
        maxWidth: 380,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        pointerEvents: 'all',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <IconComponent size={18} color={config.color} style={{ flexShrink: 0 }} />

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: '0.875rem',
          color: 'var(--color-text-primary)',
          lineHeight: 1.4,
        }}
      >
        {message}
      </span>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-text-secondary)',
          flexShrink: 0,
          borderRadius: 4,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setToasts(prev => {
      // Enforce max 3 — drop the oldest if at limit
      const next = prev.length >= MAX_TOASTS ? prev.slice(1) : prev;
      return [...next, { id, message, type }];
    });

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container — fixed, bottom-center */}
      <div
        className="toast-container"
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
        aria-label="Notifications"
      >
        <AnimatePresence mode="sync">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onDismiss={dismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * Returns `showToast(message, type?, duration?)` to fire a toast notification.
 *
 * Must be used inside a <ToastProvider>.
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}
