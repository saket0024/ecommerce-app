import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';

const categories = [
  { id: 1, name: 'Electronics', emoji: '💻', slug: '1' },
  { id: 2, name: 'Books', emoji: '📚', slug: '2' },
  { id: 3, name: 'Clothing', emoji: '👗', slug: '3' },
  { id: 4, name: 'Home & Kitchen', emoji: '🏠', slug: '4' },
  { id: 5, name: 'Sports', emoji: '⚽', slug: '5' },
];

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 8, sortBy: 'createdAt', sortDir: 'desc' }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amazon-dark via-gray-800 to-amazon-dark text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-amazon-yellow">ShopNow</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Discover millions of products at unbeatable prices. Fast delivery, easy returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-amazon-yellow text-amazon-dark font-bold px-8 py-3 rounded-lg hover:bg-amazon-light transition-colors text-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/products?sortBy=rating&sortDir=desc"
              className="border-2 border-amazon-yellow text-amazon-yellow font-bold px-8 py-3 rounded-lg hover:bg-amazon-yellow hover:text-amazon-dark transition-colors text-lg"
            >
              Top Rated
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:shadow-md hover:border-amazon-yellow transition-all group"
              >
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-amazon-blue">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals Banner */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">🔥 Today's Deals</h2>
                <p className="text-orange-100 mt-1">Up to 30% off on selected items</p>
              </div>
              <Link
                to="/products?sortBy=discountPercent&sortDir=desc"
                className="bg-white text-orange-600 font-bold px-6 py-2 rounded-lg hover:bg-orange-50 whitespace-nowrap"
              >
                See All Deals
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products" className="text-amazon-blue hover:underline text-sm font-medium">
              See all products →
            </Link>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Features */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders over $35' },
            { icon: '🔄', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-lg p-5 border border-gray-200 flex items-center gap-4">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
