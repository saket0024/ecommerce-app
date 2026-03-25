import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { closeCart, removeFromCart, updateCartItem } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { generatePlaceholder, handleImageError } from '../../utils/imageUtils';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cart, isOpen, isLoading } = useAppSelector(state => state.cart);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
    } catch (err: any) {
      toast.error(err || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch (err: any) {
      toast.error(err || 'Failed to remove item');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        data-testid="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-amazon-dark text-white">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="w-5 h-5" />
            <h2 className="font-semibold text-lg">
              Shopping Cart ({cart?.totalItems || 0})
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Close cart"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingCartIcon className="w-16 h-16" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Link
                to="/products"
                onClick={() => dispatch(closeCart())}
                className="bg-amazon-yellow text-amazon-dark px-4 py-2 rounded font-medium hover:bg-amazon-light"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3" data-testid="cart-item">
                <img
                  src={item.productImageUrl || generatePlaceholder(item.productName)}
                  alt={item.productName}
                  className="w-16 h-16 object-contain rounded"
                  onError={handleImageError}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.productName}</p>
                  <p className="text-sm text-amazon-dark font-bold mt-1">{formatPrice(item.unitPrice)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-lg"
                      >-</button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-lg"
                      >+</button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isLoading}
                      className="p-1 text-red-400 hover:text-red-600"
                      aria-label="Remove item"
                      data-testid="remove-item-btn"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700">{formatPrice(item.subtotal)}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="block w-full text-center bg-amazon-yellow hover:bg-amazon-light text-amazon-dark font-semibold py-3 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={() => dispatch(closeCart())}
              className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
