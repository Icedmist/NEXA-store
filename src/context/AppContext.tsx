import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role, CartItem, Product } from '@/data/demo';

interface AppState {
  role: Role | null;
  storeName: string;
  cart: CartItem[];
}

interface AppContextType extends AppState {
  setRole: (role: Role | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [storeName] = useState('Downtown Flagship');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== productId));
    } else {
      setCart(prev => prev.map(i => i.id === productId ? { ...i, qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const logout = useCallback(() => {
    setRole(null);
    setCart([]);
  }, []);

  return (
    <AppContext.Provider value={{
      role, setRole, storeName, cart,
      addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount, logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
