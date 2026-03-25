import React, { useEffect } from 'react';
import { generatePlaceholder, handleImageError } from '../utils/imageUtils';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatters';
import Breadcrumbs from '../components/common/Breadcrumbs';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, isLoading } = useAppSelector(state => state.cart);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(fetchCart());
  }, [isAuthenticated, dispatch, navigate]);

  const handleUpdateQty = async (itemId: number, qty: number) => {
    if (qty <= 0) {
      await dispatch(removeFromCart(itemId));
      return;
    }
    try {
      await dispatch(updateCartItem({ itemId, quantity: qty })).unwrap();
    } catch (err: any) { toast.error(err || 'Failed to update'); }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed');
    } catch (err: any) { toast.error(err || 'Failed to remove'); }
  };

  const handleClear = async () => {
    if (window.confirm('Clear all items from cart?')) {
      await dispatch(clearCart());
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingCartIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add items to get started</p>
        <Link to="/products" className="bg-amazon-yellow text-amazon-dark font-bold px-8 py-3 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const taxRate = 0.08;
  const subtotal = cart.totalAmount;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Cart' }]} />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({cart.totalItems} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={item.productImageUrl || generatePlaceholder(item.productName)}
                    alt={item.productName}
                    className="w-24 h-24 object-contain rounded"
                    onError={handleImageError}
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${item.productId}`}
                    className="font-medium text-gray-800 hover:text-amazon-blue line-clamp-2">
                    {item.productName}
                  </Link>
                  <p className="text-lg font-bold text-amazon-dark mt-1">{formatPrice(item.unitPrice)}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-lg">-</button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-lg">+</button>
                    </div>
                    <button onClick={() => handleRemove(item.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm">
                      <TrashIcon className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatPrice(item.subtotal)}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button onClick={handleClear}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 h-fit sticky top-20">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal ({cart.totalItems} items)</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              <div className="flex justify-between"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <Link
              to="/checkout"
              className="mt-4 block w-full text-center bg-amazon-yellow text-amazon-dark font-bold py-3 rounded-lg hover:bg-amazon-light transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
