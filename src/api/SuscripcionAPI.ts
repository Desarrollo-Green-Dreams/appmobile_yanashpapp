import { ExpoPushToken } from 'expo-notifications';
import api from "../lib/axios";

export async function guardarSuscripcion(
  token: ExpoPushToken,
  propiedad?: string,
  nombre?: string,
  dni?: string
) {
  try {
    const payload = {
      endpoint: `https://exp.host/--/api/v2/push/send`,
      keys: {
        p256dh: token.data, // En Expo, usamos el token directamente
        auth: token.data,
      },
      propiedad,
      nombre,
      dni,
    };

    await api.post("/guardar-suscripcion", payload);
    console.log("✅ Suscripción push guardada", payload);
  } catch (error) {
    console.error("❌ Error al guardar suscripción push", error);
    throw error;
  }
}

export async function guardarSuscripcionStaff(token: ExpoPushToken) {
  try {
    const payload = {
      endpoint: `https://exp.host/--/api/v2/push/send`,
      keys: {
        p256dh: token.data,
        auth: token.data,
      },
    };

    await api.post("/guardar-suscripcion-staff", payload);
    console.log("✅ Suscripción staff guardada");
  } catch (error) {
    console.error("❌ Error al guardar suscripción staff:", error);
    throw error;
  }
}