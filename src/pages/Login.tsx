import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Role } from '@/data/demo';
import { ShieldCheck, Store, ScanLine, ArrowRight } from 'lucide-react';

const roles: { id: Role; label: string; desc: string; icon: typeof ShieldCheck }[] = [
  { id: 'admin', label: 'Administrator', desc: 'Global oversight and store management', icon: ShieldCheck },
  { id: 'manager', label: 'Store Manager', desc: 'Inventory, staff, and local analytics', icon: Store },
  { id: 'cashier', label: 'Cashier', desc: 'Point of sale and QR scanning', icon: ScanLine },
];

export default function Login() {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    if (!selected) return;
    setEntering(true);
    setTimeout(() => {
      setRole(selected);
      navigate(selected === 'cashier' ? '/pos' : '/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen dot-pattern flex items-center justify-center p-4">
      <div className={`w-full max-w-md transition-all duration-300 ${entering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-primary-foreground text-lg font-semibold tracking-tight">NX</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight">Nexa Store OS</h1>
          <p className="text-sm text-muted-foreground mt-2 font-light">Select your role to continue</p>
        </div>

        {/* Role cards */}
        <div className="space-y-2.5">
          {roles.map((role, i) => (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                animate-fade-in stagger-${i + 1}
                ${selected === role.id
                  ? 'border-primary bg-card shadow-sm'
                  : 'border-border bg-card/60 hover:bg-card hover:border-border'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                ${selected === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                <role.icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium">{role.label}</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">{role.desc}</p>
              </div>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                ${selected === role.id ? 'border-primary bg-primary' : 'border-border'}
              `}>
                {selected === role.id && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
              </div>
            </button>
          ))}
        </div>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          disabled={!selected}
          className={`
            w-full mt-6 h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2
            transition-all duration-200 animate-fade-in stagger-4
            ${selected
              ? 'bg-primary text-primary-foreground hover:shadow-md'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[11px] text-muted-foreground mt-6 font-light animate-fade-in stagger-5">
          Demo mode — no credentials required
        </p>
      </div>
    </div>
  );
}
