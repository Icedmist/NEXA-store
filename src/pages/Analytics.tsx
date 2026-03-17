import DashboardLayout from '@/components/layout/DashboardLayout';
import { dailyRevenue, topProducts, paymentBreakdown } from '@/data/demo';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export default function Analytics() {
  const totalRevenue = dailyRevenue.reduce((s, d) => s + d.revenue, 0);
  const totalTx = dailyRevenue.reduce((s, d) => s + d.transactions, 0);

  const handleExport = () => {
    const csv = [
      'Day,Revenue,Transactions',
      ...dailyRevenue.map(d => `${d.day},${d.revenue},${d.transactions}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-report.csv';
    a.click();
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">Store performance this week</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 bg-card/60 backdrop-blur-md border border-border px-4 h-10 rounded-xl text-sm font-normal hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-1">
            <DollarSign className="w-4 h-4 text-muted-foreground mb-3" />
            <p className="text-2xl font-medium tabular-nums tracking-tight">₦{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1 font-light">Weekly Revenue</p>
          </div>
          <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-2">
            <ShoppingBag className="w-4 h-4 text-muted-foreground mb-3" />
            <p className="text-2xl font-medium tabular-nums tracking-tight">{totalTx.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1 font-light">Total Transactions</p>
          </div>
          <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground mb-3" />
            <p className="text-2xl font-medium tabular-nums tracking-tight">₦{Math.round(totalRevenue / totalTx).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1 font-light">Avg. Transaction</p>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 mb-3 animate-fade-in stagger-4">
          <p className="text-sm font-medium mb-4">Daily Revenue</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 8% 50%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 8% 50%)' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(0 0% 100%)', border: '1px solid hsl(40 10% 90%)', borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: 'hsl(40 10% 95%)' }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(220 12% 14%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-5">
            <p className="text-sm font-medium mb-4">Most Sold Products</p>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.sold} sold</p>
                  </div>
                  <p className="text-sm tabular-nums">₦{p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-6">
            <p className="text-sm font-medium mb-4">Payment Reconciliation</p>
            <div className="space-y-4">
              {paymentBreakdown.map(p => {
                const total = paymentBreakdown.reduce((s, x) => s + x.amount, 0);
                return (
                  <div key={p.method}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>{p.method}</span>
                      <span className="tabular-nums text-muted-foreground">{p.count} txns · ₦{p.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(p.amount / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
