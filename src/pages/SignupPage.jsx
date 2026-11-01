/**
 * NEXORA — SignupPage
 * Minimalist luxury registration page with live validation,
 * password strength indicator, and seamless authentication.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import PageTransition from '../components/animations/PageTransition';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength calculator
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'transparent', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#EF4444', width: '30%' };
    const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(password);
    if (password.length >= 8 && hasNumberOrSpecial) {
      return { label: 'Strong', color: '#10B981', width: '100%' };
    }
    return { label: 'Good', color: '#F59E0B', width: '65%' };
  };

  const strength = getPasswordStrength();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!agreedTerms) {
      errs.terms = 'Please accept the terms to proceed.';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const newUser = await signup(name, email, password);
      showToast(`Welcome to NEXORA, ${newUser.name}!`, 'success');
      navigate('/shop', { replace: true });
    } catch {
      setErrors({ form: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/shop', { replace: true });
    return null;
  }

  return (
    <PageTransition>
      <main
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem) 1.5rem',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4.5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 20px 48px -12px rgba(53, 39, 32, 0.08)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: 'var(--color-accent)',
                display: 'inline-block',
                marginBottom: '0.85rem',
              }}
            >
              NEXORA
            </Link>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                margin: '0 0 0.4rem 0',
              }}
            >
              Create Your Account
            </h1>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Join NEXORA for curated collections, private wishlist, and priority orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'rgba(194, 65, 12, 0.1)',
                  border: '1px solid rgba(194, 65, 12, 0.3)',
                  borderRadius: '6px',
                  color: '#C2410C',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                {errors.form}
              </div>
            )}

            {/* Name Field */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="signup-name"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.45rem',
                }}
              >
                Full Name
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'var(--color-bg)',
                  border: `1.5px solid ${errors.name ? '#C2410C' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  padding: '0 0.85rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <User size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Julian Vance"
                  autoComplete="name"
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    padding: '0.7rem 0',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {errors.name && (
                <div style={{ color: '#C2410C', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="signup-email"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.45rem',
                }}
              >
                Email Address
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'var(--color-bg)',
                  border: `1.5px solid ${errors.email ? '#C2410C' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  padding: '0 0.85rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <Mail size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@domain.com"
                  autoComplete="email"
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    padding: '0.7rem 0',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {errors.email && (
                <div style={{ color: '#C2410C', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="signup-password"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.45rem',
                }}
              >
                Password
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'var(--color-bg)',
                  border: `1.5px solid ${errors.password ? '#C2410C' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  padding: '0 0.85rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <Lock size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    padding: '0.7rem 0',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div style={{ marginTop: '0.45rem' }}>
                  <div
                    style={{
                      height: '3px',
                      width: '100%',
                      backgroundColor: 'var(--color-border)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: strength.width,
                        backgroundColor: strength.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: strength.color,
                      fontWeight: 600,
                      marginTop: '0.25rem',
                      textAlign: 'right',
                    }}
                  >
                    Strength: {strength.label}
                  </div>
                </div>
              )}

              {errors.password && (
                <div style={{ color: '#C2410C', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="signup-confirm-password"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.45rem',
                }}
              >
                Confirm Password
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'var(--color-bg)',
                  border: `1.5px solid ${errors.confirmPassword ? '#C2410C' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  padding: '0 0.85rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <Lock size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    padding: '0.7rem 0',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {errors.confirmPassword && (
                <div style={{ color: '#C2410C', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => {
                    setAgreedTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  style={{
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                    width: '15px',
                    height: '15px',
                    marginTop: '2px',
                  }}
                />
                <label
                  htmlFor="agree-terms"
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.45,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  I agree to the Terms of Service & Privacy Policy, and consent to receiving editorial notifications.
                </label>
              </div>

              {errors.terms && (
                <div style={{ color: '#C2410C', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                  {errors.terms}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem 1.5rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Creating Account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer switch to Login */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border)',
              textAlign: 'center',
              fontSize: '0.84rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--color-accent)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}

