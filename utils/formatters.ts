/**
 * Format a numeric nutrient value with its unit
 */
export const formatNutrient = (value: number | undefined, unit: string): string => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  const formattedValue = value.toFixed(2);
  return `${formattedValue}${unit}`;
};

/**
 * Format unit abbreviations
 */
export const formatUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    'g': 'g',
    'gram': 'g',
    'grams': 'g',
    'mg': 'mg',
    'milligram': 'mg',
    'milligrams': 'mg',
    'µg': 'µg',
    'microgram': 'µg',
    'micrograms': 'µg',
    'kcal': 'kcal',
    'kJ': 'kJ',
    'IU': 'IU',
    'ml': 'ml',
    'milliliter': 'ml',
    'milliliters': 'ml',
    'l': 'L',
    'liter': 'L',
    'liters': 'L',
    'oz': 'oz',
    'ounce': 'oz',
    'ounces': 'oz',
    'fl_oz': 'fl oz',
    'fluid_ounce': 'fl oz',
    'fluid_ounces': 'fl oz',
    'tbsp': 'tbsp',
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'tsp': 'tsp',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
    'cup': 'cup',
    'cups': 'cup',
    'serving': 'serving',
    'servings': 'servings',
    'piece': 'piece',
    'pieces': 'pieces'
  };

  return unitMap[unit.toLowerCase()] || unit;
}; 