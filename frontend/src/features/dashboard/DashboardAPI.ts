import api from "@/api/axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getAdminUsers = async (filters?: Record<string, any>) => {
  let url = "/admin/users";
  if (filters) {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.role) params.set("role", filters.role);
    if (filters.is_active !== undefined) params.set("is_active", filters.is_active);
    if (filters.is_verified !== undefined) params.set("is_verified", filters.is_verified);
    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    if (filters.sort_order) params.set("sort_order", filters.sort_order);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const updateAdminUser = async (userId: number, data: any) => {
  const response = await api.put(`/admin/users/${userId}`, data);
  return response.data;
};

export const getAdminOrders = async (page = 1, limit = 20, filters?: Record<string, any>) => {
  let url = `/admin/orders?page=${page}&limit=${limit}`;
  if (filters) {
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.payment) url += `&payment=${filters.payment}`;
    if (filters.sort_by) url += `&sort_by=${filters.sort_by}`;
    if (filters.sort_order) url += `&sort_order=${filters.sort_order}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const updateOrderStatus = async (orderId: number, data: any) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, data);
  return response.data;
};

export const getAdminProducts = async (page = 1, limit = 20, filters?: Record<string, any>) => {
  let url = `/admin/products?page=${page}&limit=${limit}`;
  if (filters) {
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.category_id) url += `&category_id=${filters.category_id}`;
    if (filters.brand) url += `&brand=${encodeURIComponent(filters.brand)}`;
    if (filters.featured !== undefined) url += `&featured=${filters.featured}`;
    if (filters.is_active !== undefined) url += `&is_active=${filters.is_active}`;
    if (filters.stock_status) url += `&stock_status=${filters.stock_status}`;
    if (filters.sort_by) url += `&sort_by=${filters.sort_by}`;
    if (filters.sort_order) url += `&sort_order=${filters.sort_order}`;
  }
  const response = await api.get(url);
  return response.data;
};
