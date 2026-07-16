import api from "@/api/axios";

export const getProducts = async (
  page = 1,
  limit = 12
) => {
  const response = await api.get(
    `/products?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const getProduct = async (
  id: number
) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

export const searchProducts = async (
  keyword: string
) => {
  const response = await api.get(
    `/products/search?keyword=${keyword}`
  );

  return response.data;
};

export const getProductById = async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const getRecommendations = async (id: number) => {
    const response = await api.get(`/products/${id}/recommend`);
    return response.data;
};