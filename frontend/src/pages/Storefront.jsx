import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { api } from '../services/api';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';

export const Storefront = ({ onTrackClick, onCheckoutDirect }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.products.getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchCats();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (sortBy) params.sort = sortBy;

        const res = await api.products.getAll(params);
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchProducts, 250);
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Curated Online Store 2026</span>
          </div>

          <h1 className="hero-title">
            All Your Lifestyle & Tech Needs. <br />
            <span className="gradient-text">Delivered Fast Across India.</span>
          </h1>

          <div className="hero-actions">
            <a href="#catalog" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              <span>Explore Products</span>
              <ArrowRight size={17} />
            </a>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.8rem 1.8rem' }}
              onClick={onTrackClick}
            >
              <Truck size={17} />
              <span>Track An Order</span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Truck size={22} />
              </div>
              <div className="feature-text">
                <h4>Free Express Delivery</h4>
                <p>On all orders above ₹999</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <div className="feature-text">
                <h4>100% Genuine Products</h4>
                <p>Manufacturer warranty guaranteed</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <RotateCcw size={22} />
              </div>
              <div className="feature-text">
                <h4>7-Day Easy Returns</h4>
                <p>Hassle-free reverse pickup</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={22} />
              </div>
              <div className="feature-text">
                <h4>Instant UPI & Card</h4>
                <p>GPay, PhonePe, Paytm, COD</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="container" style={{ paddingBottom: '3rem' }}>
        <div className="catalog-header">
          <div className="catalog-top-row">
            <div className="search-box-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search across all products (e.g. iPad, shoes, honey, keyboard)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <SlidersHorizontal size={15} /> Sort:
              </span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High (₹)</option>
                <option value="price-desc">Price: High to Low (₹)</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Filter Indicator */}
        {selectedCategory !== 'All' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', color: '#818CF8', fontSize: '0.9rem' }}>
            <span>
              Showing products in <strong>{selectedCategory}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366F1', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p>Loading catalog items...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onCheckoutInstant={onCheckoutDirect}
        />
      )}
    </div>
  );
};
