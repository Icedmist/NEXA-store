import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { role } = useApp();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Downtown Flagship',
    email: 'admin@nexastore.co',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    lowStockAlert: true,
    brandColor: '#1e2328',
    currency: 'NGN',
    receiptHeader: 'Thank you for shopping with us!',
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const update = (key: string, value: string | boolean) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-xl font-medium tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground font-light mt-1">System configuration</p>
        </div>

        <div className="space-y-4">
          <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-1">
            <h2 className="text-sm font-medium mb-4">General</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Store Name</label>
                <input type="text" value={settings.storeName} onChange={e => update('storeName', e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                  <select value={settings.currency} onChange={e => update('currency', e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10">
                    <option>NGN</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={settings.brandColor} onChange={e => update('brandColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                    <span className="text-xs text-muted-foreground tabular-nums">{settings.brandColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {role === 'admin' && (
            <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-2">
              <h2 className="text-sm font-medium mb-4">Email (SMTP)</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Notification Email</label>
                  <input type="email" value={settings.email} onChange={e => update('email', e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">SMTP Host</label>
                    <input type="text" value={settings.smtpHost} onChange={e => update('smtpHost', e.target.value)}
                      className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">SMTP Port</label>
                    <input type="text" value={settings.smtpPort} onChange={e => update('smtpPort', e.target.value)}
                      className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-2">
              <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Store Branding
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-dashed border-border">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border">LOGO</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Store Logo</p>
                    <p className="text-[10px] text-muted-foreground">PNG or SVG, max 500kb</p>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">Upload</button>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Brand Main Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={settings.brandColor} onChange={e => update('brandColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent shadow-sm" />
                    <input type="text" value={settings.brandColor} onChange={e => update('brandColor', e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-xs font-mono focus:outline-none" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-3">
              <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Security & Access
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light">Two-Factor Auth</p>
                    <p className="text-[10px] text-muted-foreground">Require 2FA for all managers</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-muted relative transition-colors">
                    <div className="w-4 h-4 rounded-full bg-card absolute top-0.5 left-0.5 shadow-sm" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light">Session Timeout</p>
                    <p className="text-[10px] text-muted-foreground">Auto logout after 30 mins</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-primary relative transition-colors">
                    <div className="w-4 h-4 rounded-full bg-card absolute top-0.5 right-0.5 shadow-sm" />
                  </button>
                </div>
                <button className="w-full h-9 border border-border rounded-xl text-xs font-medium hover:bg-muted transition-colors mt-2">
                  Reset Global Passwords
                </button>
              </div>
            </section>
          </div>

          <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-4">
            <h2 className="text-sm font-medium mb-4">Notifications & Audit</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Low stock notifications</p>
                  <p className="text-xs text-muted-foreground font-light">Get emailed when products hit threshold</p>
                </div>
                <button onClick={() => update('lowStockAlert', !settings.lowStockAlert)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${settings.lowStockAlert ? 'bg-primary' : 'bg-muted'}`}>
                  <div className={`w-5 h-5 rounded-full bg-card absolute top-0.5 transition-transform shadow-sm ${settings.lowStockAlert ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <p className="text-sm">Manager Activity Logs</p>
                  <p className="text-xs text-muted-foreground font-light">Notify admin of manager staff modifications</p>
                </div>
                <button className="w-11 h-6 rounded-full bg-primary relative">
                  <div className="w-5 h-5 rounded-full bg-card absolute top-0.5 right-0.5 shadow-sm" />
                </button>
              </div>
            </div>
          </section>

          <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-4">
            <h2 className="text-sm font-medium mb-4">Receipt</h2>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Header Message</label>
              <input type="text" value={settings.receiptHeader} onChange={e => update('receiptHeader', e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
            </div>
          </section>

          <button onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow animate-fade-in stagger-5">
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
