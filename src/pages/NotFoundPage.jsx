/**
 * NEXORA — NotFoundPage
 */
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(5rem, 18vw, 10rem)',
          fontWeight: 800,
          color: 'var(--color-accent)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          opacity: 0.9,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-display)',
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '360px',
          marginBottom: '2.5rem',
          lineHeight: 1.7,
          fontSize: '0.95rem',
        }}
      >
        The page you're looking for doesn't exist or has been moved to a new address.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/shop" className="btn-secondary">Browse Shop</Link>
      </div>
    </div>
  );
}

