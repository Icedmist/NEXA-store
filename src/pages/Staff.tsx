import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { staff as allStaff, StaffMember } from '@/data/demo';
import { Plus, X, UserCheck, UserX } from 'lucide-react';

export default function Staff() {
  const [staffList, setStaffList] = useState<StaffMember[]>(allStaff);
  const [showAdd, setShowAdd] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '' });

  const handleAdd = () => {
    if (!newStaff.name || !newStaff.email) return;
    const initials = newStaff.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const member: StaffMember = { id: `st${Date.now()}`, name: newStaff.name, email: newStaff.email, role: 'cashier', status: 'active', initials };
    setStaffList(prev => [member, ...prev]);
    setNewStaff({ name: '', email: '' });
    setShowAdd(false);
  };

  const toggleStatus = (id: string) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
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
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:block">{member.role}</span>
              <button onClick={() => toggleStatus(member.id)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors
                  ${member.status === 'active' ? 'bg-success/10 text-success hover:bg-success/15' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {member.status === 'active' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{member.status === 'active' ? 'Active' : 'Inactive'}</span>
              </button>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">Add Cashier</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Full name" value={newStaff.name} onChange={e => setNewStaff(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                <input type="email" placeholder="Email" value={newStaff.email} onChange={e => setNewStaff(p => ({ ...p, email: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                <button onClick={handleAdd} className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium">Add Cashier</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
