/**
 * NEXORA — LoginPage
 * Minimalist luxury authentication page with validation,
 * 1-click demo login, password toggle, and smooth feedback.
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import PageTransition from '../components/animations/PageTransition';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const from = location.state?.from?.pathname || '/shop';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDemoFill = () => {
    setEmail('alexandra.vance@nexora.luxury');
    setPassword('ArchivalPass2026!');
    setErrors({});
  };

  const validate = () => {
    const errs = {};
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
      const loggedUser = await login(email, password);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      navigate(from, { replace: true });
    } catch {
      setErrors({ form: 'Authentication failed. Please verify credentials.' });
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, show friendly session card
  if (isAuthenticated) {
    return (
      <PageTransition>
        <main
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'var(--color-highlight)',
                color: 'var(--color-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              {user?.avatarInitial || <UserCheck size={26} />}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Signed In as {user?.name}
            </h1>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
              {user?.email}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/shop" className="btn-primary" style={{ justifyContent: 'center' }}>
                Explore Catalogue
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  showToast('You have been signed out.', 'info');
                }}
                className="btn-secondary"
                style={{ justifyContent: 'center' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </main>
      </PageTransition>
    );
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
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
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
              Welcome Back
            </h1>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Sign in to manage your bag, wishlist, and private orders.
            </p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.85rem',
              backgroundColor: 'var(--color-bg)',
              border: '1px dashed var(--color-border)',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--color-accent)',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.backgroundColor = 'var(--color-highlight)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.backgroundColor = 'var(--color-bg)';
            }}
          >
            <Sparkles size={13} />
            <span>Click to Autofill Demo Credentials</span>
          </button>

          {/* Form */}
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

            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="login-email"
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
                  id="login-email"
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
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.45rem',
                }}
              >
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => showToast('Demo hint: Any password with 6+ chars works.', 'info')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.74rem',
                    color: 'var(--color-accent)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Forgot password?
                </button>
              </div>

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
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

              {errors.password && (
                <div style={{ color: '#C2410C', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.75rem',
              }}
            >
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: 'var(--color-accent)',
                  cursor: 'pointer',
                  width: '15px',
                  height: '15px',
                }}
              />
              <label
                htmlFor="remember-me"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                Keep me signed in
              </label>
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
                  <span>Signing In…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer switch to Signup */}
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
            New to NEXORA?{' '}
            <Link
              to="/signup"
              style={{
                color: 'var(--color-accent)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Create an Account
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}

