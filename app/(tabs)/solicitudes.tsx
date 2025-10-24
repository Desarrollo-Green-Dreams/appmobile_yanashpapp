import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';

import { obtenerSolicitudes, actualizarSolicitud } from "../../src/api/SolicitudesAPI";

interface Solicitud {
  _id: string;
  tipo: string;
  items: string[];
  observaciones: string;
  estado: "enviada" | "revisada" | "atendida" | "cancelada";
  mensajeRevisado?: string;
  mensajeAtendido?: string;
  calificacion?: number;
  createdAt: string;
  propiedad: string;
  nombre: string;
  calificacionIntentos: number;
}

export default function SolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [verAtendidas, setVerAtendidas] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [datosReserva, setDatosReserva] = useState<any>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    loadDatosReserva();
  }, []);

  // Cargar solicitudes cuando se cargan los datos de reserva
  useEffect(() => {
    if (datosReserva.propiedad && datosReserva.nombre) {
      fetchSolicitudes();
    }
  }, [datosReserva.propiedad, datosReserva.nombre]);

  // Configurar Socket.io
  useEffect(() => {
    if (!datosReserva.propiedad) return;

    console.log('Conectando socket para propiedad:', datosReserva.propiedad);
    
    // Usar la variable de entorno que ya configuraste
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;
    
    console.log('Conectando a:', socketUrl);
    
    // Crear conexión socket con configuración para React Native
    const newSocket = io(socketUrl, {
      query: { propiedad: datosReserva.propiedad },
      transports: ['polling', 'websocket'], // polling primero para RN
      timeout: 20000,
      forceNew: true,
      autoConnect: true
    });

    // Listeners de eventos
    newSocket.on('connect', () => {
      console.log('Socket conectado:', newSocket.id);
      console.log('Conectado a room de propiedad:', datosReserva.propiedad);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket desconectado. Razón:', reason);
    });

    newSocket.on('nueva-solicitud', (nueva: Solicitud) => {
      console.log('Nueva solicitud recibida via socket:', nueva);
      if (nueva.nombre === datosReserva?.nombre && nueva.propiedad === datosReserva?.propiedad) {
        setSolicitudes((prev) => {
          // Evitar duplicados
          const existe = prev.find(s => s._id === nueva._id);
          if (existe) {
            console.log('Solicitud ya existe, no agregando duplicado');
            return prev;
          }
          console.log('Agregando nueva solicitud a la lista');
          return [nueva, ...prev];
        });
      }
    });

    newSocket.on('solicitud-actualizada', (actualizada: Solicitud) => {
      console.log('Solicitud actualizada via socket:', actualizada);
      if (actualizada.nombre === datosReserva?.nombre && actualizada.propiedad === datosReserva?.propiedad) {
        setSolicitudes((prev) => {
          const updated = prev.map((s) => (s._id === actualizada._id ? { ...s, ...actualizada } : s));
          console.log('Lista de solicitudes actualizada');
          return updated;
        });
      } else {
        console.log('Solicitud actualizada no es para este usuario');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión socket:', error.message);
      console.error('Detalles del error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('Error en socket:', error);
    });

    setSocket(newSocket);

    // Cleanup al desmontar
    return () => {
      console.log('Desconectando socket');
      newSocket.disconnect();
      setSocket(null);
    };
  }, [datosReserva.propiedad, datosReserva.nombre]);

  // Cleanup al salir de la pantalla
  useFocusEffect(
    React.useCallback(() => {
      // Al entrar en focus, recargar solicitudes
      if (datosReserva.propiedad && datosReserva.nombre) {
        fetchSolicitudes();
      }

      // Al salir de focus, no hacer nada especial
      return () => {
        // Mantener el socket activo
      };
    }, [datosReserva.propiedad, datosReserva.nombre])
  );

  const loadDatosReserva = async () => {
    try {
      const datos = await AsyncStorage.getItem("datosReserva");
      if (datos) {
        setDatosReserva(JSON.parse(datos));
      }
    } catch (error) {
      console.error('Error loading datos reserva:', error);
    }
  };

  const fetchSolicitudes = async () => {
    try {
      console.log('Fetching solicitudes for:', datosReserva.propiedad, datosReserva.nombre);
      
      const todas = await obtenerSolicitudes();
      console.log('Total solicitudes received:', todas.length);
      
      const filtradas = todas.filter(
        (s: Solicitud) =>
          s.propiedad === datosReserva?.propiedad && s.nombre === datosReserva?.nombre
      );
      
      console.log('Filtered solicitudes:', filtradas.length);
      setSolicitudes(filtradas);
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      Alert.alert("Error", "No se pudieron cargar las solicitudes");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSolicitudes();
    setRefreshing(false);
  };

  const enviarCalificacion = async (nota: number, solicitud: Solicitud) => {
    try {
      await actualizarSolicitud(solicitud._id, { calificacion: nota });
      
      // Actualizar estado local
      setSolicitudes((prev) =>
        prev.map((s) =>
          s._id === solicitud._id ? { ...s, calificacion: nota } : s
        )
      );
      
      Alert.alert("Gracias", "Tu calificación ha sido enviada");
    } catch (err: any) {
      Alert.alert("Error", "No se pudo enviar la calificación");
    }
  };

  const cancelarSolicitud = async (solicitudId: string) => {
    Alert.alert(
      "Cancelar solicitud",
      "¿Estás seguro de que quieres cancelar esta solicitud?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await actualizarSolicitud(solicitudId, { estado: "cancelada" });
              setSolicitudes((prev) =>
                prev.map((s) =>
                  s._id === solicitudId ? { ...s, estado: "cancelada" } : s
                )
              );
              Alert.alert("Solicitud cancelada", "Tu solicitud ha sido cancelada");
            } catch (error) {
              Alert.alert("Error", "No se pudo cancelar la solicitud");
            }
          },
        },
      ]
    );
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/51916598443?text=${encodeURIComponent("Necesito ayuda con mi solicitud")}`;
    Linking.openURL(url);
  };

  const solicitudesFiltradas = verAtendidas
    ? solicitudes
    : solicitudes.filter(
        (s) =>
          !(s.estado === "atendida" && s.calificacion !== undefined) &&
          s.estado !== "cancelada"
      );

  const formatearTipoSolicitud = (tipo: string) => {
    switch (tipo) {
      case "LateCheckout":
        return "Late Check-out";
      case "Amenidades":
        return "Amenidades";
      case "Minibar":
        return "Minibar";
      case "Movilidad":
        return "Movilidad";
      default:
        return tipo;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "enviada":
        return "bg-yellow-100 text-yellow-800";
      case "revisada":
        return "bg-blue-100 text-blue-800";
      case "atendida":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "enviada":
        return "Pendiente";
      case "revisada":
        return "Revisada";
      case "atendida":
        return "Atendida";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  return (
    <View className="flex-1 bg-[#f6f0e9]">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-[#F36C3F]">
            Mis Solicitudes
          </Text>
          
          <TouchableOpacity
            onPress={() => setVerAtendidas(!verAtendidas)}
            className="bg-[#F36C3F] px-4 py-2 rounded-xl"
          >
            <Text className="text-white text-sm font-semibold">
              {verAtendidas ? "Ocultar atendidas" : "Ver todas"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {solicitudesFiltradas.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="document-outline" size={64} color="#7d6f63" />
            <Text className="text-[#7d6f63] text-center mt-4 text-lg">
              {verAtendidas
                ? "Aún no has enviado ninguna solicitud"
                : "No hay solicitudes pendientes"}
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {solicitudesFiltradas.map((solicitud) => (
              <View
                key={solicitud._id}
                className="bg-white/80 border border-[#e5dfd8] rounded-2xl p-4 shadow-sm"
              >
                {/* Header de la solicitud */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#17332a] mb-1">
                      {formatearTipoSolicitud(solicitud.tipo)}
                    </Text>
                    <Text className="text-xs text-[#7d6f63]">
                      {new Date(solicitud.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center space-x-2">
                    <View className={`px-3 py-1 rounded-full ${getEstadoColor(solicitud.estado)}`}>
                      <Text className="text-xs font-semibold">
                        {getEstadoTexto(solicitud.estado)}
                      </Text>
                    </View>
                    
                    {solicitud.estado === "cancelada" && (
                      <TouchableOpacity
                        onPress={openWhatsApp}
                        className="w-8 h-8 bg-[#25D366] rounded-full items-center justify-center"
                      >
                        <Ionicons name="logo-whatsapp" size={16} color="white" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Detalles de la solicitud */}
                {solicitud.tipo === "Movilidad" && solicitud.items.length >= 3 ? (
                  <Text className="text-sm text-[#4d6359] mb-2">
                    <Text className="font-semibold">Horario: </Text>
                    {`${solicitud.items[1]?.replace("Horario: ", "")}, ${solicitud.items[2]?.replace("Recojo en: ", "")}`}
                  </Text>
                ) : solicitud.tipo !== "LateCheckout" ? (
                  <Text className="text-sm text-[#4d6359] mb-2">
                    <Text className="font-semibold">Ítems: </Text>
                    {solicitud.items.join(", ")}
                  </Text>
                ) : null}

                {solicitud.observaciones && (
                  <Text className="text-sm text-[#4d6359] mb-2">
                    <Text className="font-semibold">Observaciones: </Text>
                    {solicitud.observaciones}
                  </Text>
                )}

                {/* Estados específicos */}
                {solicitud.estado === "revisada" && (
                  <View className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg mt-2">
                    <Text className="text-sm text-blue-900">
                      Tu solicitud se está revisando.
                    </Text>
                  </View>
                )}

                {solicitud.estado === "atendida" && solicitud.mensajeAtendido && (
                  <View className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg mt-2">
                    <Text className="text-sm text-green-900">
                      <Text className="font-semibold">Host: </Text>
                      {solicitud.mensajeAtendido}
                    </Text>
                  </View>
                )}

                {solicitud.estado === "cancelada" && solicitud.mensajeRevisado && (
                  <View className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mt-2">
                    <Text className="text-sm text-red-900">
                      <Text className="font-semibold">Host: </Text>
                      {solicitud.mensajeRevisado}
                    </Text>
                  </View>
                )}

                {/* Botones de acción */}
                {(solicitud.estado === "enviada" || solicitud.estado === "revisada") && (
                  <TouchableOpacity
                    onPress={() => cancelarSolicitud(solicitud._id)}
                    className="bg-red-50 border border-red-300 rounded-xl py-2 px-4 mt-3"
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="close-circle-outline" size={16} color="#dc2626" />
                      <Text className="text-red-700 font-semibold text-sm ml-2">
                        Cancelar solicitud
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Calificación */}
                {solicitud.estado === "atendida" && (
                  <View className="mt-4 pt-4 border-t border-[#e5dfd8]">
                    {(() => {
                      const MAX_INTENTOS = 2;
                      const yaNoPuedeCambiar =
                        solicitud.calificacion !== undefined && 
                        solicitud.calificacionIntentos >= MAX_INTENTOS;

                      if (yaNoPuedeCambiar) {
                        return (
                          <Text className="text-sm text-[#4d6359] text-center">
                            ¡Gracias por tu calificación!
                          </Text>
                        );
                      }

                      const textoPregunta = solicitud.calificacion !== undefined
                        ? "¿Deseas cambiar tu calificación?"
                        : "¿Cómo calificarías la atención que recibiste?";

                      return (
                        <>
                          <Text className="text-sm text-[#4d6359] text-center mb-3">
                            {textoPregunta}
                          </Text>
                          <View className="flex-row justify-center space-x-6">
                            <TouchableOpacity
                              onPress={() => enviarCalificacion(5, solicitud)}
                              className={`w-12 h-12 rounded-full items-center justify-center ${
                                solicitud.calificacion === 5
                                  ? "bg-green-600"
                                  : "bg-green-100"
                              }`}
                            >
                              <Ionicons 
                                name="thumbs-up" 
                                size={20} 
                                color={solicitud.calificacion === 5 ? "white" : "#16a34a"} 
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => enviarCalificacion(1, solicitud)}
                              className={`w-12 h-12 rounded-full items-center justify-center ${
                                solicitud.calificacion === 1
                                  ? "bg-red-600"
                                  : "bg-red-100"
                              }`}
                            >
                              <Ionicons 
                                name="thumbs-down" 
                                size={20} 
                                color={solicitud.calificacion === 1 ? "white" : "#dc2626"} 
                              />
                            </TouchableOpacity>
                          </View>
                        </>
                      );
                    })()}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}