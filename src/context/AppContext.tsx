import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { stores as initialStores, staff as initialStaff, products as initialProducts, Store, StaffMember, Role, CartItem, Product, Transaction } from '@/data/demo';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  storeName: string | null;
  stores: Store[];
  staff: StaffMember[];
  currentUserProfile: StaffMember | null;
  transactions: Transaction[];
  notifications: any[];
  setStoreName: (name: string | null) => void;
  registerStore: (name: string, email: string, password?: string) => Promise<void>;
  addStore: (store: Omit<Store, 'id' | 'code' | 'revenue' | 'transactions'>) => Promise<void>;
  updateStore: (id: string, updates: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'qrCode' | 'image' | 'lowStockThreshold'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStaff: (member: Omit<StaffMember, 'id' | 'initials'>) => Promise<void>;
  updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<void>;
  logActivity: (action: string, user: string, storeId?: string) => void;
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  addTransaction: (paymentMethod: 'cash' | 'card' | 'mobile', cashier: string, storeId?: string) => Promise<void>;
  clearCart: () => void;
  cart: CartItem[];
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
  const [storeName, setStoreName] = useState<string | null>(() => {
    const saved = localStorage.getItem('nexa-store-name');
    return saved && saved !== 'null' ? JSON.parse(saved) : 'Nexa Store Portal';
  });
  const [stores, setStores] = useState<Store[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<StaffMember | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        let { data: staffProfile, error: profErr } = await supabase
          .from('staff_members')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!staffProfile && user.email) {
          // Self-heal lazy-registered staff profiles (updates 'st...' fake IDs to real Auth UUID)
          const { data: profileByEmail } = await supabase
            .from('staff_members')
            .select('*')
            .eq('email', user.email)
            .single();
            
          if (profileByEmail) {
            staffProfile = profileByEmail;
            await supabase.from('staff_members').update({ id: user.id }).eq('id', profileByEmail.id);
            await supabase.from('stores').update({ manager_id: user.id }).eq('manager_id', profileByEmail.id);
            staffProfile.id = user.id;
          }
        }

        let userStoreId = null;
        if (staffProfile) {
          userStoreId = staffProfile.store_id;
          setCurrentUserProfile({
            ...staffProfile,
            storeId: staffProfile.store_id,
            tempPassword: staffProfile.password_hash || staffProfile.temp_password || staffProfile.tempPassword || null
          });
        }
        if (!userStoreId && typeof window !== 'undefined') {
          const host = window.location.hostname;
          const parts = host.split('.');
          if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
            const { data: matchedStores } = await supabase.from('stores').select('*');
            const matched = matchedStores?.find((s: any) => s.name.toLowerCase().replace(/\s+/g, '') === parts[0].toLowerCase());
            if (matched) {
              userStoreId = matched.id;
            }
          }
        }
        let dbStores: any[] | null = null;
        let dbProducts: any[] | null = null;
        let dbStaff: any[] | null = null;
        let storesErr: any = null;
        let storeIds: string[] = [];

        if (userStoreId) {
          // Fetch stores owned by this store (children Branches) OR is the store itself
          const resStores = await supabase
            .from('stores')
            .select('*')
            .or(`id.eq.${userStoreId},parent_store_id.eq.${userStoreId}`);
          
          dbStores = resStores.data;
          storesErr = resStores.error;
          
          storeIds = dbStores?.map((s: any) => s.id) || [userStoreId];

          let resProd = await supabase.from('products').select('*').in('store_id', storeIds);
          dbProducts = resProd.data;

          const resStaff = await supabase.from('staff_members').select('*').in('store_id', storeIds);
          dbStaff = resStaff.data;
        } else {
          console.warn('No mapped store_id found for current auth user. Loading broad view dashboard.');
          const resStores = await supabase.from('stores').select('*');
          dbStores = resStores.data;
          
          if (dbStores) storeIds = dbStores.map((s: any) => s.id);

          const resProd = await supabase.from('products').select('*');
          dbProducts = resProd.data;

          const resStaff = await supabase.from('staff_members').select('*');
          dbStaff = resStaff.data;
        }

        if (storesErr && userStoreId) {
          console.warn('Backend schema doesn\'t have parent_store_id. Falling back to simple fetch.');
        }

        // Fetch stores again with simple query fallback if it originally errored or list was empty
        let finalStores = dbStores || [];
        if (userStoreId && (storesErr || finalStores.length === 0)) {
          const { data: fbStores } = await supabase.from('stores').select('*').eq('id', userStoreId);
          if (fbStores) {
            finalStores = fbStores;
            storeIds = finalStores.map((s: any) => s.id);
          }
        }

        if (finalStores.length > 0) {
          setStores(finalStores.map((s: any) => ({
            ...s,
            managerId: s.manager_id
          })));
        }
        if (dbProducts) {
          setProducts(dbProducts.map((p: any) => ({
            ...p,
            qrCode: p.qr_code,
            costPrice: p.cost_price || 0,
            lowStockThreshold: p.low_stock_threshold,
            storeId: p.store_id
          })));
        }
        if (dbStaff) {
          setStaff(dbStaff.map((s: any) => ({
            ...s,
            storeId: s.store_id,
            tempPassword: s.password_hash || s.temp_password || s.tempPassword || null
          })));
        }

          let resTxns = await supabase.from('transactions').select('*').in('store_id', storeIds);
          const dbTxns = resTxns.data;
          
          if (dbTxns) {
          setTransactions(dbTxns.map((t: any) => ({
            ...t,
            paymentMethod: t.payment_method,
            timestamp: t.timestamp
          })));
        }

        let dbNotifsRes = await supabase.from('activities').select('*').in('store_id', storeIds).order('time', { ascending: false });
        const dbNotifs = dbNotifsRes.data;
        if (dbNotifs) {
          setNotifications(dbNotifs.map((n: any) => ({
            id: n.id,
            action: n.action,
            user: n.user_name,
            store: n.store,
            time: new Date(n.time).toLocaleString(),
            type: n.type || 'system'
          })));
        }

      } catch (error) {
        console.warn('Failed to load from Supabase. Starting with empty dataset.', error);
        setStores([]);
        setProducts([]);
        setStaff([]);
      } finally {
        setLoading(false);
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
    if (storeName) {
      localStorage.setItem('nexa-store-name', JSON.stringify(storeName));
    }
  }, [storeName]);

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
    setCurrentUserProfile(null);
    clearCart();
    supabase.auth.signOut();
  }, [clearCart]);

  const registerStore = async (name: string, email: string, password?: string) => {
    try {
      if (!password) {
        throw new Error('Password is required for registration.');
      }

      // 1. Sign up with Supabase Auth
      let { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password
      });

      if (authErr && authErr.message.toLowerCase().includes('user already registered')) {
        // Fallback to signIn if the user exists but hasn't mapped their store correctly 
        // (usually happens during local dev testing after wiping the public tables)
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) {
          throw new Error('This email is already registered, but the password provided was incorrect. Try logging in or use a different email.');
        }
        authData = signInData as any;
        authErr = null;
      }

      if (authErr) throw authErr;
      const userId = authData.user?.id;

      if (!userId) throw new Error("Could not retrieve user ID after signup.");

      // 2. Create a new Store
      const newStoreId = `s${Date.now()}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const newStore: Store = {
        id: newStoreId,
        name,
        location: 'TBA',
        code: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        revenue: 0,
        transactions: 0
      };

      let storeErr = null;
      const storeRes = await supabase.from('stores').insert([{ ...newStore, slug }]);

      if (storeRes.error) {
        if (storeRes.error.code === 'PGRST204' || storeRes.error.message.includes('slug')) {
          console.warn('Backend schema outdated. Falling back to insert without slug.');
          const fallbackRes = await supabase.from('stores').insert([newStore]);
          storeErr = fallbackRes.error;
        } else {
          storeErr = storeRes.error;
        }
      }
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

      let staffErr = null;
      const staffRes = await supabase.from('staff_members').insert([{
        id: userId,
        name: newStaff.name,
        email,
        role: newStaff.role,
        status: newStaff.status,
        initials,
        store_id: newStoreId,
        password_hash: null // Admins don't need this
      }]);

      if (staffRes.error) {
        if (staffRes.error.code === 'PGRST204' || staffRes.error.message.includes('password_hash')) {
          const fallbackRes2 = await supabase.from('staff_members').insert([{
            id: userId,
            name: newStaff.name,
            email,
            role: newStaff.role,
            status: newStaff.status,
            initials,
            store_id: newStoreId
          }]);
          staffErr = fallbackRes2.error;
        } else {
          staffErr = staffRes.error;
        }
      }

      if (staffErr) throw staffErr;

      // Update local states for responsive behavior
      setStores(prev => [newStore, ...prev]);
      setStaff(prev => [newStaff, ...prev]);
      setStoreName(name);
      setRole('admin');
      setCurrentUserProfile(newStaff);

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
      const { data: { user } } = await supabase.auth.getUser();
      let currentAdminStoreId = null;
      if (user) {
        const { data: staffProfile } = await supabase.from('staff_members').select('store_id').eq('id', user.id).single();
        if (staffProfile) currentAdminStoreId = staffProfile.store_id;
      }

      const slug = newStore.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dbStore = {
        id: newStore.id,
        name: newStore.name,
        location: newStore.location,
        code: newStore.code,
        status: newStore.status,
        revenue: newStore.revenue,
        transactions: newStore.transactions,
        manager_id: newStore.managerId || null,
        slug,
        parent_store_id: currentAdminStoreId
      };

      const storeRes = await supabase.from('stores').insert([dbStore]);
      if (storeRes.error) {
        if (storeRes.error.code === 'PGRST204' || storeRes.error.message.includes('slug')) {
          console.warn('Backend schema outdated. Falling back to insert without slug.');
          const fallbackStore = { ...dbStore };
          delete (fallbackStore as any).slug;
          delete (fallbackStore as any).parent_store_id;
          await supabase.from('stores').insert([fallbackStore]);
        } else {
          throw storeRes.error;
        }
      }
    } catch (e) {
      console.error('Failed to sync addStore to Supabase', e);
    }
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    const store = stores.find(s => s.id === id);
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity(`Store "${store?.name}" updated`, 'Admin', id);

    try {
      const dbUpdates: any = { ...updates };
      if (updates.managerId !== undefined) {
        dbUpdates.manager_id = updates.managerId || null;
        delete dbUpdates.managerId;
      }
      if (updates.name !== undefined) {
        dbUpdates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      }

      const res = await supabase.from('stores').update(dbUpdates).eq('id', id);
      if (res.error && (res.error.code === 'PGRST204' || res.error.message.includes('slug'))) {
        delete dbUpdates.slug;
        await supabase.from('stores').update(dbUpdates).eq('id', id);
      }
    } catch (e) {
      console.error('Failed to sync updateStore to Supabase', e);
    }
  };

  const deleteStore = async (id: string) => {
    const store = stores.find(s => s.id === id);
    setStores(prev => prev.filter(s => s.id !== id));
    logActivity(`Store "${store?.name}" deleted`, 'Admin', id);

    try {
      // 1. Delete associated staff
      await supabase.from('staff_members').delete().eq('store_id', id);
      // 2. Delete the store
      await supabase.from('stores').delete().eq('id', id);
    } catch (e) {
      console.error('Failed to sync deleteStore to Supabase', e);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'qrCode' | 'image' | 'lowStockThreshold'>) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      qrCode: `QR-${Date.now()}`,
      image: '📦',
      lowStockThreshold: 10,
      storeId: currentUserProfile?.storeId || (stores.length > 0 ? stores[0].id : undefined)
    };
    setProducts(prev => [newProduct, ...prev]);
    logActivity(`Product "${product.name}" added`, role === 'admin' ? 'Admin' : 'Manager', newProduct.storeId);

    try {
      const dbProduct = {
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category || null,
        price: newProduct.price,
        cost_price: newProduct.costPrice || 0,
        stock: newProduct.stock,
        low_stock_threshold: newProduct.lowStockThreshold,
        qr_code: newProduct.qrCode,
        image: newProduct.image,
        store_id: newProduct.storeId || null
      };
      await supabase.from('products').insert([dbProduct]);
    } catch (e) {
      console.error('Failed to sync addProduct to Supabase', e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const product = products.find(p => p.id === id);
    logActivity(`Product "${product?.name}" updated`, role === 'admin' ? 'Admin' : 'Manager');

    try {
      const dbUpdates: any = { ...updates };
      if (updates.lowStockThreshold !== undefined) {
        dbUpdates.low_stock_threshold = updates.lowStockThreshold;
        delete dbUpdates.lowStockThreshold;
      }
      if (updates.qrCode !== undefined) {
        dbUpdates.qr_code = updates.qrCode;
        delete dbUpdates.qrCode;
      }
      if (updates.costPrice !== undefined) {
        dbUpdates.cost_price = updates.costPrice;
        delete dbUpdates.costPrice;
      }
      if (updates.storeId !== undefined) {
        dbUpdates.store_id = updates.storeId;
        delete dbUpdates.storeId;
      }
      await supabase.from('products').update(dbUpdates).eq('id', id);
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
      tempPassword: (member as any).password || member.tempPassword || null
    };
    setStaff(prev => [newMember, ...prev]);
    logActivity(`Staff member "${member.name}" added`, role === 'admin' ? 'Admin' : 'Manager', newMember.storeId);

    const dbStaff = {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: newMember.status,
      initials: newMember.initials,
      store_id: newMember.storeId,
      password_hash: newMember.tempPassword
    };

    const res = await supabase.from('staff_members').insert([dbStaff]);

    if (res.error) {
      console.error('Failed to sync addStaff to Supabase', res.error);
    }
  };

  const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity(`Staff member "${member?.name}" updated`, role === 'admin' ? 'Admin' : 'Manager', member?.storeId);

    const dbUpdates: any = { ...updates };
    if (updates.tempPassword !== undefined) {
      dbUpdates.password_hash = updates.tempPassword;
      delete dbUpdates.tempPassword;
    }
    if (updates.storeId !== undefined) {
      dbUpdates.store_id = updates.storeId;
      delete dbUpdates.storeId;
    }

    const resUpdate = await supabase.from('staff_members').update(dbUpdates).eq('id', id);
    if (resUpdate.error) {
      console.error('Failed to sync updateStaff to Supabase', resUpdate.error);
    }
  };

  const logActivity = (action: string, user: string, targetStoreId?: string) => {
    const finalStoreId = targetStoreId || (currentUserProfile ? currentUserProfile.storeId : (stores.length > 0 ? stores[0].id : null));
    const store = stores.find(s => s.id === finalStoreId);
    
    const activity = {
      id: `notif-${Date.now()}`,
      action,
      user,
      store: store?.name || 'Global',
      time: 'Just now',
    };
    setNotifications(prev => [activity, ...prev]);

    supabase.from('activities').insert([{
      id: activity.id,
      action: activity.action,
      user_name: activity.user,
      store: activity.store,
      store_id: finalStoreId,
      type: 'system'
    }]).then(({ error }) => {
      if (error) console.error(error);
    });
  };

  const addTransaction = async (paymentMethod: 'cash' | 'card' | 'mobile', cashier: string, storeId?: string) => {
    if (cart.length === 0) return;
    const newTxnId = `t${Date.now()}`;
    const newTxn: Transaction = {
      id: newTxnId,
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      total: cartTotal,
      paymentMethod,
      timestamp: new Date().toISOString(),
      cashier
    };
    setTransactions(prev => [newTxn, ...prev]);

    try {
      await supabase.from('transactions').insert([{
        id: newTxn.id,
        items: newTxn.items,
        total: newTxn.total,
        payment_method: newTxn.paymentMethod,
        cashier: newTxn.cashier,
        timestamp: newTxn.timestamp,
        store_id: storeId || currentUserProfile?.storeId || null
      }]);
    } catch (e) {
      console.error('Failed to sync transaction to Supabase', e);
    }
  };

  return (
    <AppContext.Provider value={{
      role, setRole, storeName, setStoreName, registerStore,
      stores, staff, products, transactions, notifications, addStore, updateStore, deleteStore, addStaff, updateStaff,
      addProduct, updateProduct, deleteProduct, logActivity, loading, currentUserProfile,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount, logout, addTransaction
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
