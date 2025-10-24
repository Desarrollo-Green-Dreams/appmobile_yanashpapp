// src/api/ToppingsAPI.ts
import api from "../lib/axios";

export type ToppingType = "cream" | "flavor" | "garnish" | "sauce";

export interface Topping {
  _id: string;
  name: string;
  slug: string;
  type: ToppingType;
  priceDelta: number; // precio adicional (puede ser 0)
  available: boolean;
  maxQuantity?: number; // máximo por producto
  description?: string;
  imageUrl?: string;
}

export interface ToppingsResponse {
  success: boolean;
  toppings: Topping[];
  total: number;
}

const isAxiosError = (error: any): boolean => {
  return error && error.isAxiosError === true;
};

/**
 * Listar toppings por tipo
 */
export async function listarToppings(params: {
  type?: ToppingType;
  available?: boolean;
  limit?: number;
}): Promise<Topping[]> {
  try {
    const response = await api.get<ToppingsResponse>('/toppings', { params });
    return response.data.toppings;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener toppings"
      );
    } else {
      throw new Error("Error desconocido al obtener toppings");
    }
  }
}

/**
 * Obtener toppings específicos por IDs
 */
export async function obtenerToppingsPorIds(ids: string[]): Promise<Topping[]> {
  try {
    const response = await api.post<ToppingsResponse>('/toppings/by-ids', { ids });
    return response.data.toppings;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al obtener toppings específicos"
      );
    } else {
      throw new Error("Error desconocido al obtener toppings específicos");
    }
  }
}