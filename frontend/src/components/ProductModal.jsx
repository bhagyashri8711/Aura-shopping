import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const ProductModal = ({ product, onClose, onCheckoutInstant }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    if (onCheckoutInstant) {
      onCheckoutInstant();
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span style={{ fontSize: '0.82rem', color: '#818CF8', fontWeight: 700, textTransform: 'uppercase' }}>
            {product.category}
          </span>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="product-modal-grid">
            <div className="product-modal-image-col">
              <img
                src={product.image}
                alt={product.title}
                className="product-modal-image"
              />
              {product.badge && (
                <span className="badge-tag" style={{ top: 16, left: 16 }}>
                  {product.badge}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '0.6rem' }}>{product.title}</h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Star size={16} fill="#FBBF24" color="#FBBF24" />
                <span style={{ fontWeight: 700 }}>{product.rating}</span>
                <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>({product.numReviews} verified reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#F9FAFB' }}>
                  {formatINR(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span style={{ fontSize: '1.05rem', color: '#6B7280', textDecoration: 'line-through' }}>
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div style={{ marginBottom: '1.25rem' }}>
                {product.stock > 5 ? (
                  <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
                    ● In Stock ({product.stock} units ready to ship)
                  </span>
                ) : isLowStock ? (
                  <span style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: 600 }}>
                    ⚡ Only {product.stock} left in stock - order soon
                  </span>
                ) : (
                  <span style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✕ Out of Stock
                  </span>
                )}
              </div>

              <p style={{ color: '#9CA3AF', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                {product.description}
              </p>

              {/* Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="specs-list">
                  {product.specs.map((s, idx) => (
                    <div className="spec-item" key={idx}>
                      <span className="spec-label">{s.label}</span>
                      <span className="spec-val">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity and Actions */}
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9CA3AF' }}>Quantity:</span>
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="qty-val">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={handleAdd}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                  >
                    <Zap size={16} />
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontSize: '0.75rem', color: '#6B7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#10B981" /> 2-Yr Warranty
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={14} color="#6366F1" /> Fast Global Dispatch
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={14} color="#38BDF8" /> 30-Day Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
