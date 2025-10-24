import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F36C3F',
        tabBarInactiveTintColor: '#7d6f63',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5dfd8',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Servicios',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="solicitudes"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center relative">
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                size={24}
                color={color}
              />
              {/* Badge rojo para nuevas notificaciones */}
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -6,
                  backgroundColor: '#dc2626',
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0 // Por ahora invisible, se activará con lógica después
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                  !
                </Text>
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="room-service"
        options={{
          title: 'Room Service',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <Ionicons
                name={focused ? 'restaurant' : 'restaurant-outline'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}