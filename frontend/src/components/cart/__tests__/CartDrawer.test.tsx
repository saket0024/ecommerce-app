import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CartDrawer from '../CartDrawer';
import cartReducer from '../../../store/slices/cartSlice';
import authReducer from '../../../store/slices/authSlice';
import { Cart } from '../../../types';

const mockCart: Cart = {
  id: 1,
  totalAmount: 199.98,
  totalItems: 2,
  items: [
    {
      id: 1, productId: 1, productName: 'iPhone 15 Pro', productImageUrl: '',
      unitPrice: 99.99, quantity: 2, subtotal: 199.98,
    },
  ],
};

const createStoreWithCart = (cart: Cart | null = null, isOpen = true) =>
  configureStore({
    reducer: { cart: cartReducer, auth: authReducer },
    preloadedState: {
      cart: { cart, isLoading: false, error: null, isOpen },
      auth: { user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false, error: null },
    },
  });

describe('CartDrawer', () => {
  test('renders when open', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('cart-drawer')).toBeInTheDocument();
  });

  test('displays item count in header', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Shopping Cart (2)')).toBeInTheDocument();
  });

  test('renders cart items', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
  });

  test('shows empty state when cart has no items', () => {
    const emptyCart: Cart = { id: 1, totalAmount: 0, totalItems: 0, items: [] };
    const store = createStoreWithCart(emptyCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  test('shows total amount', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('$199.98')).toBeInTheDocument();
  });

  test('has remove item button', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('remove-item-btn')).toBeInTheDocument();
  });

  test('has proceed to checkout link', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    const checkoutLink = screen.getByText('Proceed to Checkout');
    expect(checkoutLink).toBeInTheDocument();
  });

  test('close button dispatches closeCart action', () => {
    const store = createStoreWithCart(mockCart, true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      </Provider>
    );
    const closeBtn = screen.getByLabelText('Close cart');
    fireEvent.click(closeBtn);
    expect(store.getState().cart.isOpen).toBe(false);
  });
});
