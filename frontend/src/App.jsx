import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Storefront } from './pages/Storefront';
import { OrderTracking } from './pages/OrderTracking';
import { MyOrders } from './pages/MyOrders';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('store'); // 'store' | 'track' | 'my-orders' | 'admin'
  const [activeTrackingCode, setActiveTrackingCode] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const { toast } = useCart();

  const handleTrackOrder = (code) => {
    setActiveTrackingCode(code);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (code) => {
    setIsCheckoutModalOpen(false);
    handleTrackOrder(code);
  };

  return (
    <>
      {/* Toast Notification Banner */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="#10B981" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
            {toast.type === 'info' && <Info size={18} color="#3B82F6" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* View Routing */}
      <main style={{ flex: 1 }}>
        {currentView === 'store' && (
          <Storefront
            onTrackClick={() => setCurrentView('track')}
            onCheckoutDirect={() => setIsCheckoutModalOpen(true)}
          />
        )}

        {currentView === 'track' && (
          <OrderTracking
            initialTrackingCode={activeTrackingCode}
          />
        )}

        {currentView === 'my-orders' && (
          <MyOrders
            onTrackOrder={handleTrackOrder}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onTrackOrder={handleTrackOrder}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthPage
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {}}
      />

      {/* Footer */}
      <Footer
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
