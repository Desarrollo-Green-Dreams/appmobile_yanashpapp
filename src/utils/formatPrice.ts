// src/utils/formatPrice.ts

/**
 * Formatea un precio numérico a string con formato peruano
 */
export const formatPrice = (value: number): string => `S/${value.toFixed(2)}`;

/**
 * Calcula precio con toppings aplicados
 */
export const calcularPrecioConToppings = (
  precioBase: number,
  toppingsSeleccionados: Record<string, Record<string, number>>,
  toppingsData: any[] = []
): number => {
  let total = precioBase;
  
  Object.entries(toppingsSeleccionados).forEach(([type, toppings]) => {
    Object.entries(toppings).forEach(([toppingId, cantidad]) => {
      if (cantidad > 0) {
        const topping = toppingsData.find(t => t.slug === toppingId);
        if (topping && typeof topping.priceDelta === 'number') {
          total += topping.priceDelta * cantidad;
        }
      }
    });
  });
  
  return Math.round(total * 100) / 100; // redondear a 2 decimales
};

/**
 * Genera texto descriptivo de toppings seleccionados
 */
export const generarTextoToppings = (
  toppingsSeleccionados: Record<string, Record<string, number>>
): string => {
  const partes: string[] = [];
  
  const tipoLabels: Record<string, string> = {
    cream: "Cremas",
    flavor: "Sabores", 
    garnish: "Con",
    sauce: "Salsas"
  };
  
  Object.entries(toppingsSeleccionados).forEach(([type, toppings]) => {
    const itemsSeleccionados: string[] = [];
    
    Object.entries(toppings).forEach(([toppingId, cantidad]) => {
      if (cantidad > 0) {
        if (cantidad === 1) {
          itemsSeleccionados.push(toppingId);
        } else {
          itemsSeleccionados.push(`${toppingId} (${cantidad})`);
        }
      }
    });
    
    if (itemsSeleccionados.length > 0) {
      const tipoLabel = tipoLabels[type] || type;
      partes.push(`${tipoLabel}: ${itemsSeleccionados.join(', ')}`);
    }
  });
  
  return partes.join(' • ');
};