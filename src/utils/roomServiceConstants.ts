// src/utils/roomServiceConstants.ts

// Colores del tema Room Service
export const ROOM_SERVICE_COLORS = {
  primary: '#F36C3F',
  secondary: '#17332a',
  background: '#f6f0e9',
  textPrimary: '#17332a',
  textSecondary: '#7d6f63',
  border: '#e5dfd8',
  success: '#16a34a',
  warning: '#f59e0b',
  error: '#dc2626'
};

// Horarios del restaurante
export const RESTAURANT_HOURS = {
  open: 11,  // 11 AM
  close: 21, // 9 PM
  timezone: 'America/Lima'
};

// Límites y configuraciones
export const CART_CONFIG = {
  maxItemsPerProduct: 10,
  maxItemsTotal: 50,
  minOrderAmount: 15.00, // S/15 mínimo
  deliveryTime: {
    whenOpen: 15,      // 15 minutos cuando está abierto
    whenScheduled: 30  // 30 minutos cuando se programa
  }
};

// Labels para tipos de toppings
export const TOPPING_TYPE_LABELS: Record<string, string> = {
  cream: "Cremas",
  flavor: "Sabores", 
  garnish: "Guarniciones",
  sauce: "Salsas"
};

// Tags disponibles con sus estilos
export const TAG_STYLES: Record<string, { label: string; color: string; backgroundColor: string }> = {
  vegetariano: {
    label: "Vegetariano",
    color: '#16a34a',
    backgroundColor: '#dcfce7'
  },
  picante: {
    label: "Picante", 
    color: '#dc2626',
    backgroundColor: '#fecaca'
  },
  'para-compartir': {
    label: "Para Compartir",
    color: '#7c3aed',
    backgroundColor: '#e9d5ff'
  },
  rapido: {
    label: "Rápido",
    color: '#f59e0b',
    backgroundColor: '#fef3c7'
  },
  minibar: {
    label: "Minibar",
    color: '#0ea5e9',
    backgroundColor: '#dbeafe'
  },
  kids: {
    label: "Kids",
    color: '#f97316',
    backgroundColor: '#fed7aa'
  }
};

// Configuración de la UI
export const UI_CONFIG = {
  cardBorderRadius: 16,
  buttonBorderRadius: 12,
  modalBorderRadius: 20,
  shadowColor: 'rgba(23, 51, 42, 0.1)',
  animationDuration: 200
};

// Mensajes del sistema
export const MESSAGES = {
  loading: 'Cargando menú...',
  error: 'Error al cargar el menú',
  emptyCart: 'Tu carrito está vacío',
  restaurantClosed: 'El restaurante está cerrado',
  orderSuccess: 'Pedido enviado correctamente',
  orderError: 'Error al enviar el pedido',
  minOrderNotMet: (min: number) => `Pedido mínimo S/${min.toFixed(2)}`,
  toppingLimitReached: (type: string, max: number) => `Máximo ${max} ${type} permitidos`
};