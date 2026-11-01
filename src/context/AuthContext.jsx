/**
 * NEXORA — AuthContext
 * Client-side authentication context persisted via localStorage.
 * Supports login, signup, demo one-click auth, and logout.
 */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'nexora_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore quota errors
    }
  }, [user]);

  const login = async (email, _password) => {
    // Simulated network authentication delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const formattedName = email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const newUser = {
      id: `usr_${Date.now()}`,
      name: formattedName || 'Collector',
      email,
      avatarInitial: (formattedName[0] || 'N').toUpperCase(),
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      token: `demo_token_${Date.now()}`,
    };

    setUser(newUser);
    return newUser;
  };

  const signup = async (name, email, _password) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatarInitial: (name.trim()[0] || 'N').toUpperCase(),
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      token: `demo_token_${Date.now()}`,
    };

    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

