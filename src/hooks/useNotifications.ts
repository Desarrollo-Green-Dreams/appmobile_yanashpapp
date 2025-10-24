import { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { 
  registrarNotificacionesPush 
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

  // Configurar listeners cuando el usuario esté autenticado
  // Configurar listeners cuando el usuario esté autenticado
  useEffect(() => {
    if (!autenticado) return;

    // Solo usar los listeners que necesitas
    const notificationSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📨 Notificación recibida:", notification);

        const data = notification.request.content.data;
        if (data?.tipo === "solicitud") {
          setMostrarBadge(true);
          setSolicitudReciente(data.solicitud);
        }
      }
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("👆 Usuario tocó notificación:", response);

        const data = response.notification.request.content.data;
        if (data?.tipo === "solicitud") {
          setMostrarBadge(false);
          // TODO: Navegar a solicitudes cuando tengas esa pantalla
        }
      }
    );

    notificationListener.current = notificationSub;
    responseListener.current = responseSub;

    return () => {
      notificationSub.remove();
      responseSub.remove();
    };
  }, [autenticado]);
  // Manejar cambios de estado de la app
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
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
      console.warn("Datos incompletos para registrar notificaciones");
      return null;
    }

    try {
      const token = await registrarNotificacionesPush(propiedad, nombre, dni);
      setPushToken(token);
      return token;
    } catch (error) {
      console.error("Error al registrar notificaciones:", error);
      throw error;
    }
  };


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
