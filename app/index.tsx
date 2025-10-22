import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useAuthPublic } from '../src/hooks/useAuth';
import LoginModal from '../src/components/LoginModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { consultarCheckInsActivosPorDni } from '../src/api/ReservaAPI';
import { CheckinData, DatosReserva } from '../src/types';

export default function MainScreen() {
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservasEncontradas, setReservasEncontradas] = useState<CheckinData[]>([]);
  const [backdoorClicks, setBackdoorClicks] = useState(0);
  
  const {
    autenticado,
    setAutenticado,
    nombre,
    setNombre,
    propiedad,
    setPropiedad,
    validarReservaVigente,
  } = useAuthPublic();

  useEffect(() => {
    validarReservaVigente();
  }, []);

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
      
      setAutenticado(true);
      setNombre(nuevosDatos.nombre);
      setPropiedad(nuevosDatos.propiedad);
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los datos");
    }
  };

  if (autenticado) {
    return (
      <View className="flex-1 bg-[#f6f0e9] justify-center items-center p-6">
        <Text className="text-3xl font-bold text-[#F36C3F] mb-4 text-center">
          Bienvenido
        </Text>
        <Text className="text-xl text-[#17332a] text-center mb-2">
          {nombre?.split(" ")[0]}
        </Text>
        <Text className="text-base text-[#7d6f63] text-center mb-8">
          {propiedad}
        </Text>
        
        <Text className="text-lg text-[#17332a] text-center">
          Login funcionando
        </Text>
      </View>
    );
  }

  return (
    <LoginModal
      dniBusqueda={dniBusqueda}
      setDniBusqueda={setDniBusqueda}
      errorMensaje={errorMensaje}
      loading={loading}
      reservasEncontradas={reservasEncontradas}
      onBuscarReserva={handleBuscarReserva}
      onSeleccionarCheckIn={handleSeleccionarCheckIn}
      setBackdoorClicks={setBackdoorClicks}
    />
  );
}