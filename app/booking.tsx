import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const accommodationTypes = [
  {
    id: 1,
    name: 'Bungalows Forestales',
    description: 'Cabañas rodeadas de naturaleza con todas las comodidades',
    image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Vista al bosque', 'Terraza privada', 'Kitchenette'],
    capacity: '2-4 personas'
  },
  {
    id: 2,
    name: 'Casas Village',
    description: 'Amplias casas familiares en el corazón del resort',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Sala de estar', 'Cocina completa', 'Jardín privado'],
    capacity: '4-8 personas'
  },
  {
    id: 3,
    name: 'Cabañas Old Yanashpa',
    description: 'Alojamiento tradicional con encanto rústico',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Estilo rústico', 'Chimenea', 'Vista panorámica'],
    capacity: '2-6 personas'
  },
];

export default function BookingScreen() {
  const openBookingSystem = () => {
    const url = 'https://hotels.cloudbeds.com/es/reservation/mEFmNc';
    Linking.openURL(url);
  };

  const openWhatsApp = () => {
    const message = 'Hola, me interesa hacer una reserva en Mundo Yanashpa. ¿Podrían ayudarme?';
    const url = `https://wa.me/51916598443?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const callReservations = () => {
    Linking.openURL('tel:+51916598443');
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
            Reservar
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          
          {/* Hero Section */}
          <View className="bg-white/80 rounded-2xl p-6 mb-6 border border-[#e5dfd8] shadow-sm">
            <Text className="text-xl font-bold text-[#17332a] mb-3 text-center">
              Planifica tu escape perfecto
            </Text>
            <Text className="text-[#7d6f63] text-sm leading-relaxed text-center mb-4">
              Descubre nuestros diferentes tipos de alojamiento y encuentra 
              el que mejor se adapte a tu experiencia ideal en la naturaleza.
            </Text>
          </View>

          {/* Accommodation Types */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#17332a] mb-4">
              Tipos de Alojamiento
            </Text>
            
            {accommodationTypes.map((accommodation) => (
              <View
                key={accommodation.id}
                className="bg-white/80 rounded-2xl mb-4 overflow-hidden border border-[#e5dfd8] shadow-sm"
              >
                <Image
                  source={{ uri: accommodation.image }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="cover"
                />
                
                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-[#17332a] font-bold text-lg flex-1">
                      {accommodation.name}
                    </Text>
                    <View className="bg-[#F36C3F]/10 px-3 py-1 rounded-full">
                      <Text className="text-[#F36C3F] text-xs font-semibold">
                        {accommodation.capacity}
                      </Text>
                    </View>
                  </View>
                  
                  <Text className="text-[#7d6f63] text-sm mb-3">
                    {accommodation.description}
                  </Text>
                  
                  <View className="flex-row flex-wrap">
                    {accommodation.features.map((feature, index) => (
                      <View
                        key={index}
                        className="bg-[#f6f0e9] px-2 py-1 rounded-lg mr-2 mb-2"
                      >
                        <Text className="text-[#17332a] text-xs">
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Booking Options */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#17332a] mb-4">
              Hacer tu Reserva
            </Text>
            
            <View className="space-y-3">
              {/* Online Booking */}
              <TouchableOpacity
                onPress={openBookingSystem}
                className="bg-[#F36C3F] rounded-2xl p-6 shadow-sm"
              >
                <View className="items-center">
                  <Ionicons name="calendar" size={32} color="white" />
                  <Text className="text-white font-bold text-lg mt-2 mb-1">
                    Reservar Online
                  </Text>
                  <Text className="text-white/90 text-sm text-center">
                    Sistema de reservas directo - Disponibilidad en tiempo real
                  </Text>
                </View>
              </TouchableOpacity>

              {/* WhatsApp */}
              <TouchableOpacity
                onPress={openWhatsApp}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-[#25D366]/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      Reservar por WhatsApp
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      Atención personalizada y asesoría
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>

              {/* Phone */}
              <TouchableOpacity
                onPress={callReservations}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-[#F36C3F]/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="call" size={24} color="#F36C3F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      Llamar directamente
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      +51 916 598 443
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Information */}
          <View className="bg-white/80 rounded-2xl p-6 border border-[#e5dfd8] shadow-sm mb-6">
            <Text className="text-lg font-bold text-[#17332a] mb-4 text-center">
              Información Importante
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Ionicons name="time-outline" size={20} color="#F36C3F" style={{ marginTop: 2, marginRight: 12 }} />
                <View className="flex-1">
                  <Text className="text-[#17332a] font-semibold text-sm mb-1">
                    Check-in: 3:00 PM | Check-out: 12:00 PM
                  </Text>
                  <Text className="text-[#7d6f63] text-xs">
                    Horarios estándar, sujetos a disponibilidad para cambios
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Ionicons name="card-outline" size={20} color="#F36C3F" style={{ marginTop: 2, marginRight: 12 }} />
                <View className="flex-1">
                  <Text className="text-[#17332a] font-semibold text-sm mb-1">
                    Política de Cancelación
                  </Text>
                  <Text className="text-[#7d6f63] text-xs">
                    Cancelación gratuita hasta 48 horas antes de la llegada
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Ionicons name="paw-outline" size={20} color="#F36C3F" style={{ marginTop: 2, marginRight: 12 }} />
                <View className="flex-1">
                  <Text className="text-[#17332a] font-semibold text-sm mb-1">
                    Pet Friendly
                  </Text>
                  <Text className="text-[#7d6f63] text-xs">
                    Mascotas bienvenidas con costo adicional
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Ionicons name="wifi-outline" size={20} color="#F36C3F" style={{ marginTop: 2, marginRight: 12 }} />
                <View className="flex-1">
                  <Text className="text-[#17332a] font-semibold text-sm mb-1">
                    Servicios Incluidos
                  </Text>
                  <Text className="text-[#7d6f63] text-xs">
                    WiFi gratuito, estacionamiento, acceso a áreas comunes
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTA Final */}
          <View className="bg-[#F36C3F]/10 rounded-2xl p-6 border border-[#F36C3F]/20">
            <Text className="text-[#F36C3F] font-bold text-lg text-center mb-2">
              ¿Listo para tu escape?
            </Text>
            <Text className="text-[#7d6f63] text-sm text-center mb-4">
              No esperes más y asegura tu lugar en este paraíso natural
            </Text>
            <TouchableOpacity
              onPress={openBookingSystem}
              className="bg-[#F36C3F] py-3 rounded-xl"
            >
              <Text className="text-white font-bold text-center">
                Reservar Ahora
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}