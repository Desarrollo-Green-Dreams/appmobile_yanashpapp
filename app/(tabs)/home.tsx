import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthPublic } from '../../src/hooks/useAuth';
import { DatosReserva } from '../../src/types';
import ModalSolicitud from '../../src/components/ModalSolicitud';

const { width } = Dimensions.get('window');

export default function HomeDashboard() {
  const [datosReserva, setDatosReserva] = useState<DatosReserva>({
    nombre: "",
    correo: "",
    telefono: "",
    propiedad: "",
    checkIn: "",
    checkOut: "",
    dniPasaporte: "",
  });

  const [modalSolicitud, setModalSolicitud] = useState<"Amenidades" | "Minibar" | "Movilidad" | "LateCheckout" | "Emergencia" | null>(null);

  const {
    autenticado,
    setAutenticado,
    nombre,
    propiedad,
    validarReservaVigente,
  } = useAuthPublic();

  useEffect(() => {
    validarReservaVigente();
    loadDatosReserva();
  }, []);

  const loadDatosReserva = async () => {
    try {
      const datos = await AsyncStorage.getItem("datosReserva");
      if (datos) {
        setDatosReserva(JSON.parse(datos));
      }
    } catch (error) {
      console.error('Error loading datos reserva:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("datosReserva");
            setAutenticado(false);
            router.replace('/');
          },
        },
      ]
    );
  };

  const openWhatsApp = (number: string, message: string) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  // Verificar horarios de servicio (HABILITADO TODO EL DÍA PARA TESTING)
  const ahora = new Date();
  const hora = ahora.getHours();
  const serviciosDisponibles = true; // hora >= 9 && hora < 21;

  if (!autenticado) {
    return (
      <View className="flex-1 bg-[#f6f0e9] justify-center items-center p-6">
        <Text className="text-lg text-[#17332a] text-center mb-4">
          Debes iniciar sesión para acceder a los servicios
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          className="bg-[#F36C3F] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f6f0e9]">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-[#F36C3F] mb-1">
              Bienvenido
            </Text>
            <Text className="text-xl text-[#17332a] mb-1">
              {nombre?.split(" ")[0]}
            </Text>
            <Text className="text-sm text-[#7d6f63]">
              {propiedad}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 bg-[#F36C3F] rounded-full items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Comentado para testing */}
        {false && !serviciosDisponibles && (
          <View className="mt-4 bg-yellow-100 p-3 rounded-xl border-l-4 border-yellow-500">
            <Text className="text-yellow-800 text-sm font-semibold">
              Los servicios estarán disponibles de 9:00 AM a 9:00 PM
            </Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          
          {/* Servicios Principales */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#17332a] mb-4 text-center">
              Solicitar Servicios
            </Text>
            
            <View className="space-y-4">
              {/* Row 1 */}
              <View className="flex-row space-x-4">
                <ServiceButton
                  icon="restaurant-outline"
                  title="Room Service"
                  subtitle="Pedir comida"
                  onPress={() => {
                    if (serviciosDisponibles) {
                      // TODO: Implementar modal room service
                      Alert.alert("Room Service", "Funcionalidad en desarrollo");
                    } else {
                      Alert.alert("Fuera de horario", "Servicios disponibles de 9:00 AM a 9:00 PM");
                    }
                  }}
                  disabled={!serviciosDisponibles}
                />
                <ServiceButton
                  icon="car-outline"
                  title="Movilidad"
                  subtitle="Transporte interno"
                  onPress={() => {
                    if (serviciosDisponibles) {
                      setModalSolicitud("Movilidad");
                    } else {
                      Alert.alert("Fuera de horario", "Servicios disponibles de 9:00 AM a 9:00 PM");
                    }
                  }}
                  disabled={!serviciosDisponibles}
                />
              </View>

              {/* Row 2 */}
              <View className="flex-row space-x-4">
                <ServiceButton
                  icon="water-outline"
                  title="Amenidades"
                  subtitle="Reponer artículos"
                  onPress={() => {
                    if (serviciosDisponibles) {
                      setModalSolicitud("Amenidades");
                    } else {
                      Alert.alert("Fuera de horario", "Servicios disponibles de 9:00 AM a 9:00 PM");
                    }
                  }}
                  disabled={!serviciosDisponibles}
                />
                <ServiceButton
                  icon="wine-outline"
                  title="Minibar"
                  subtitle="Reponer minibar"
                  onPress={() => {
                    if (serviciosDisponibles) {
                      setModalSolicitud("Minibar");
                    } else {
                      Alert.alert("Fuera de horario", "Servicios disponibles de 9:00 AM a 9:00 PM");
                    }
                  }}
                  disabled={!serviciosDisponibles}
                />
              </View>
            </View>
          </View>

          {/* Extras */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#17332a] mb-4 text-center">
              Explorar Extras
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row space-x-4">
                <ServiceButton
                  icon="camera-outline"
                  title="Experiencias"
                  subtitle="Reservar actividades"
                  onPress={() => {
                    const url = `https://elresort.pe/extras/`;
                    Linking.openURL(url);
                  }}
                />
                <ServiceButton
                  icon="color-palette-outline"
                  title="Arte"
                  subtitle="Adquirir obras"
                  onPress={() => {
                    const url = `https://elresort.pe/yanashpART/`;
                    Linking.openURL(url);
                  }}
                />
              </View>

              <View className="flex-row space-x-4">
                <ServiceButton
                  icon="images-outline"
                  title="Spots"
                  subtitle="Lugares instagrameables"
                  onPress={() => {
                    // TODO: Implementar spots
                    Alert.alert("Spots", "Funcionalidad en desarrollo");
                  }}
                />
                <ServiceButton
                  icon="information-circle-outline"
                  title="Información"
                  subtitle="Detalles del resort"
                  onPress={() => {
                    Alert.alert("Información", "Funcionalidad en desarrollo");
                  }}
                />
              </View>
            </View>
          </View>

          {/* Extensión de estadía */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#17332a] mb-4 text-center">
              Extender tu estadía
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row space-x-4">
                <ServiceButton
                  icon="star-outline"
                  title="Upgrade"
                  subtitle="Mejorar alojamiento"
                  onPress={() => {
                    const mensaje = `Hola, soy ${nombre} de la propiedad ${propiedad}. Me gustaría consultar sobre upgrades disponibles.`;
                    openWhatsApp("51916598443", mensaje);
                  }}
                />
                <ServiceButton
                  icon="time-outline"
                  title="Late Check-Out"
                  subtitle="Salida tardía"
                  onPress={() => {
                    if (serviciosDisponibles) {
                      setModalSolicitud("LateCheckout");
                    } else {
                      Alert.alert("Fuera de horario", "Servicios disponibles de 9:00 AM a 9:00 PM");
                    }
                  }}
                  disabled={!serviciosDisponibles}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  const url = `https://hotels.cloudbeds.com/es/reservation/mEFmNc`;
                  Linking.openURL(url);
                }}
                className="bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm"
              >
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={24} color="#F36C3F" />
                  <View className="ml-4 flex-1">
                    <Text className="text-[#17332a] font-bold text-base">
                      Extender Reserva
                    </Text>
                    <Text className="text-[#7d6f63] text-sm">
                      Más noches en el resort
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7d6f63" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Acciones adicionales */}
          <View className="space-y-3 mb-8">
            <TouchableOpacity
              onPress={() => {
                const mensaje = `Hola, soy ${nombre} de ${propiedad}. Me gustaría compartir mi experiencia hasta ahora.`;
                openWhatsApp("51916598443", mensaje);
              }}
              className="flex-row items-center justify-center border border-[#F36C3F] text-[#F36C3F] rounded-xl py-3"
            >
              <Ionicons name="create-outline" size={20} color="#F36C3F" />
              <Text className="text-[#F36C3F] font-semibold ml-2">
                ¿Cómo te sientes hasta ahora?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const mensaje = `Hola, me interesa saber más sobre las oportunidades de inversión en Mundo Yanashpa.`;
                openWhatsApp("51916598443", mensaje);
              }}
              className="flex-row items-center justify-center border border-[#F36C3F] text-[#F36C3F] rounded-xl py-3"
            >
              <Ionicons name="home-outline" size={20} color="#F36C3F" />
              <Text className="text-[#F36C3F] font-semibold ml-2">
                ¿Cómo invertir en Mundo Yanashpa?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalSolicitud("Emergencia")}
              className="flex-row items-center justify-center border border-red-600 bg-red-50 rounded-xl py-3"
            >
              <Ionicons name="warning-outline" size={20} color="#dc2626" />
              <Text className="text-red-600 font-semibold ml-2">
                Tengo una emergencia
              </Text>
            </TouchableOpacity>
          </View>

          {/* Flotante de ayuda */}
          <TouchableOpacity
            onPress={() => {
              const mensaje = `Hola, soy ${nombre} de ${propiedad}. Necesito ayuda con la app.`;
              openWhatsApp("51916598443", mensaje);
            }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#F36C3F] rounded-full items-center justify-center shadow-lg"
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              zIndex: 10,
            }}
          >
            <Ionicons name="headset-outline" size={24} color="white" />
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal de Solicitudes */}
      <ModalSolicitud
        visible={modalSolicitud !== null}
        tipo={modalSolicitud}
        onClose={() => setModalSolicitud(null)}
        onSuccess={() => {
          setModalSolicitud(null);
          Alert.alert("Éxito", "Tu solicitud ha sido enviada y será atendida pronto.", [
            {
              text: "Ver mis solicitudes",
              onPress: () => router.push('/(tabs)/solicitudes')
            },
            {
              text: "OK",
              style: "cancel"
            }
          ]);
        }}
      />
    </View>
  );
}

// Service Button Component
function ServiceButton({ 
  icon, 
  title, 
  subtitle, 
  onPress,
  disabled = false
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 bg-white/80 rounded-2xl p-4 border border-[#e5dfd8] shadow-sm ${
        disabled ? 'opacity-50' : ''
      }`}
      style={{ minHeight: 100 }}
    >
      <View className="items-center">
        <Ionicons 
          name={icon} 
          size={28} 
          color={disabled ? "#7d6f63" : "#F36C3F"} 
          style={{ marginBottom: 8 }}
        />
        <Text className={`font-bold text-sm text-center mb-1 ${
          disabled ? 'text-[#7d6f63]' : 'text-[#17332a]'
        }`}>
          {title}
        </Text>
        <Text className="text-[#7d6f63] text-xs text-center">
          {subtitle}
        </Text>
        {disabled && (
          <View className="absolute inset-0 items-center justify-center bg-black/10 rounded-2xl">
            <Ionicons name="time-outline" size={24} color="#7d6f63" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}