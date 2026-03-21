import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Users, Settings, Shield, Activity,
  MapPin, Store as StoreIcon, Trash2, Plus, Edit3,
  Mail, Phone, Lock, ChevronRight, Copy, Check, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function BranchManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stores, updateStore, deleteStore, staff, updateStaff, addStaff, role, logActivity, storeName } = useApp();

  const currentStore = stores.find(s => s.id === id);
  const storeStaff = staff.filter(s => s.storeId === id);
  const managers = staff.filter(s => s.role === 'manager');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [formData, setFormData] = useState({
    name: currentStore?.name || '',
    location: currentStore?.location || '',
    status: currentStore?.status || 'active',
    managerId: currentStore?.managerId || ''
  });

  const [showAddStaff, setShowAddStaff] = useState(false);
  
  // Since useState initializers only run once, sync using useEffect
  useEffect(() => {
    if (currentStore) {
      setFormData({
        name: currentStore.name,
        location: currentStore.location || '',
        status: currentStore.status || 'active',
        managerId: currentStore.managerId || ''
      });
    }
  }, [currentStore]);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: 'staff',
    email: '',
    phone: '',
    password: ''
  });

  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [editStaffData, setEditStaffData] = useState({
    name: '',
    role: 'staff',
    email: '',
    status: 'active',
    password: ''
  });
  const [copiedPwd, setCopiedPwd] = useState(false);

  const openEditStaff = (member: any) => {
    setEditingStaff(member);
    setEditStaffData({
      name: member.name,
      role: member.role,
      email: member.email,
      status: member.status || 'active',
      password: ''
    });
  };

  const generateMemorablePassword = () => {
    const adjs = ["smart", "quick", "lucky", "happy", "brave", "bright", "cool", "calm", "fast", "wise", "kind", "soft", "warm", "gold", "silver", "blue", "red", "green", "bold", "super"];
    const nouns = ["lion", "bear", "wolf", "hawk", "fox", "deer", "puma", "lynx", "orca", "bull", "eagle", "tiger", "shark", "whale", "owl", "crow", "duck", "swan", "seal", "koala"];
    const acts = ["runs", "soars", "jumps", "dives", "hunts", "leaps", "speeds", "zooms", "glows", "swims", "flies", "roars", "howls", "shines", "walks", "moves", "sparks", "dances", "sings"];
    const specials = ["!", "@", "#", "$", "%", "*", "&"];
    
    const adj = adjs[Math.floor(Math.random() * adjs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const act = acts[Math.floor(Math.random() * acts.length)];
    const num = Math.floor(10 + Math.random() * 89);
    const spec = specials[Math.floor(Math.random() * specials.length)];
    
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${cap(adj)}${cap(noun)}${cap(act)}${num}${spec}`;
  };

  const handleGeneratePassword = () => {
    setEditStaffData(p => ({ ...p, password: generateMemorablePassword() }));
  };

  const handleGenerateLoginID = () => {
    const rolePrefix = newStaffData.role === 'manager' ? 'manager' : 'staff';
    
    // Smoothly read off the currently active storefront workspace header title
    const storeSlug = storeName ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'store';
    
    const prefixRegex = new RegExp(`^${rolePrefix}_(\\d+)@`);
    const existingIds = staff
      .map(s => s.email?.match(prefixRegex))
      .filter(Boolean)
      .map(m => parseInt(m![1]));
    
    // If the input already contains a generated ID, add its index so clicking again increments it
    const currentInputMatch = newStaffData.email?.match(prefixRegex);
    if (currentInputMatch) {
      existingIds.push(parseInt(currentInputMatch[1]));
    }
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const nextId = maxId + 1;
    const paddedId = nextId.toString().padStart(2, '0');
    
    const baseDomain = window.location.hostname.includes('nexaos') ? 'nexaos.com' : 'nexa.com';
    const generatedId = `${rolePrefix}_${paddedId}@${storeSlug}.${baseDomain}`;
    
    setNewStaffData(p => ({ ...p, email: generatedId }));
  };

  const handleGenerateNewStaffPassword = () => {
    setNewStaffData(p => ({ ...p, password: generateMemorablePassword() }));
  };

  const handleCopyPassword = () => {
    if (!editStaffData.password) return;
    navigator.clipboard.writeText(editStaffData.password);
    setCopiedPwd(true);
    setTimeout(() => setCopiedPwd(false), 2000);
  };

  const handleUpdateStaff = () => {
    if (!editingStaff) return;
    const updates: any = {
      name: editStaffData.name,
      role: editStaffData.role,
      email: editStaffData.email,
      status: editStaffData.status
    };
    if (editStaffData.password) {
      if (role !== 'admin') {
        toast.error('Only admins can change passwords');
        return;
      }
      updates.tempPassword = editStaffData.password;
    }
    updateStaff(editingStaff.id, updates);
    toast.success(`${editStaffData.name} updated successfully`);
    setEditingStaff(null);
  };

  if (!currentStore) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-xl font-medium">Store not found</h1>
          <button onClick={() => navigate('/stores')} className="mt-4 text-primary hover:underline">Back to Stores</button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSaveStore = () => {
    updateStore(currentStore.id, formData);
    toast.success('Store information updated successfully');
    logActivity(`Store "${formData.name}" settings updated`, 'Admin', currentStore.id);
  };

  const handleAddStaffToStore = () => {
    if (!newStaffData.name || !newStaffData.email) return;
    addStaff({
      ...newStaffData,
      role: newStaffData.role as 'admin' | 'manager' | 'staff',
      storeId: currentStore.id,
      status: 'active'
    });
    toast.success(`${newStaffData.name} added to ${currentStore.name}`);
    setShowAddStaff(false);
    setNewStaffData({ name: '', role: 'staff', email: '', phone: '', password: '' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/branches')} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-medium tracking-tight truncate">Manage {currentStore.name}</h1>
              <p className="text-sm text-muted-foreground font-light mt-1">Configure {currentStore?.name} details</p>
            </div>
          </div>
          <button onClick={handleSaveStore} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 h-11 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98] w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up">
            {/* Branch Information */}
            <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-primary" />
                Core Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1">Branch Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1">Location / Address</label>
                  <input type="text" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1">Branch Code (Internal)</label>
                  <div className="w-full h-12 px-4 rounded-xl border border-border bg-muted/30 flex items-center text-sm font-mono text-muted-foreground">
                    {currentStore.code}
                  </div>
                </div>
              </div>
              
              {role === 'admin' && (
                <div className="mt-8 pt-6 border-t border-destructive/10">
                  <h3 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4" />
                    Danger Zone
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-light">Permanently delete this branch. This action is completely irreversible and wipes all records.</p>
                  <button onClick={() => setShowDeleteModal(true)} className="mt-4 h-10 px-4 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground rounded-xl text-xs font-semibold transition-all">
                    Delete Branch
                  </button>
                </div>
              )}
            </section>

            {/* Staff Management */}
            <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Assigned Staff ({storeStaff.length})
                </h2>
                <button onClick={() => setShowAddStaff(true)} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Personnel
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                      <th className="pb-4 px-2">Name</th>
                      <th className="pb-4 px-2">Role</th>
                      <th className="pb-4 px-2">Status</th>
                      <th className="pb-4 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {storeStaff.map(member => (
                      <tr key={member.id} className="group hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {member.initials}
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-[10px] text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                            ${member.role === 'manager' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="flex items-center gap-1.5 text-xs">
                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                            {member.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          {member.role !== 'admin' && (
                            <button onClick={() => openEditStaff(member)} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-lg transition-all">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Sidebar */}
          <div className="space-y-8 animate-slide-up-delayed">
            {/* Manager Selection */}
            <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Branch Manager
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1">Assigned Manager</label>
                  <select value={formData.managerId} onChange={e => setFormData(p => ({ ...p, managerId: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm">
                    <option value="">No Global Manager</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                {formData.managerId && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Branch Name</label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This manager will have full oversight of staff and activities for <strong>{formData.name}</strong>.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Branch Security/Access */}
            <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Access Controls
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border/50 hover:bg-muted/10 transition-colors">
                  <div>
                    <p className="text-xs font-medium">Require 2FA</p>
                    <p className="text-[10px] text-muted-foreground">For all staff sessions</p>
                  </div>
                  <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-card rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border/50 hover:bg-muted/10 transition-colors">
                  <div>
                    <p className="text-xs font-medium">Remote Closure</p>
                    <p className="text-[10px] text-muted-foreground">Emergency lock</p>
                  </div>
                  <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-card rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Add Staff Modal Overlay */}
        {showAddStaff && (
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl border border-border p-8 w-full max-w-lg shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-medium">Assign New Personnel</h2>
                  <p className="text-sm text-muted-foreground font-light mt-1">Onboard staff directly to {currentStore.name}</p>
                </div>
                <button onClick={() => setShowAddStaff(false)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Full Name</label>
                    <input type="text" placeholder="John Doe" value={newStaffData.name} onChange={e => setNewStaffData(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Role</label>
                    <select value={newStaffData.role} onChange={e => setNewStaffData(p => ({ ...p, role: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="staff">Staff Member</option>
                      <option value="manager">Asst. Manager</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Login ID</label>
                    <button onClick={handleGenerateLoginID} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                      Auto-Generate
                    </button>
                  </div>
                  <input type="email" placeholder="staff_123@nexa.com" value={newStaffData.email} onChange={e => setNewStaffData(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Access Password</label>
                    <button onClick={handleGenerateNewStaffPassword} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                      Auto-Generate
                    </button>
                  </div>
                  <input type="text" placeholder="••••••••" value={newStaffData.password} onChange={e => setNewStaffData(p => ({ ...p, password: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all font-mono" />
                </div>

                <button onClick={handleAddStaffToStore} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  Complete Onboarding
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Staff Modal Overlay */}
        {editingStaff && (
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl border border-border p-8 w-full max-w-lg shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-medium">Edit Personnel</h2>
                  <p className="text-sm text-muted-foreground font-light mt-1">Update details for {editingStaff.name}</p>
                </div>
                <button onClick={() => setEditingStaff(null)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Full Name</label>
                    <input type="text" value={editStaffData.name} onChange={e => setEditStaffData(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Role</label>
                    <select value={editStaffData.role} onChange={e => setEditStaffData(p => ({ ...p, role: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="staff">Staff Member</option>
                      <option value="manager">Manager</option>
                      {role === 'admin' && <option value="admin">Admin</option>}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Login ID</label>
                    <input type="email" placeholder="staff_123@nexa.com" value={editStaffData.email} onChange={e => setEditStaffData(p => ({ ...p, email: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Status</label>
                    <select value={editStaffData.status} onChange={e => setEditStaffData(p => ({ ...p, status: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {role === 'admin' && (
                  <div className="p-4 rounded-2xl border border-border/50 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Password Reset</label>
                      {editingStaff?.tempPassword && (
                        <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
                          Current: <code className="bg-background px-1.5 py-0.5 rounded border border-border">{editingStaff.tempPassword}</code>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Leave blank to keep unchanged" value={editStaffData.password} onChange={e => setEditStaffData(p => ({ ...p, password: e.target.value }))}
                        className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all font-mono" />
                      
                      <button onClick={handleCopyPassword} title="Copy Password"
                        className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0">
                        {copiedPwd ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button onClick={handleGeneratePassword} title="Generate Password"
                        className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shrink-0">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <button onClick={handleUpdateStaff} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border border-destructive/20 p-6 w-full max-w-sm shadow-2xl animate-scale-in">
              <h2 className="text-base font-semibold text-destructive flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                Delete Branch?
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 font-light">All products, staff assignments, and records connected to <span className="font-semibold text-foreground">{currentStore.name}</span> will be permanently gone forever.</p>
              
              <div className="mt-5">
                <label className="text-[10px] font-bold text-muted-foreground block mb-1.5 uppercase tracking-wider">Type <span className="text-destructive">DELETE-{currentStore.name.toUpperCase().replace(/\s+/g, '-')}</span> to verify:</label>
                <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-destructive/20 bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-destructive/20 transition-all font-mono" />
                
                <div className="flex gap-2.5 mt-4">
                  <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="flex-1 h-9 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button 
                    disabled={deleteConfirmText !== `DELETE-${currentStore.name.toUpperCase().replace(/\s+/g, '-')}`} 
                    onClick={async () => {
                      await deleteStore(currentStore.id);
                      toast.success('Branch deleted successfully');
                      navigate('/branches');
                    }} 
                    className={`flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-lg
                      ${deleteConfirmText === `DELETE-${currentStore.name.toUpperCase().replace(/\s+/g, '-')}` 
                        ? 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-destructive/10' 
                        : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                      }
                    `}
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
