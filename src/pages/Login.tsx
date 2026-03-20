import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Fetch role from staff_members table based on email
      const { data: staff, error: staffErr } = await supabase
        .from('staff_members')
        .select('role')
        .eq('email', email)
        .single();

      if (staffErr) {
        console.warn('Failed to fetch staff role from DB. Falling back to staff.', staffErr);
      }

      const userRole = staff?.role || 'staff';
      setRole(userRole as any);

      // 3. Navigate based on role
      navigate(userRole === 'staff' ? '/pos' : '/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dot-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md transition-all duration-300 opacity-100 scale-100">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-5 transition-transform hover:scale-105 duration-300 drop-shadow-lg">
            <img src="/logo.png" alt="Nexa Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight">Nexa Store OS</h1>
          <p className="text-sm text-muted-foreground mt-2 font-light">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-xs p-3.5 rounded-xl mb-5 text-center border border-destructive/20 animate-fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 animate-fade-in stagger-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-light text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="email"
                type="email"
                placeholder="amina@nexa.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 pl-10 rounded-xl bg-card/60 backdrop-blur-sm border-border focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-light text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pl-10 rounded-xl bg-card/60 backdrop-blur-sm border-border focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`
              w-full mt-6 h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2
              transition-all duration-200
              ${loading || !email || !password
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:shadow-md hover:translate-y-[-1px]'
              }
            `}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground mt-8 font-light animate-fade-in stagger-3">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}
