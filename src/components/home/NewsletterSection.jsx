/**
 * NEXORA — NewsletterSection (Stay in the Loop)
 * Architectural editorial newsletter component with interactive validation,
 * simulated subscription feedback, one-click welcome promo code copy,
 * and luxury micro-interactions.
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PERKS = [
  { label: 'Private Previews', desc: '48h early access to seasonal capsules' },
  { label: 'Archival Notes', desc: 'Behind-the-scenes material provenance' },
  { label: 'Inaugural Gift', desc: '10% privilege code upon admission' },
];

export default function NewsletterSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // GSAP scroll trigger reveal animation
  useGSAP(
    () => {
      if (!sectionRef.current || !cardRef.current) return;

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter your email address to request invitation.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g., name@domain.com).');
      return;
    }

    // Simulate luxury API subscription dispatch
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 700);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('NEXORA10').catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const handleReset = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
    setCopiedCode(false);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(4.5rem, 8vw, 7.5rem) 1.5rem',
        backgroundColor: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Newsletter Subscription"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(320px, 60vw, 750px)',
          height: 'clamp(320px, 60vw, 750px)',
          background: 'radial-gradient(circle, rgba(169, 80, 50, 0.08) 0%, rgba(169, 80, 50, 0.02) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        ref={cardRef}
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem)',
          boxShadow: '0 20px 48px -12px rgba(53, 39, 32, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative watermark */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-2rem',
            right: '-1rem',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 14vw, 11rem)',
            fontWeight: 800,
            letterSpacing: '-0.06em',
            color: 'var(--color-text-primary)',
            opacity: 0.03,
            lineHeight: 0.8,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          NEXORA
        </div>

        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'var(--color-highlight)',
              border: '1px solid var(--color-border)',
              borderRadius: '9999px',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={12} />
            <span>Stay In The Loop • Private Circle</span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.85rem, 4.2vw, 3rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            Be First When the Vault Opens.
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Join our private circle of collectors and design enthusiasts. Receive archival release dispatches, 
            curator monographs, and private invitations before public access.
          </p>

          {/* Subscription State vs Success State */}
          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Form wrapper */}
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '520px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'var(--color-bg)',
                      border: `1.5px solid ${
                        status === 'error'
                          ? '#C2410C'
                          : isFocused
                          ? 'var(--color-accent)'
                          : 'var(--color-border)'
                      }`,
                      borderRadius: '10px',
                      padding: '0.35rem 0.4rem 0.35rem 0.9rem',
                      boxShadow: isFocused
                        ? '0 0 0 3px rgba(169, 80, 50, 0.14), 0 4px 16px rgba(0, 0, 0, 0.04)'
                        : '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.22s var(--ease-smooth)',
                    }}
                  >
                    <Mail
                      size={18}
                      style={{
                        color: isFocused ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        flexShrink: 0,
                        transition: 'color 0.2s ease',
                      }}
                      aria-hidden="true"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Enter your personal or studio email…"
                      aria-label="Email address for private circle"
                      disabled={status === 'loading'}
                      style={{
                        flex: '1 1 200px',
                        minWidth: 0,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--color-text-primary)',
                        padding: '0.45rem 0',
                      }}
                    />

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary"
                      style={{
                        padding: '0.7rem 1.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        borderRadius: '7px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        flexShrink: 0,
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: status === 'loading' ? 0.8 : 1,
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                          <span>Requesting…</span>
                        </>
                      ) : (
                        <>
                          <span>Request Invitation</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Inline Error Message */}
                  {status === 'error' && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: '#C2410C',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        textAlign: 'center',
                      }}
                      role="alert"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                </form>
              </motion.div>
            ) : (
              /* Success State Confirmation */
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '2rem 1.5rem',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(169, 80, 50, 0.12)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.25rem',
                  }}
                >
                  <CheckCircle2 size={26} strokeWidth={2.3} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  Welcome to the NEXORA Circle
                </h3>

                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.55,
                    margin: 0,
                    maxWidth: '440px',
                  }}
                >
                  Your inaugural dispatch has been reserved. Please accept this 10% complimentary privilege code for your first acquisition:
                </p>

                {/* Promo Code Pill with Copy Action */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    backgroundColor: 'var(--color-surface)',
                    border: '1.5px dashed var(--color-accent)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.9rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: 'var(--color-accent)',
                    }}
                  >
                    NEXORA10
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: copiedCode ? 'var(--color-accent)' : 'var(--color-highlight)',
                      color: copiedCode ? '#FAF7F1' : 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '5px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {copiedCode ? (
                      <>
                        <Check size={12} strokeWidth={3} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    padding: '0.2rem',
                  }}
                >
                  Register another address
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editorial Perks Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--color-border)',
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}
          >
            {PERKS.map((perk, i) => (
              <div
                key={i}
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span style={{ color: 'var(--color-accent)', fontSize: '0.65rem' }}>✦</span>
                  <span>{perk.label}</span>
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.45,
                  }}
                >
                  {perk.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Discreet Privacy & Architecture Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.74rem',
              color: 'var(--color-text-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--color-accent)', opacity: 0.9 }} />
            <span>Digital sanctuary pledge: Bi-weekly dispatches only. Unsubscribe with 1 click.</span>
          </div>

          <p
            style={{
              fontSize: '0.67rem',
              color: 'var(--color-text-secondary)',
              opacity: 0.6,
              marginTop: '0.5rem',
              marginBottom: 0,
            }}
          >
            *Interactive client simulation — no external data harvested.
          </p>
        </div>
      </div>
    </section>
  );
}

