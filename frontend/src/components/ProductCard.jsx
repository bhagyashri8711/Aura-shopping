import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const isSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="product-card" onClick={() => onSelectProduct(product)}>
      <div className="product-card-image-box">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-image"
          loading="lazy"
        />
        {product.badge && (
          <span className={`badge-tag ${product.badge.toLowerCase().includes('sale') ? 'sale' : ''}`}>
            {product.badge}
          </span>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-card-meta">
          <Star size={15} fill="#FBBF24" color="#FBBF24" />
          <span style={{ fontWeight: 600 }}>{product.rating}</span>
          <span className="product-reviews-count">({product.numReviews} reviews)</span>
        </div>

        <div className="product-card-footer">
          <div className="price-box">
            <span className="product-price">{formatINR(product.price)}</span>
            {isSale && (
              <span className="product-compare-price">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            title={product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingBag size={15} />
            <span>{product.stock <= 0 ? 'Out of Stock' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
