import React, { useEffect } from 'react';
import { generatePlaceholder, handleImageError } from '../utils/imageUtils';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchOrderById } from '../store/slices/orderSlice';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

const OrderConfirmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder: order, isLoading } = useAppSelector(state => state.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(Number(id)));
  }, [id, dispatch]);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amazon-yellow border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-6">Thank you for your order. We'll send you a confirmation email shortly.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Order #{order.id}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Placed on {formatDate(order.createdAt)}</p>

            <div className="space-y-3">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.productImageUrl || generatePlaceholder(item.productName)}
                    alt={item.productName} className="w-12 h-12 object-contain rounded"
                    onError={handleImageError} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <hr className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/orders" className="flex-1 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 text-center">
              View All Orders
            </Link>
            <Link to="/products" className="flex-1 bg-amazon-yellow text-amazon-dark font-bold py-2.5 rounded-lg hover:bg-amazon-light text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
