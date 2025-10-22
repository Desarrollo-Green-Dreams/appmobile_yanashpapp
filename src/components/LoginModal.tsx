import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Linking
} from 'react-native';
import { CheckinData } from '../types';

interface LoginModalProps {
  dniBusqueda: string;
  setDniBusqueda: (value: string) => void;
  errorMensaje: string;
  loading: boolean;
  reservasEncontradas: CheckinData[];
  onBuscarReserva: () => Promise<void>;
  onSeleccionarCheckIn: (checkin: CheckinData) => void;
  setBackdoorClicks: (fn: (prev: number) => number) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  dniBusqueda,
  setDniBusqueda,
  errorMensaje,
  loading,
  reservasEncontradas,
  onBuscarReserva,
  onSeleccionarCheckIn,
  setBackdoorClicks,
}) => {

  const openWhatsApp = (number: string, message: string) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <View className="flex-1 bg-black/20 justify-center items-center px-4">
      <View className="bg-white rounded-3xl p-7 w-full max-w-[370px] shadow-xl">
        
        <Text className="text-2xl font-bold text-[#F36C3F] text-center mb-6">
          Identificate
        </Text>

        <View className="mb-4">
          <Text className="text-sm text-[#F36C3F] font-semibold mb-2 ml-2">
            Nro. Documento
          </Text>
          
          <TextInput
            value={dniBusqueda}
            onChangeText={setDniBusqueda}
            maxLength={15}
            autoFocus
            className="bg-white/70 w-full px-4 py-3 text-base text-gray-900 rounded-2xl border border-[#e5dfd8] shadow-sm"
            placeholder="Ingresa tu documento"
            placeholderTextColor="#ccc"
          />
        </View>

        {errorMensaje && (
          <View className="mb-4 bg-red-100 p-3 rounded-lg border-l-4 border-red-500">
            <Text className="text-red-700 text-sm font-semibold">
              {errorMensaje}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={onBuscarReserva}
          disabled={loading}
          className="w-full bg-[#F36C3F] rounded-xl px-5 py-4 mt-2 shadow-sm disabled:opacity-60"
        >
          <View className="flex-row items-center justify-center">
            {loading && (
              <ActivityIndicator 
                color="white" 
                size="small" 
                style={{ marginRight: 8 }}
              />
            )}
            <Text className="text-white font-bold text-center">
              {loading ? 'Buscando...' : 'Encontrar Reserva'}
            </Text>
          </View>
        </TouchableOpacity>

        {Array.isArray(reservasEncontradas) && reservasEncontradas.length > 1 && (
          <View className="mt-6">
            <Text className="text-sm font-semibold text-[#F36C3F] text-center mb-4">
              Selecciona tu propiedad:
            </Text>

            <ScrollView style={{ maxHeight: 200 }}>
              {reservasEncontradas.map((checkin, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onSeleccionarCheckIn(checkin)}
                  className="w-full border border-[#e8e0d6] bg-white/80 rounded-2xl px-4 py-3 shadow-sm mb-3"
                >
                  <Text className="text-base font-semibold text-[#17332a]">
                    {checkin.property}
                  </Text>
                  <Text className="text-sm text-[#7d6f63]">
                    {checkin.checkInDate} al {checkin.checkOutDate}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="mt-6">
          <Text className="text-xs text-[#ac9e8c] text-center">
            ¿Problemas para acceder?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => openWhatsApp("51916598443", "Necesito ayuda con YanashpApp")}
          >
            <Text className="text-xs text-[#F36C3F] underline text-center">
              Contáctanos
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default LoginModal;