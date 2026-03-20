import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Store, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function StoreRegistrationSection() {
  const navigate = useNavigate();
  const { registerStore } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerStore(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="w-full py-24 sm:py-32 flex justify-center relative overflow-hidden">
      {/* Background blobs for visual interest */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Copy */}
          <div className="flex flex-col gap-6 max-w-[540px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Registration Open</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#37322F] dark:text-white leading-[1.1]">
              Put your store on the <span className="text-accent italic font-serif">grid.</span>
            </h2>
            
            <p className="text-lg text-[#605A57] dark:text-gray-400 leading-relaxed">
              Join thousands of retailers who trust Nexa to run their operations offline and online. Register your store today and get full access to our multi-store dashboard and QR inventory system.
            </p>
            
            <div className="flex flex-col gap-4 mt-4">
              {[
                "Instant store setup in under 2 minutes",
                "Unlimited staff accounts and role management",
                "Advanced QR inventory synchronization",
                "Works 100% offline with auto-sync"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  </div>
                  <span className="text-sm font-medium text-[#49423D] dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="relative">
            {/* Decorative elements behind form */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/10 to-transparent blur-2xl rounded-[32px] opacity-50"></div>
            
            <div className="glass-card dark:glass p-8 sm:p-10 rounded-[32px] border border-[rgba(55,50,47,0.12)] dark:border-white/10 shadow-2xl relative z-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#37322F] dark:text-white">Register Store</h3>
                <p className="text-sm text-[#605A57] dark:text-gray-400 mt-1">Free 14-day trial, no credit card required.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#605A57] dark:text-gray-500 ml-1">Store Name</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605A57] dark:text-gray-500 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. Vintage Vault" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 bg-white/50 dark:bg-white/5 border border-[rgba(55,50,47,0.12)] dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#605A57] dark:text-gray-500 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605A57] dark:text-gray-500 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="email" 
                      placeholder="admin@yourstore.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 bg-white/50 dark:bg-white/5 border border-[rgba(55,50,47,0.12)] dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#605A57] dark:text-gray-500 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605A57] dark:text-gray-500 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 bg-white/50 dark:bg-white/5 border border-[rgba(55,50,47,0.12)] dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 mt-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Store Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <p className="text-center text-[10px] text-[#605A57] dark:text-gray-500 mt-4 leading-relaxed px-4">
                  By clicking "Create Store Account", you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </form>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 glass p-4 rounded-2xl border border-[rgba(55,50,47,0.12)] dark:border-white/20 shadow-xl hidden sm:flex items-center gap-3 animate-bounce">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#37322F] dark:text-white uppercase tracking-wider">Enterprise Grade</span>
                <span className="text-xs text-[#605A57] dark:text-gray-400">SOC2 Type II Compliant</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
