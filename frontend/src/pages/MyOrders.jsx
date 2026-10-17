import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Ban, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';

export const MyOrders = ({ onTrackOrder, openAuthModal }) => {
  const { user, isAuthenticated, quickDemoLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.orders.getMyOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    setCancelling(true);
    try {
      const res = await api.orders.cancel(cancelModalOrder._id, cancelReason);
      if (res.success) {
        setNotification('Order cancelled successfully. Stock has been restored.');
        setCancelModalOrder(null);
        setCancelReason('');
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return 'status-placed';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Out for Delivery': return 'status-out-for-delivery';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-placed';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <Package size={48} color="#818CF8" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sign In to View Orders</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Access your purchase history, invoices, and live delivery updates.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={openAuthModal}>
              Sign In to Your Account
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => quickDemoLogin('user')}
            >
              1-Click Demo Customer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>My Orders</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
      </div>

      {notification && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', color: '#34D399', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{notification}</span>
          <button onClick={() => setNotification('')} style={{ background: 'transparent', border: 'none', color: '#34D399', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: '#9CA3AF' }}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <Package size={42} color="#6B7280" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders placed yet</h3>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Check out our catalog and treat yourself to something extraordinary.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const canCancel = order.status === 'Placed' || order.status === 'Processing';
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={order._id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{order.orderNumber}</span>
                      <span className={`order-status-badge ${getStatusBadge(order.status)}`}>
                        ● {order.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                      Placed on {dateStr} • Tracking ID: <strong style={{ color: '#818CF8' }}>{order.trackingNumber}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Total Amount</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F9FAFB' }}>
                      {formatINR(order.totalPrice)}
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                          Qty: {item.quantity} • {formatINR(item.price)} each
                        </div>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                    Carrier: <strong>{order.carrier}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    {canCancel && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setCancelModalOrder(order)}
                      >
                        <Ban size={14} />
                        <span>Cancel Order</span>
                      </button>
                    )}
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onTrackOrder(order.trackingNumber)}
                    >
                      <Truck size={14} />
                      <span>Live Tracker</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="modal-overlay" onClick={() => setCancelModalOrder(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Cancel Order {cancelModalOrder.orderNumber}</h3>
              <button className="modal-close-btn" onClick={() => setCancelModalOrder(null)}>✕</button>
            </div>
            <form onSubmit={handleCancelSubmit} className="modal-body">
              <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Are you sure you want to cancel this order? Stock will be immediately restored to the inventory catalog.
              </p>

              <div className="form-group">
                <label className="form-label">Reason for Cancellation (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Changed my mind, found alternative"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCancelModalOrder(null)}>
                  Keep Order
                </button>
                <button type="submit" className="btn btn-danger" disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
