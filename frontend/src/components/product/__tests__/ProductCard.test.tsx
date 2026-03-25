import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../ProductCard';
import authReducer from '../../../store/slices/authSlice';
import cartReducer from '../../../store/slices/cartSlice';
import { Product } from '../../../types';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  price: 99.99,
  discountedPrice: 79.99,
  discountPercent: 20,
  stockQuantity: 50,
  sku: 'TEST-001',
  brand: 'TestBrand',
  rating: 4.5,
  reviewCount: 100,
  category: { id: 1, name: 'Electronics', slug: 'electronics' },
  imageUrls: ['https://via.placeholder.com/300'],
  isActive: true,
  createdAt: '2024-01-01T00:00:00',
};

const createStore = (isAuthenticated = false) => configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState: {
    auth: {
      user: isAuthenticated ? { id: 1, firstName: 'Test', lastName: 'User', email: 'test@test.com', role: 'CUSTOMER', createdAt: '' } : null,
      accessToken: isAuthenticated ? 'mock-token' : null,
      refreshToken: null,
      isAuthenticated,
      isLoading: false,
      error: null,
    },
    cart: {
      cart: null,
      isLoading: false,
      error: null,
      isOpen: false,
    },
  },
});

const renderWithProviders = (isAuthenticated = false) => {
  const store = createStore(isAuthenticated);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    </Provider>
  );
};

describe('ProductCard', () => {
  test('renders product name', () => {
    renderWithProviders();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders discounted price', () => {
    renderWithProviders();
    expect(screen.getByText('$79.99')).toBeInTheDocument();
  });

  test('renders original price with strikethrough when discounted', () => {
    renderWithProviders();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('renders discount badge', () => {
    renderWithProviders();
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  test('renders brand name', () => {
    renderWithProviders();
    expect(screen.getByText('TestBrand')).toBeInTheDocument();
  });

  test('renders add to cart button', () => {
    renderWithProviders();
    expect(screen.getByTestId('add-to-cart-btn')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  test('shows out of stock when quantity is 0', () => {
    const oosProduct = { ...mockProduct, stockQuantity: 0 };
    const store = createStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={oosProduct} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  test('add to cart button is disabled when out of stock', () => {
    const oosProduct = { ...mockProduct, stockQuantity: 0 };
    const store = createStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={oosProduct} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('add-to-cart-btn')).toBeDisabled();
  });

  test('renders star rating', () => {
    renderWithProviders();
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
  });

  test('renders review count', () => {
    renderWithProviders();
    expect(screen.getByText('(100)')).toBeInTheDocument();
  });

  test('links to product detail page', () => {
    renderWithProviders();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });
});
