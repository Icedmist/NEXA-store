import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Plus, X, UserCheck, UserX, Edit2, KeyRound, Copy, Check } from 'lucide-react';

export default function Staff() {
  const { staff: allStaff, stores, addStaff, updateStaff, role, currentUserProfile, storeName } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'staff' as 'staff' | 'manager', storeId: '', tempPassword: '' });

  // Filter staff based on role and branch assignments
  const staffList = role === 'admin' 
    ? allStaff 
    : allStaff.filter(s => s.storeId === currentUserProfile?.storeId);

  const generateMemorablePassword = () => {
    const verbs = ['Runs', 'Jumps', 'Flies', 'Leaps', 'Swims'];
    const adjs = ['Fast', 'Smart', 'Brave', 'Cool', 'Wild'];
    const nouns = ['Lion', 'Tiger', 'Bear', 'Wolf', 'Puma'];
    return `${adjs[Math.floor(Math.random() * adjs.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${verbs[Math.floor(Math.random() * verbs.length)]}${Math.floor(10 + Math.random() * 90)}!`;
  };

  const generateLoginID = (selectedRole: string, selectedStoreId: string) => {
    const slug = (stores.find(s => s.id === selectedStoreId)?.name || storeName || 'store').toLowerCase().replace(/\s+/g, '');
    const prefix = selectedRole === 'manager' ? 'mgr' : 'agent';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${prefix}_${rand}@${slug}.nexaos.com`;
  };

  const handleRoleOrStoreChange = (updates: any) => {
    const nextState = { ...formData, ...updates };
    setFormData(nextState);
  };



  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;
    if (editingStaff) {
      updateStaff(editingStaff, formData);
    } else {
      addStaff({ ...formData, status: 'active' });
    }
    setFormData({ name: '', email: '', role: 'staff', storeId: '', tempPassword: '' });
    setShowAdd(false);
    setEditingStaff(null);
  };

  const startEdit = (member: any) => {
    setFormData({ 
      name: member.name, 
      email: member.email, 
      role: member.role, 
      storeId: member.storeId || '', 
      tempPassword: member.tempPassword || '' 
    });
    setEditingStaff(member.id);
    setShowAdd(true);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateStaff(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
  };

  const resetPassword = (member: any) => {
    const newPass = generateMemorablePassword();
    updateStaff(member.id, { tempPassword: newPass });
    alert(`New temporary password for ${member.name} (${member.email}) is:\n\n${newPass}\n\nPlease copy this securely. They will use this to sign in.`);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Staffing</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">
              Manage your teams & credentials for {storeName || 'the store'}
            </p>
          </div>
          <button onClick={() => {
            setFormData({ name: '', email: '', role: 'staff', storeId: role === 'admin' ? '' : (currentUserProfile?.storeId || ''), tempPassword: '' });
            setEditingStaff(null);
            setShowAdd(true);
          }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            Add Personnel
          </button>
        </div>

        <div className="space-y-2">
          {staffList.map((member, i) => (
            <div key={member.id}
              className={`bg-card/60 backdrop-blur-md rounded-xl border border-border p-4 flex items-center gap-4 animate-fade-in stagger-${Math.min(i + 1, 6)}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-medium
                ${member.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{member.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-muted-foreground font-mono">{member.email}</p>
                  {member.tempPassword && (
                    <span className="text-[9px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full uppercase">Credentials Pending</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:block">
                {member.role} {member.storeId ? `• ${(stores.find(s => s.id === member.storeId)?.name)?.slice(0, 15)}...` : ''}
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                <button onClick={() => resetPassword(member)} title="Reset Password"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors">
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => startEdit(member)} title="Edit Profile"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleStatus(member.id, member.status)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors
                    ${member.status === 'active' ? 'bg-success/10 text-success hover:bg-success/15' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {member.status === 'active' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{member.status === 'active' ? 'Active' : 'Locked'}</span>
                </button>
              </div>
            </div>
          ))}
          {staffList.length === 0 && (
            <div className="py-20 text-center animate-fade-in">
              <p className="text-muted-foreground font-light text-sm">No personnel found.</p>
            </div>
          )}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg shadow-2xl animate-scale-in my-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium">{editingStaff ? 'Edit Personnel' : 'Add New Personnel'}</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name</label>
                    <input type="text" placeholder="E.g. Brain Kamau" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Account Level</label>
                    <select value={formData.role} onChange={e => handleRoleOrStoreChange({ role: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:border-primary transition-all"
                      disabled={role !== 'admin'}>
                      <option value="staff">Agent / Cashier</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Branch Assignment</label>
                    <select value={formData.storeId} onChange={e => handleRoleOrStoreChange({ storeId: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:border-primary transition-all"
                      disabled={role !== 'admin'}>
                      <option value="">Main (Unassigned)</option>
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Login ID</label>
                    <button onClick={() => setFormData(p => ({ ...p, email: generateLoginID(p.role, p.storeId) }))} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                      Auto-Generate
                    </button>
                  </div>
                  <input type="email" placeholder="e.g. agent_123@nexaos.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Access Password</label>
                    <button onClick={() => setFormData(p => ({ ...p, tempPassword: generateMemorablePassword() }))} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                      Auto-Generate
                    </button>
                  </div>
                  <input type="text" placeholder="••••••••" value={formData.tempPassword} onChange={e => setFormData(p => ({ ...p, tempPassword: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:ring-2 focus:ring-primary/20 transition-all font-mono" />
                </div>

                <div className="pt-2">
                  <button onClick={handleSubmit} disabled={!formData.email || !formData.tempPassword} 
                    className={`w-full h-12 rounded-xl text-sm font-medium transition-all
                      ${(!formData.email || !formData.tempPassword) ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' : 'bg-primary text-primary-foreground hover:shadow-lg hover:-translate-y-0.5'}`}>
                    {editingStaff ? 'Update System Access' : 'Create & Provision Access'}
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
