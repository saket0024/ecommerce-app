import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order, PageResponse } from '../../types';
import { orderService } from '../../services/orderService';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async ({ page, size }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      return await orderService.getOrders(page, size);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Order not found');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (data: { shippingAddressId: number; paymentMethod: string }, { rejectWithValue }) => {
    try {
      return await orderService.placeOrder(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id: number, { rejectWithValue }) => {
    try {
      return await orderService.cancelOrder(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false; state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      .addCase(placeOrder.pending, (state) => { state.isLoading = true; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o.id === action.payload.id);
        if (idx !== -1) state.orders[idx] = action.payload;
        if (state.currentOrder?.id === action.payload.id) state.currentOrder = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
