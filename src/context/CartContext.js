// src/context/CartContext.js
// Cart Global State in pure JavaScript using React Context API & AsyncStorage

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '../utils/storage';

const CART_STORAGE_KEY = '@ecommerce_cart_v1';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. App open hone par Local Storage se pehle se saved cart load karo
  useEffect(() => {
    const loadStoredCart = async () => {
      const stored = await Storage.getItem(CART_STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        setCart(stored);
      }
      setIsLoaded(true);
    };

    loadStoredCart();
  }, []);

  // 2. Cart me koi bhi change aane par use local storage me save karo
  useEffect(() => {
    if (isLoaded) {
      Storage.setItem(CART_STORAGE_KEY, cart);
    }
  }, [cart, isLoaded]);

  // Add to cart: agar pehle se hai toh quantity + 1, warna naya item add karo
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Quantity change (+1 ya -1)
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item) => item !== null);
    });
  };

  // Cart se item delete karna
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Order place hone par cart clear karna
  const clearCart = () => {
    setCart([]);
  };

  // Check karna ki product cart me already hai ya nahi
  const isItemInCart = (productId) => {
    return cart.some((item) => item.product.id === productId);
  };

  // Total items count (Badge ke liye)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Total amount calculation
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook: useCart()
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
