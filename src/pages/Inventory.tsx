import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useCallback } from 'react';
import { products as allProducts, categories, Product } from '@/data/demo';
import { Search, Plus, AlertTriangle, Package, X, Upload, FileSpreadsheet, Check } from 'lucide-react';

interface CSVRow {
  name: string;
  category: string;
  price: string;
  stock: string;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: categories[0], price: '', stock: '' });
  const [dragOver, setDragOver] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [bulkImported, setBulkImported] = useState(false);

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

  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('product'));
    const catIdx = headers.findIndex(h => h.includes('categ'));
    const priceIdx = headers.findIndex(h => h.includes('price'));
    const stockIdx = headers.findIndex(h => h.includes('stock') || h.includes('qty') || h.includes('quantity'));

    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length < 2) continue;
      rows.push({
        name: nameIdx >= 0 ? cols[nameIdx] : cols[0],
        category: catIdx >= 0 ? cols[catIdx] : 'Electronics',
        price: priceIdx >= 0 ? cols[priceIdx] : '0',
        stock: stockIdx >= 0 ? cols[stockIdx] : '0',
      });
    }
    setCsvData(rows.filter(r => r.name));
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  }, [parseCSV]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleBulkImport = () => {
    const newProducts: Product[] = csvData.map((row, i) => ({
      id: `p${Date.now()}-${i}`,
      name: row.name,
      category: row.category,
      price: Number(row.price) || 0,
      stock: Number(row.stock) || 0,
      lowStockThreshold: 10,
      qrCode: `QR-${Date.now()}-${i}`,
      image: '📦',
    }));
    setProducts(prev => [...newProducts, ...prev]);
    setBulkImported(true);
    setTimeout(() => {
      setBulkImported(false);
      setShowBulk(false);
      setCsvData([]);
      setCsvFileName('');
    }, 1500);
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulk(true)}
              className="flex items-center gap-2 bg-card border border-border px-4 h-10 rounded-xl text-sm font-normal hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">CSV Upload</span>
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 h-10 rounded-xl text-sm font-medium hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
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
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card/60 backdrop-blur-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10"
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
                    : 'bg-card/60 backdrop-blur-md border border-border text-muted-foreground hover:text-foreground'
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
                className={`bg-card/60 backdrop-blur-md rounded-xl border border-border p-4 animate-fade-in stagger-${Math.min(i + 1, 6)}`}
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
                  <p className="text-lg font-medium tabular-nums tracking-tight">₦{product.price.toLocaleString()}</p>
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
                <input type="text" placeholder="Product name" value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                <select value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Price (₦)" value={newProduct.price}
                    onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                  <input type="number" placeholder="Stock qty" value={newProduct.stock}
                    onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-ring/10" />
                </div>
                <button onClick={handleAddProduct}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk CSV upload modal */}
        {showBulk && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowBulk(false); setCsvData([]); setCsvFileName(''); }}>
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">Bulk CSV Upload</h2>
                <button onClick={() => { setShowBulk(false); setCsvData([]); setCsvFileName(''); }} className="p-1 rounded-md hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {csvData.length === 0 ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
                    ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'}
                  `}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFile(file);
                    };
                    input.click();
                  }}
                >
                  <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Drop your CSV file here, or <span className="text-foreground font-medium">browse</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                    Columns: name, category, price, stock
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{csvFileName}</span>
                    <span className="text-muted-foreground">· {csvData.length} products</span>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden mb-4 max-h-60 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <th className="text-left px-3 py-2 font-medium">Name</th>
                          <th className="text-left px-3 py-2 font-medium">Category</th>
                          <th className="text-right px-3 py-2 font-medium">Price</th>
                          <th className="text-right px-3 py-2 font-medium">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 20).map((row, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.category}</td>
                            <td className="px-3 py-2 text-right tabular-nums">₦{Number(row.price).toLocaleString()}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{row.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvData.length > 20 && (
                      <p className="text-[11px] text-muted-foreground text-center py-2">+{csvData.length - 20} more rows</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { setCsvData([]); setCsvFileName(''); }}
                      className="flex-1 h-10 bg-muted text-foreground rounded-xl text-sm font-medium">
                      Cancel
                    </button>
                    <button onClick={handleBulkImport}
                      className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                      {bulkImported ? <><Check className="w-4 h-4" /> Imported!</> : <>Import {csvData.length} products</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
