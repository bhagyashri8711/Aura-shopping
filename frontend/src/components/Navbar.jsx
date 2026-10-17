import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Sparkles,
  Truck,
  Package,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, openAuthModal }) => {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const { cartCount, openCart } = useCart();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleQuickLogin = async (type) => {
    try {
      await quickDemoLogin(type);
      setShowDemoMenu(false);
      if (type === 'admin') {
        setCurrentView('admin');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => setCurrentView('store')}>
            <div className="brand-icon-box">
              <Sparkles size={20} />
            </div>
            <span>AURA</span>
          </div>

          {/* Navigation Links */}
          <nav className="nav-links">
            <span
              className={`nav-link ${currentView === 'store' ? 'active' : ''}`}
              onClick={() => setCurrentView('store')}
            >
              Shop
            </span>
            <span
              className={`nav-link ${currentView === 'track' ? 'active' : ''}`}
              onClick={() => setCurrentView('track')}
            >
              <Truck size={16} />
              Track Order
            </span>
            {isAuthenticated && (
              <span
                className={`nav-link ${currentView === 'my-orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('my-orders')}
              >
                <Package size={16} />
                My Orders
              </span>
            )}
            {isAdmin && (
              <span
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                <LayoutDashboard size={16} />
                Admin Panel
                <span className="admin-badge">Admin</span>
              </span>
            )}
          </nav>

          {/* Action Tools */}
          <div className="nav-actions">
            {/* Quick Demo Switcher Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="demo-badge-trigger"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                title="Switch test accounts quickly"
              >
                <ShieldCheck size={14} />
                <span>Demo Accounts</span>
                <ChevronDown size={13} />
              </button>

              {showDemoMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    background: '#1F2937',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 50,
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', padding: '4px 8px', fontWeight: 600 }}>
                    1-CLICK DEMO LOGIN
                  </div>
                  <button
                    onClick={() => handleQuickLogin('admin')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#C084FC',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Admin Mode (Full Access)</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('user')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#60A5FA',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <UserCheck size={16} />
                    <span>Customer (Alex Morgan)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button className="btn-icon" onClick={openCart} title="Open Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Auth Button or User Menu */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <User size={15} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '180px',
                      background: '#1F2937',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '6px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: '#F9FAFB' }}>{user.name}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentView('my-orders');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#F9FAFB',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentView('admin');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          color: '#C084FC',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <LayoutDashboard size={15} />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        marginTop: '4px'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={openAuthModal}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
