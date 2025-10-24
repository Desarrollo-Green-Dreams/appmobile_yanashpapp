import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { guardarSuscripcion, guardarSuscripcionStaff } from '../api/SuscripcionAPI';

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
  // En desarrollo con Expo Go, no funciona - solo simular
  if (__DEV__ && !Constants.appOwnership) {
    console.warn('Push notifications no funcionan en Expo Go. Simulando registro...');
    console.log('En build final funcionará correctamente');
    return 'simulado-en-desarrollo';
  }

  // Verificar que es un dispositivo físico
  if (!Device.isDevice) {
    console.warn('Las push notifications solo funcionan en dispositivos físicos');
    return null;
  }

  // Verificar permisos existentes
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  // Si no tiene permisos, pedirlos
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Usuario no concedió permisos para notificaciones');
    return null;
  }

  try {
    // En standalone app, esto funcionará correctamente
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    console.log('Token de push obtenido:', token.data);

    // Guardar en el backend
    if (propiedad && nombre && dni) {
      await guardarSuscripcion(token, propiedad, nombre, dni);
    }

    return token.data;
  } catch (error) {
    console.error('Error al registrar notificaciones push:', error);
    throw error;
  }
}

export async function registrarNotificacionesStaff(): Promise<string | null> {
  // En desarrollo con Expo Go, no funciona
  if (__DEV__ && !Constants.appOwnership) {
    console.warn('Push notifications no funcionan en Expo Go para staff');
    return 'simulado-staff-desarrollo';
  }

  if (!Device.isDevice) {
    console.warn('Las push notifications solo funcionan en dispositivos físicos');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Usuario no concedió permisos para notificaciones');
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    console.log('Token de push staff obtenido:', token.data);

    await guardarSuscripcionStaff(token);
    return token.data;
  } catch (error) {
    console.error('Error al registrar notificaciones staff:', error);
    throw error;
  }
}

// Configurar listeners para notificaciones
export function configurarListeners() {
  // Listener para cuando se recibe una notificación mientras la app está en foreground
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notificación recibida:', notification);
  });

  // Listener para cuando el usuario toca una notificación
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Usuario tocó notificación:', response);
    
    // Aquí puedes navegar a una pantalla específica basada en la notificación
    const data = response.notification.request.content.data;
    if (data?.url) {
      // Manejar navegación basada en la URL
      console.log('Navegar a:', data.url);
    }
  });

  return {
    notificationListener,
    responseListener,
  };
}

// Función para limpiar listeners - CORREGIDA
export function limpiarListeners(listeners: { 
  notificationListener: Notifications.Subscription;
  responseListener: Notifications.Subscription;
}) {
  listeners.notificationListener.remove();
  listeners.responseListener.remove();
}

// Configuración específica para Android
export async function configurarAndroid() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F36C3F',
      sound: true,
    });

    // Canal específico para solicitudes
    await Notifications.setNotificationChannelAsync('solicitudes', {
      name: 'Solicitudes',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F36C3F',
      sound: true,
      description: 'Notificaciones sobre el estado de tus solicitudes',
    });
  }
}