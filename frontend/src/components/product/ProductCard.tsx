import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import StarRating from '../common/StarRating';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addToCart, openCart } from '../../store/slices/cartSlice';
import { generatePlaceholder, handleImageError } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      dispatch(openCart());
      toast.success(`${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const primaryImage = product.imageUrls?.[0] || generatePlaceholder(product.name);

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
        data-testid="product-card"
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-gray-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onError={handleImageError}
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discountPercent}%
            </span>
          )}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-amazon-blue">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          )}

          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-amazon-dark">
              {formatPrice(product.discountedPrice)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity === 0}
            className="w-full flex items-center justify-center gap-2 bg-amazon-yellow hover:bg-amazon-light text-amazon-dark text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="add-to-cart-btn"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            {isAdding ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
