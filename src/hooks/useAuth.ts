import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthPublic = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [propiedad, setPropiedad] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const datos = await AsyncStorage.getItem("datosReserva");
        if (!datos) {
          setAutenticado(false);
          return;
        }

        const d = JSON.parse(datos);
        const isValid = !!d.checkIn && !!d.checkOut;
        
        setAutenticado(isValid);
        setNombre(d.nombre || "");
        setPropiedad(d.propiedad || "");
      } catch (error) {
        console.warn("Error al parsear datosReserva:", error);
        setAutenticado(false);
      }
    };

    checkAuth();
  }, []);

  const validarReservaVigente = async () => {
    try {
      const datosRaw = await AsyncStorage.getItem("datosReserva");
      const datos = JSON.parse(datosRaw || "{}");

      const [d1, m1, y1] = (datos.checkIn || "").split("/").map(Number);
      const [d2, m2, y2] = (datos.checkOut || "").split("/").map(Number);

      if (!d1 || !m1 || !y1 || !d2 || !m2 || !y2) {
        await AsyncStorage.removeItem("datosReserva");
        setAutenticado(false);
        return;
      }

      const ahora = new Date();
      const ahoraUTC = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
      const ahoraLima = new Date(ahoraUTC - 5 * 60 * 60 * 1000);

      const checkInLima = new Date(y1, m1 - 1, d1, 15, 0, 0);
      const checkOutLima = new Date(y2, m2 - 1, d2, 12, 0, 0);

      const enRango = ahoraLima >= checkInLima && ahoraLima <= checkOutLima;

      if (enRango) {
        setAutenticado(true);
      } else {
        await AsyncStorage.removeItem("datosReserva");
        setAutenticado(false);
      }
    } catch (err) {
      await AsyncStorage.removeItem("datosReserva");
      setAutenticado(false);
    }
  };

  return {
    autenticado,
    setAutenticado,
    nombre,
    setNombre,
    propiedad,
    setPropiedad,
    validarReservaVigente
  };
};