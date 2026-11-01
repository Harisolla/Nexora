
import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import './App.css';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

// UI
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import CartDrawer from './components/cart/CartDrawer';
import SearchOverlay from './components/search/SearchOverlay';
import ThemeToggle from './components/layout/ThemeToggle';

// Pages (lazy-loaded for performance)
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Animated routes wrapper (needs useLocation inside BrowserRouter)
function AnimatedRoutes({ onCartOpen }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage onCartOpen={onCartOpen} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

// App Shell — manages drawer/overlay states
function AppShell() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />

      <main style={{ flex: 1 }}>
        <AnimatedRoutes onCartOpen={() => setCartOpen(true)} />
      </main>

      <Footer />

      {/* Global overlays */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Global Floating Theme Toggle */}
      <ThemeToggle floating />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <BrowserRouter>
                <ScrollToTop />
                <AppShell />
              </BrowserRouter>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
