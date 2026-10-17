import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    cartCount,
    subtotal,
    shipping,
    tax,
    discountAmount,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  return (
    <div className="cart-drawer-backdrop" onClick={closeCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="#818CF8" />
            <h3 style={{ fontSize: '1.15rem' }}>Your Bag</h3>
            <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>({cartCount} items)</span>
          </div>
          <button className="modal-close-btn" onClick={closeCart}>
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#6B7280' }}>
              <ShoppingBag size={30} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your shopping bag is empty</h4>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '1.5rem', maxWidth: '240px' }}>
              Explore our modern collection of curated electronics and lifestyle gear.
            </p>
            <button className="btn btn-primary btn-sm" onClick={closeCart}>
              Browse Catalog
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div className="cart-item-title">{item.title}</div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '2px' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span className="cart-item-price">{formatINR(item.price * item.quantity)}</span>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <input
                  type="text"
                  placeholder="Promo Code (SAVE20)"
                  className="coupon-input"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </form>

              {couponCode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '6px 10px', marginBottom: '1rem', fontSize: '0.8rem', color: '#34D399' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={13} /> Code <strong>{couponCode}</strong> applied
                  </span>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="summary-row">
                <span>Subtotal</span>
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
                  <span>Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row total-row">
                <span>Total</span>
                <span style={{ color: '#818CF8' }}>{formatINR(total)}</span>
              </div>

              {shipping > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.5rem 0 1rem', textAlign: 'center' }}>
                  Add {formatINR(999 - subtotal)} more for <strong>FREE Delivery</strong>!
                </div>
              )}

              <button
                id="checkout-now-btn"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: '0.85rem',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
              >
                <span>Proceed to Checkout</span>
                <span style={{ opacity: 0.85 }}>•</span>
                <span>{formatINR(total)}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
