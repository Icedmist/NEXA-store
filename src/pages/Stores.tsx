import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Plus, Copy, Check, MapPin, X, Edit2, Users } from 'lucide-react';

export default function Stores() {
  const { stores: storeList, addStore, updateStore, staff, role } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editingStore, setEditingStore] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '', managerId: '' });

  const managers = staff.filter(s => s.role === 'manager');

  const handleCopy = (code: string) => { 
    navigator.clipboard.writeText(code); 
    setCopied(code); 
    setTimeout(() => setCopied(null), 1500); 
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location) return;
    if (editingStore) {
      updateStore(editingStore, formData);
    } else {
      addStore({ ...formData, status: 'active' });
    }
    setFormData({ name: '', location: '', managerId: '' });
    setShowAdd(false);
    setEditingStore(null);
  };

  const startEdit = (store: any) => {
    setFormData({ name: store.name, location: store.location, managerId: store.managerId || '' });
    setEditingStore(store.id);
    setShowAdd(true);
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
            <div key={store.id} className={`bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-${Math.min(i + 1, 6)}`}>
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
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">₦{store.revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{store.transactions} transactions</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleCopy(store.code)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" title="Copy Store Code">
                      {copied === store.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {role === 'admin' && (
                      <button onClick={() => startEdit(store)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" title="Edit Store">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">{editingStore ? 'Edit Store' : 'New Store'}</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Store Name</label>
                  <input type="text" placeholder="e.g. Downtown Flagship" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Location</label>
                  <input type="text" placeholder="e.g. Lagos, Nigeria" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Assigned Manager</label>
                  <select value={formData.managerId} onChange={e => setFormData(p => ({ ...p, managerId: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10 transition-all">
                    <option value="">No Manager Assigned</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSubmit} className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity mt-2">
                  {editingStore ? 'Update Store' : 'Create Store'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
