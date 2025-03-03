import { useState } from 'react';

export interface CartItem {
  id: string;
  variant: {
    id: string;
    product: { name: string };
    type: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (variant: CartItem['variant'], quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.variant.id === variant.id);
    if (existingItem) {
      // Nếu đã có, tăng số lượng
      setCartItems(
        cartItems.map(item =>
          item.variant.id === variant.id ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      );
    } else {
      // Nếu chưa có, thêm mới
      const newItem: CartItem = {
        id: Math.random().toString(36).substr(2, 9), // Tạo ID tạm thời
        variant,
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.variant.price || 0) * item.quantity,
    0,
  );

  const checkout = () => {
    console.log('Processing checkout...', cartItems);
    setCartItems([]);
  };

  return { cartItems, addToCart, removeFromCart, totalPrice, checkout };
};
