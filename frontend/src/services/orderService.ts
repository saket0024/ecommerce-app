import api from './api';
import { Order, PageResponse } from '../types';

export const orderService = {
  placeOrder: async (data: { shippingAddressId: number; paymentMethod: string }): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  getOrders: async (page = 0, size = 10): Promise<PageResponse<Order>> => {
    const response = await api.get<PageResponse<Order>>(`/orders?page=${page}&size=${size}`);
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};
