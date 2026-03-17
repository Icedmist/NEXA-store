import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, BarChart3, Settings, QrCode,
  ShoppingCart, Tag, Store, LogOut, Wifi, WifiOff
} from 'lucide-react';
import { useState } from 'react';

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Stores', path: '/stores', icon: Store },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
  manager: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/inventory', icon: Package },
    { label: 'Labels', path: '/labels', icon: Tag },
    { label: 'Staff', path: '/staff', icon: Users },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
  cashier: [
    { label: 'POS', path: '/pos', icon: ShoppingCart },
    { label: 'Scanner', path: '/scanner', icon: QrCode },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, storeName, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline] = useState(true);

  if (!role) return null;

  const items = navItems[role];

  return (
    <div className="min-h-screen dot-pattern flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-card/60 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-[10px] font-semibold tracking-tight">NX</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium tracking-tight leading-none">Nexa Store</p>
          </div>
          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
          <p className="text-xs text-muted-foreground hidden sm:block">{storeName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {isOnline ? <Wifi className="w-3 h-3 text-success" /> : <WifiOff className="w-3 h-3 text-destructive" />}
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {role === 'admin' ? 'Admin' : role === 'manager' ? 'Manager' : 'Cashier'}
          </p>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
        {children}
      </main>

      {/* Floating bottom nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1 bg-card/70 backdrop-blur-xl border border-border rounded-2xl px-2 py-2 shadow-lg shadow-foreground/5">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-xl text-[10px] transition-colors duration-150
                  ${active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium tracking-tight">{item.label}</span>
                {item.label === 'POS' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-0.5 text-[9px] bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
