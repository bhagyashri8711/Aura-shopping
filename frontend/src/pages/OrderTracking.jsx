import React, { useState, useEffect } from 'react';
import { Search, Truck, Package, Clock, MapPin, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { OrderTimeline } from '../components/OrderTimeline';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';

export const OrderTracking = ({ initialTrackingCode }) => {
  const [query, setQuery] = useState(initialTrackingCode || 'TRK-9021-4819');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (trackingIdentifier) => {
    const term = (trackingIdentifier || query).trim();
    if (!term) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.orders.track(term);
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setOrder(null);
        setError(`No active order found with identifier: "${term}". Please check the number.`);
      }
    } catch (err) {
      setOrder(null);
      setError(err.message || 'Order could not be located. Verify your tracking code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingCode) {
      setQuery(initialTrackingCode);
      fetchTracking(initialTrackingCode);
    } else {
      // Auto-load sample tracking so page looks gorgeous immediately!
      fetchTracking('TRK-9021-4819');
    }
  }, [initialTrackingCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const handleDemoClick = (code) => {
    setQuery(code);
    fetchTracking(code);
  };

  const getStatusClass = (status) => {
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

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="tracking-hero">
        <div className="hero-pill" style={{ marginBottom: '1rem' }}>
          <Truck size={15} />
          <span>Real-Time Logistics Engine</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>Package & Order Tracker</h1>
        <p style={{ color: '#9CA3AF', maxWidth: '520px', margin: '0 auto' }}>
          Monitor your shipment from warehouse departure to your doorstep in real-time.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="tracking-search-bar">
          <input
            type="text"
            className="form-input"
            placeholder="Enter Tracking ID (e.g. TRK-9021-4819) or Order # (e.g. ORD-72941)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            <span>Track</span>
          </button>
        </form>

        {/* Demo Fast Click Chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Try sample tracking:</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
            onClick={() => handleDemoClick('TRK-9021-4819')}
          >
            🚚 In Transit (TRK-9021-4819)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
            onClick={() => handleDemoClick('TRK-3819-2041')}
          >
            ✅ Delivered (TRK-3819-2041)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
            onClick={() => handleDemoClick('ORD-72941')}
          >
            📦 Order ORD-72941
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '1rem 1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Order Tracking Card */}
      {order && (
        <div className="tracking-card" style={{ maxWidth: '880px', margin: '2rem auto' }}>
          <div className="tracking-header-status">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{order.orderNumber}</span>
                <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                  ● {order.status}
                </span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#9CA3AF' }}>
                Tracking ID: <strong style={{ color: '#818CF8' }}>{order.trackingNumber}</strong>
                <span style={{ margin: '0 8px', color: '#4B5563' }}>•</span>
                Carrier: <strong>{order.carrier}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Estimated Delivery
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F9FAFB' }}>
                {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending Confirmation'}
              </div>
            </div>
          </div>

          {/* Interactive Stepper */}
          <OrderTimeline order={order} />

          {/* Shipment Breakdown & Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem' }}>
            {/* Delivery Destination */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#818CF8', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} /> Delivery Address
              </h4>
              <div style={{ fontSize: '0.88rem', color: '#F9FAFB', lineHeight: 1.6 }}>
                <strong>{order.shippingAddress.fullName}</strong><br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}<br />
                <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Phone: {order.shippingAddress.phone}</span>
              </div>
            </div>

            {/* Payment & Total */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#818CF8', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={16} /> Payment & Billing
              </h4>
              <div style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF' }}>
                  <span>Method:</span>
                  <span style={{ color: '#F9FAFB' }}>{order.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF' }}>
                  <span>Status:</span>
                  <span style={{ color: order.paymentStatus === 'Paid' ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399' }}>
                    <span>Coupon:</span>
                    <span>{order.couponApplied}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', marginTop: '6px' }}>
                  <span>Total Paid:</span>
                  <strong style={{ color: '#818CF8', fontSize: '1.05rem' }}>{formatINR(order.totalPrice)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items List */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#818CF8', marginBottom: '1rem' }}>
              Package Contents ({order.items.length} items)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                      Qty: {item.quantity} × {formatINR(item.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F9FAFB' }}>
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
