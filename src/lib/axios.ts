import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cachedToken: string | null = null;

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL
});

const getToken = async () => {
  if (!cachedToken) {
    try {
      cachedToken = await AsyncStorage.getItem("AUTH_TOKEN");
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }
  return cachedToken;
};

export const updateAuthToken = (token: string | null) => {
  cachedToken = token;
  if (token) {
    AsyncStorage.setItem("AUTH_TOKEN", token);
  } else {
    AsyncStorage.removeItem("AUTH_TOKEN");
  }
};

api.interceptors.request.use((config) => {
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  }
  return config;
});

getToken();

export default api;