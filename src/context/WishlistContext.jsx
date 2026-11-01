/**
 * NEXORA — Wishlist Context
 * Manages wishlist state with localStorage persistence.
 * Stores full product objects for offline display.
 */
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

function loadWishlist() {
  try {
    const raw = localStorage.getItem('nexora-wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    try {
      localStorage.setItem('nexora-wishlist', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      if (prev.some(i => i.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeItem = (id) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const toggleItem = (product) => {
    if (items.some(i => i.id === product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const isWishlisted = (id) => items.some(i => i.id === id);
  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items, addItem, removeItem, toggleItem, isWishlisted, totalItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

