export type Role = 'admin' | 'manager' | 'staff';

export interface Store {
  id: string;
  name: string;
  location: string;
  code: string;
  status: 'active' | 'inactive';
  revenue: number;
  transactions: number;
  managerId?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  qrCode: string;
  image: string;
  storeId?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  initials: string;
  storeId?: string;
  password?: string;
  tempPassword?: string;
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

export const stores: Store[] = [];

export const categories = ['Electronics', 'Beverages', 'Snacks', 'Personal Care', 'Household', 'Stationery'];

export const products: Product[] = [];

export const staff: StaffMember[] = [];

export const recentTransactions: Transaction[] = [];

export const dailyRevenue = [
  { day: 'Mon', revenue: 0, transactions: 0 },
  { day: 'Tue', revenue: 0, transactions: 0 },
  { day: 'Wed', revenue: 0, transactions: 0 },
  { day: 'Thu', revenue: 0, transactions: 0 },
  { day: 'Fri', revenue: 0, transactions: 0 },
  { day: 'Sat', revenue: 0, transactions: 0 },
  { day: 'Sun', revenue: 0, transactions: 0 },
];

export const paymentBreakdown = [
  { method: 'Cash', amount: 0, count: 0 },
  { method: 'Card', amount: 0, count: 0 },
  { method: 'Mobile', amount: 0, count: 0 },
];

export const topProducts: { name: string; sold: number; revenue: number }[] = [];

export const profitAndLoss = [
  { month: 'Jan', revenue: 0, expenses: 0, profit: 0 },
  { month: 'Feb', revenue: 0, expenses: 0, profit: 0 },
  { month: 'Mar', revenue: 0, expenses: 0, profit: 0 },
];

export const storeActivities: { id: string; store: string; action: string; user: string; time: string; type: string }[] = [];
