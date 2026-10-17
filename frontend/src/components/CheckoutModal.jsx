import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowRight, DollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';

export const CheckoutModal = ({ isOpen, onClose, onOrderCompleted }) => {
  const { cart, total, subtotal, shipping, tax, discountAmount, couponCode, clearCart } = useCart();
  const { user, isAuthenticated, quickDemoLogin } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Aarav Sharma',
    street: user?.address?.street || 'Flat 402, Shanti Niketan, Indiranagar',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '560038',
    country: user?.address?.country || 'India',
    phone: user?.address?.phone || '+91 98450 67890',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Ensure user is authenticated before creating order
      if (!isAuthenticated) {
        // Auto sign in as demo customer if user didn't log in
        await quickDemoLogin('user');
      }

      const orderPayload = {
        items: cart.map((i) => ({
          productId: i._id,
          quantity: i.quantity,
        })),
        shippingAddress,
        paymentMethod,
        couponApplied: couponCode,
      };

      const res = await api.orders.create(orderPayload);
      if (res.success && res.order) {
        setPlacedOrder(res.order);
        clearCart();
      } else {
        setError(res.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#10B981" />
            <h3 style={{ fontSize: '1.2rem' }}>
              {placedOrder ? 'Order Confirmed!' : 'Secure Checkout'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {placedOrder ? (
            /* Order Success State */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CheckCircle2 size={40} />
              </div>

              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Thank You For Your Order!</h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Your order has been registered and is being prepared for fulfillment.
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  maxWidth: '480px',
                  margin: '0 auto 2rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Order Number:</span>
                  <strong style={{ color: '#F9FAFB' }}>{placedOrder.orderNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Tracking Code:</span>
                  <strong style={{ color: '#818CF8' }}>{placedOrder.trackingNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Carrier:</span>
                  <span>{placedOrder.carrier}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.65rem' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Total Amount Paid:</span>
                  <strong style={{ color: '#10B981' }}>{formatINR(placedOrder.totalPrice)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    if (onOrderCompleted) {
                      onOrderCompleted(placedOrder.trackingNumber);
                    }
                  }}
                >
                  <Truck size={16} />
                  <span>Track Package Live</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder}>
              {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {error}
                </div>
              )}

              {/* Shipping Address */}
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#818CF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={17} /> 1. Shipping Address
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#818CF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={17} /> 2. Payment Method
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {['UPI / GPay / PhonePe', 'Credit/Debit Card', 'Cash on Delivery'].map((method) => (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '12px',
                      background: paymentMethod === method ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${paymentMethod === method ? '#6366F1' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: paymentMethod === method ? '#A5B4FC' : '#9CA3AF',
                      transition: 'all 0.2s',
                    }}
                  >
                    {method}
                  </div>
                ))}
              </div>

              {/* Order Final Summary */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div className="summary-row">
                  <span>Items ({cart.length})</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? <strong style={{ color: '#10B981' }}>FREE</strong> : formatINR(shipping)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated GST (5%)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-row" style={{ color: '#34D399' }}>
                    <span>Promo Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span style={{ color: '#818CF8' }}>{formatINR(total)}</span>
                </div>
              </div>

              <button
                id="place-order-submit-btn"
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={submitting}
              >
                {submitting ? 'Processing Order...' : `Pay & Place Order (${formatINR(total)})`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
