import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProducts, setFilters } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import Pagination from '../components/common/Pagination';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';
import { Category } from '../types';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Best Rated' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, totalElements, totalPages, currentPage } = useAppSelector(state => state.products);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [pageSize, setPageSize] = React.useState(20);

  const currentFilters = {
    page: parseInt(searchParams.get('page') || '0'),
    size: parseInt(searchParams.get('size') || '20'),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortDir: (searchParams.get('sortDir') || 'desc') as 'asc' | 'desc',
    category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    brand: searchParams.get('brand') || undefined,
    search: searchParams.get('search') || undefined,
  };

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(currentFilters));
  }, [searchParams, dispatch]);

  const updateFilters = useCallback((newFilters: any) => {
    const updated = { ...currentFilters, ...newFilters };
    const params: Record<string, string> = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params[k] = String(v);
    });
    setSearchParams(params);
  }, [currentFilters, setSearchParams]);

  const currentSort = `${currentFilters.sortBy}_${currentFilters.sortDir}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Products' }]} />

        <div className="flex gap-6">
          <FilterSidebar
            filters={currentFilters}
            onFilterChange={updateFilters}
            categories={categories}
          />

          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-sm text-gray-600">
                {isLoading ? 'Loading...' : `${totalElements} results`}
                {currentFilters.search && ` for "${currentFilters.search}"`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={currentSort}
                  onChange={e => {
                    const [sortBy, sortDir] = e.target.value.split('_');
                    updateFilters({ sortBy, sortDir, page: 0 });
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={pageSize} />
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-xl font-medium">No products found</p>
                <p className="text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentFilters.page}
              totalPages={totalPages}
              onPageChange={page => updateFilters({ page })}
              pageSize={pageSize}
              onPageSizeChange={size => { setPageSize(size); updateFilters({ size, page: 0 }); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
