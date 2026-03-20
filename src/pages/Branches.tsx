import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Check, MapPin, X, Edit2, Users, Activity, TrendingUp, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

export default function Branches() {
  const navigate = useNavigate();
  const { stores: storeList, addStore, updateStore, staff, role, notifications } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '', managerId: '' });

  const selectedStore = storeList.find(s => s.id === selectedStoreId);
  const storeStaff = staff.filter(s => s.storeId === selectedStoreId);
  const storeActivities = notifications.filter(n => n.store === selectedStore?.name);
  
  const managers = staff.filter(s => s.role === 'manager');

  const handleCopy = (code: string) => { 
    navigator.clipboard.writeText(code); 
    setCopied(code); 
    setTimeout(() => setCopied(null), 1500); 
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location) return;
    addStore({ ...formData, status: 'active' });
    setFormData({ name: '', location: '', managerId: '' });
    setShowAdd(false);
  };


  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Branches</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">Manage your branch locations</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            New Branch
          </button>
        </div>

        <div className="space-y-3">
          {storeList.map((store, i) => (
            <div key={store.id} className={`bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-${Math.min(i + 1, 6)}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <button onClick={() => setSelectedStoreId(store.id)}
                        className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 group text-left">
                        <div className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                        {store.name}
                        <Activity className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-light">
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
                          <button onClick={() => navigate(`/branches/${store.id}/manage`)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" title="Edit Branch">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
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
                <h2 className="text-base font-medium">New Branch</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Branch Name</label>
                  <input type="text" placeholder="e.g. Downtown Branch" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
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
                  Create Branch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail View Modal */}
        {selectedStore && (
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedStoreId(null)}>
            <div className="bg-card rounded-3xl border border-border w-full max-w-2xl animate-scale-in flex flex-col max-h-[90vh] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-medium tracking-tight">{selectedStore.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${selectedStore.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {selectedStore.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-light mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedStore.location} • {selectedStore.code}
                  </p>
                </div>
                <button onClick={() => setSelectedStoreId(null)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5" />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</p>
                      </div>
                      <p className="text-lg font-medium tabular-nums">₦{selectedStore.revenue.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Transactions</p>
                      </div>
                      <p className="text-lg font-medium tabular-nums">{selectedStore.transactions}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Avg Ticket</p>
                      </div>
                      <p className="text-lg font-medium tabular-nums">₦{(selectedStore.revenue / (selectedStore.transactions || 1)).toFixed(0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Activity className="w-3.5 h-3.5 text-success" />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Performance</p>
                      </div>
                      <p className="text-lg font-medium text-success flex items-center gap-1">
                        +12.4%
                        <TrendingUp className="w-3 h-3" />
                      </p>
                    </div>
                  </div>

                {/* Activity Feed Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Recent Activities
                    </h3>
                    <button className="text-xs text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-1">
                    {storeActivities.length > 0 ? (
                      storeActivities.map((n) => (
                        <div key={n.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{n.action}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-muted-foreground font-light">{n.time}</span>
                              <span className="text-[10px] text-muted-foreground/50">•</span>
                              <span className="text-[11px] text-muted-foreground font-light">{n.user}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                        <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-light">No activities logged for this store yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Staff Assignment Section */}
                <div>
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Assigned Personnel
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {storeStaff.map(member => (
                      <div key={member.id} className="p-3 rounded-2xl bg-muted/20 border border-border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-xs font-bold border border-border">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-[11px] text-muted-foreground font-light capitalize">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
                <button onClick={() => setSelectedStoreId(null)} className="px-5 h-11 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors">Close View</button>
                {role === 'admin' && (
                  <button onClick={() => navigate(`/branches/${selectedStore.id}/manage`)} className="px-5 h-11 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Manage Branch
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
