import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { stores as initialStores, staff as initialStaff, products as initialProducts, Store, StaffMember, Role, CartItem, Product } from '@/data/demo';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  storeName: string | null;
  stores: Store[];
  staff: StaffMember[];
  notifications: any[];
  setStoreName: (name: string | null) => void;
  registerStore: (name: string, email: string, password?: string) => Promise<void>;
  addStore: (store: Omit<Store, 'id' | 'code' | 'revenue' | 'transactions'>) => Promise<void>;
  updateStore: (id: string, updates: Partial<Store>) => Promise<void>;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'qrCode' | 'image' | 'lowStockThreshold'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStaff: (member: Omit<StaffMember, 'id' | 'initials'>) => Promise<void>;
  updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<void>;
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
    let parsed = saved ? JSON.parse(saved) : null;
    if (parsed === 'cashier') parsed = 'staff';
    if (parsed && !['admin', 'manager', 'staff'].includes(parsed)) parsed = null;
    return parsed as Role | null;
  });
  const [storeName, setStoreName] = useState<string | null>('Downtown Flagship');
  const [stores, setStores] = useState<Store[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: dbStores, error: storesErr } = await supabase.from('stores').select('*');
        const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
        const { data: dbStaff, error: staffErr } = await supabase.from('staff_members').select('*');

        if (storesErr || prodErr || staffErr) {
          throw new Error('Supabase fetch failed');
        }

        if (dbStores) setStores(dbStores);
        if (dbProducts) setProducts(dbProducts);
        if (dbStaff) setStaff(dbStaff);

      } catch (error) {
        console.warn('Failed to load from Supabase. Starting with empty dataset.', error);
        setStores([]);
        setProducts([]);
        setStaff([]);
      }
    };
    loadData();
  }, []);

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

  const registerStore = async (name: string, email: string, password?: string) => {
    try {
      if (!password) {
        throw new Error('Password is required for registration.');
      }

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password
      });

      if (authErr) throw authErr;
      const userId = authData.user?.id;

      if (!userId) throw new Error("Could not retrieve user ID after signup.");

      // 2. Create a new Store
      const newStoreId = `s${Date.now()}`;
      const newStore: Store = {
        id: newStoreId,
        name,
        location: 'TBA',
        code: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        revenue: 0,
        transactions: 0
      };

      const { error: storeErr } = await supabase.from('stores').insert([newStore]);
      if (storeErr) throw storeErr;

      // 3. Create Staff profile for owner (admin)
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const newStaff: StaffMember = {
        id: userId,
        name: 'Admin',
        email,
        role: 'admin',
        status: 'active',
        initials,
        storeId: newStoreId
      };

      const { error: staffErr } = await supabase.from('staff_members').insert([{
        id: userId,
        name: newStaff.name,
        email,
        role: newStaff.role,
        status: newStaff.status,
        initials,
        store_id: newStoreId
      }]);

      if (staffErr) throw staffErr;

      // Update local states for responsive behavior
      setStores(prev => [newStore, ...prev]);
      setStaff(prev => [newStaff, ...prev]);
      setStoreName(name);
      setRole('admin');
      
    } catch (e) {
      console.error('Failed to register store in Supabase', e);
      throw e;
    }
  };

  const addStore = async (store: Omit<Store, 'id' | 'code' | 'revenue' | 'transactions'>) => {
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
    
    try {
      await supabase.from('stores').insert([newStore]);
    } catch (e) {
      console.error('Failed to sync addStore to Supabase', e);
    }
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    const store = stores.find(s => s.id === id);
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity(`Store "${store?.name}" updated`, 'Admin', id);

    try {
      await supabase.from('stores').update(updates).eq('id', id);
    } catch (e) {
      console.error('Failed to sync updateStore to Supabase', e);
    }
  };
  
  const addProduct = async (product: Omit<Product, 'id' | 'qrCode' | 'image' | 'lowStockThreshold'>) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      qrCode: `QR-${Date.now()}`,
      image: '📦',
      lowStockThreshold: 10
    };
    setProducts(prev => [newProduct, ...prev]);
    logActivity(`Product "${product.name}" added`, role === 'admin' ? 'Admin' : 'Manager');

    try {
      await supabase.from('products').insert([newProduct]);
    } catch (e) {
      console.error('Failed to sync addProduct to Supabase', e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const product = products.find(p => p.id === id);
    logActivity(`Product "${product?.name}" updated`, role === 'admin' ? 'Admin' : 'Manager');

    try {
      await supabase.from('products').update(updates).eq('id', id);
    } catch (e) {
      console.error('Failed to sync updateProduct to Supabase', e);
    }
  };

  const deleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    logActivity(`Product "${product?.name}" deleted`, role === 'admin' ? 'Admin' : 'Manager');

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error('Failed to sync deleteProduct to Supabase', e);
    }
  };

  const addStaff = async (member: Omit<StaffMember, 'id' | 'initials'>) => {
    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMember: StaffMember = {
      ...member,
      id: `st${Date.now()}`,
      initials,
    };
    setStaff(prev => [newMember, ...prev]);
    logActivity(`Staff member "${member.name}" added`, role === 'admin' ? 'Admin' : 'Manager');

    try {
      await supabase.from('staff_members').insert([newMember]);
    } catch (e) {
      console.error('Failed to sync addStaff to Supabase', e);
    }
  };

  const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity(`Staff member "${member?.name}" updated`, role === 'admin' ? 'Admin' : 'Manager', member?.storeId);

    try {
      await supabase.from('staff_members').update(updates).eq('id', id);
    } catch (e) {
      console.error('Failed to sync updateStaff to Supabase', e);
    }
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
      stores, staff, products, notifications, addStore, updateStore, addStaff, updateStaff, 
      addProduct, updateProduct, deleteProduct, logActivity,
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
