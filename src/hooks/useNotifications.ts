import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { 
  registrarNotificacionesPush, 
  configurarListeners, 
  limpiarListeners, 
  configurarAndroid 
} from '../lib/pushNotifications';

export function useNotifications(
  autenticado: boolean,
  propiedad?: string,
  nombre?: string,
  dni?: string
) {
  const [mostrarModalPush, setMostrarModalPush] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [mostrarBadge, setMostrarBadge] = useState(false);
  const [solicitudReciente, setSolicitudReciente] = useState<any>(null);
  
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const appState = useRef(AppState.currentState);

  // Configurar Android al inicializar
  useEffect(() => {
    configurarAndroid();
  }, []);

  // Configurar listeners cuando el usuario esté autenticado
  useEffect(() => {
    if (!autenticado) return;

    const listeners = configurarListeners();
    notificationListener.current = listeners.notificationListener;
    responseListener.current = listeners.responseListener;

    // Listener personalizado para notificaciones recibidas
    const customNotificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
      
      // Si la notificación es sobre solicitudes, mostrar badge
      const data = notification.request.content.data;
      if (data?.tipo === 'solicitud') {
        setMostrarBadge(true);
        setSolicitudReciente(data.solicitud);
      }
    });

    // Listener para cuando se toca la notificación
    const customResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario tocó notificación:', response);
      
      const data = response.notification.request.content.data;
      if (data?.tipo === 'solicitud') {
        // Navegar a la pantalla de solicitudes
        // router.push('/(tabs)/solicitudes');
        setMostrarBadge(false);
      }
    });

    // Cleanup
    return () => {
      customNotificationListener.remove();
      customResponseListener.remove();
    };
  }, [autenticado]);

  // Manejar cambios de estado de la app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App volvió al foreground, quitar badge si estaba
        setMostrarBadge(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Registrar para push notifications
  const registrarNotificaciones = async () => {
    if (!autenticado || !propiedad || !nombre || !dni) {
      console.warn('Datos incompletos para registrar notificaciones');
      return null;
    }

    try {
      const token = await registrarNotificacionesPush(propiedad, nombre, dni);
      setPushToken(token);
      return token;
    } catch (error) {
      console.error('Error al registrar notificaciones:', error);
      throw error;
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (notificationListener.current && responseListener.current) {
        limpiarListeners({
          notificationListener: notificationListener.current,
          responseListener: responseListener.current,
        });
      }
    };
  }, []);

  return {
    mostrarModalPush,
    setMostrarModalPush,
    pushToken,
    setPushToken,
    mostrarBadge,
    setMostrarBadge,
    solicitudReciente,
    setSolicitudReciente,
    registrarNotificaciones,
  };
}