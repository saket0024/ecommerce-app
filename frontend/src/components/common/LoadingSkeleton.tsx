import React from 'react';

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
    <div className="bg-gray-200 h-48 w-full" />
    <div className="p-4 space-y-2">
      <div className="bg-gray-200 h-4 rounded w-3/4" />
      <div className="bg-gray-200 h-3 rounded w-1/2" />
      <div className="bg-gray-200 h-4 rounded w-1/4" />
      <div className="bg-gray-200 h-8 rounded w-full mt-3" />
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="bg-gray-200 h-4 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);
