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
      <div className="max-w-2xl">
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

          <section className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-3">
            <h2 className="text-sm font-medium mb-4">Alerts</h2>
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
