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
    
    // Simple mock logic for generic domains vs store subdomains
    if (parts.length > 2 || (parts.length === 2 && host.includes('localhost') && parts[0] !== 'localhost')) {
      const slug = parts[0];
      if (slug !== 'www' && slug !== 'app') {
        setPortalSlug(slug);
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

      // Lazy Registration Logic
      if (authError && authError.message.includes('Invalid login credentials')) {
        // Check if there's a matching password_hash in staff_members
        const { data: staffMatch } = await supabase
          .from('staff_members')
          .select('id, password_hash')
          .eq('email', email)
          .single();

        if (staffMatch && staffMatch.password_hash === password) {
          // Password verified against password_hash!
          // Register them for real in Supabase Auth
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (signUpErr) throw signUpErr;

          // Clear password_hash so it can't be reused, update the user ID if needed 
          // (though ID should probably stay the original generated ID, or we update the auth user. Better to just clear password_hash)
          await supabase.from('staff_members').update({ password_hash: null, status: 'active' }).eq('id', staffMatch.id);

          const newUserId = signUpData.user?.id;
          if (newUserId && newUserId !== staffMatch.id) {
            await supabase.from('staff_members').update({ id: newUserId }).eq('id', staffMatch.id);
            await supabase.from('stores').update({ manager_id: newUserId }).eq('manager_id', staffMatch.id);
          }

          // We are now signed in via signUp!
          authError = null;
        }
      }

      // If still error, throw
      if (authError) throw authError;

      // 2. Fetch role and store_id from staff_members table based on email
      const { data: staff, error: staffErr } = await supabase
        .from('staff_members')
        .select('role, store_id')
        .eq('email', email)
        .single();

      if (staffErr || !staff) {
        throw new Error('Your account profile is missing or corrupted. If you created this account previously before the recent updates, please register a brand new store to set up your admin profile correctly.');
      } 
      
      if (staff?.store_id) {
        // Fetch the specific store name & slug, with fallback for outdated schema cache
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
        // We fetch the store belonging to the current visiting portal layout
        if (portalSlug) {
          const { data: portalStore } = await supabase
            .from('stores')
            .select('id, parent_store_id')
            .eq('slug', portalSlug)
            .single();

          if (portalStore) {
            // 2-way Hierarchical Check:
            // 1. Visit matches your store (portalStore.id === staff.store_id)
            // 2. Visiting node is a branch of your store (portalStore.parent_store_id === staff.store_id)
            // 3. Your store node is a branch belonging to the visiting base (storeData?.parent_store_id === portalStore.id)
            
            const staffParentId = (storeData as any)?.parent_store_id;
            const isOwner = portalStore.id === staff.store_id || 
                            portalStore.parent_store_id === staff.store_id ||
                            (staffParentId && staffParentId === portalStore.id);

            if (!isOwner) {
              await supabase.auth.signOut();
              throw new Error(`Access Denied: Your account doesn't have privileges mapped for the ${portalSlug} store portal.`);
            }
          } else {
            // Fallback for missing Slug schemas on old database records
            const matches = storeData?.slug === portalSlug || 
                            storeData?.name?.toLowerCase().replace(/\s+/g, '') === portalSlug;

            if (storeData && !matches) {
              await supabase.auth.signOut();
              throw new Error(`Invalid Access: Your account does not belong to the ${portalSlug} store portal.`);
            }
          }
        }
      }

      const userRole = staff.role;

      // STRICT DOMAIN ROLE GUARDS
      if (!portalSlug && userRole !== 'admin') {
        // Bare domain (localhost:8080) -> ONLY Admins
        await supabase.auth.signOut();
        throw new Error('Access Denied: Staff and Managers must log in using their dedicated store URL.');
      }

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
          <h1 className="text-2xl font-medium tracking-tight">{portalSlug ? `Login to ${portalSlug.toUpperCase()}` : 'Nexa Store OS'}</h1>
          <p className="text-sm text-muted-foreground mt-2 font-light">
            {portalSlug ? 'Please enter the credentials generated by your administrator' : 'Sign in to your account to continue'}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-xs p-3.5 rounded-xl mb-5 text-center border border-destructive/20 animate-fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
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
                placeholder={portalSlug ? `e.g. agent_123@${portalSlug}.nexaos.com` : "amina@nexa.co"}
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
