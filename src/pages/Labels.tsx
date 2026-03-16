import DashboardLayout from '@/components/layout/DashboardLayout';
import { products as allProducts } from '@/data/demo';
import { useState } from 'react';
import { Printer, QrCode, Check } from 'lucide-react';

export default function Labels() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [printed, setPrinted] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === allProducts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allProducts.map(p => p.id)));
    }
  };

  const handlePrint = () => {
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2000);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">QR Labels</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">Generate printable QR code sheets</p>
          </div>
          <div className="flex gap-2">
            <button onClick={selectAll}
              className="px-4 h-10 rounded-xl border border-border bg-card text-sm font-normal hover:bg-muted transition-colors">
              {selected.size === allProducts.length ? 'Deselect All' : 'Select All'}
            </button>
            <button onClick={handlePrint} disabled={selected.size === 0}
              className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium transition-all
                ${selected.size > 0
                  ? 'bg-primary text-primary-foreground hover:shadow-md'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}>
              {printed ? <Check className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
              {printed ? 'Sent to printer' : `Print ${selected.size} labels`}
            </button>
          </div>
        </div>

        {/* Label grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {allProducts.map((product, i) => (
            <button
              key={product.id}
              onClick={() => toggle(product.id)}
              className={`
                p-4 rounded-xl border text-left transition-all animate-fade-in stagger-${Math.min(i + 1, 6)}
                ${selected.has(product.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/20'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                  ${selected.has(product.id) ? 'border-primary bg-primary' : 'border-border'}
                `}>
                  {selected.has(product.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </div>
              <p className="text-xs font-medium leading-tight">{product.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{product.qrCode}</p>
              <p className="text-xs tabular-nums mt-1 font-medium">KES {product.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
