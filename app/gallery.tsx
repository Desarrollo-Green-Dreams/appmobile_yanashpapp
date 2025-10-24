import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Imágenes de ejemplo del resort
const galleryImages = [
  {
    id: 1,
    title: 'Vista aérea del resort',
    uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'exteriors'
  },
  {
    id: 2,
    title: 'Cabaña forestal',
    uri: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'accommodations'
  },
  {
    id: 3,
    title: 'Restaurante principal',
    uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'dining'
  },
  {
    id: 4,
    title: 'Sendero natural',
    uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'nature'
  },
  {
    id: 5,
    title: 'Habitación suite',
    uri: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'accommodations'
  },
  {
    id: 6,
    title: 'Zona de relajación',
    uri: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'amenities'
  },
  {
    id: 7,
    title: 'Atardecer en el lago',
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'nature'
  },
  {
    id: 8,
    title: 'Área de eventos',
    uri: 'https://images.unsplash.com/photo-1519167758481-83f29c7c6756?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'amenities'
  },
];

const categories = [
  { id: 'all', name: 'Todas', icon: 'grid-outline' },
  { id: 'accommodations', name: 'Alojamiento', icon: 'bed-outline' },
  { id: 'dining', name: 'Gastronomía', icon: 'restaurant-outline' },
  { id: 'nature', name: 'Naturaleza', icon: 'leaf-outline' },
  { id: 'amenities', name: 'Amenidades', icon: 'star-outline' },
];

export default function GalleryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openImageModal = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View className="flex-1 bg-[#f6f0e9]">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-[#F36C3F]/10 rounded-full items-center justify-center mr-4"
          >
            <Ionicons name="arrow-back" size={20} color="#F36C3F" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#F36C3F] flex-1">
            Galería
          </Text>
        </View>
      </View>

      {/* Categories Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-[#e5dfd8]"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${
              selectedCategory === category.id
                ? 'bg-[#F36C3F]'
                : 'bg-[#F36C3F]/10'
            }`}
          >
            <Ionicons 
              name={category.icon as keyof typeof Ionicons.glyphMap} 
              size={16} 
              color={selectedCategory === category.id ? 'white' : '#F36C3F'}
            />
            <Text className={`ml-2 text-sm font-semibold ${
              selectedCategory === category.id ? 'text-white' : 'text-[#F36C3F]'
            }`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Gallery Grid */}
      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredImages.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => openImageModal(image)}
              className="mb-4"
              style={{ 
                width: (width - 32 - 8) / 2, // Dos columnas con padding
                marginRight: index % 2 === 0 ? 8 : 0 
              }}
            >
              <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: image.uri }}
                  style={{ 
                    width: '100%', 
                    height: 200,
                  }}
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-[#17332a] font-semibold text-sm" numberOfLines={2}>
                    {image.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View className="bg-white/80 rounded-2xl p-6 mt-4 mb-8 border border-[#e5dfd8]">
          <Text className="text-lg font-bold text-[#17332a] mb-3 text-center">
            Descubre Mundo Yanashpa
          </Text>
          <Text className="text-[#7d6f63] text-sm leading-relaxed text-center mb-4">
            Un refugio natural donde cada rincón cuenta una historia. 
            Nuestras instalaciones están diseñadas para brindarte la 
            experiencia perfecta entre confort y naturaleza.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/contact')}
            className="bg-[#F36C3F] py-3 rounded-xl"
          >
            <Text className="text-white font-bold text-center">
              Más Información
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            onPress={closeImageModal}
            className="absolute top-12 right-6 z-10 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {selectedImage && (
            <View className="w-full px-4">
              <Image
                source={{ uri: selectedImage.uri }}
                style={{
                  width: width - 32,
                  height: height * 0.6,
                }}
                resizeMode="contain"
              />
              <View className="bg-white/90 rounded-xl p-4 mt-4">
                <Text className="text-[#17332a] font-bold text-lg text-center">
                  {selectedImage.title}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}