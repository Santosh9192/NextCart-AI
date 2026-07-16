import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/features/dashboard/DashboardAPI";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  BarChart3,
  Star,
  Layers,
  ShoppingBag,
  PackageX,
  Percent,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface DashboardData {
  total_users: number;
  total_products: number;
  total_categories: number;
  total_orders: number;
  total_revenue: number;
  today_revenue: number;
  week_revenue: number;
  avg_order_value: number;
  pending_orders: number;
  low_stock_products: number;
  out_of_stock_products: number;
  order_status_distribution: Record<string, number>;
  latest_orders: any[];
  recent_users: any[];
  monthly_revenue: { date: string; revenue: number }[];
  top_products: { id: number; name: string; total_sold: number; revenue: number }[];
  category_breakdown: { name: string; product_count: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      label: "Total Revenue",
      value: `₹${(data?.total_revenue ?? 0).toLocaleString()}`,
      sub: `Today: ₹${(data?.today_revenue ?? 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-green-500",
      bg: "bg-green-50",
      txt: "text-green-600",
    },
    {
      label: "Total Orders",
      value: data?.total_orders ?? 0,
      sub: `Avg: ₹${(data?.avg_order_value ?? 0).toFixed(0)}`,
      icon: ShoppingCart,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      txt: "text-blue-600",
    },
    {
      label: "Total Users",
      value: data?.total_users ?? 0,
      sub: `Products: ${data?.total_products ?? 0}`,
      icon: Users,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      txt: "text-purple-600",
    },
    {
      label: "Pending Orders",
      value: data?.pending_orders ?? 0,
      sub: `Low stock: ${data?.low_stock_products ?? 0}`,
      icon: Clock,
      color: "bg-yellow-500",
      bg: "bg-yellow-50",
      txt: "text-yellow-600",
    },
  ];

  const secondaryStats = [
    {
      label: "Today's Revenue",
      value: `₹${(data?.today_revenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      bg: "bg-emerald-50",
      txt: "text-emerald-600",
    },
    {
      label: "This Week",
      value: `₹${(data?.week_revenue ?? 0).toLocaleString()}`,
      icon: BarChart3,
      bg: "bg-cyan-50",
      txt: "text-cyan-600",
    },
    {
      label: "Avg Order Value",
      value: `₹${(data?.avg_order_value ?? 0).toFixed(0)}`,
      icon: Percent,
      bg: "bg-rose-50",
      txt: "text-rose-600",
    },
    {
      label: "Out of Stock",
      value: data?.out_of_stock_products ?? 0,
      icon: PackageX,
      bg: "bg-red-50",
      txt: "text-red-600",
    },
  ];

  // Revenue chart
  const revenueChartData = {
    labels:
      data?.monthly_revenue?.map((r) => {
        const d = new Date(r.date);
        return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      }) ?? [],
    datasets: [
      {
        fill: true,
        label: "Revenue",
        data: data?.monthly_revenue?.map((r) => r.revenue) ?? [],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const revenueChartOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { callback: (v: any) => "₹" + v.toLocaleString() },
      },
      x: { grid: { display: false } },
    },
  };

  // Order status doughnut
  const statusData = data?.order_status_distribution ?? {};
  const statusLabels = Object.keys(statusData);
  const statusValues = Object.values(statusData);
  const statusColors = ["#f59e0b", "#8b5cf6", "#3b82f6", "#10b981", "#ef4444"];

  const doughnutData = {
    labels: statusLabels,
    datasets: [{ data: statusValues, backgroundColor: statusColors.slice(0, statusLabels.length), borderWidth: 0 }],
  };

  const doughnutOpts = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: { position: "bottom" as const, labels: { usePointStyle: true, padding: 16 } },
    },
  };

  // Top products
  const topProducts = data?.top_products ?? [];

  // Category breakdown
  const categories = data?.category_breakdown ?? [];
  const catColors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];
  const catChartData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.product_count),
        backgroundColor: catColors.slice(0, categories.length),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Store performance overview</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map(({ label, value, sub, icon: Icon, bg, txt }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={txt} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryStats.map(({ label, value, icon: Icon, bg, txt }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon size={18} className={txt} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">30-Day Revenue</h2>
          </div>
          <div className="h-64">
            {data?.monthly_revenue && data.monthly_revenue.length > 0 ? (
              <Line data={revenueChartData} options={revenueChartOpts} />
            ) : (
              <p className="text-gray-400 text-center pt-20">No revenue data yet</p>
            )}
          </div>
        </div>

        {/* Order Status Doughnut */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
          </div>
          {statusLabels.length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOpts} />
            </div>
          ) : (
            <p className="text-gray-400 text-center pt-20">No orders yet</p>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Top Products by Revenue</h2>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-600">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.total_sold} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">₹{p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No product sales yet</p>
          )}
          <Link to="/admin/products" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            View all products →
          </Link>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={20} className="text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
          </div>
          {categories.length > 0 ? (
            <div className="space-y-5">
              {/* Header summary */}
              <div className="flex items-center justify-between text-sm text-gray-500 pb-2 border-b border-gray-100">
                <span>{categories.length} categories</span>
                <span>{categories.reduce((s, c) => s + c.product_count, 0)} total products</span>
              </div>
              {/* Category bars */}
              {categories.map((c, i) => {
                const maxCount = Math.max(...categories.map(x => x.product_count))
                const pct = Math.round((c.product_count / maxCount) * 100)
                const color = catColors[i % catColors.length]
                const catIcons: Record<string, string> = {
                  "Electronics": "🖥️",
                  "Fashion": "👕",
                  "Home & Kitchen": "🏠",
                  "Books": "📚",
                  "Sports & Fitness": "🏋️",
                }
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{catIcons[c.name] || "📦"}</span>
                        <span className="font-medium text-gray-800 text-sm">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{c.product_count}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">
                          ({Math.round((c.product_count / categories.reduce((s, x) => s + x.product_count, 0)) * 100)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No categories yet</p>
          )}
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Latest Orders</h2>
          </div>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {data?.latest_orders && data.latest_orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 font-medium text-gray-500">Order</th>
                  <th className="pb-3 font-medium text-gray-500">Amount</th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.latest_orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">#{o.id}</td>
                    <td className="py-3">₹{Number(o.total_amount).toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          o.order_status === "Delivered"
                            ? "bg-green-50 text-green-600"
                            : o.order_status === "Cancelled"
                            ? "bg-red-50 text-red-600"
                            : o.order_status === "Shipped"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{o.created_at?.split("T")[0] || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No orders yet</p>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          </div>
          <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {data?.recent_users && data.recent_users.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {data.recent_users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                  {u.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{u.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No users yet</p>
        )}
      </div>
    </div>
  );
}
