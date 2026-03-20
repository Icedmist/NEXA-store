import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, Settings,
  Calculator, ScanLine, Printer, Receipt, Store, LogOut, Wifi, WifiOff
} from 'lucide-react';
import { useState } from 'react';
import { ModeToggle } from '@/components/ModeToggle';

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Branches', path: '/branches', icon: Store },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
  manager: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/inventory', icon: Package },
    { label: 'Staff', path: '/staff', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
  staff: [
    { label: 'POS', icon: Calculator, path: '/pos' },
    { label: 'Scanner', icon: ScanLine, path: '/scanner' },
    { label: 'Labels', icon: Printer, path: '/labels' },
    { label: 'Sales', icon: Receipt, path: '/dashboard' },
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
    <div className="min-h-screen bg-background dot-pattern flex flex-col transition-colors duration-500">
      {/* Top bar */}
      <header className="h-16 glass dark:glass border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Nexa Logo" className="w-9 h-9 object-contain drop-shadow transition-transform hover:rotate-3" />
          <div className="flex flex-col">
            <p className="text-sm font-bold tracking-tight leading-none text-foreground">Nexa Retail</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">{storeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/40 rounded-full border border-border/50">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-accent animate-pulse" /> : <WifiOff className="w-3.5 h-3.5 text-destructive" />}
            <span className="text-[11px] font-semibold">{isOnline ? 'Network Active' : 'Offline Mode'}</span>
          </div>
          <div className="h-6 w-px bg-border/50 hidden xs:block" />
          <div className="scale-90">
            <ModeToggle />
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="group p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
            title="Sign out"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-4 lg:p-8 lg:ml-64 pb-24 lg:pb-8 animate-fade-in">
        {children}
      </main>

      {/* Side navigation for desktop */}
      <nav className="fixed left-4 top-20 bottom-4 w-56 glass-card dark:glass border border-border/50 hidden lg:block z-40 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 flex flex-col h-full">
          <div className="space-y-2 flex-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 opacity-60">Menu</p>
            {items.map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200 group
                    ${active
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-black/10'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'stroke-[2.5]' : ''}`} />
                  <span className="font-semibold tracking-tight">{item.label}</span>
                  {item.label === 'POS' && cartCount > 0 && (
                    <span className="ml-auto text-[10px] bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-auto px-2">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[11px] font-bold text-primary uppercase tracking-tighter">Current Session</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">Role: <span className="text-foreground capitalize">{role}</span></p>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating navigation for mobile */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[calc(100%-2rem)] max-w-sm">
        <div className="flex items-center justify-around glass dark:glass border border-white/20 dark:border-white/10 rounded-3xl px-2 py-3 shadow-2xl">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300
                  ${active
                    ? 'text-primary scale-110'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                {active && <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_primary]"></span>}
                {item.label === 'POS' && cartCount > 0 && (
                  <span className="absolute -top-1 right-2 text-[10px] bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center font-bold">
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
