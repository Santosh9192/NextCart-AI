import { useEffect, useState, useCallback, useRef } from "react";
import { getAdminProducts } from "@/features/dashboard/DashboardAPI";
import api from "@/api/axios";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", brand: "", sku: "", price: "", discount: "0",
    category_id: "", quantity: "10", featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const limit = 20;

  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, any> = {};
      if (search) filters.search = search;
      if (categoryFilter) filters.category_id = Number(categoryFilter);
      if (featuredFilter) filters.featured = featuredFilter === "true";
      if (stockFilter === "low") filters.stock_status = "low";
      filters.sort_by = sortBy;
      filters.sort_order = sortOrder;
      const data = await getAdminProducts(page, limit, filters);
      setProducts(data.products);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, featuredFilter, stockFilter, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortOrder("desc"); }
  };

  const clearFilters = () => {
    setSearch(""); setSearchInput(""); setCategoryFilter(""); setFeaturedFilter(""); setStockFilter("");
    setSortBy("id"); setSortOrder("desc"); setPage(1);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.sku || !form.price || !form.category_id) {
      toast.error("Fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description || form.name,
        brand: form.brand,
        sku: form.sku,
        price: parseFloat(form.price),
        discount: parseFloat(form.discount) || 0,
        featured: form.featured,
        category_id: parseInt(form.category_id),
        quantity: parseInt(form.quantity) || 10,
      };
      const res = await api.post("/products/", body);
      const pid = res.data.id;

      // Upload image if selected
      if (imageFile && pid) {
        const fd = new FormData();
        fd.append("file", imageFile);
        await api.post(`/products/${pid}/upload-image`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Product created");
      setShowForm(false);
      setForm({ name: "", description: "", brand: "", sku: "", price: "", discount: "0", category_id: "", quantity: "10", featured: false });
      setImageFile(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = search || categoryFilter || featuredFilter || stockFilter;
  const countFilters = [search, categoryFilter, featuredFilter, stockFilter].filter(Boolean).length;

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortOrder === "desc" ? <ArrowDown size={14} className="text-orange-600" /> : <ArrowUp size={14} className="text-orange-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{total} products total</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search by name, brand, or SKU..."
              value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm transition"
            />
          </form>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
              showFilters || hasFilters ? "bg-orange-50 border-orange-200 text-orange-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} /> Filters
            {countFilters > 0 && <span className="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{countFilters}</span>}
          </button>
          {hasFilters && <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"><X size={16} /> Clear</button>}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 bg-white">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.product_count})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Featured</label>
              <select value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 bg-white">
                <option value="">All</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
              <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 bg-white">
                <option value="">All</option>
                <option value="low">Low Stock (&lt;10)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
              <div className="flex gap-1 flex-wrap">
                {[
                  { key: "id", label: "Newest" },
                  { key: "name", label: "Name" },
                  { key: "price", label: "Price" },
                  { key: "discount", label: "Discount" },
                  { key: "average_rating", label: "Rating" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => toggleSort(key)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      sortBy === key ? "bg-orange-50 border-orange-200 text-orange-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}>
                    {label} <SortIcon col={key} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">New Product</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Product name" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})}
                    placeholder="Brand" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})}
                    placeholder="e.g. BRD-001" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                    placeholder="999" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm({...form, discount: e.target.value})}
                    placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white">
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})}
                    placeholder="10" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={3} placeholder="Product description..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-center text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Featured product
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {saving ? "Creating..." : "Create Product"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-gray-300" /></div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No products match your filters</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Product</th>
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Brand</th>
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Category</th>
                  <th className="text-right px-5 py-4 font-medium text-gray-500">Price</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Stock</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Rating</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Status</th>
                  <th className="text-right px-5 py-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{p.brand}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{p.category_name}</td>
                    <td className="px-5 py-4 text-right font-medium">
                      ₹{Number(p.price).toLocaleString()}
                      {p.discount > 0 && <span className="text-xs text-red-500 ml-1">-{p.discount}%</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.quantity < 10 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-xs text-gray-500">{p.average_rating.toFixed(1)}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.featured ? "bg-amber-50 text-amber-600" : p.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {p.featured ? "⭐ Featured" : p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><Edit3 size={15} /></button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
}
