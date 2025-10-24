// src/api/MenuAPI.ts
import api from "../lib/axios";
import { MenuResponse, ChipsResponse } from "../types/MenuItem";

const isAxiosError = (error: any): boolean => {
  return error && error.isAxiosError === true;
};

/**
 * Obtener menú completo organizado por secciones
 */
export async function obtenerMenuPublico(): Promise<MenuResponse> {
  try {
    const response = await api.get<MenuResponse>('/menu/publico');
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener el menú"
      );
    } else {
      throw new Error("Error desconocido al obtener el menú");
    }
  }
}

/**
 * Obtener chips de categorías con contadores
 */
export async function obtenerMenuChips(): Promise<CategoryChip[]> {
  try {
    const response = await api.get<ChipsResponse>('/menu/chips');
    return response.data.chips;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener las categorías"
      );
    } else {
      throw new Error("Error desconocido al obtener las categorías");
    }
  }
}

/**
 * Verificar si el restaurante está abierto
 */
export async function verificarEstadoRestaurante(): Promise<{ isOpen: boolean; nextChange?: string }> {
  try {
    const response = await api.get('/restaurant/status');
    return response.data;
  } catch (error) {
    // Si falla, usar lógica local de horarios
    const now = new Date();
    const hour = now.getHours();
    const isOpen = hour >= 11 && hour < 21; // 11 AM a 9 PM
    
    return { isOpen };
  }
}