import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { stores, dailyRevenue, paymentBreakdown, recentTransactions, topProducts } from '@/data/demo';
import { TrendingUp, DollarSign, ShoppingBag, Store, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

function StatCard({ label, value, change, positive, icon: Icon, delay }: {
  label: string; value: string; change: string; positive: boolean;
  icon: typeof TrendingUp; delay: number;
}) {
  return (
    <div className={`bg-card/60 backdrop-blur-md rounded-xl p-5 border border-border animate-fade-in stagger-${delay}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? 'text-success' : 'text-destructive'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-medium tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-light">{label}</p>
    </div>
  );
}

function AdminDashboardContent() {
  const totalRevenue = stores.reduce((s, st) => s + st.revenue, 0);
  const totalTransactions = stores.reduce((s, st) => s + st.transactions, 0);

  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-light mt-1">Overview across all stores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} change="12.4%" positive icon={DollarSign} delay={1} />
        <StatCard label="Transactions" value={totalTransactions.toLocaleString()} change="8.2%" positive icon={ShoppingBag} delay={2} />
        <StatCard label="Active Stores" value={stores.filter(s => s.status === 'active').length.toString()} change="0%" positive icon={Store} delay={3} />
        <StatCard label="Growth Rate" value="14.7%" change="2.1%" positive icon={TrendingUp} delay={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-3">
        <div className="lg:col-span-3 bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-5">
          <p className="text-sm font-medium mb-4">Weekly Revenue</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 8% 50%)' }} />
                <YAxis hide />
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

        <div className="lg:col-span-2 bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-6">
          <p className="text-sm font-medium mb-4">Stores</p>
          <div className="space-y-3">
            {stores.map(store => (
              <div key={store.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                  <div>
                    <p className="text-sm font-normal">{store.name}</p>
                    <p className="text-[11px] text-muted-foreground">{store.location}</p>
                  </div>
                </div>
                <p className="text-sm tabular-nums">₦{store.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 mt-3 animate-fade-in">
        <p className="text-sm font-medium mb-4">Recent Transactions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Cashier</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.slice(0, 4).map(tx => (
                <tr key={tx.id} className="border-t border-border">
                  <td className="py-3 text-muted-foreground tabular-nums">{tx.id}</td>
                  <td className="py-3">{tx.items.length} item{tx.items.length > 1 ? 's' : ''}</td>
                  <td className="py-3 tabular-nums">₦{tx.total.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-md capitalize">{tx.paymentMethod}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{tx.cashier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboardContent() {
  const todayRevenue = dailyRevenue[4].revenue;
  const todayTx = dailyRevenue[4].transactions;
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground font-light mt-1">Store performance and analytics</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 bg-card/60 backdrop-blur-md border border-border px-4 h-10 rounded-xl text-sm font-normal hover:bg-muted transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Today's Revenue" value={`₦${todayRevenue.toLocaleString()}`} change="18.3%" positive icon={DollarSign} delay={1} />
        <StatCard label="Transactions" value={todayTx.toString()} change="12.1%" positive icon={ShoppingBag} delay={2} />
        <StatCard label="Weekly Revenue" value={`₦${totalRevenue.toLocaleString()}`} change="15.7%" positive icon={TrendingUp} delay={3} />
        <StatCard label="Avg. Transaction" value={`₦${Math.round(totalRevenue / totalTx).toLocaleString()}`} change="8.4%" positive icon={DollarSign} delay={4} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-5">
          <p className="text-sm font-medium mb-4">Revenue Trend</p>
          <div className="h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 8% 50%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 8% 50%)' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(0 0% 100%)', border: '1px solid hsl(40 10% 90%)', borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: 'hsl(40 10% 95%)' }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(152 30% 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-6">
          <p className="text-sm font-medium mb-4">Payment Methods</p>
          <div className="space-y-3">
            {paymentBreakdown.map(p => {
              const total = paymentBreakdown.reduce((s, x) => s + x.amount, 0);
              return (
                <div key={p.method}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{p.method}</span>
                    <span className="tabular-nums text-muted-foreground">₦{p.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(p.amount / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Products */}
        <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-7">
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

        {/* Recent Transactions */}
        <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-8">
          <p className="text-sm font-medium mb-4">Recent Transactions</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.slice(0, 5).map(tx => (
                  <tr key={tx.id} className="border-t border-border">
                    <td className="py-3 text-muted-foreground tabular-nums">{tx.id}</td>
                    <td className="py-3">{tx.items.length} item{tx.items.length > 1 ? 's' : ''}</td>
                    <td className="py-3 tabular-nums">₦{tx.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-md capitalize">{tx.paymentMethod}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useApp();
  return (
    <DashboardLayout>
      {role === 'admin' ? <AdminDashboardContent /> : <ManagerDashboardContent />}
    </DashboardLayout>
  );
}
