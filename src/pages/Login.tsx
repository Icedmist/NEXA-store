 import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const { setRole, setStoreName } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalSlug, setPortalSlug] = useState<string | null>(null);

  useEffect(() => {
    const host = window.location.hostname;
    const parts = host.split('.');
    
    // FINAL FIX: Explicitly ignore your main production domain and localhost
    const isMainSite = 
      host === 'localhost' || 
      host === 'nexa-store-six.vercel.app';

    if (!isMainSite) {
      // Only detect a "Portal" if we aren't on the main marketing site
      if (parts.length > (host.includes('vercel.app') ? 3 : 2)) {
        const slug = parts[0];
        if (slug !== 'www' && slug !== 'app') {
          setPortalSlug(slug);
        }
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Sign in with Supabase Auth
      let { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Lazy Registration Logic (Existing)
      if (authError && authError.message.includes('Invalid login credentials')) {
        const { data: staffMatch } = await supabase
          .from('staff_members')
          .select('id, password_hash')
          .eq('email', email)
          .single();

        if (staffMatch && staffMatch.password_hash === password) {
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (signUpErr) throw signUpErr;

          await supabase.from('staff_members').update({ password_hash: null, status: 'active' }).eq('id', staffMatch.id);

          const newUserId = signUpData.user?.id;
          if (newUserId && newUserId !== staffMatch.id) {
            await supabase.from('staff_members').update({ id: newUserId }).eq('id', staffMatch.id);
            await supabase.from('stores').update({ manager_id: newUserId }).eq('manager_id', staffMatch.id);
          }
          authError = null;
        }
      }

      if (authError) throw authError;

      // 2. Fetch role and store_id
      const { data: staff, error: staffErr } = await supabase
        .from('staff_members')
        .select('role, store_id')
        .eq('email', email)
        .single();

      if (staffErr || !staff) {
        throw new Error('Your account profile is missing or corrupted.');
      } 
      
      if (staff?.store_id) {
        let storeData = null;
        const resStore = await supabase
          .from('stores')
          .select('name, slug, parent_store_id')
          .eq('id', staff.store_id)
          .single();
          
        if (resStore.error) {
          if (resStore.error.code === 'PGRST204' || resStore.error.message.includes('slug')) {
             const fbStore = await supabase.from('stores').select('name, parent_store_id').eq('id', staff.store_id).single();
             storeData = fbStore.data;
          } else {
             throw resStore.error;
          }
        } else {
          storeData = resStore.data;
        }
          
        if (storeData?.name) {
          setStoreName(storeData.name);
        }
        
        // Strict mapping check for subdomain
        if (portalSlug) {
          const { data: portalStore } = await supabase
            .from('stores')
            .select('id, parent_store_id')
            .eq('slug', portalSlug)
            .single();

          if (portalStore) {
            const staffParentId = (storeData as any)?.parent_store_id;
            const isOwner = portalStore.id === staff.store_id || 
                            portalStore.parent_store_id === staff.store_id ||
                            (staffParentId && staffParentId === portalStore.id);

            if (!isOwner) {
              await supabase.auth.signOut();
              throw new Error(`Access Denied: Your account doesn't have privileges for ${portalSlug}.`);
            }
          }
        }
      }

      const userRole = staff.role;

      // STRICT DOMAIN ROLE GUARDS
      if (!portalSlug && userRole !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access Denied: Staff must log in using their dedicated store URL.');
      }

      setRole(userRole as any);
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
      <div className="w-full max-w-md transition-all duration-300">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-5">
            <img src="/logo.png" alt="Nexa Logo" className="w-full h-full object-contain" />
          </div>
          {/* This heading will now correctly show "Nexa Store OS" on your main URL */}
          <h1 className="text-2xl font-medium tracking-tight">
            {portalSlug ? `Login to ${portalSlug.toUpperCase()}` : 'Nexa Store OS'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-light">
            {portalSlug ? 'Please enter the credentials provided by your manager' : 'Sign in to your account to continue'}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-xs p-3.5 rounded-xl mb-5 text-center border border-destructive/20 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 animate-fade-in stagger-2">
          <div className="space-y-2">
             <Label htmlFor="email" className="text-xs font-light text-muted-foreground">
              {portalSlug ? 'Store Login ID / Email' : 'Email'}
             </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="email"
                type="email"
                placeholder={portalSlug ? `user@${portalSlug}.com` : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="Enter Password" />
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pl-10 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full mt-6 h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
                loading ? 'bg-muted' : 'bg-primary text-primary-foreground'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
