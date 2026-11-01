/**
 * NEXORA — Cart Context
 * Manages shopping cart state with localStorage persistence.
 * Each item: { id, title, price, image, quantity, brand, category }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem('nexora-cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item) => {
          const img =
            item.image ||
            item.thumbnail ||
            (Array.isArray(item.images) ? item.images[0] : null) ||
            '';
          return {
            ...item,
            image: img,
            thumbnail: img,
          };
        })
      : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.payload.id);
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(i.quantity + (action.payload.quantity || 1), 99) }
            : i
        );
      }
      return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload);
    case 'UPDATE_QTY':
      if (action.payload.qty < 1) return state.filter(i => i.id !== action.payload.id);
      return state.map(i =>
        i.id === action.payload.id
          ? { ...i, quantity: Math.min(action.payload.qty, 99) }
          : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('nexora-cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product, qty = 1) => {
    const img =
      product.image ||
      product.thumbnail ||
      (Array.isArray(product.images) ? product.images[0] : null) ||
      '';
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        image: img,
        thumbnail: img,
        quantity: qty,
      },
    });
  };

  const removeItem = (id) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id });

  const updateQty = (id, qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });

  const clearCart = () =>
    dispatch({ type: 'CLEAR_CART' });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isInCart = (id) => items.some(i => i.id === id);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, totalPrice, isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

