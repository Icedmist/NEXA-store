import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { products as allProducts } from '@/data/demo';
import { useState } from 'react';
import { Minus, Plus, Trash2, CreditCard, Banknote, Smartphone, Check, ShoppingCart } from 'lucide-react';

type PaymentMethod = 'cash' | 'card' | 'mobile';

export default function POS() {
  const { cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount } = useApp();
  const [search, setSearch] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleCheckout = () => {
    setReceiptId(`RCP-${Date.now().toString().slice(-6)}`);
    setShowReceipt(true);
    setShowCheckout(false);
  };

  const handleDone = () => {
    clearCart();
    setShowReceipt(false);
  };

  const payments: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'mobile', label: 'M-Pesa', icon: Smartphone },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
        {/* Products */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="mb-4 animate-fade-in">
            <h1 className="text-xl font-medium tracking-tight">Point of Sale</h1>
            <input
              type="text"
              placeholder="Search or scan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 px-4 rounded-xl border border-border bg-card text-sm font-light mt-3 focus:outline-none focus:ring-2 focus:ring-ring/10"
            />
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 content-start">
            {filtered.map((product, i) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={`bg-card rounded-xl border border-border p-3 text-left hover:border-primary/20 hover:shadow-sm transition-all animate-fade-in stagger-${Math.min(i + 1, 6)}`}
              >
                <span className="text-xl">{product.image}</span>
                <p className="text-xs font-medium mt-2 leading-tight line-clamp-2">{product.name}</p>
                <p className="text-sm font-medium tabular-nums mt-1">KES {product.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="w-full lg:w-80 bg-card rounded-xl border border-border flex flex-col animate-slide-in-left">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Cart</p>
              <span className="text-xs text-muted-foreground">{cartCount} items</span>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Tap products to add</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">KES {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs tabular-nums w-6 text-center font-medium">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium tabular-nums text-base">KES {cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              disabled={cart.length === 0}
              className={`w-full h-11 rounded-xl text-sm font-medium transition-all
                ${cart.length > 0
                  ? 'bg-primary text-primary-foreground hover:shadow-md'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm animate-scale-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-medium mb-1">Payment</h2>
            <p className="text-3xl font-medium tabular-nums tracking-tight mb-6">KES {cartTotal.toLocaleString()}</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {payments.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors
                    ${paymentMethod === p.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}
                >
                  <p.icon className="w-5 h-5" />
                  <span className="text-xs">{p.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleCheckout} className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm animate-scale-in text-center">
            <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-base font-medium mb-1">Payment Complete</h2>
            <p className="text-xs text-muted-foreground mb-4">{receiptId}</p>
            <div className="bg-muted/50 rounded-xl p-4 mb-4 text-left">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-xs py-1">
                  <span>{item.name} ×{item.qty}</span>
                  <span className="tabular-nums">KES {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-medium pt-2 mt-2 border-t border-border">
                <span>Total</span>
                <span className="tabular-nums">KES {cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 capitalize">Paid via {paymentMethod}</p>
            </div>
            <button onClick={handleDone} className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
              Done
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
