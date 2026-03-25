import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { formatPrice, formatDate } from '../utils/formatters';
import StarRating from '../components/common/StarRating';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { reviewService } from '../services/reviewService';
import { Review, PageResponse } from '../types';
import Pagination from '../components/common/Pagination';
import toast from 'react-hot-toast';
import { generatePlaceholder, handleImageError } from '../utils/imageUtils';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct: product, isLoading } = useAppSelector(state => state.products);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState<PageResponse<Review> | null>(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', body: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
    return () => { dispatch(clearCurrentProduct()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      reviewService.getProductReviews(Number(id), reviewPage, 5)
        .then(setReviews).catch(() => {});
    }
  }, [id, reviewPage]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
    if (!product) return;
    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      dispatch(openCart());
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !product) return;
    setIsSubmittingReview(true);
    try {
      await reviewService.createReview(product.id, newReview);
      toast.success('Review submitted!');
      setNewReview({ rating: 5, title: '', body: '' });
      const updated = await reviewService.getProductReviews(product.id, 0, 5);
      setReviews(updated);
      setReviewPage(0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 h-96 rounded-lg" />
          <div className="space-y-4">
            <div className="bg-gray-200 h-8 rounded w-3/4" />
            <div className="bg-gray-200 h-4 rounded w-1/2" />
            <div className="bg-gray-200 h-10 rounded w-1/3" />
            <div className="bg-gray-200 h-32 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Products', path: '/products' },
          { label: product.category?.name || '', path: `/products?category=${product.category?.id}` },
          { label: product.name },
        ]} />

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                <img
                  src={product.imageUrls?.[selectedImage] || generatePlaceholder(product.name)}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                  onError={handleImageError}
                />
              </div>
              {product.imageUrls?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 flex-shrink-0 border-2 rounded overflow-hidden ${selectedImage === idx ? 'border-amazon-yellow' : 'border-gray-200'}`}
                    >
                      <img src={url} alt=""
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.brand && (
                <Link to={`/products?brand=${product.brand}`} className="text-amazon-blue text-sm hover:underline">
                  Brand: {product.brand}
                </Link>
              )}

              <div className="flex items-center gap-2 my-3">
                <StarRating rating={product.rating} size="md" />
                <span className="text-amazon-blue text-sm hover:underline cursor-pointer">
                  {product.reviewCount} ratings
                </span>
              </div>

              <hr className="my-3" />

              <div className="mb-4">
                <span className="text-3xl font-bold text-amazon-dark">{formatPrice(product.discountedPrice)}</span>
                {product.discountPercent > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
                    <span className="text-green-600 font-medium">Save {product.discountPercent}%</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stockQuantity > 0
                    ? product.stockQuantity < 10 ? `Only ${product.stockQuantity} left in stock!` : 'In Stock'
                    : 'Out of Stock'}
                </span>
              </div>

              {product.stockQuantity > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm font-medium text-gray-700">Qty:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-lg">-</button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-lg">+</button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stockQuantity === 0}
                className="w-full flex items-center justify-center gap-2 bg-amazon-yellow hover:bg-amazon-light text-amazon-dark font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>

              {product.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-2">About this product</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

          {/* Review Stats */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800">{product.rating?.toFixed(1)}</div>
              <StarRating rating={product.rating} size="md" />
              <div className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</div>
            </div>
          </div>

          {/* Add Review */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Write a Review</h3>
              <div className="mb-3">
                <label className="text-sm text-gray-700 mb-1 block">Rating</label>
                <StarRating rating={newReview.rating} size="lg" interactive
                  onRatingChange={r => setNewReview(prev => ({ ...prev, rating: r }))} />
              </div>
              <input
                type="text" placeholder="Title" value={newReview.title}
                onChange={e => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-amazon-yellow"
              />
              <textarea
                placeholder="Share your experience..." value={newReview.body}
                onChange={e => setNewReview(prev => ({ ...prev, body: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amazon-yellow resize-none"
              />
              <button
                type="submit" disabled={isSubmittingReview}
                className="bg-amazon-yellow text-amazon-dark font-medium px-4 py-2 rounded hover:bg-amazon-light disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews?.content.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews?.content.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-amazon-yellow rounded-full flex items-center justify-center text-amazon-dark font-bold text-sm">
                      {review.userName[0]}
                    </div>
                    <span className="font-medium text-sm text-gray-800">{review.userName}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Verified</span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  {review.title && <p className="font-semibold text-sm mt-1">{review.title}</p>}
                  <p className="text-sm text-gray-600 mt-1">{review.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
                </div>
              ))}
              {reviews && (
                <Pagination
                  currentPage={reviewPage}
                  totalPages={reviews.totalPages}
                  onPageChange={setReviewPage}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
