// src/screens/RoomService/hooks/useCart.ts
import { useCallback, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MenuItem as ApiItem } from "../../types/MenuItem";
import React from "react";

type SelectedToppings = Record<string, Record<string, number>>;

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedToppings: SelectedToppings;
  selectedText?: string;
  notes?: string;
}

const CART_STORAGE_KEY = 'room_service_cart';

const calcPriceWithToppings = (
  basePrice: number, 
  selectedToppings: SelectedToppings, 
  product?: ApiItem
): number => {
  let total = basePrice;
  
  if (!product || !(product as any).toppings) {
    return total;
  }
  
  const productToppings = (product as any).toppings;
  
  Object.entries(selectedToppings).forEach(([type, toppings]) => {
    const toppingsOfType = productToppings[type];
    if (!toppingsOfType || !Array.isArray(toppingsOfType)) return;
    
    Object.entries(toppings).forEach(([toppingId, quantity]) => {
      if (quantity > 0) {
        const topping = toppingsOfType.find((t: any) => t.id === toppingId);
        if (topping && typeof topping.priceDelta === 'number') {
          total += topping.priceDelta * quantity;
        }
      }
    });
  });
  
  return Math.round(total * 100) / 100;
};

const toppingsToText = (selectedToppings: SelectedToppings): string => {
  const parts: string[] = [];
  
  Object.entries(selectedToppings).forEach(([type, toppings]) => {
    const selectedItems: string[] = [];
    
    Object.entries(toppings).forEach(([toppingId, quantity]) => {
      if (quantity > 0) {
        if (quantity === 1) {
          selectedItems.push(toppingId);
        } else {
          selectedItems.push(`${toppingId} (${quantity})`);
        }
      }
    });
    
    if (selectedItems.length > 0) {
      const typeLabels: Record<string, string> = {
        cream: "Cremas",
        flavor: "Sabores", 
        garnish: "Con",
        sauce: "Salsas"
      };
      
      const typeLabel = typeLabels[type] || type;
      parts.push(`${typeLabel}: ${selectedItems.join(', ')}`);
    }
  });
  
  return parts.join(' • ');
};

const generateCartKey = (productId: string, selectedToppings: SelectedToppings): string => {
  const toppingsStr = JSON.stringify(selectedToppings);
  return `${productId}__${btoa(toppingsStr)}`;
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito desde AsyncStorage al inicializar
  React.useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = useCallback((product: ApiItem, selectedToppings: SelectedToppings = {}) => {
    const unitPrice = calcPriceWithToppings(product.priceBase, selectedToppings, product);
    const id = product._id || product.slug;
    const key = generateCartKey(id, selectedToppings);
    const text = toppingsToText(selectedToppings);

    console.log("🛒 Adding to cart:", {
      product: product.name,
      basePrice: product.priceBase,
      selectedToppings,
      unitPrice,
      text
    });

    setCart(prev => {
      const idx = prev.findIndex(it => it.key === key);
      let newCart: CartItem[];
      
      if (idx >= 0) {
        newCart = [...prev];
        newCart[idx] = { ...newCart[idx], quantity: newCart[idx].quantity + 1 };
      } else {
        newCart = [...prev, { 
          key, 
          productId: id, 
          name: product.name, 
          unitPrice, 
          quantity: 1, 
          selectedToppings,
          selectedText: text 
        }];
      }
      
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((key: string, delta: number) => {
    setCart(prev => {
      const idx = prev.findIndex(it => it.key === key);
      if (idx < 0) return prev;
      
      const newCart = [...prev];
      newCart[idx] = { ...newCart[idx], quantity: newCart[idx].quantity + delta };
      
      if (newCart[idx].quantity <= 0) {
        newCart.splice(idx, 1);
      }
      
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const { totalItems, subtotal } = useMemo(() => {
    const totalItems = cart.reduce((a, it) => a + it.quantity, 0);
    const subtotal = cart.reduce((a, it) => a + (it.unitPrice * it.quantity), 0);
    return { 
      totalItems, 
      subtotal: Math.round(subtotal * 100) / 100
    };
  }, [cart]);

  return { 
    cart, 
    addToCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    subtotal,
    loading
  };
};