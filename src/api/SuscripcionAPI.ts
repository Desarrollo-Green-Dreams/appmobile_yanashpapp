import { ExpoPushToken } from 'expo-notifications';
import api from "../lib/axios";

// 📱 NUEVA: Función específica para app móvil
export async function guardarSuscripcionMobile(
  expoToken: string,
  propiedad?: string,
  nombre?: string,
  dni?: string
) {
  console.log('💾 Iniciando guardarSuscripcionMobile...');
  console.log('📋 Datos recibidos:', { propiedad, nombre, dni });
  console.log('🎫 Token:', expoToken?.substring(0, 30) + '...');
  
  try {
    const payload = {
      expoToken,
      propiedad,
      nombre,
      dni,
    };

    console.log('📤 Enviando payload móvil al backend:', payload);
    console.log('🌐 URL del API:', `${api.defaults.baseURL}/guardar-suscripcion-mobile`);
    
    const response = await api.post("/guardar-suscripcion-mobile", payload);
    
    console.log("✅ Respuesta del backend móvil:", response.status, response.statusText);
    console.log("📋 Datos de respuesta:", response.data);
    console.log("✅ Suscripción móvil guardada exitosamente");
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al guardar suscripción móvil:", error);
    console.error("📋 Status:", error?.response?.status);
    console.error("📋 Status text:", error?.response?.statusText);
    console.error("📋 Response data:", error?.response?.data);
    console.error("📋 Request config:", error?.config?.url);
    throw error;
  }
}

// 🌐 EXISTENTE: Función para web (mantenemos para no romper nada)
export async function guardarSuscripcion(
  token: ExpoPushToken,
  propiedad?: string,
  nombre?: string,
  dni?: string
) {
  console.log('💾 Iniciando guardarSuscripcion (web)...');
  console.log('📋 Datos recibidos:', { propiedad, nombre, dni });
  console.log('🎫 Token:', token?.data?.substring(0, 20) + '...');
  
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

    console.log('📤 Enviando payload al backend (web):', {
      ...payload,
      keys: { ...payload.keys, p256dh: payload.keys.p256dh?.substring(0, 20) + '...', auth: 'hidden' }
    });
    console.log('🌐 URL del API:', `${api.defaults.baseURL}/guardar-suscripcion`);
    
    const response = await api.post("/guardar-suscripcion", payload);
    
    console.log("✅ Respuesta del backend (web):", response.status, response.statusText);
    console.log("📋 Datos de respuesta:", response.data);
    console.log("✅ Suscripción push guardada exitosamente");
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al guardar suscripción push:", error);
    console.error("📋 Status:", error?.response?.status);
    console.error("📋 Status text:", error?.response?.statusText);
    console.error("📋 Response data:", error?.response?.data);
    console.error("📋 Request config:", error?.config?.url);
    throw error;
  }
}

// 👥 EXISTENTE: Función para staff (mantenemos igual)
export async function guardarSuscripcionStaff(token: ExpoPushToken) {
  console.log('💾 Iniciando guardarSuscripcionStaff...');
  console.log('🎫 Token staff:', token?.data?.substring(0, 20) + '...');
  
  try {
    const payload = {
      endpoint: `https://exp.host/--/api/v2/push/send`,
      keys: {
        p256dh: token.data,
        auth: token.data,
      },
    };

    console.log('📤 Enviando payload staff al backend');
    
    const response = await api.post("/guardar-suscripcion-staff", payload);
    
    console.log("✅ Suscripción staff guardada");
    console.log("📋 Respuesta:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al guardar suscripción staff:", error);
    console.error("📋 Status:", error?.response?.status);
    console.error("📋 Response data:", error?.response?.data);
    throw error;
  }
}