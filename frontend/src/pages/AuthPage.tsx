import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { login, register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(login(form)).unwrap();
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      // error handled by slice
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email" value={form.email}
          onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow`}
          placeholder="you@example.com" data-testid="email-input"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1" data-testid="email-error">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password" value={form.password}
          onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
          className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow`}
          placeholder="••••••••" data-testid="password-input"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1" data-testid="password-error">{errors.password}</p>}
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded" data-testid="auth-error">{error}</p>}

      <button
        type="submit" disabled={isLoading}
        className="w-full bg-amazon-yellow text-amazon-dark font-semibold py-2 rounded-md hover:bg-amazon-light transition-colors disabled:opacity-50"
        data-testid="submit-btn"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-amazon-blue hover:underline font-medium">
          Create account
        </button>
      </p>
    </form>
  );
};

const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...data } = form;
    try {
      await dispatch(register(data)).unwrap();
      toast.success('Account created successfully!');
      navigate('/');
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-testid="register-form">
      <div className="grid grid-cols-2 gap-3">
        {(['firstName', 'lastName'] as const).map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field === 'firstName' ? 'First Name' : 'Last Name'}
            </label>
            <input
              type="text" value={form[field]}
              onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
              className={`w-full border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow`}
            />
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}
      </div>

      {[
        { field: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
        { field: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
        { field: 'confirmPassword', type: 'password', label: 'Confirm Password', placeholder: '••••••••' },
      ].map(({ field, type, label, placeholder }) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type} value={(form as any)[field]}
            onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
            className={`w-full border ${(errors as any)[field] ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow`}
            placeholder={placeholder}
          />
          {(errors as any)[field] && (
            <p className="text-red-500 text-xs mt-1">{(errors as any)[field]}</p>
          )}
        </div>
      ))}

      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

      <button
        type="submit" disabled={isLoading}
        className="w-full bg-amazon-yellow text-amazon-dark font-semibold py-2 rounded-md hover:bg-amazon-light transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-amazon-blue hover:underline font-medium">
          Sign in
        </button>
      </p>
    </form>
  );
};

const AuthPage: React.FC<{ mode?: 'login' | 'register' }> = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-3xl font-bold text-amazon-dark mb-6">
          ShopNow
        </Link>
        <div className="bg-white rounded-lg border border-gray-300 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          {isLogin
            ? <LoginForm onSwitch={() => setIsLogin(false)} />
            : <RegisterForm onSwitch={() => setIsLogin(true)} />
          }
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
