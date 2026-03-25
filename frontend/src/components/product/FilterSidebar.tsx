import React from 'react';
import { Category } from '../../types';
import { useAppSelector } from '../../hooks/useAppDispatch';
import StarRating from '../common/StarRating';

interface FilterSidebarProps {
  filters: {
    category?: number;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    minRating?: number;
  };
  onFilterChange: (filters: any) => void;
  categories: Category[];
  availableBrands?: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters, onFilterChange, categories, availableBrands = []
}) => {
  const [priceMin, setPriceMin] = React.useState(filters.minPrice?.toString() || '');
  const [priceMax, setPriceMax] = React.useState(filters.maxPrice?.toString() || '');

  const handlePriceApply = () => {
    onFilterChange({
      minPrice: priceMin ? Number(priceMin) : undefined,
      maxPrice: priceMax ? Number(priceMax) : undefined,
      page: 0,
    });
  };

  return (
    <aside className="w-64 flex-shrink-0" data-testid="filter-sidebar">
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
        <h2 className="font-semibold text-gray-800 text-lg">Filters</h2>

        {/* Categories */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Category</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onFilterChange({ category: undefined, page: 0 })}
                className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-50 ${!filters.category ? 'text-amazon-blue font-medium' : 'text-gray-600'}`}
              >
                All Categories
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => onFilterChange({ category: cat.id, page: 0 })}
                  className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-50 ${filters.category === cat.id ? 'text-amazon-blue font-medium' : 'text-gray-600'}`}
                >
                  {cat.name}
                </button>
                {cat.subCategories?.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => onFilterChange({ category: sub.id, page: 0 })}
                    className={`text-sm w-full text-left px-2 py-1 pl-5 rounded hover:bg-gray-50 ${filters.category === sub.id ? 'text-amazon-blue font-medium' : 'text-gray-500'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number" placeholder="Min" value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number" placeholder="Max" value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <button
            onClick={handlePriceApply}
            className="mt-2 w-full bg-amazon-yellow text-amazon-dark text-sm font-medium py-1.5 rounded hover:bg-amazon-light"
          >
            Apply
          </button>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Brand</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {availableBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={filters.brand === brand}
                    onChange={() => onFilterChange({ brand, page: 0 })}
                    className="text-amazon-blue"
                  />
                  <span className="text-sm text-gray-600">{brand}</span>
                </label>
              ))}
            </div>
            {filters.brand && (
              <button
                onClick={() => onFilterChange({ brand: undefined, page: 0 })}
                className="text-xs text-amazon-blue hover:underline mt-1"
              >
                Clear brand filter
              </button>
            )}
          </div>
        )}

        {/* Clear all filters */}
        {(filters.category || filters.minPrice || filters.maxPrice || filters.brand) && (
          <button
            onClick={() => onFilterChange({ category: undefined, minPrice: undefined, maxPrice: undefined, brand: undefined, page: 0 })}
            className="w-full text-sm text-red-500 hover:text-red-700 border border-red-200 rounded py-1.5 hover:bg-red-50"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
