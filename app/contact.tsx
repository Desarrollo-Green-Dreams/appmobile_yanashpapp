import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ContactScreen() {
  const openMap = () => {
    const url = 'https://maps.google.com/?q=-12.0431,-77.0282';
    Linking.openURL(url);
  };

  const openWhatsApp = (number: string, message: string) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const makePhoneCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const sendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openWebsite = () => {
    Linking.openURL('https://elresort.pe');
  };

  const openSocialMedia = (platform: string) => {
    const urls = {
      instagram: 'https://instagram.com/mundoyanashpa',
      facebook: 'https://facebook.com/mundoyanashpa',
      tiktok: 'https://tiktok.com/@mundoyanashpa',
    };
    Linking.openURL(urls[platform] || urls.instagram);
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
            Contacto
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          
          {/* Info Principal */}
          <View className="bg-white/80 rounded-2xl p-6 mb-6 border border-[#e5dfd8] shadow-sm">
            <Text className="text-xl font-bold text-[#17332a] mb-4 text-center">
              Mundo Yanashpa Resort
            </Text>
            <Text className="text-[#7d6f63] text-sm leading-relaxed text-center mb-4">
              Tu refugio natural en el corazón de la naturaleza peruana. 
              Estamos aquí para hacer de tu experiencia algo inolvidable.
            </Text>
          </View>

          {/* Ubicación */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#17332a] mb-4">
              📍 Ubicación
            </Text>
            
            <TouchableOpacity
              onPress={openMap}
              className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-[#F36C3F]/10 rounded-full items-center justify-center mr-4">
                  <Ionicons name="location" size={24} color="#F36C3F" />
                </View>
                <View className="flex-1">
                  <Text className="text-[#17332a] font-bold text-base mb-1">
                    Mundo Yanashpa
                  </Text>
                  <Text className="text-[#7d6f63] text-sm mb-1">
                    Carretera Central Km 85
                  </Text>
                  <Text className="text-[#7d6f63] text-sm">
                    San Jerónimo de Surco, Lima - Perú
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Contacto Directo */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#17332a] mb-4">
              📞 Contacto Directo
            </Text>
            
            <View className="space-y-3">
              {/* WhatsApp */}
              <TouchableOpacity
                onPress={() => openWhatsApp("51916598443", "Hola, me interesa conocer más sobre Mundo Yanashpa")}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-[#25D366]/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      WhatsApp
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      +51 916 598 443
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>

              {/* Teléfono */}
              <TouchableOpacity
                onPress={() => makePhoneCall("+51916598443")}
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

              {/* Email */}
              <TouchableOpacity
                onPress={() => sendEmail("info@elresort.pe")}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-[#F36C3F]/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="mail" size={24} color="#F36C3F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      Email
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      info@elresort.pe
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Redes Sociales */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#17332a] mb-4">
              🌐 Síguenos
            </Text>
            
            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => openSocialMedia('instagram')}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full items-center justify-center mr-4">
                    <Ionicons name="logo-instagram" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      Instagram
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      @mundoyanashpa
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openSocialMedia('facebook')}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-[#1877F2]/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      Facebook
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      Mundo Yanashpa
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openSocialMedia('tiktok')}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-black/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="logo-tiktok" size={24} color="black" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#17332a] font-bold text-base mb-1">
                      TikTok
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      @mundoyanashpa
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sitio Web */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={openWebsite}
              className="bg-[#F36C3F]/10 rounded-2xl p-6 border border-[#F36C3F]/20 shadow-sm"
            >
              <View className="items-center">
                <Ionicons name="globe-outline" size={32} color="#F36C3F" />
                <Text className="text-[#F36C3F] font-bold text-lg mt-2 mb-1">
                  Visita nuestro sitio web
                </Text>
                <Text className="text-[#7d6f63] text-sm text-center">
                  elresort.pe
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Horarios */}
          <View className="bg-white/80 rounded-2xl p-6 border border-[#e5dfd8] shadow-sm mb-8">
            <Text className="text-lg font-bold text-[#17332a] mb-4 text-center">
              ⏰ Horarios de Atención
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-[#7d6f63] text-sm">Recepción</Text>
                <Text className="text-[#17332a] font-semibold text-sm">24 horas</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#7d6f63] text-sm">Servicios</Text>
                <Text className="text-[#17332a] font-semibold text-sm">9:00 AM - 9:00 PM</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#7d6f63] text-sm">Restaurante</Text>
                <Text className="text-[#17332a] font-semibold text-sm">7:00 AM - 10:00 PM</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#7d6f63] text-sm">Check-in</Text>
                <Text className="text-[#17332a] font-semibold text-sm">3:00 PM</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#7d6f63] text-sm">Check-out</Text>
                <Text className="text-[#17332a] font-semibold text-sm">12:00 PM</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}