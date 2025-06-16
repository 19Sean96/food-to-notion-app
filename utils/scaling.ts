export function scaleNutrients<T extends Record<string, any>>(nutrients: T, factor: number): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(nutrients)) {
    if (typeof value === 'number') {
      result[key] = value * factor;
    } else if (typeof value === 'object' && value !== null) {
      result[key] = scaleNutrients(value, factor);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

export function scaleFoodItem(food: any, size: number): any {
  const base = food.servingSize || 1;
  const factor = size / base;
  return {
    ...food,
    servingSize: size,
    nutrients: scaleNutrients(food.nutrients, factor)
  };
}

export function convertMeasurement(amount: number, unit: string): {value: number; unit: string} | null {
  switch(unit) {
    case 'g':
      return { value: amount / 28.3495, unit: 'oz' };
    case 'oz':
      return { value: amount * 28.3495, unit: 'g' };
    case 'ml':
      return { value: amount / 29.5735, unit: 'fl oz' };
    case 'fl oz':
    case 'fl_oz':
      return { value: amount * 29.5735, unit: 'ml' };
    case 'cup':
      return { value: amount * 240, unit: 'ml' };
    case 'l':
      return { value: amount * 33.814, unit: 'fl oz' };
    default:
      return null;
  }
}
