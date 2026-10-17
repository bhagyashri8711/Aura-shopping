import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  'Mobiles & Tablets',
  'Electronics & Gadgets',
  'Audio & Sound',
  'Wearables & Watches',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Home & Kitchen',
  'Sports & Fitness',
  'Books & Stationery',
  'Groceries & Essentials'
];

export const AdminProductModal = ({ isOpen, onClose, product, onProductSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Mobiles & Tablets',
    price: '',
    compareAtPrice: '',
    stock: 10,
    image: '',
    badge: '',
    description: '',
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        category: product.category || 'Mobiles & Tablets',
        price: product.price || '',
        compareAtPrice: product.compareAtPrice || '',
        stock: product.stock !== undefined ? product.stock : 10,
        image: product.image || '',
        badge: product.badge || '',
        description: product.description || '',
        featured: !!product.featured,
      });
    } else {
      setFormData({
        title: '',
        category: 'Mobiles & Tablets',
        price: '',
        compareAtPrice: '',
        stock: 10,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
        badge: 'New',
        description: '',
        featured: false,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : 0,
        stock: parseInt(formData.stock, 10),
      };

      let res;
      if (product && product._id) {
        res = await api.products.update(product._id, payload);
      } else {
        res = await api.products.create(payload);
      }

      if (res.success) {
        onProductSaved(res.product);
        onClose();
      } else {
        setError(res.message || 'Failed to save product');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem' }}>
            {product ? 'Edit Product' : 'Add New Product to Catalog'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Ultra HD Wireless Soundbar"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ background: '#1F2937' }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Badge Label (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Best Seller, Sale"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  min="0"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2499"
                />
              </div>

              <div>
                <label className="form-label">Compare Price (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="form-input"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  placeholder="2999"
                />
              </div>

              <div>
                <label className="form-label">Inventory Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Image URL *</label>
              <input
                type="url"
                required
                className="form-input"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              {formData.image && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Image preview</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                required
                rows={4}
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed specifications, features, and materials..."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: '#6366F1' }}
              />
              <label htmlFor="featured" style={{ fontSize: '0.88rem', color: '#F9FAFB', cursor: 'pointer' }}>
                Feature on home catalog hero banner
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={16} />
                <span>{loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
