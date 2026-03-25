import api from './api';
import { Review, PageResponse } from '../types';

export const reviewService = {
  getProductReviews: async (
    productId: number, page = 0, size = 10, sortBy = 'createdAt'
  ): Promise<PageResponse<Review>> => {
    const response = await api.get<PageResponse<Review>>(
      `/reviews/products/${productId}?page=${page}&size=${size}&sortBy=${sortBy}`
    );
    return response.data;
  },

  createReview: async (
    productId: number, data: { rating: number; title?: string; body?: string }
  ): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/products/${productId}`, data);
    return response.data;
  },

  updateReview: async (
    id: number, data: { rating: number; title?: string; body?: string }
  ): Promise<Review> => {
    const response = await api.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};
