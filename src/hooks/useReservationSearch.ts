import { useState } from "react";
import { consultarCheckInsActivosPorDni } from "../api/ReservaAPI";
import { CheckinData, CheckInsActivosResponse } from "../types";

interface SearchResult {
  success: boolean;
  showPushModal?: boolean;
  checkin?: CheckinData;
  multipleReservations?: boolean;
}

export function useReservationSearch() {
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservasEncontradas, setReservasEncontradas] = useState<CheckinData[]>([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<CheckinData | null>(null);

  const handleBuscarReserva = async (): Promise<SearchResult> => {
    if (!dniBusqueda.trim()) {
      setErrorMensaje("Ingresa tu número de documento");
      return { success: false };
    }

    setLoading(true);
    setErrorMensaje("");

    try {
      const response = await consultarCheckInsActivosPorDni(dniBusqueda.trim());
      
      if (response.status === "not_found" || !response.data || response.data.length === 0) {
        setErrorMensaje("No encontramos ninguna reserva activa con ese documento");
        return { success: false };
      }

      const reservas = response.data;
      setReservasEncontradas(reservas);

      if (reservas.length === 1) {
        // Una sola reserva - continuar con push modal
        return {
          success: true,
          showPushModal: true,
          checkin: reservas[0]
        };
      } else {
        // Múltiples reservas - mostrar selector
        return {
          success: true,
          multipleReservations: true
        };
      }
    } catch (error: any) {
      const mensaje = error.message || "Error al buscar reserva. Intenta nuevamente.";
      setErrorMensaje(mensaje);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    dniBusqueda,
    setDniBusqueda,
    errorMensaje,
    loading,
    reservasEncontradas,
    reservaSeleccionada,
    setReservaSeleccionada,
    handleBuscarReserva
  };
}