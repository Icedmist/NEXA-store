import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { stores as initialStores, staff as initialStaff, Store, StaffMember, Role, CartItem, Product } from '@/data/demo';

interface AppContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  storeName: string | null;
  stores: Store[];
  staff: StaffMember[];
  notifications: any[];
  setStoreName: (name: string | null) => void;
  registerStore: (name: string, email: string) => Promise<void>;
  addStore: (store: Omit<Store, 'id' | 'code' | 'revenue' | 'transactions'>) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  addStaff: (member: Omit<StaffMember, 'id' | 'initials'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  logActivity: (action: string, user: string, storeId?: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem('nexa-role');
    return saved ? (JSON.parse(saved) as Role) : 'admin';
  });
  const [storeName, setStoreName] = useState<string | null>('Downtown Flagship');
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nexa-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem('nexa-role', JSON.stringify(role));
    } else {
      localStorage.removeItem('nexa-role');
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('nexa-cart', JSON.stringify(cart));
  }, [cart]);

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

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('nexa-cart');
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const logout = useCallback(() => {
    setRole(null);
    clearCart();
  }, [clearCart]);

  const registerStore = async (name: string, email: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setStoreName(name);
        setRole('admin');
        resolve();
      }, 1500);
    });
  };

  const addStore = (store: Omit<Store, 'id' | 'code' | 'revenue' | 'transactions'>) => {
    const newStore: Store = {
      ...store,
      id: `s${Date.now()}`,
      code: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      revenue: 0,
      transactions: 0,
    };
    setStores(prev => [newStore, ...prev]);
    logActivity(`New store "${store.name}" created`, 'Admin');
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    const store = stores.find(s => s.id === id);
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity(`Store "${store?.name}" updated`, 'Admin', id);
  };

  const addStaff = (member: Omit<StaffMember, 'id' | 'initials'>) => {
    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMember: StaffMember = {
      ...member,
      id: `st${Date.now()}`,
      initials,
    };
    setStaff(prev => [newMember, ...prev]);
    logActivity(`Staff member "${member.name}" added`, role === 'admin' ? 'Admin' : 'Manager');
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity(`Staff member "${member?.name}" updated`, role === 'admin' ? 'Admin' : 'Manager', member?.storeId);
  };

  const logActivity = (action: string, user: string, storeId?: string) => {
    const store = stores.find(s => s.id === storeId);
    const activity = {
      id: `notif-${Date.now()}`,
      action,
      user,
      store: store?.name || 'Global',
      time: 'Just now',
    };
    setNotifications(prev => [activity, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      role, setRole, storeName, setStoreName, registerStore,
      stores, staff, notifications, addStore, updateStore, addStaff, updateStaff, logActivity,
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
