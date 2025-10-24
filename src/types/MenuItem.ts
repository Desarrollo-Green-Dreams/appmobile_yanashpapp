// src/types/MenuItem.ts

// Tipos básicos para tags
export type TagSlug = "vegetariano" | "picante" | "para-compartir" | "kids" | "rapido" | "minibar";

// Tipo para categoría embebida en items
export interface CategoryEmbed {
  _id: string;
  slug: string;
  name: string;
}

// Tipo para un item individual del menú
export interface MenuItem {
  _id: string;
  slug: string;
  name: string;
  desc?: string;
  priceBase: number;
  category: CategoryEmbed;
  tags?: TagSlug[];
  visible: boolean;
  outOfStock: boolean;
  orderInCategory: number;
  imageUrl?: string;
  
  // Para toppings dinámicos
  autoToppings?: string[];
  maxToppingsPerType?: Record<string, number>;
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
}

// Tipo para una sección del menú (categoría con sus items)
export interface MenuSection {
  category: {
    _id: string;
    slug: string;
    name: string;
    order: number;
  };
  items: MenuItem[];
}

// Respuesta completa del endpoint público del menú
export interface MenuResponse {
  sections: MenuSection[];
  totalItems: number;
  lastUpdated: string;
}

// Tipo para los chips de categorías
export interface CategoryChip {
  _id: string;
  slug: string;
  name: string;
  order: number;
  count: number;
  visible: boolean;
}

// Respuesta del endpoint de chips
export interface ChipsResponse {
  chips: CategoryChip[];
  totalCategories: number;
}

// Tipos para queries y filtros
export interface ListQuery {
  page?: number;
  limit?: number;
  category?: string;
  visible?: boolean;
  outOfStock?: boolean;
  search?: string;
  tags?: TagSlug[];
}

// Tipo para crear/actualizar items
export interface UpsertItemDTO {
  slug: string;
  name: string;
  desc?: string;
  priceBase: number;
  category: CategoryEmbed;
  tags?: TagSlug[];
  visible?: boolean;
  outOfStock?: boolean;
  orderInCategory?: number;
  imageUrl?: string;
  autoToppings?: string[];
  maxToppingsPerType?: Record<string, number>;
}

// Respuesta paginada genérica
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos legacy para opciones (si los necesitas)
export interface OptionChoice {
  id: string;
  label: string;
  priceDelta?: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  required: boolean;
  maxChoices: number;
  choices: OptionChoice[];
}

export type SelectedOptions = Record<string, string[]>;