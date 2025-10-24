import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  return (
    <View className="flex-1 bg-[#f6f0e9]">
      <StatusBar barStyle="light-content" />
      
      {/* Hero Section */}
      <View style={{ height: height * 0.6 }} className="relative">
        <Image
          source={{ 
            uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' 
          }}
          style={{ width, height: height * 0.6 }}
          className="absolute inset-0"
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={{ width, height: height * 0.6 }}
          className="absolute inset-0"
        />
        
        <View className="absolute inset-0 justify-center items-center px-8">
          <Text className="text-white text-4xl font-bold text-center mb-4 font-weidemann">
            Mundo Yanashpa
          </Text>
          <Text className="text-white/90 text-lg text-center mb-8 font-humanist">
            Tu refugio natural en el corazón de la naturaleza
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="bg-[#F36C3F] px-8 py-4 rounded-xl"
          >
            <Text className="text-white font-bold text-lg font-humanist">
              Acceso Huéspedes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          
          {/* Welcome Text */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-[#17332a] mb-4 text-center font-weidemann">
              Bienvenido a tu experiencia
            </Text>
            <Text className="text-[#7d6f63] text-base leading-relaxed text-center font-humanist">
              Descubre un lugar donde la naturaleza y el confort se encuentran. 
              Mundo Yanashpa te ofrece una experiencia única de descanso y aventura.
            </Text>
          </View>

          {/* Services Grid */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#17332a] mb-6 text-center font-weidemann">
              Explora nuestros servicios
            </Text>
            
            <View className="space-y-4">
              {/* Row 1 */}
              <View className="flex-row space-x-4">
                <ServiceCard
                  icon="images-outline"
                  title="Galería"
                  subtitle="Explora nuestros espacios"
                  onPress={() => router.push('/gallery')}
                />
                <ServiceCard
                  icon="location-outline"
                  title="Contacto"
                  subtitle="Ubicación y detalles"
                  onPress={() => router.push('/contact')}
                />
              </View>
              
              {/* Row 2 */}
              <View className="flex-row space-x-4">
                <ServiceCard
                  icon="calendar-outline"
                  title="Reservar"
                  subtitle="Planifica tu estadía"
                  onPress={() => router.push('/booking')}
                />
                <ServiceCard
                  icon="information-circle-outline"
                  title="Información"
                  subtitle="Conoce más del resort"
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>

          {/* Features */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#17332a] mb-6 text-center font-weidemann">
              Lo que te espera
            </Text>
            
            <View className="space-y-4">
              <FeatureItem
                icon="leaf-outline"
                title="Conexión con la naturaleza"
                description="Espacios diseñados para tu descanso y bienestar"
              />
              <FeatureItem
                icon="restaurant-outline"
                title="Gastronomía local"
                description="Sabores auténticos con ingredientes frescos"
              />
              <FeatureItem
                icon="bed-outline"
                title="Alojamiento único"
                description="Cabañas y casas con todo el confort que necesitas"
              />
            </View>
          </View>

          {/* CTA Section */}
          <View className="bg-white/60 rounded-2xl p-6 border border-[#e5dfd8]">
            <Text className="text-lg font-bold text-[#17332a] mb-2 text-center font-weidemann">
              ¿Ya tienes una reserva?
            </Text>
            <Text className="text-[#7d6f63] text-sm mb-4 text-center font-humanist">
              Accede a servicios exclusivos durante tu estadía
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/login')}
              className="bg-[#F36C3F] py-3 rounded-xl"
            >
              <Text className="text-white font-bold text-center font-humanist">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// Service Card Component
function ServiceCard({ 
  icon, 
  title, 
  subtitle, 
  onPress 
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
    >
      <Ionicons name={icon} size={32} color="#F36C3F" className="mb-3" />
      <Text className="text-[#17332a] font-bold text-base mb-1 font-humanist">
        {title}
      </Text>
      <Text className="text-[#7d6f63] text-xs font-humanist">
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

// Feature Item Component
function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-start space-x-4">
      <View className="w-12 h-12 bg-[#F36C3F]/10 rounded-full items-center justify-center">
        <Ionicons name={icon} size={24} color="#F36C3F" />
      </View>
      <View className="flex-1">
        <Text className="text-[#17332a] font-bold text-base mb-1 font-humanist">
          {title}
        </Text>
        <Text className="text-[#7d6f63] text-sm font-humanist">
          {description}
        </Text>
      </View>
    </View>
  );
}