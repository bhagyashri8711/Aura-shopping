import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aura_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [toast, setToast] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} items in stock!`, 'error');
          return prev;
        }
        showToast(`Updated "${product.title}" in cart`, 'success');
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} items in stock!`, 'error');
          return prev;
        }
        showToast(`Added "${product.title}" to cart`, 'success');
        return [
          ...prev,
          {
            _id: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item._id === productId) {
          if (newQuantity > item.stock) {
            showToast(`Max available stock is ${item.stock}`, 'error');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE20') {
      setCouponCode('SAVE20');
      setCouponDiscount(0.20);
      showToast('20% discount coupon applied! 🎉', 'success');
      return true;
    } else if (clean === 'WELCOME10') {
      setCouponCode('WELCOME10');
      setCouponDiscount(0.10);
      showToast('10% welcome coupon applied! 🎉', 'success');
      return true;
    } else {
      showToast('Invalid coupon code. Try SAVE20 or WELCOME10', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Calculations in Indian Rupee (INR)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const discountAmount = Math.round(subtotal * couponDiscount);
  const total = Math.max(0, Math.round(subtotal + shipping + tax - discountAmount));

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        shipping,
        tax,
        discountAmount,
        total,
        couponCode,
        couponDiscount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
