import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { products as allProducts, categories, Product } from '@/data/demo';
import { Search, Plus, Filter, AlertTriangle, Package, X } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: categories[0], price: '', stock: '' });

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    const product: Product = {
      id: `p${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      lowStockThreshold: 10,
      qrCode: `QR-${Date.now()}`,
      image: '📦',
    };
    setProducts(prev => [product, ...prev]);
    setNewProduct({ name: '', category: categories[0], price: '', stock: '' });
    setShowAdd(false);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Inventory</h1>
            <p className="text-sm text-muted-foreground font-light mt-1">
              {products.length} products · {lowStockCount > 0 && (
                <span className="text-destructive">{lowStockCount} low stock</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 animate-fade-in stagger-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`
                  px-3 h-10 rounded-xl text-xs whitespace-nowrap transition-colors
                  ${categoryFilter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((product, i) => {
            const isLow = product.stock <= product.lowStockThreshold;
            return (
              <div
                key={product.id}
                className={`bg-card rounded-xl border border-border p-4 animate-fade-in stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{product.image}</span>
                  {isLow && (
                    <span className="flex items-center gap-1 text-[10px] text-destructive bg-destructive/8 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3 h-3" />
                      Low
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium leading-tight">{product.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{product.category}</p>
                <div className="flex items-end justify-between mt-3">
                  <p className="text-lg font-medium tabular-nums tracking-tight">KES {product.price.toLocaleString()}</p>
                  <p className={`text-xs tabular-nums ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {product.stock} in stock
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Package className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        )}

        {/* Add product modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">Add Product</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-md hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
                />
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Price (KES)"
                    value={newProduct.price}
                    onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
                  />
                  <input
                    type="number"
                    placeholder="Stock qty"
                    value={newProduct.stock}
                    onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
                  />
                </div>
                <button
                  onClick={handleAddProduct}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
