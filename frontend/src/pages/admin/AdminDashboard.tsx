import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../../types';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({
  title, value, icon, color
}) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/admin/products" className="bg-amazon-yellow text-amazon-dark font-medium px-4 py-2 rounded hover:bg-amazon-light text-sm">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-50 text-sm">
              Manage Orders
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="bg-gray-200 h-12 w-12 rounded-xl mb-3" />
                <div className="bg-gray-200 h-3 w-20 rounded mb-2" />
                <div className="bg-gray-200 h-6 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Orders" value={String(stats.totalOrders)} icon="📦" color="bg-blue-50" />
            <StatCard title="Total Revenue" value={formatPrice(stats.totalRevenue)} icon="💰" color="bg-green-50" />
            <StatCard title="Total Users" value={String(stats.totalUsers)} icon="👥" color="bg-purple-50" />
            <StatCard title="Total Products" value={String(stats.totalProducts)} icon="🛍️" color="bg-orange-50" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/products" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-amazon-blue">Product Management</h3>
            <p className="text-sm text-gray-500">Add, edit, and delete products</p>
          </Link>
          <Link to="/admin/orders" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-amazon-blue">Order Management</h3>
            <p className="text-sm text-gray-500">View and update order statuses</p>
          </Link>
          <Link to="/admin/users" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-amazon-blue">User Management</h3>
            <p className="text-sm text-gray-500">Manage customer accounts</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
