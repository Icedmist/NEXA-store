import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { products as allProducts } from '@/data/demo';
import { useState, useEffect } from 'react';
import { Camera, ScanLine } from 'lucide-react';

export default function Scanner() {
  const { addToCart } = useApp();
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<typeof allProducts[0] | null>(null);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setScanLine(prev => {
        if (prev >= 100) {
          const random = allProducts[Math.floor(Math.random() * allProducts.length)];
          setFound(random);
          setScanning(false);
          return 0;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleScan = () => { setFound(null); setScanLine(0); setScanning(true); };

  const handleAdd = () => { if (found) { addToCart(found); setFound(null); } };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-xl font-medium tracking-tight">QR Scanner</h1>
          <p className="text-sm text-muted-foreground font-light mt-1">Scan product QR codes to add to cart</p>
        </div>

        <div className="relative aspect-square max-w-xs mx-auto bg-foreground/5 rounded-2xl overflow-hidden border border-border mb-6 animate-fade-in stagger-1">
          <div className="absolute inset-0 flex items-center justify-center">
            {!scanning && !found && (
              <div className="text-center">
                <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Camera preview</p>
              </div>
            )}
          </div>
          <div className="absolute inset-6">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-md" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-md" />
          </div>
          {scanning && (
            <div className="absolute left-6 right-6 h-0.5 bg-accent transition-none" style={{ top: `${6 + (scanLine / 100) * 88}%` }} />
          )}
        </div>

        {!found && (
          <button onClick={handleScan} disabled={scanning}
            className={`w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 animate-fade-in stagger-2
              ${scanning ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:shadow-md'}`}>
            <ScanLine className="w-4 h-4" />
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        )}

        {found && (
          <div className="bg-card/60 backdrop-blur-md rounded-xl border border-border p-5 animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">{found.image}</span>
              <div>
                <p className="text-sm font-medium">{found.name}</p>
                <p className="text-xs text-muted-foreground">{found.category}</p>
                <p className="text-lg font-medium tabular-nums mt-1">₦{found.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium">Add to Cart</button>
              <button onClick={handleScan} className="flex-1 h-10 bg-muted text-foreground rounded-xl text-sm font-medium">Scan Again</button>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground mt-6 font-light animate-fade-in stagger-3">
          In production, this uses your device camera for real QR scanning
        </p>
      </div>
    </DashboardLayout>
  );
}
