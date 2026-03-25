import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { Address } from '../types';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/common/Breadcrumbs';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'United States', isDefault: false });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadAddresses();
  }, [isAuthenticated, navigate]);

  const loadAddresses = async () => {
    try {
      const r = await api.get('/users/me/addresses');
      setAddresses(r.data);
    } catch {}
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/me/addresses', newAddress);
      toast.success('Address added!');
      setShowAddForm(false);
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'United States', isDefault: false });
      loadAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/users/me/addresses/${id}`);
      toast.success('Address deleted');
      loadAddresses();
    } catch { toast.error('Failed to delete address'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Profile' }]} />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center text-amazon-dark font-bold text-2xl">
              {user?.firstName[0]}{user?.lastName[0]}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{user?.role}</span>
            </div>
          </div>
          {user?.createdAt && (
            <p className="text-sm text-gray-500">Member since {formatDate(user.createdAt)}</p>
          )}
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Saved Addresses</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-sm bg-amazon-yellow text-amazon-dark px-3 py-1.5 rounded font-medium hover:bg-amazon-light"
            >
              {showAddForm ? 'Cancel' : '+ Add Address'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAddress} className="mb-4 bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-medium">Add New Address</h3>
              <input placeholder="Street Address" required value={newAddress.street}
                onChange={e => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="City" required value={newAddress.city}
                  onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 text-sm" />
                <input placeholder="State" required value={newAddress.state}
                  onChange={e => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Zip Code" required value={newAddress.zipCode}
                  onChange={e => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 text-sm" />
                <input placeholder="Country" required value={newAddress.country}
                  onChange={e => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newAddress.isDefault}
                  onChange={e => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))} />
                Set as default address
              </label>
              <button type="submit" className="bg-amazon-yellow text-amazon-dark font-medium px-4 py-2 rounded hover:bg-amazon-light text-sm">
                Save Address
              </button>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">No saved addresses</p>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className="border border-gray-200 rounded-lg p-3 flex justify-between">
                  <div>
                    <p className="text-sm font-medium">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-sm text-gray-600">{addr.country}</p>
                    {addr.isDefault && <span className="text-xs text-green-600 font-medium">Default</span>}
                  </div>
                  <button onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
