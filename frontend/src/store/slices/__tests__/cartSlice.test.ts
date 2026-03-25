import cartReducer, {
  toggleCart,
  openCart,
  closeCart,
  clearCartState,
} from '../cartSlice';
import { Cart } from '../../../types';

const mockCart: Cart = {
  id: 1,
  totalAmount: 100,
  totalItems: 1,
  items: [{
    id: 1, productId: 1, productName: 'Test', productImageUrl: '',
    unitPrice: 100, quantity: 1, subtotal: 100,
  }],
};

const initialState = {
  cart: null,
  isLoading: false,
  error: null,
  isOpen: false,
};

describe('cartSlice', () => {
  test('initial state', () => {
    const state = cartReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('toggleCart opens cart when closed', () => {
    const state = cartReducer(initialState, toggleCart());
    expect(state.isOpen).toBe(true);
  });

  test('toggleCart closes cart when open', () => {
    const openState = { ...initialState, isOpen: true };
    const state = cartReducer(openState, toggleCart());
    expect(state.isOpen).toBe(false);
  });

  test('openCart sets isOpen to true', () => {
    const state = cartReducer(initialState, openCart());
    expect(state.isOpen).toBe(true);
  });

  test('closeCart sets isOpen to false', () => {
    const openState = { ...initialState, isOpen: true };
    const state = cartReducer(openState, closeCart());
    expect(state.isOpen).toBe(false);
  });

  test('clearCartState sets cart to null', () => {
    const stateWithCart = { ...initialState, cart: mockCart };
    const state = cartReducer(stateWithCart, clearCartState());
    expect(state.cart).toBeNull();
  });
});
