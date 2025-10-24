// src/screens/RoomService/components/CategoryChips.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

interface CategoryChip {
  slug: string;
  label: string;
  order: number;
}

interface CategoryChipsProps {
  categories: CategoryChip[];
  selectedCatSlug: string;
  onCategorySelect: (slug: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCatSlug,
  onCategorySelect
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-4 py-2"
      contentContainerStyle={{ gap: 8 }}
    >
      {categories.map((category) => {
        const isActive = selectedCatSlug === category.slug;
        return (
          <TouchableOpacity
            key={category.slug}
            onPress={() => onCategorySelect(category.slug)}
            className={`px-3 py-1 rounded-full border ${
              isActive 
                ? 'bg-[#F36C3F] border-[#F36C3F]' 
                : 'bg-white border-[#e6d9cc]'
            }`}
          >
            <Text className={`text-sm font-medium ${
              isActive ? 'text-white' : 'text-[#4d6359]'
            }`}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};