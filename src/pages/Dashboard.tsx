import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { stores, dailyRevenue, paymentBreakdown, recentTransactions } from '@/data/demo';
import { TrendingUp, DollarSign, ShoppingBag, Store, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-light mt-1">Today's store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today's Revenue" value={`₦${todayRevenue.toLocaleString()}`} change="18.3%" positive icon={DollarSign} delay={1} />
        <StatCard label="Transactions" value={todayTx.toString()} change="12.1%" positive icon={ShoppingBag} delay={2} />
        <StatCard label="Low Stock Items" value="2" change="Alert" positive={false} icon={TrendingUp} delay={3} />
        <StatCard label="Active Cashiers" value="2" change="On shift" positive icon={Store} delay={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-3">
        <div className="lg:col-span-3 bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-5">
          <p className="text-sm font-medium mb-4">This Week</p>
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
                <Bar dataKey="revenue" fill="hsl(152 30% 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-fade-in stagger-6">
          <p className="text-sm font-medium mb-4">Payment Methods</p>
          <div className="space-y-4">
            {paymentBreakdown.map(p => (
              <div key={p.method}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{p.method}</span>
                  <span className="tabular-nums text-muted-foreground">₦{p.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(p.amount / 130000) * 100}%` }} />
                </div>
              </div>
            ))}
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
