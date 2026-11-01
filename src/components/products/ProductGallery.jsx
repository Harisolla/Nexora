/**
 * NEXORA — Product Gallery
 * Image gallery with thumbnail navigation and zoom effect.
 */
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images = [], title = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState({});

  function handleError(index) {
    setImgError((prev) => ({ ...prev, [index]: true }));
  }

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  const currentSrc = images[activeIndex];
  const hasMultiple = images.length > 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          aspectRatio: '4/3',
        }}
      >
        {currentSrc && !imgError[activeIndex] ? (
          <img
            src={currentSrc}
            alt={`${title} — image ${activeIndex + 1}`}
            onError={() => handleError(activeIndex)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform',
              padding: '1rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            Image unavailable
          </div>
        )}

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--color-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '50%',
                width: '2.25rem',
                height: '2.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                transition: 'all 0.2s ease',
                opacity: 0.85,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--color-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '50%',
                width: '2.25rem',
                height: '2.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                transition: 'all 0.2s ease',
                opacity: 0.85,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Counter */}
        {hasMultiple && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.75rem',
              background: 'rgba(37,27,22,0.6)',
              color: '#F5F0E7',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              letterSpacing: '0.05em',
            }}
          >
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultiple && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                flexShrink: 0,
                width: '72px',
                height: '72px',
                border: i === activeIndex
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--color-border)',
                borderRadius: '3px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--color-surface)',
                padding: 0,
                transition: 'border-color 0.2s ease',
                opacity: imgError[i] ? 0.3 : 1,
              }}
            >
              {!imgError[i] && (
                <img
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  onError={() => handleError(i)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

