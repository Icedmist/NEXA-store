import DashboardLayout from '@/components/layout/DashboardLayout';
import { stores as allStores, Store } from '@/data/demo';
import { useState } from 'react';
import { Plus, Copy, Check, MapPin, X } from 'lucide-react';

export default function Stores() {
  const [storeList, setStoreList] = useState<Store[]>(allStores);
  const [showAdd, setShowAdd] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [newStore, setNewStore] = useState({ name: '', location: '' });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleAdd = () => {
    if (!newStore.name || !newStore.location) return;
    const store: Store = {
      id: `s${Date.now()}`,
      name: newStore.name,
      location: newStore.location,
      code: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      revenue: 0,
      transactions: 0,
    };
    setStoreList(prev => [store, ...prev]);
    setNewStore({ name: '', location: '' });
    setShowAdd(false);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Stores</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">Manage your store locations</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            New Store
          </button>
        </div>

        <div className="space-y-3">
          {storeList.map((store, i) => (
            <div key={store.id}
              className={`bg-card rounded-xl border border-border p-5 animate-fade-in stagger-${Math.min(i + 1, 6)}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                    <h3 className="text-sm font-medium">{store.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {store.location}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">KES {store.revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{store.transactions} transactions</p>
                  </div>
                  <button
                    onClick={() => handleCopy(store.code)}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-muted text-xs hover:bg-muted/80 transition-colors"
                  >
                    {copied === store.code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span className="tabular-nums">{store.code}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">New Store</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Store name" value={newStore.name} onChange={e => setNewStore(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                <input type="text" placeholder="Location" value={newStore.location} onChange={e => setNewStore(p => ({ ...p, location: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                <button onClick={handleAdd}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
                  Create Store
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
