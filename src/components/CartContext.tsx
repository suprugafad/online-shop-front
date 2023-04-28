import React, { createContext, useState } from "react";
import {ProductCard} from "../types";
import axios from "axios";

interface CartItem {
  product: ProductCard;
  quantity: number;
}

export interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: ProductCard) => void;
  removeFromCart: (product: ProductCard) => void;
  clearCart: () => void;
  total: number;
  checkoutHandler: () => void; // добавляем checkoutHandler в интерфейс
}

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: (product: ProductCard) => {},
  removeFromCart: (product: ProductCard) => {},
  clearCart: () => {},
  total: 0,
  checkoutHandler: () => {},
});

interface Props {
  children: React.ReactNode;
}

const CartProvider = ({ children }: Props) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const addToCart = (product: ProductCard) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (product: ProductCard) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem?.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.product.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkoutHandler = async () => {
    try {
      await axios.post("/api/checkout", { cartItems, total });
      alert("Заказ успешно оформлен.");
      clearCart();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        checkoutHandler, // передаем функцию checkoutHandler в контекст
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;