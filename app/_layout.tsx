import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyleSheet } from 'react-native';

// Crear QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="gallery" 
          options={{ 
            title: 'Galería',
            headerShown: true,
            headerBackTitle: 'Volver'
          }} 
        />
        <Stack.Screen 
          name="contact" 
          options={{ 
            title: 'Contacto',
            headerShown: true,
            headerBackTitle: 'Volver'
          }} 
        />
        <Stack.Screen 
          name="booking" 
          options={{ 
            title: 'Reservar',
            headerShown: true,
            headerBackTitle: 'Volver'
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            presentation: 'modal',
            headerShown: false
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}