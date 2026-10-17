import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminProductModal } from '../components/AdminProductModal';
import { formatINR } from '../utils/formatters';

export const AdminDashboard = ({ onTrackOrder }) => {
  const { isAdmin, quickDemoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Modals & alerts
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Fetch Dashboard Summary Stats
  const loadStats = async () => {
    try {
      const res = await api.stats.getDashboard();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
    }
  };

  // Fetch Orders
  const loadOrders = async () => {
    try {
      const params = {};
      if (orderStatusFilter !== 'All') params.status = orderStatusFilter;
      if (orderSearch) params.search = orderSearch;
      const res = await api.orders.getAll(params);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (e) {
      console.error('Error fetching admin orders:', e);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    try {
      const params = {};
      if (productSearch) params.search = productSearch;
      const res = await api.products.getAll(params);
      if (res.success) {
        setProducts(res.products);
      }
    } catch (e) {
      console.error('Error fetching products for inventory:', e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      Promise.all([loadStats(), loadOrders(), loadProducts()]).finally(() => {
        setLoading(false);
      });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [orderStatusFilter, orderSearch]);

  useEffect(() => {
    if (isAdmin) {
      const timer = setTimeout(loadProducts, 200);
      return () => clearTimeout(timer);
    }
  }, [productSearch]);

  const showNotice = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.orders.updateStatus(orderId, {
        status: newStatus,
        note: `Status updated to ${newStatus} by Admin`,
      });
      if (res.success) {
        showNotice(`Order status updated to ${newStatus}! Live tracker synced.`);
        loadOrders();
        loadStats();
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      return;
    }

    try {
      const res = await api.products.delete(productId);
      if (res.success) {
        showNotice(`Product "${title}" removed from catalog.`);
        loadProducts();
        loadStats();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <ShieldCheck size={50} color="#F59E0B" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.65rem' }}>Admin Access Required</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            This panel allows managing inventory, editing stock, and pushing live delivery updates to customer tracking pages.
          </p>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => quickDemoLogin('admin')}
          >
            Switch to Demo Admin Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Admin Control Center</h1>
            <span className="admin-badge">Store Operator</span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Manage catalog inventory, fulfill customer orders, and update real-time shipping timelines.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            loadStats();
            loadOrders();
            loadProducts();
            showNotice('Dashboard metrics refreshed!');
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {feedbackMsg && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', color: '#A5B4FC', marginBottom: '1.5rem' }}>
          {feedbackMsg}
        </div>
      )}

      {/* Metric Cards */}
      <div className="admin-metric-grid">
        <div className="metric-card">
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value" style={{ color: '#10B981' }}>
            {formatINR(stats ? stats.totalRevenue : 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.4rem' }}>
            From verified fulfilled orders
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Orders</div>
          <div className="metric-value" style={{ color: '#818CF8' }}>
            {stats ? stats.totalOrders : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.4rem' }}>
            Lifetime customer checkouts
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Catalog Products</div>
          <div className="metric-value" style={{ color: '#38BDF8' }}>
            {stats ? stats.totalProducts : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.4rem' }}>
            Active SKUs available
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Low Stock Items</div>
          <div className="metric-value" style={{ color: stats && stats.lowStockCount > 0 ? '#F59E0B' : '#10B981' }}>
            {stats ? stats.lowStockCount : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.4rem' }}>
            Items with 5 or fewer units left
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'orders' ? '#6366F1' : 'transparent'}`,
            color: activeTab === 'orders' ? '#F9FAFB' : '#9CA3AF',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Truck size={17} />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'inventory' ? '#6366F1' : 'transparent'}`,
            color: activeTab === 'inventory' ? '#F9FAFB' : '#9CA3AF',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Package size={17} />
          <span>Product Inventory ({products.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div>
          {/* Order Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div className="search-box-wrapper" style={{ minWidth: '240px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by Order #, Tracking code, or name..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Filter Status:</span>
              <select
                className="sort-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                {['All', 'Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th>Update Status Action</th>
                  <th>Tracking</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                      No orders match the filter.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <strong>{ord.orderNumber}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#818CF8' }}>{ord.trackingNumber}</div>
                      </td>
                      <td>
                        <div>{ord.shippingAddress.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {ord.shippingAddress.city}, {ord.shippingAddress.country}
                        </div>
                      </td>
                      <td>
                        {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <strong>{formatINR(ord.totalPrice)}</strong>
                      </td>
                      <td>
                        <span className={`order-status-badge status-${ord.status.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="sort-select"
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem' }}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => onTrackOrder(ord.trackingNumber)}
                          title="View customer tracking page"
                        >
                          <ExternalLink size={13} />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Catalog Management */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div className="search-box-wrapper" style={{ minWidth: '240px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search catalog products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Inventory Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={prod.image}
                            alt={prod.title}
                            style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{prod.title}</strong>
                            {prod.badge && (
                              <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC', padding: '1px 6px', borderRadius: '4px' }}>
                                {prod.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{prod.category}</td>
                      <td>
                        <strong>{formatINR(prod.price)}</strong>
                        {prod.compareAtPrice > prod.price && (
                          <span style={{ fontSize: '0.78rem', color: '#6B7280', textDecoration: 'line-through', marginLeft: '4px' }}>
                            {formatINR(prod.compareAtPrice)}
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: prod.stock <= 5 ? '#F59E0B' : '#F9FAFB' }}>
                          {prod.stock} units
                        </strong>
                      </td>
                      <td>
                        {prod.stock > 5 ? (
                          <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>● In Stock</span>
                        ) : prod.stock > 0 ? (
                          <span style={{ color: '#F59E0B', fontSize: '0.8rem', fontWeight: 600 }}>● Low Stock</span>
                        ) : (
                          <span style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>● Out of Stock</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.6rem' }}
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsProductModalOpen(true);
                            }}
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.3rem 0.6rem' }}
                            onClick={() => handleDeleteProduct(prod._id, prod.title)}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Product Modal */}
      {isProductModalOpen && (
        <AdminProductModal
          isOpen={isProductModalOpen}
          product={editingProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onProductSaved={(saved) => {
            showNotice(`Product "${saved.title}" saved successfully!`);
            loadProducts();
            loadStats();
          }}
        />
      )}
    </div>
  );
};
