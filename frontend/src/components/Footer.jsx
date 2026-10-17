import React from 'react';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const Footer = ({ setCurrentView }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setCurrentView('store')}>
              <div className="brand-icon-box">
                <Sparkles size={18} />
              </div>
              <span>AURA</span>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '0.88rem', maxWidth: '320px', lineHeight: 1.6 }}>
              Curated precision electronics, ergonomic workspaces, and premium lifestyle accessories with real-time logistics tracking.
            </p>
          </div>

          <div className="footer-col">
            <h5>Explore Store</h5>
            <ul>
              <li><a href="#catalog" onClick={(e) => { e.preventDefault(); setCurrentView('store'); }}>All Products</a></li>
              <li><a href="#featured" onClick={(e) => { e.preventDefault(); setCurrentView('store'); }}>Featured Deals</a></li>
              <li><a href="#audio" onClick={(e) => { e.preventDefault(); setCurrentView('store'); }}>Hi-Fi Audio</a></li>
              <li><a href="#wearables" onClick={(e) => { e.preventDefault(); setCurrentView('store'); }}>Wearables</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Customer Care</h5>
            <ul>
              <li><a href="#track" onClick={(e) => { e.preventDefault(); setCurrentView('track'); }}>Track Your Package</a></li>
              <li><a href="#orders" onClick={(e) => { e.preventDefault(); setCurrentView('my-orders'); }}>Order History</a></li>
              <li><a href="#shipping">Shipping Policy</a></li>
              <li><a href="#warranty">Warranty & Returns</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Full-Stack Stack</h5>
            <ul>
              <li>● React 19 + Vite</li>
              <li>● Node.js + Express.js</li>
              <li>● MongoDB Database</li>
              <li>● JWT Role-Based Auth</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} AURA E-Commerce Platform. Built for real-world full-stack development.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>MongoDB Connected</span>
            <span>•</span>
            <span>RESTful APIs Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
