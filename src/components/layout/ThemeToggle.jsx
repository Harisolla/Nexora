/**
 * NEXORA — ThemeToggle
 * Animated sun/moon icon button for toggling light/dark mode.
 * Supports both global floating FAB mode and inline mode.
 */
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ floating = false }) {
  const { isDark, toggleTheme } = useTheme();

  if (floating) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'fixed',
          bottom: 'clamp(1.25rem, 3vw, 2.25rem)',
          right: 'clamp(1.25rem, 3vw, 2.25rem)',
          zIndex: 45,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease, box-shadow 0.25s ease, background-color 0.2s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(169, 80, 50, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.92)';
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            pointerEvents: 'none',
            color: 'var(--color-accent)',
          }}
        >
          <Sun size={20} strokeWidth={2} />
        </span>

        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            pointerEvents: 'none',
            color: 'var(--color-text-primary)',
          }}
        >
          <Moon size={19} strokeWidth={2} />
        </span>
      </button>
    );
  }

  // Inline mode (e.g. inside drawer)
  return (
    <button
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      {/* Sun icon — visible in dark mode */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <Sun size={18} strokeWidth={1.75} />
      </span>

      {/* Moon icon — visible in light mode */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <Moon size={18} strokeWidth={1.75} />
      </span>

      {/* Invisible spacer so the button keeps its 2.5rem size */}
      <span aria-hidden="true" style={{ visibility: 'hidden' }}>
        <Sun size={18} />
      </span>
    </button>
  );
}
