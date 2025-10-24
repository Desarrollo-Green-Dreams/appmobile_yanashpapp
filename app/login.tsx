import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { consultarCheckInsActivosPorDni } from '../src/api/ReservaAPI';
import { CheckinData, DatosReserva } from '../src/types';

export default function LoginModal() {
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservasEncontradas, setReservasEncontradas] = useState<CheckinData[]>([]);

  const handleBuscarReserva = async () => {
    if (!dniBusqueda.trim()) {
      setErrorMensaje("Ingresa tu número de documento");
      return;
    }

    setLoading(true);
    setErrorMensaje("");

    try {
      const response = await consultarCheckInsActivosPorDni(dniBusqueda.trim());
      
      if (response.status === "not_found" || !response.data || response.data.length === 0) {
        setErrorMensaje("No encontramos ninguna reserva activa con ese documento");
        return;
      }

      const reservas = response.data;
      setReservasEncontradas(reservas);

      if (reservas.length === 1) {
        handleSeleccionarCheckIn(reservas[0]);
      }

    } catch (error: any) {
      setErrorMensaje(error.message || "Error al buscar reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarCheckIn = async (checkin: CheckinData) => {
    const nuevosDatos: DatosReserva = {
      nombre: checkin?.name || "",
      correo: checkin?.email || "",
      telefono: checkin?.phone || "",
      propiedad: checkin?.property || "",
      checkIn: checkin?.checkInDate || "",
      checkOut: checkin?.checkOutDate || "",
      dniPasaporte: dniBusqueda || "",
    };

    try {
      await AsyncStorage.setItem("datosReserva", JSON.stringify(nuevosDatos));
      
      // Navegar a la sección de huéspedes
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los datos");
    }
  };

  const openWhatsApp = (number: string, message: string) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black/20 justify-center items-center px-4"
    >
      {/* Header con botón de cerrar */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white/90 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#F36C3F" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-3xl p-7 w-full max-w-[370px] shadow-xl">
        
        <Text className="text-2xl font-bold text-[#F36C3F] text-center mb-6 font-weidemann">
          Acceso Huéspedes
        </Text>

        <View className="mb-4">
          <Text className="text-sm text-[#F36C3F] font-semibold mb-2 ml-2 font-humanist">
            Nro. Documento
          </Text>
          
          <TextInput
            value={dniBusqueda}
            onChangeText={setDniBusqueda}
            maxLength={15}
            autoFocus
            className="bg-white/70 w-full px-4 py-3 text-base text-gray-900 rounded-2xl border border-[#e5dfd8] shadow-sm font-humanist"
            placeholder="Ingresa tu documento"
            placeholderTextColor="#ccc"
            keyboardType="default"
            returnKeyType="search"
            onSubmitEditing={handleBuscarReserva}
          />
        </View>

        {errorMensaje && (
          <View className="mb-4 bg-red-100 p-3 rounded-lg border-l-4 border-red-500">
            <Text className="text-red-700 text-sm font-semibold font-humanist">
              {errorMensaje}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleBuscarReserva}
          disabled={loading}
          className="w-full bg-[#F36C3F] rounded-xl px-5 py-4 mt-2 shadow-sm disabled:opacity-60"
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          <View className="flex-row items-center justify-center">
            {loading && (
              <ActivityIndicator 
                color="white" 
                size="small" 
                style={{ marginRight: 8 }}
              />
            )}
            <Text className="text-white font-bold text-center font-humanist">
              {loading ? 'Buscando...' : 'Encontrar Reserva'}
            </Text>
          </View>
        </TouchableOpacity>

        {Array.isArray(reservasEncontradas) && reservasEncontradas.length > 1 && (
          <View className="mt-6">
            <Text className="text-sm font-semibold text-[#F36C3F] text-center mb-4 font-humanist">
              Selecciona tu propiedad:
            </Text>

            <ScrollView style={{ maxHeight: 200 }}>
              {reservasEncontradas.map((checkin, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSeleccionarCheckIn(checkin)}
                  className="w-full border border-[#e8e0d6] bg-white/80 rounded-2xl px-4 py-3 shadow-sm mb-3"
                >
                  <Text className="text-base font-semibold text-[#17332a] font-humanist">
                    {checkin.property}
                  </Text>
                  <Text className="text-sm text-[#7d6f63] font-humanist">
                    {checkin.checkInDate} al {checkin.checkOutDate}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="mt-6">
          <Text className="text-xs text-[#ac9e8c] text-center font-humanist">
            ¿Problemas para acceder?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => openWhatsApp("51916598443", "Necesito ayuda con YanashpApp")}
          >
            <Text className="text-xs text-[#F36C3F] underline text-center font-humanist">
              Contáctanos
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}