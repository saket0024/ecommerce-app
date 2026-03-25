import React, { useEffect, useState } from 'react';
import { Order, PageResponse } from '../../types';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<PageResponse<Order> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { loadOrders(); }, [currentPage]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const r = await api.get(`/admin/orders?page=${currentPage}&size=20`);
      setOrders(r.data);
    } catch { toast.error('Failed to load orders'); }
    finally { setIsLoading(false); }
  };

  const handleStatusUpdate = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      loadOrders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders Management</h1>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={8}><TableSkeleton rows={10} cols={8} /></td></tr>
              ) : orders?.content.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.orderItems?.length}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders && (
          <Pagination
            currentPage={currentPage}
            totalPages={orders.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
