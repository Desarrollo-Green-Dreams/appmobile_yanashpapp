import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PushNotificationModalProps {
  visible: boolean;
  onAccept: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function PushNotificationModal({ 
  visible, 
  onAccept, 
  onSkip, 
  onClose 
}: PushNotificationModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20 
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 24,
          width: '100%',
          maxWidth: 340,
          alignItems: 'center'
        }}>
          {/* Header con botón de cerrar */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#f3f4f6',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Icono principal */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#fef3e2',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <Ionicons name="notifications" size={40} color="#F36C3F" />
          </View>

          {/* Título */}
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#17332a',
            textAlign: 'center',
            marginBottom: 12
          }}>
            Mantente actualizado
          </Text>

          {/* Descripción */}
          <Text style={{
            fontSize: 16,
            color: '#7d6f63',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 24
          }}>
            Recibe notificaciones cuando el estado de tus solicitudes cambie.
          </Text>

          {/* Beneficios */}
          <View style={{ width: '100%', marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#dcfce7',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="checkmark" size={14} color="#16a34a" />
              </View>
              <Text style={{ fontSize: 14, color: '#17332a', flex: 1 }}>
                Actualizaciones instantáneas
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#dcfce7',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="checkmark" size={14} color="#16a34a" />
              </View>
              <Text style={{ fontSize: 14, color: '#17332a', flex: 1 }}>
                Sin necesidad de recargar la app
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#dcfce7',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="checkmark" size={14} color="#16a34a" />
              </View>
              <Text style={{ fontSize: 14, color: '#17332a', flex: 1 }}>
                Funciona incluso con la app cerrada
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View style={{ width: '100%', gap: 12 }}>
            <TouchableOpacity
              onPress={onAccept}
              style={{
                backgroundColor: '#F36C3F',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                Activar Notificaciones
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSkip}
              style={{
                backgroundColor: '#f3f4f6',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: '#6b7280',
                fontSize: 16,
                fontWeight: '600'
              }}>
                Ahora no
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nota */}
          <Text style={{
            fontSize: 12,
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 16
          }}>
            Puedes cambiar esta configuración en cualquier momento desde los ajustes de tu dispositivo.
          </Text>
        </View>
      </View>
    </Modal>
  );
}