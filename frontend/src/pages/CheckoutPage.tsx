import React, { useEffect, useState } from 'react';
import { generatePlaceholder, handleImageError } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { placeOrder } from '../store/slices/orderSlice';
import { clearCartState } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatters';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';
import { Address } from '../types';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
  { value: 'PAYPAL', label: 'PayPal', icon: '🅿️' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦' },
];

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart } = useAppSelector(state => state.cart);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.orders);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!cart || cart.items.length === 0) { navigate('/cart'); return; }
    api.get('/users/me/addresses').then(r => {
      setAddresses(r.data);
      const def = r.data.find((a: Address) => a.isDefault);
      if (def) setSelectedAddress(def.id);
    }).catch(() => {});
  }, [isAuthenticated, cart, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a shipping address'); return; }
    try {
      const order = await dispatch(placeOrder({
        shippingAddressId: selectedAddress,
        paymentMethod,
      })).unwrap();
      dispatch(clearCartState());
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}/confirm`);
    } catch (err: any) {
      toast.error(err || 'Failed to place order');
    }
  };

  if (!cart) return null;

  const tax = cart.totalAmount * 0.08;
  const total = cart.totalAmount + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {(['address', 'payment', 'review'] as const).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-amazon-blue' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === s ? 'border-amazon-blue bg-amazon-blue text-white' : 'border-gray-300'}`}>
                  {i + 1}
                </div>
                <span className="hidden sm:block capitalize font-medium text-sm">{s}</span>
              </div>
              {i < 2 && <div className="flex-1 h-0.5 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1: Address */}
            {step === 'address' && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No saved addresses</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="text-amazon-blue hover:underline"
                    >Add address in profile</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <label key={addr.id} className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer ${selectedAddress === addr.id ? 'border-amazon-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio" name="address" value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-sm">{addr.street}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                          <p className="text-sm text-gray-600">{addr.country}</p>
                          {addr.isDefault && <span className="text-xs text-green-600 font-medium">Default</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { if (selectedAddress) setStep('payment'); else toast.error('Select an address'); }}
                  disabled={!selectedAddress}
                  className="mt-4 w-full bg-amazon-yellow text-amazon-dark font-bold py-2 rounded-lg hover:bg-amazon-light disabled:opacity-50"
                >Continue to Payment</button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="font-bold text-lg mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.value}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer ${paymentMethod === method.value ? 'border-amazon-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio" name="payment" value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                      />
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep('address')} className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50">Back</button>
                  <button onClick={() => setStep('review')} className="flex-1 bg-amazon-yellow text-amazon-dark font-bold py-2 rounded-lg hover:bg-amazon-light">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 'review' && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="font-bold text-lg mb-4">Review Your Order</h2>
                <div className="space-y-3 mb-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.productImageUrl || generatePlaceholder(item.productName)} alt=""
                        className="w-14 h-14 object-contain" onError={handleImageError} />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                  <div className="flex justify-between font-bold text-base mt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep('payment')} className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50">Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 bg-amazon-yellow text-amazon-dark font-bold py-2 rounded-lg hover:bg-amazon-light disabled:opacity-50"
                  >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 h-fit sticky top-20">
            <h2 className="font-bold mb-3">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Items ({cart.totalItems})</span><span>{formatPrice(cart.totalAmount)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-base"><span>Order Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
