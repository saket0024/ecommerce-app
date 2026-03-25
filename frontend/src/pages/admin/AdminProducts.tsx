import React, { useEffect, useState } from 'react';
import { generatePlaceholder, handleImageError } from '../../utils/imageUtils';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Product, PageResponse, Category } from '../../types';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPercent: '0',
    stockQuantity: '', sku: '', brand: '', categoryId: '',
    imageUrls: [''],
  });

  useEffect(() => {
    loadProducts();
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, [currentPage]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const r = await api.get(`/products?page=${currentPage}&size=20&sortBy=createdAt&sortDir=desc`);
      setProducts(r.data);
    } catch { toast.error('Failed to load products'); }
    finally { setIsLoading(false); }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, description: product.description,
      price: String(product.price), discountPercent: String(product.discountPercent),
      stockQuantity: String(product.stockQuantity), sku: product.sku,
      brand: product.brand || '', categoryId: String(product.category?.id || ''),
      imageUrls: product.imageUrls?.length ? product.imageUrls : [''],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      discountPercent: parseInt(form.discountPercent),
      stockQuantity: parseInt(form.stockQuantity),
      categoryId: parseInt(form.categoryId),
      imageUrls: form.imageUrls.filter(url => url.trim()),
    };
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);
        toast.success('Product updated!');
      } else {
        await api.post('/products', data);
        toast.success('Product created!');
      }
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <button
            onClick={() => { setEditingProduct(null); setForm({ name: '', description: '', price: '', discountPercent: '0', stockQuantity: '', sku: '', brand: '', categoryId: '', imageUrls: [''] }); setShowForm(true); }}
            className="flex items-center gap-2 bg-amazon-yellow text-amazon-dark font-bold px-4 py-2 rounded hover:bg-amazon-light"
          >
            <PlusIcon className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input required type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount %</label>
                    <input type="number" min="0" max="100" value={form.discountPercent} onChange={e => setForm(p => ({ ...p, discountPercent: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input required type="number" min="0" value={form.stockQuantity} onChange={e => setForm(p => ({ ...p, stockQuantity: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SKU *</label>
                    <input required value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select required value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option value="">Select...</option>
                      {categories.map(c => (
                        <React.Fragment key={c.id}>
                          <option value={c.id}>{c.name}</option>
                          {c.subCategories?.map(sub => <option key={sub.id} value={sub.id}>&nbsp;&nbsp;{sub.name}</option>)}
                        </React.Fragment>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Image URLs</label>
                    {form.imageUrls.map((url, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={url} onChange={e => {
                          const urls = [...form.imageUrls];
                          urls[i] = e.target.value;
                          setForm(p => ({ ...p, imageUrls: urls }));
                        }} placeholder="https://..." className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                        {form.imageUrls.length > 1 && (
                          <button type="button" onClick={() => setForm(p => ({ ...p, imageUrls: p.imageUrls.filter((_, j) => j !== i) }))}
                            className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(p => ({ ...p, imageUrls: [...p.imageUrls, ''] }))}
                      className="text-xs text-amazon-blue hover:underline">+ Add image URL</button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }}
                    className="flex-1 border border-gray-300 py-2 rounded font-medium hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 bg-amazon-yellow text-amazon-dark font-bold py-2 rounded hover:bg-amazon-light">
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7}><TableSkeleton rows={10} cols={7} /></td></tr>
              ) : products?.content.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrls?.[0] || generatePlaceholder(product.name)} alt=""
                        className="w-10 h-10 object-contain rounded" onError={handleImageError} />
                      <div>
                        <p className="text-sm font-medium line-clamp-1 max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category?.name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={product.stockQuantity < 10 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">⭐ {product.rating?.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products && (
          <Pagination
            currentPage={currentPage}
            totalPages={products.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
