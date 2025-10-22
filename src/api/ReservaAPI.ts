import api from "../lib/axios";
import { CheckInsActivosResponse } from "../types";

const isAxiosError = (error: any): boolean => {
  return error && error.response && error.config;
};

export async function consultarCheckInsActivosPorDni(
  dni: string
): Promise<CheckInsActivosResponse> {
  try {
    const response = await api.get<CheckInsActivosResponse>(`/reserva/checkins-activos/${dni}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al consultar check-ins activos"
      );
    } else {
      throw new Error("Error desconocido al consultar check-ins activos");
    }
  }
}