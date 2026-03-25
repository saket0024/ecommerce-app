import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { toggleCart, fetchCart } from '../../store/slices/cartSlice';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { cart } = useAppSelector(state => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    setShowUserMenu(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartItemCount = cart?.totalItems || 0;

  return (
    <header className="bg-amazon-dark text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-2xl font-bold text-amazon-yellow hover:text-white transition-colors">
            ShopNow
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
            <div className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, and categories..."
                className="flex-1 px-4 py-2 text-gray-900 text-sm rounded-l-md focus:outline-none"
                data-testid="search-input"
              />
              <button
                type="submit"
                className="bg-amazon-yellow hover:bg-amazon-light text-amazon-dark px-4 rounded-r-md transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex flex-col items-start hover:text-amazon-yellow transition-colors"
                data-testid="user-menu-btn"
              >
                <span className="text-xs text-gray-300">
                  {isAuthenticated ? `Hello, ${user?.firstName}` : 'Hello, Sign in'}
                </span>
                <span className="text-sm font-semibold flex items-center gap-1">
                  <UserIcon className="w-4 h-4" /> Account
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Dashboard</Link>
                      )}
                      <hr className="my-1" />
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign In</Link>
                      <Link to="/register" onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative flex items-center gap-1 hover:text-amazon-yellow transition-colors"
              data-testid="cart-btn"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <div className="relative">
                <ShoppingCartIcon className="w-7 h-7" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-amazon-yellow text-amazon-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    data-testid="cart-count"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-sm font-semibold">Cart</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="hidden md:flex items-center gap-6 h-10 text-sm border-t border-gray-600">
          <Link to="/products" className="hover:text-amazon-yellow transition-colors">All Products</Link>
          <Link to="/products?category=1" className="hover:text-amazon-yellow transition-colors">Electronics</Link>
          <Link to="/products?category=2" className="hover:text-amazon-yellow transition-colors">Books</Link>
          <Link to="/products?category=3" className="hover:text-amazon-yellow transition-colors">Clothing</Link>
          <Link to="/products?category=4" className="hover:text-amazon-yellow transition-colors">Home & Kitchen</Link>
          <Link to="/products?category=5" className="hover:text-amazon-yellow transition-colors">Sports</Link>
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-3 py-2 text-gray-900 text-sm rounded-l-md focus:outline-none"
          />
          <button type="submit" className="bg-amazon-yellow text-amazon-dark px-3 rounded-r-md">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
