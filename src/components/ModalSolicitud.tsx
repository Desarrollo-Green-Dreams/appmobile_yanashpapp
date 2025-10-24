import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { crearSolicitud, obtenerHorariosOcupadosMovilidad } from '../api/SolicitudesAPI';
import { DatosReserva } from '../types';

interface ModalSolicitudProps {
  visible: boolean;
  tipo: "Amenidades" | "Minibar" | "Movilidad" | "LateCheckout" | "Emergencia" | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const opcionesPorTipo: Record<string, string[]> = {
  Amenidades: ["Shampoo", "Jabón", "Papel Higiénico", "Toallas"],
  Minibar: [
    "Barra de granola",
    "Agua (con gas / sin gas)",
    "Gaseosas (Coca Cola / Inka Cola)",
    "Barra de cereal",
    "Bebidas regionales",
    "Chocolate",
    "Vino",
  ],
  Movilidad: ["Personalizado"],
  LateCheckout: ["Late Checkout solicitado"],
  Emergencia: [
    "Falla en servicios",
    "Riesgo de seguridad",
    "Emergencia de salud",
    "Riesgo por fauna",
    "Problema de acceso",
  ],
};

const horariosDisponibles = [
  "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
  "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00",
  "13:00 - 13:30", "13:30 - 14:00", "14:00 - 14:30", "14:30 - 15:00",
  "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30", "16:30 - 17:00",
  "17:00 - 17:30", "17:30 - 18:00", "18:00 - 18:30", "18:30 - 19:00",
  "19:00 - 19:30", "19:30 - 20:00", "20:00 - 20:30", "20:30 - 21:00",
];

export default function ModalSolicitud({ visible, tipo, onClose, onSuccess }: ModalSolicitudProps) {
  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [enviando, setEnviando] = useState(false);
  
  // Para Movilidad
  const [horaMovilidad, setHoraMovilidad] = useState("");
  const [lugarRecojo, setLugarRecojo] = useState("");
  const [lugarRecojoOtra, setLugarRecojoOtra] = useState("");
  const [pax, setPax] = useState<number | "">("");
  const [slotsOcupados, setSlotsOcupados] = useState<string[]>([]);

  // Para Late Checkout
  const [opcionLateCheckout, setOpcionLateCheckout] = useState("");

  const [datosReserva, setDatosReserva] = useState<DatosReserva>({
    nombre: "",
    correo: "",
    telefono: "",
    propiedad: "",
    checkIn: "",
    checkOut: "",
    dniPasaporte: "",
  });

  useEffect(() => {
    if (visible && tipo) {
      loadDatosReserva();
      resetForm();
      
      if (tipo === "LateCheckout") {
        setItemsSeleccionados(["Late Checkout solicitado"]);
      } else if (tipo === "Movilidad") {
        setItemsSeleccionados(["Personalizado"]);
        loadHorariosOcupados();
      }
    }
  }, [visible, tipo]);

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

  const loadHorariosOcupados = async () => {
    try {
      const hoyISO = new Date().toISOString().slice(0, 10);
      const ocupados = await obtenerHorariosOcupadosMovilidad(hoyISO);
      setSlotsOcupados(ocupados);
    } catch (error) {
      console.error('Error loading horarios ocupados:', error);
    }
  };

  const resetForm = () => {
    setItemsSeleccionados([]);
    setObservaciones("");
    setHoraMovilidad("");
    setLugarRecojo("");
    setLugarRecojoOtra("");
    setPax("");
    setOpcionLateCheckout("");
  };

  const handleCheckboxChange = (item: string) => {
    if (tipo === "Movilidad" || tipo === "LateCheckout") {
      setItemsSeleccionados([item]);
    } else {
      setItemsSeleccionados((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  const rangoPasado = (rango: string) => {
    const [ini, fin] = rango.split(" - ").map(s => s.trim());
    const [hf, mf] = fin.split(":").map(Number);
    const ahora = new Date();
    const corte = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      hf, mf
    );
    return ahora >= corte;
  };

  const handleSubmit = async () => {
    if (itemsSeleccionados.length === 0) {
      Alert.alert("Error", "Selecciona al menos un ítem.");
      return;
    }

    if (tipo === "Movilidad" && (!horaMovilidad || !lugarRecojo || !pax)) {
      Alert.alert("Error", "Completa todos los campos requeridos para movilidad.");
      return;
    }

    const payload = {
      nombre: datosReserva.nombre,
      dni: datosReserva.dniPasaporte,
      propiedad: datosReserva.propiedad,
      telefono: datosReserva.telefono,
      tipo,
      items: tipo === "Movilidad" ? [
        ...itemsSeleccionados,
        `Horario: ${horaMovilidad}`,
        `Recojo en: ${lugarRecojo === "Otra" ? lugarRecojoOtra : lugarRecojo}`,
        `Pasajeros: ${pax}`,
      ] : itemsSeleccionados,
      observaciones,
      hora: new Date(),
    };

    try {
      setEnviando(true);
      await crearSolicitud(payload);
      
      Alert.alert("Éxito", "Solicitud enviada correctamente", [
        { text: "OK", onPress: () => {
          onSuccess?.();
          onClose();
        }}
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo enviar la solicitud");
    } finally {
      setEnviando(false);
    }
  };

  if (!tipo) return null;

  const etiquetasPorTipo: Record<string, string> = {
    Amenidades: "Solicitud de Amenidades",
    Minibar: "Solicitud de Minibar",
    Movilidad: "Solicitar Movilidad Interna",
    LateCheckout: "Solicitud de Late Check-out",
    Emergencia: "¿Cuál es tu emergencia?",
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'flex-end',
        paddingTop: 50 
      }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '90%',
          minHeight: '60%'
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#F36C3F',
              flex: 1,
              textAlign: 'center'
            }}>
              {etiquetasPorTipo[tipo]}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#F36C3F" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1, padding: 24 }} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            
            {/* Opciones generales */}
            {tipo !== "Movilidad" && tipo !== "LateCheckout" && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#17332a', marginBottom: 12 }}>
                  Selecciona los ítems:
                </Text>
                {opcionesPorTipo[tipo]?.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => handleCheckboxChange(item)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      marginBottom: 8,
                      backgroundColor: '#f9fafb',
                      borderRadius: 12
                    }}
                  >
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 2,
                      marginRight: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: itemsSeleccionados.includes(item) ? '#F36C3F' : 'transparent',
                      borderColor: itemsSeleccionados.includes(item) ? '#F36C3F' : '#d1d5db'
                    }}>
                      {itemsSeleccionados.includes(item) && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                    <Text style={{ color: '#17332a', flex: 1 }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Movilidad específico */}
            {tipo === "Movilidad" && (
              <View style={{ marginBottom: 24 }}>
                {/* Horario */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#17332a', marginBottom: 8 }}>
                    Horario:
                  </Text>
                  <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12 }}>
                    <Picker
                      selectedValue={horaMovilidad}
                      onValueChange={setHoraMovilidad}
                      style={{ height: 50 }}
                    >
                      <Picker.Item label="Selecciona un horario" value="" />
                      {horariosDisponibles
                        .filter(rango => !rangoPasado(rango))
                        .map(rango => {
                          const [horaInicio] = rango.split(" - ");
                          const ocupado = slotsOcupados.includes(horaInicio);
                          return (
                            <Picker.Item
                              key={rango}
                              label={`${rango} ${ocupado ? "(Reservado)" : ""}`}
                              value={rango}
                              enabled={!ocupado}
                            />
                          );
                        })}
                    </Picker>
                  </View>
                </View>

                {/* Lugar de recojo */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#17332a', marginBottom: 8 }}>
                    Lugar de recojo:
                  </Text>
                  <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12 }}>
                    <Picker
                      selectedValue={lugarRecojo}
                      onValueChange={setLugarRecojo}
                      style={{ height: 50 }}
                    >
                      <Picker.Item label="Selecciona lugar" value="" />
                      <Picker.Item label="Mi Alojamiento" value="Propiedad" />
                      <Picker.Item label="Club House" value="Restaurante" />
                      <Picker.Item label="Otra ubicación" value="Otra" />
                    </Picker>
                  </View>
                </View>

                {lugarRecojo === "Otra" && (
                  <View style={{ marginBottom: 16 }}>
                    <TextInput
                      value={lugarRecojoOtra}
                      onChangeText={setLugarRecojoOtra}
                      placeholder="Especifica el lugar de recojo"
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 12,
                        padding: 12,
                        color: '#17332a'
                      }}
                    />
                  </View>
                )}

                {/* Número de pasajeros */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#17332a', marginBottom: 8 }}>
                    Número de personas:
                  </Text>
                  <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12 }}>
                    <Picker
                      selectedValue={pax}
                      onValueChange={setPax}
                      style={{ height: 50 }}
                    >
                      <Picker.Item label="Selecciona cantidad" value="" />
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                        <Picker.Item key={n} label={`${n}`} value={n} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <Text style={{ fontSize: 12, color: '#7d6f63', marginBottom: 16 }}>
                  * El tiempo puede variar según la demanda. Consulta a tu host para más información.
                </Text>
              </View>
            )}

            {/* Late Checkout específico */}
            {tipo === "LateCheckout" && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#17332a', marginBottom: 12 }}>
                  Horario de salida deseado:
                </Text>
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setOpcionLateCheckout("13:00");
                      setItemsSeleccionados(["Late Check-out hasta las 13:00"]);
                    }}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: opcionLateCheckout === "13:00" ? '#F36C3F' : '#e5e7eb',
                      backgroundColor: opcionLateCheckout === "13:00" ? 'rgba(243, 108, 63, 0.1)' : '#f9fafb'
                    }}
                  >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#17332a' }}>
                      13:00
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#7d6f63', marginTop: 4 }}>
                      Sin costo
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => {
                      setOpcionLateCheckout("16:00");
                      setItemsSeleccionados(["Late Check-out hasta las 16:00"]);
                    }}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: opcionLateCheckout === "16:00" ? '#F36C3F' : '#e5e7eb',
                      backgroundColor: opcionLateCheckout === "16:00" ? 'rgba(243, 108, 63, 0.1)' : '#f9fafb'
                    }}
                  >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#17332a' }}>
                      16:00
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#F36C3F', marginTop: 4 }}>
                      Tarifa extra
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Observaciones */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#17332a', marginBottom: 8 }}>
                Observaciones (opcional):
              </Text>
              <TextInput
                value={observaciones}
                onChangeText={setObservaciones}
                placeholder="Agrega cualquier detalle adicional..."
                multiline
                numberOfLines={3}
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 12,
                  padding: 12,
                  color: '#17332a',
                  minHeight: 80,
                  textAlignVertical: 'top'
                }}
              />
            </View>

          </ScrollView>

          {/* Footer */}
          <View style={{
            padding: 24,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            backgroundColor: 'white'
          }}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={enviando || itemsSeleccionados.length === 0}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: (enviando || itemsSeleccionados.length === 0) ? '#d1d5db' : '#F36C3F'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {enviando && (
                  <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
                )}
                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                  {enviando ? 'Enviando...' : 'Enviar Solicitud'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}