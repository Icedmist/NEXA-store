export type Role = 'admin' | 'manager' | 'cashier';

export interface Store {
  id: string;
  name: string;
  location: string;
  code: string;
  status: 'active' | 'inactive';
  revenue: number;
  transactions: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  qrCode: string;
  image: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'cashier' | 'manager';
  status: 'active' | 'inactive';
  initials: string;
}

export interface Transaction {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  timestamp: string;
  cashier: string;
}

export interface CartItem extends Product {
  qty: number;
}

export const stores: Store[] = [
  { id: 's1', name: 'Downtown Flagship', location: 'Nairobi CBD', code: 'NX-4821', status: 'active', revenue: 284700, transactions: 1243 },
  { id: 's2', name: 'Westlands Branch', location: 'Westlands', code: 'NX-7193', status: 'active', revenue: 198340, transactions: 876 },
  { id: 's3', name: 'Mombasa Outlet', location: 'Mombasa', code: 'NX-3056', status: 'inactive', revenue: 45200, transactions: 234 },
];

export const categories = ['Electronics', 'Beverages', 'Snacks', 'Personal Care', 'Household', 'Stationery'];

export const products: Product[] = [
  { id: 'p1', name: 'Wireless Earbuds Pro', category: 'Electronics', price: 3500, stock: 24, lowStockThreshold: 5, qrCode: 'QR-001', image: '🎧' },
  { id: 'p2', name: 'USB-C Fast Charger', category: 'Electronics', price: 1200, stock: 42, lowStockThreshold: 10, qrCode: 'QR-002', image: '🔌' },
  { id: 'p3', name: 'Tusker Lager 500ml', category: 'Beverages', price: 250, stock: 120, lowStockThreshold: 20, qrCode: 'QR-003', image: '🍺' },
  { id: 'p4', name: 'Coca-Cola 350ml', category: 'Beverages', price: 80, stock: 200, lowStockThreshold: 30, qrCode: 'QR-004', image: '🥤' },
  { id: 'p5', name: 'Tropical Heat Crisps', category: 'Snacks', price: 50, stock: 3, lowStockThreshold: 15, qrCode: 'QR-005', image: '🥔' },
  { id: 'p6', name: 'Dove Soap Bar', category: 'Personal Care', price: 180, stock: 67, lowStockThreshold: 10, qrCode: 'QR-006', image: '🧼' },
  { id: 'p7', name: 'Dettol Antiseptic 500ml', category: 'Personal Care', price: 450, stock: 8, lowStockThreshold: 10, qrCode: 'QR-007', image: '🧴' },
  { id: 'p8', name: 'Exercise Book 96pg', category: 'Stationery', price: 45, stock: 350, lowStockThreshold: 50, qrCode: 'QR-008', image: '📓' },
  { id: 'p9', name: 'Harpic Toilet Cleaner', category: 'Household', price: 320, stock: 28, lowStockThreshold: 8, qrCode: 'QR-009', image: '🏠' },
  { id: 'p10', name: 'Phone Screen Guard', category: 'Electronics', price: 500, stock: 15, lowStockThreshold: 5, qrCode: 'QR-010', image: '📱' },
];

export const staff: StaffMember[] = [
  { id: 'st1', name: 'Amina Osei', email: 'amina@nexa.co', role: 'cashier', status: 'active', initials: 'AO' },
  { id: 'st2', name: 'Brian Kamau', email: 'brian@nexa.co', role: 'cashier', status: 'active', initials: 'BK' },
  { id: 'st3', name: 'Clara Wanjiku', email: 'clara@nexa.co', role: 'manager', status: 'active', initials: 'CW' },
  { id: 'st4', name: 'David Otieno', email: 'david@nexa.co', role: 'cashier', status: 'inactive', initials: 'DO' },
];

export const recentTransactions: Transaction[] = [
  { id: 't1', items: [{ name: 'Wireless Earbuds Pro', qty: 1, price: 3500 }, { name: 'USB-C Fast Charger', qty: 2, price: 1200 }], total: 5900, paymentMethod: 'card', timestamp: '2026-03-20T14:23:00', cashier: 'Amina Osei' },
  { id: 't2', items: [{ name: 'Tusker Lager 500ml', qty: 3, price: 250 }, { name: 'Tropical Heat Crisps', qty: 2, price: 50 }], total: 850, paymentMethod: 'cash', timestamp: '2026-03-20T13:45:00', cashier: 'Brian Kamau' },
  { id: 't3', items: [{ name: 'Coca-Cola 350ml', qty: 4, price: 80 }, { name: 'Exercise Book 96pg', qty: 6, price: 45 }], total: 590, paymentMethod: 'mobile', timestamp: '2026-03-20T12:10:00', cashier: 'Amina Osei' },
  { id: 't4', items: [{ name: 'Dove Soap Bar', qty: 2, price: 180 }, { name: 'Dettol Antiseptic 500ml', qty: 1, price: 450 }], total: 810, paymentMethod: 'cash', timestamp: '2026-03-20T11:30:00', cashier: 'Brian Kamau' },
  { id: 't5', items: [{ name: 'Phone Screen Guard', qty: 3, price: 500 }], total: 1500, paymentMethod: 'card', timestamp: '2026-03-20T10:05:00', cashier: 'Amina Osei' },
];

export const dailyRevenue = [
  { day: 'Mon', revenue: 42300, transactions: 187 },
  { day: 'Tue', revenue: 38900, transactions: 164 },
  { day: 'Wed', revenue: 51200, transactions: 213 },
  { day: 'Thu', revenue: 47800, transactions: 198 },
  { day: 'Fri', revenue: 63400, transactions: 267 },
  { day: 'Sat', revenue: 72100, transactions: 312 },
  { day: 'Sun', revenue: 28500, transactions: 122 },
];

export const paymentBreakdown = [
  { method: 'Cash', amount: 124800, count: 542 },
  { method: 'Card', amount: 98300, count: 387 },
  { method: 'Mobile', amount: 61600, count: 314 },
];

export const topProducts = [
  { name: 'Coca-Cola 350ml', sold: 487, revenue: 38960 },
  { name: 'Exercise Book 96pg', sold: 342, revenue: 15390 },
  { name: 'Tusker Lager 500ml', sold: 298, revenue: 74500 },
  { name: 'Wireless Earbuds Pro', sold: 87, revenue: 304500 },
  { name: 'USB-C Fast Charger', sold: 134, revenue: 160800 },
];

export const profitAndLoss = [
  { month: 'Jan', revenue: 420000, expenses: 280000, profit: 140000 },
  { month: 'Feb', revenue: 380000, expenses: 260000, profit: 120000 },
  { month: 'Mar', revenue: 528000, expenses: 310000, profit: 218000 },
];

export const storeActivities = [
  { id: 'a1', store: 'Downtown Flagship', action: 'New staff added', user: 'Clara Wanjiku', time: '2 hours ago', type: 'staff' },
  { id: 'a2', store: 'Westlands Branch', action: 'Low stock alert: USB-C Fast Charger', user: 'System', time: '4 hours ago', type: 'inventory' },
  { id: 'a3', store: 'Mombasa Outlet', action: 'Store status changed to Inactive', user: 'Admin', time: 'Yesterday', type: 'system' },
  { id: 'a4', store: 'Downtown Flagship', action: 'Price update: Wireless Earbuds Pro', user: 'Clara Wanjiku', time: 'Yesterday', type: 'inventory' },
  { id: 'a5', store: 'Global', action: 'New store "Vintage Vault" registered', user: 'System', time: '2 days ago', type: 'registration' },
];
