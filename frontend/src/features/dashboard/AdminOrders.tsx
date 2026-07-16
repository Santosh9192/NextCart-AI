import { useEffect, useState, useCallback } from "react";
import { getAdminOrders, updateOrderStatus } from "@/features/dashboard/DashboardAPI";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const statuses = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const payments = ["Pending", "Paid"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.payment = paymentFilter;
      params.sort_by = sortBy;
      params.sort_order = sortOrder;
      const data = await getAdminOrders(page, limit, params);
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, paymentFilter, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, { order_status: newStatus });
      toast.success(`Order #${orderId} → ${newStatus}`);
      load();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setStatusFilter("");
    setPaymentFilter("");
    setSortBy("id");
    setSortOrder("desc");
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = search || statusFilter || paymentFilter;

  const statusColor = (s: string) => {
    switch (s) {
      case "Delivered": return "bg-green-50 text-green-600";
      case "Shipped": return "bg-blue-50 text-blue-600";
      case "Confirmed": return "bg-purple-50 text-purple-600";
      case "Cancelled": return "bg-red-50 text-red-600";
      default: return "bg-yellow-50 text-yellow-600";
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortOrder === "desc"
      ? <ArrowDown size={14} className="text-blue-600" />
      : <ArrowUp size={14} className="text-blue-600" />;
  };

  const countFilters = (statusFilter ? 1 : 0) + (paymentFilter ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{total} total orders</p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or order #..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm transition"
            />
          </form>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
              showFilters || hasFilters
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} />
            Filters
            {countFilters > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {countFilters}
              </span>
            )}
          </button>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment</label>
              <select
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="">All Payments</option>
                {payments.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
              <div className="flex gap-1">
                {[
                  { key: "id", label: "Order" },
                  { key: "total_amount", label: "Amount" },
                  { key: "created_at", label: "Date" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleSort(key)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      sortBy === key
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                    <SortIcon col={key} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No orders match your filters</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Order</th>
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Customer</th>
                  <th className="text-right px-5 py-4 font-medium text-gray-500">Amount</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Payment</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Status</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">#{o.id}</p>
                      <p className="text-xs text-gray-400">{o.items?.length || 0} items</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{o.customer_name}</p>
                      <p className="text-xs text-gray-400">{o.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      ₹{Number(o.total_amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        o.payment_status === "Paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={o.order_status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className={`text-xs font-medium px-2 py-1.5 rounded-full border-0 cursor-pointer outline-none ${statusColor(o.order_status)}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updatingId === o.id && (
                          <Loader2 size={14} className="animate-spin text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500 text-xs">
                      {o.created_at?.split("T")[0] || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
