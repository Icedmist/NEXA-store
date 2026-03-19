import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Plus, X, UserCheck, UserX, Edit2, Store } from 'lucide-react';

export default function Staff() {
  const { staff: allStaff, stores, addStaff, updateStaff, role, staff: currentStaffMembers } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'cashier' as 'cashier' | 'manager', storeId: '', password: '' });

  // Filter staff based on role
  // For demo: suppose 'st3' is the current manager logging in (Clara)
  // In a real app, this would be based on the logged in user's ID
  const currentUserId = 'st3'; 
  const currentUser = allStaff.find(s => s.id === currentUserId);
  
  const staffList = role === 'admin' 
    ? allStaff 
    : allStaff.filter(s => s.storeId === currentUser?.storeId);

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;
    if (editingStaff) {
      updateStaff(editingStaff, formData);
    } else {
      addStaff(formData);
    }
    setFormData({ name: '', email: '', role: 'cashier', storeId: '', password: '' });
    setShowAdd(false);
    setEditingStaff(null);
  };

  const startEdit = (member: any) => {
    setFormData({ 
      name: member.name, 
      email: member.email, 
      role: member.role, 
      storeId: member.storeId || '', 
      password: member.password || '' 
    });
    setEditingStaff(member.id);
    setShowAdd(true);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateStaff(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Staff</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {staffList.filter(s => s.status === 'active').length} active · {staffList.filter(s => s.status === 'inactive').length} inactive
            </p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            Add Cashier
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
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground font-light">{member.email}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:block">
                {member.role} {member.storeId ? `• ${stores.find(s => s.id === member.storeId)?.name}` : ''}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(member)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleStatus(member.id, member.status)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors
                    ${member.status === 'active' ? 'bg-success/10 text-success hover:bg-success/15' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {member.status === 'active' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{member.status === 'active' ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Full Name</label>
                    <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Email</label>
                    <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Role</label>
                    <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value as any }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
                      disabled={role !== 'admin'}>
                      <option value="cashier">Cashier</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Store Assignment</label>
                    <select value={formData.storeId} onChange={e => setFormData(p => ({ ...p, storeId: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
                      disabled={role !== 'admin'}>
                      <option value="">No Store Assigned</option>
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block px-1">Login Password</label>
                  <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                </div>

                <button onClick={handleSubmit} className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity mt-2">
                  {editingStaff ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
