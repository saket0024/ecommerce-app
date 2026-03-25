import React, { useEffect } from 'react';
import { generatePlaceholder, handleImageError } from '../utils/imageUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchOrders } from '../store/slices/orderSlice';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, isLoading } = useAppSelector(state => state.orders);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(fetchOrders({}));
  }, [isAuthenticated, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Orders' }]} />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>

        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-xl font-medium text-gray-600 mb-2">No orders yet</p>
            <Link to="/products" className="text-amazon-blue hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-6 text-sm">
                    <div><span className="text-gray-500 block text-xs uppercase">Order Placed</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span></div>
                    <div><span className="text-gray-500 block text-xs uppercase">Total</span>
                      <span className="font-bold">{formatPrice(order.totalAmount)}</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">Order #{order.id}</span>
                    <Link to={`/orders/${order.id}`}
                      className="text-sm text-amazon-blue hover:underline font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-3 flex-wrap">
                    {order.orderItems.slice(0, 3).map(item => (
                      <div key={item.id} className="flex gap-2 items-center">
                        <img
                          src={item.productImageUrl || generatePlaceholder(item.productName)}
                          alt={item.productName}
                          className="w-12 h-12 object-contain rounded"
                          onError={handleImageError}
                        />
                        <div>
                          <p className="text-sm font-medium line-clamp-1 max-w-[150px]">{item.productName}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="flex items-center text-sm text-gray-500">
                        +{order.orderItems.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
