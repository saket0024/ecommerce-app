import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '../../types';
import { cartService } from '../../services/cartService';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  isOpen: false,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartService.addItem(productId, quantity);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }: { itemId: number; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartService.updateItem(itemId, quantity);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId: number, { rejectWithValue }) => {
    try {
      return await cartService.removeItem(itemId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    clearCartState: (state) => { state.cart = null; },
  },
  extraReducers: (builder) => {
    const setLoading = (state: CartState) => { state.isLoading = true; state.error = null; };
    const setCart = (state: CartState, action: PayloadAction<Cart>) => {
      state.isLoading = false;
      state.cart = action.payload;
    };
    const setError = (state: CartState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)
      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, setError)
      .addCase(removeFromCart.pending, setLoading)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, setError)
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
        state.isLoading = false;
      });
  },
});

export const { toggleCart, openCart, closeCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
