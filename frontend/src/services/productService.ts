import api from './api';
import { Product, PageResponse, ProductFilters } from '../types';

export const productService = {
  getProducts: async (filters: ProductFilters = {}): Promise<PageResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);
    if (filters.category) params.append('category', String(filters.category));
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get<PageResponse<Product>>(`/products?${params}`);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (q: string, page = 0, size = 20): Promise<PageResponse<Product>> => {
    const response = await api.get<PageResponse<Product>>(`/products/search?q=${q}&page=${page}&size=${size}`);
    return response.data;
  },

  createProduct: async (data: Partial<Product> & { categoryId: number; imageUrls?: string[] }): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: Partial<Product> & { categoryId: number; imageUrls?: string[] }): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
