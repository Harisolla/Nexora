/**
 * NEXORA — CheckoutPage
 * Demo checkout — no real payments or orders processed.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import PageTransition from '../components/animations/PageTransition';

const INITIAL_FORM = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  country: '',
  zip: '',
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => `NEXORA-${Math.floor(10000 + Math.random() * 90000)}`);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  }

  function validate() {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'country', 'zip'];
    const errs = {};
    required.forEach((key) => {
      if (!form[key].trim()) errs[key] = 'This field is required';
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    clearCart();
    setOrderPlaced(true);
  }

  // Success state
  if (orderPlaced) {
    return (
      <PageTransition>
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            paddingTop: '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 1.5rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              textAlign: 'center',
              backgroundColor: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '3rem 2rem',
            }}
          >
            <CheckCircle
              size={56}
              style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem' }}
            />
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Order Placed!
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {orderNumber}
            </p>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '0.75rem',
              }}
            >
              Thank you for testing NEXORA. This was a frontend demonstration — no real order was placed or payment processed.
            </p>
            <div
              style={{
                background: 'var(--color-highlight)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                padding: '0.75rem',
                marginBottom: '2rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              ⚠ DEMO MODE — No charges applied.
            </div>
            <Link to="/shop" className="btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <PageTransition>
        <div
          style={{
            minHeight: '80vh',
            backgroundColor: 'var(--color-bg)',
            paddingTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 1.5rem',
            textAlign: 'center',
            gap: '1.25rem',
          }}
        >
          <ShoppingBag size={56} style={{ color: 'var(--color-accent)', opacity: 0.4 }} />
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Your bag is empty
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Add some products before checking out.
          </p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </PageTransition>
    );
  }

  const shipping = 0;
  const total = totalPrice + shipping;

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  };
  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--color-text-secondary)',
  };

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          paddingTop: '5rem',
        }}
      >
        <style>{`
          .checkout-grid-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
            gap: 3rem;
            align-items: start;
          }
          .checkout-2col-fields {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          @media (max-width: 880px) {
            .checkout-grid-layout {
              grid-template-columns: 1fr !important;
              gap: 2.25rem !important;
            }
          }
          @media (max-width: 520px) {
            .checkout-2col-fields {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
          }
        `}</style>

        {/* Demo Notice */}
        <div
          style={{
            backgroundColor: 'var(--color-highlight)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0.75rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-secondary)',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={14} style={{ color: 'var(--color-accent)' }} />
          DEMO CHECKOUT — No real orders are placed. No payment is required or processed.
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          {/* Heading */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="section-label">NEXORA CHECKOUT</p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                marginTop: '0.5rem',
              }}
            >
              Complete Your Order
            </h1>
          </div>

          <div className="checkout-grid-layout">
            {/* FORM */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Contact */}
              <div style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-primary)',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.75rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  Contact
                </h2>
                <div style={fieldStyle}>
                  <label htmlFor="email" style={labelStyle}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your@email.com"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" style={{ color: '#c0392b', fontSize: '0.75rem' }}>{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-primary)',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.75rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  Shipping Address
                </h2>

                <div
                  className="checkout-2col-fields"
                  style={{ marginBottom: '1rem' }}
                >
                  {[
                    { id: 'firstName', label: 'First Name', placeholder: 'Jane' },
                    { id: 'lastName', label: 'Last Name', placeholder: 'Doe' },
                  ].map(({ id, label, placeholder }) => (
                    <div key={id} style={fieldStyle}>
                      <label htmlFor={id} style={labelStyle}>{label}</label>
                      <input
                        id={id}
                        name={id}
                        value={form[id]}
                        onChange={handleChange}
                        className="input-field"
                        placeholder={placeholder}
                      />
                      {errors[id] && (
                        <p style={{ color: '#c0392b', fontSize: '0.75rem' }}>{errors[id]}</p>
                      )}
                    </div>
                  ))}
                </div>

                {[
                  { id: 'address', label: 'Street Address', placeholder: '123 Main Street' },
                  { id: 'city', label: 'City', placeholder: 'New York' },
                ].map(({ id, label, placeholder }) => (
                  <div key={id} style={{ ...fieldStyle, marginBottom: '1rem' }}>
                    <label htmlFor={id} style={labelStyle}>{label}</label>
                    <input
                      id={id}
                      name={id}
                      value={form[id]}
                      onChange={handleChange}
                      className="input-field"
                      placeholder={placeholder}
                    />
                    {errors[id] && (
                      <p style={{ color: '#c0392b', fontSize: '0.75rem' }}>{errors[id]}</p>
                    )}
                  </div>
                ))}

                <div className="checkout-2col-fields">
                  {[
                    { id: 'country', label: 'Country', placeholder: 'United States' },
                    { id: 'zip', label: 'ZIP / Postal Code', placeholder: '10001' },
                  ].map(({ id, label, placeholder }) => (
                    <div key={id} style={fieldStyle}>
                      <label htmlFor={id} style={labelStyle}>{label}</label>
                      <input
                        id={id}
                        name={id}
                        value={form[id]}
                        onChange={handleChange}
                        className="input-field"
                        placeholder={placeholder}
                      />
                      {errors[id] && (
                        <p style={{ color: '#c0392b', fontSize: '0.75rem' }}>{errors[id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-primary)',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.75rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  Payment
                </h2>
                <div
                  style={{
                    backgroundColor: 'var(--color-highlight)',
                    border: '1px dashed var(--color-border)',
                    borderRadius: '4px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                    Demo Mode — No Payment Required
                  </strong>
                  This is a frontend demonstration. No real payment gateway is connected.
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem 2rem', fontSize: '0.85rem' }}
              >
                Place Demo Order
              </button>
            </form>

            {/* ORDER SUMMARY */}
            <div
              style={{
                backgroundColor: 'var(--color-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '1.75rem',
                position: 'sticky',
                top: '6rem',
              }}
            >
              <h2
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                Order Summary
              </h2>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {items.map((item) => {
                  const displayImage =
                    item.thumbnail ||
                    item.image ||
                    (Array.isArray(item.images) ? item.images[0] : null);
                  return (
                    <div
                      key={item.id}
                      style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          flexShrink: 0,
                          borderRadius: '3px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          padding: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                            {(item.title?.[0] || 'N').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: 'var(--color-text-primary)',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: 'var(--color-text-primary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                  <span style={{ color: '#4A8C5C', fontWeight: 600 }}>Free</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '0.75rem',
                    marginTop: '0.25rem',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

