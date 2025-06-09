/**
 * Format a numeric nutrient value with its unit
 */
export const formatNutrient = (value: number | undefined, unit: string): string => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  // Format number based on value size and type
  let formattedValue: string;
  
  if (value < 1 && value > 0) {
    // Small values (like vitamins in mg)
    formattedValue = value.toFixed(2);
  } else if (Number.isInteger(value)) {
    // Whole numbers
    formattedValue = value.toString();
  } else {
    // Other numbers with 1 decimal place
    formattedValue = value.toFixed(1);
  }
  
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