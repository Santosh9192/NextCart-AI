import { useEffect, useState, useCallback } from "react";
import { getAdminUsers, updateAdminUser } from "@/features/dashboard/DashboardAPI";
import {
  Users,
  Loader2,
  Shield,
  User as UserIcon,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, any> = {};
      if (search) filters.search = search;
      if (roleFilter) filters.role = roleFilter;
      if (verifiedFilter) filters.is_verified = verifiedFilter === "true";
      if (activeFilter) filters.is_active = activeFilter === "true";
      filters.sort_by = sortBy;
      filters.sort_order = sortOrder;
      const data = await getAdminUsers(filters);
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, verifiedFilter, activeFilter, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  const toggleActive = async (userId: number, current: boolean) => {
    try {
      await updateAdminUser(userId, { is_active: !current });
      toast.success(`User ${current ? "deactivated" : "activated"}`);
      load();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setRoleFilter("");
    setVerifiedFilter("");
    setActiveFilter("");
    setSortBy("id");
    setSortOrder("desc");
  };

  const hasFilters = search || roleFilter || verifiedFilter || activeFilter;
  const countFilters = [search, roleFilter, verifiedFilter, activeFilter].filter(Boolean).length;

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortOrder === "desc"
      ? <ArrowDown size={14} className="text-blue-600" />
      : <ArrowUp size={14} className="text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">{users.length} registered users</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm transition"
            />
          </form>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
              showFilters || hasFilters
                ? "bg-purple-50 border-purple-200 text-purple-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} />
            Filters
            {countFilters > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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

        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 bg-white"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Verification</label>
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 bg-white"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 bg-white"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
              <div className="flex gap-1">
                {[
                  { key: "id", label: "Newest" },
                  { key: "full_name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "created_at", label: "Joined" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleSort(key)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      sortBy === key
                        ? "bg-purple-50 border-purple-200 text-purple-600"
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No users match your filters</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-4 font-medium text-gray-500">User</th>
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Email</th>
                  <th className="text-left px-5 py-4 font-medium text-gray-500">Phone</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Role</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Verified</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Joined</th>
                  <th className="text-center px-5 py-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                          {u.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <p className="font-medium text-gray-900">{u.full_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{u.email}</td>
                    <td className="px-5 py-4 text-gray-500">{u.phone || "-"}</td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.role_name === "Admin"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role_name === "Admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                        {u.role_name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          u.is_verified ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {u.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-xs text-gray-400">
                      {u.created_at?.split("T")[0]?.split(" ")[0] || "-"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleActive(u.id, u.is_active)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                          u.is_active
                            ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600"
                            : "bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
