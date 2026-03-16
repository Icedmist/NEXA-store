import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, BarChart3, Settings, QrCode,
  ShoppingCart, Tag, Store, LogOut, Menu, X, Wifi, WifiOff
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
    { label: 'Point of Sale', path: '/pos', icon: ShoppingCart },
    { label: 'Scanner', path: '/scanner', icon: QrCode },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, storeName, logout, sidebarOpen, setSidebarOpen, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline] = useState(true);

  if (!role) return null;

  const items = navItems[role];

  return (
    <div className="min-h-screen dot-pattern flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card z-50 flex flex-col
        border-r border-border
        transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-semibold tracking-tight">NX</span>
            </div>
            <div>
              <p className="text-sm font-medium tracking-tight leading-none">Nexa Store</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">OS</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store name */}
        <div className="px-5 py-3 border-b border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Store</p>
          <p className="text-sm font-medium mt-0.5">{storeName}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-colors duration-150
                  ${active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-normal">{item.label}</span>
                {item.label === 'Point of Sale' && cartCount > 0 && (
                  <span className="ml-auto text-[10px] bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-success" /> : <WifiOff className="w-3.5 h-3.5 text-destructive" />}
            <span>{isOnline ? 'Online' : 'Offline — syncing paused'}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {role === 'admin' ? 'Administrator' : role === 'manager' ? 'Store Manager' : 'Cashier'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {role === 'admin' ? 'AD' : role === 'manager' ? 'MG' : 'CS'}
              </span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
