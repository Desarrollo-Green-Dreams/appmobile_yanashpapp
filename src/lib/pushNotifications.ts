// src/lib/pushNotifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { guardarSuscripcion, guardarSuscripcionStaff, guardarSuscripcionMobile } from '../api/SuscripcionAPI';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registrarNotificacionesPush(
  propiedad?: string,
  nombre?: string,
  dni?: string
): Promise<string | null> {
  console.log('🔧 Iniciando registrarNotificacionesPush...');
  console.log('📋 Parámetros recibidos:', { propiedad, nombre, dni });
  console.log('🏗️ __DEV__:', __DEV__);
  console.log('📱 Constants.appOwnership:', Constants.appOwnership);
  console.log('📱 Device.isDevice:', Device.isDevice);

  // 🔧 CAMBIO: solo advertir pero NO salir en desarrollo
  if (__DEV__ && !Constants.appOwnership) {
    console.warn('⚠️ Push notifications pueden no funcionar en Expo Go');
    console.log('💡 Para testing real, usa "expo run:android" o build de desarrollo');
    // NO RETORNAR AQUÍ - continuar con el flujo real
  }

  // Verificar que es un dispositivo físico
  if (!Device.isDevice) {
    console.warn('⚠️ Las push notifications solo funcionan en dispositivos físicos');
    return null;
  }

  console.log('🔐 Verificando permisos...');
  // Verificar permisos existentes
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('📋 Estado de permisos existente:', existingStatus);
  let finalStatus = existingStatus;
  
  // Si no tiene permisos, pedirlos
  if (existingStatus !== 'granted') {
    console.log('🙋‍♂️ Solicitando permisos...');
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log('📋 Estado final de permisos:', finalStatus);
  }
  
  if (finalStatus !== 'granted') {
    console.warn('❌ Usuario no concedió permisos para notificaciones');
    return null;
  }

  try {
    console.log('🎫 Obteniendo token de Expo...');
    console.log('🏗️ Project ID:', Constants.expoConfig?.extra?.eas?.projectId);
    
    // Esto debería funcionar incluso en desarrollo con Expo Go
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    console.log('✅ Token de push obtenido:', token.data);

    // 🔧 CAMBIO: usar la función específica para móviles
    if (propiedad && nombre && dni) {
      console.log('💾 Guardando suscripción móvil en backend...');
      await guardarSuscripcionMobile({
        dni,
        nombre,
        propiedad,
        expoToken: token.data
      });
      console.log('✅ Suscripción móvil guardada exitosamente en backend');
    } else {
      console.warn('⚠️ Faltan datos para guardar suscripción:', { propiedad, nombre, dni });
    }

    return token.data;
  } catch (error) {
    console.error('❌ Error al registrar notificaciones push:', error);
    console.error('📋 Stack trace:', error?.stack);
    
    // 🔧 FALLBACK: si falla, solo simular en desarrollo extremo
    if (__DEV__ && !Constants.appOwnership) {
      console.log('🎭 Fallback: simulando solo porque falló el token real');
      return 'dev-simulation-fallback';
    }
    
    throw error;
  }
}