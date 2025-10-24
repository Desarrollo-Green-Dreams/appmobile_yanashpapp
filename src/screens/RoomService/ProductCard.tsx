// src/screens/RoomService/components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MenuItem as ApiItem } from '../../types/MenuItem';

interface ProductCardProps {
  product: ApiItem;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const hasCustomizations = (product.autoToppings?.length ?? 0) > 0;
  const imageUrl = (product as any).imageUrl || (product as any).image || '';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl border border-[#efe6dc] shadow-sm mb-4 overflow-hidden"
    >
      {/* Image */}
      <View className="w-full aspect-[4/3] bg-[#faf7f3]">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="restaurant" size={48} color="#e6d9cc" />
          </View>
        )}
        
        {/* Price overlay */}
        <View className="absolute right-3 bottom-2 bg-black/55 rounded-full px-3 py-1">
          <Text className="text-white text-sm font-semibold">
            {hasCustomizations ? `Desde S/${product.priceBase.toFixed(2)}` : `S/${product.priceBase.toFixed(2)}`}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-3">
        <Text className="font-semibold text-[#17332a] mb-1">{product.name}</Text>
        
        {product.desc && (
          <Text className="text-sm text-[#6b6158] mb-3" numberOfLines={2}>
            {product.desc}
          </Text>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {product.tags.map((tag) => (
              <View key={tag} className="bg-[#e8efe9] px-2 py-1 rounded-full">
                <Text className="text-xs text-[#4d6359]">{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA Button */}
        <TouchableOpacity
          onPress={onPress}
          className={`w-full h-10 rounded-xl items-center justify-center flex-row ${
            hasCustomizations
              ? 'border border-[#F36C3F] bg-white'
              : 'bg-[#F36C3F]'
          }`}
        >
          {!hasCustomizations && (
            <Ionicons name="add" size={16} color="white" style={{ marginRight: 4 }} />
          )}
          <Text className={`font-medium ${
            hasCustomizations ? 'text-[#F36C3F]' : 'text-white'
          }`}>
            {hasCustomizations ? 'Elegir' : 'Añadir'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};