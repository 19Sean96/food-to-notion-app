import { convert, Unit } from './conversion';
import { ProcessedFoodItem } from '@/types';

/**
 * Scale a ProcessedFoodItem's nutrient amounts when serving size or unit changes.
 * Does NOT mutate original object; returns a copy with scaled nutrient values.
 *
 * @param item The original food item including a numeric servingSize & unit.
 * @param newQty The new serving quantity (e.g., 0.5)
 * @param newUnit The new serving unit (e.g., 'cup')
 * @param density Optional density (g/ml) if converting between mass & volume. Defaults 1.
 */
export function scaleFoodItem(
  item: ProcessedFoodItem & { servingSize: number; servingSizeUnit: Unit },
  newQty: number,
  newUnit: Unit,
  density?: number
): ProcessedFoodItem {
  const { servingSize: originalQty, servingSizeUnit: originalUnit } = item;

  // If no change, return same reference
  if (originalQty === newQty && originalUnit === newUnit) return item;

  // Calculate ratio: (new amount in grams or ml) / (original amount in grams or ml)
  const originalBase = convert(1, originalUnit, getCanonicalUnit(originalUnit), density);
  const newBase = convert(1, newUnit, getCanonicalUnit(newUnit), density);

  const ratio = (newQty * newBase) / (originalQty * originalBase);

  // Deep clone nutrients and multiply each leaf numeric value by ratio
  const scaledNutrients: any = JSON.parse(JSON.stringify(item.nutrients));
  multiplyNumbersRecursively(scaledNutrients, ratio);

  return {
    ...item,
    servingSize: newQty,
    servingSizeUnit: newUnit,
    nutrients: scaledNutrients,
  };
}

function multiplyNumbersRecursively(obj: any, factor: number) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'number') {
      obj[key] = obj[key] * factor;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      multiplyNumbersRecursively(obj[key], factor);
    }
  }
}

function getCanonicalUnit(unit: Unit): Unit {
  // For weight units canonical is grams, for volume canonical is ml
  if (['mg', 'g', 'kg', 'oz', 'lb'].includes(unit)) return 'g';
  if (['ml', 'l', 'tsp', 'tbsp', 'floz', 'cup'].includes(unit)) return 'ml';
  return unit;
} 