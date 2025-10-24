// src/screens/RoomService/components/CartBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CartBarProps {
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  onCartOpen: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({
  totalItems,
  subtotal,
  isOpen,
  onCartOpen
}) => {
  if (totalItems === 0) return null;

  return (
    <View className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur p-4 border-t border-[#e6d9cc]">
      <TouchableOpacity
        onPress={onCartOpen}
        className="bg-white rounded-2xl p-3 flex-row items-center justify-between border border-[#e6d9cc] shadow-sm"
      >
        <View className="flex-row items-center gap-3">
          <View className="relative w-10 h-10 bg-[#f6f0e9] rounded-xl items-center justify-center">
            <Ionicons name="basket" size={20} color="#17332a" />
            <View className="absolute -top-1 -right-1 w-5 h-5 bg-[#F36C3F] rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">{totalItems}</Text>
            </View>
          </View>

          <View>
            <Text className="text-xs text-[#7d6f63]">Subtotal</Text>
            <Text className="font-semibold text-[#17332a]">S/{subtotal.toFixed(2)}</Text>
          </View>
        </View>

        <View className="bg-[#F36C3F] px-4 py-2 rounded-full">
          <Text className="text-white font-medium">
            {isOpen ? 'Ver pedido' : 'Programar pedido'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};