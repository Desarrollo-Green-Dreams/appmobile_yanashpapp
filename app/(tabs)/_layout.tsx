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
            <View className="items-center">
              <Ionicons 
                name={focused ? 'notifications' : 'notifications-outline'} 
                size={24} 
                color={color} 
              />
              {/* Badge de notificaciones - lo implementaremos después */}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}