// Helper function to map USDA food categories to Notion Food Group options
export const mapFoodCategory = (usdaCategory: any) => {
    if (!usdaCategory) return null;
    
    // Handle case where usdaCategory is an object with description property
    let categoryString = usdaCategory;
    if (typeof usdaCategory === 'object' && usdaCategory.description) {
      categoryString = usdaCategory.description;
    } else if (typeof usdaCategory === 'object') {
      // If it's an object but no description, return null
      return null;
    }
    
    const categoryLower = categoryString.toLowerCase();
    
    // Fruits
    if (categoryLower.includes('fruit') || 
        categoryLower.includes('berry') || 
        categoryLower.includes('citrus') ||
        categoryLower.includes('apple') ||
        categoryLower.includes('banana') ||
        categoryLower.includes('grape')) {
      return { name: 'Fruits' };
    }
    
    // Vegetables
    if (categoryLower.includes('vegetable') || 
        categoryLower.includes('lettuce') ||
        categoryLower.includes('carrot') ||
        categoryLower.includes('tomato') ||
        categoryLower.includes('onion') ||
        categoryLower.includes('pepper') ||
        categoryLower.includes('broccoli') ||
        categoryLower.includes('spinach')) {
      return { name: 'Vegetables' };
    }
    
    // Meat
    if (categoryLower.includes('beef') || 
        categoryLower.includes('pork') ||
        categoryLower.includes('chicken') ||
        categoryLower.includes('turkey') ||
        categoryLower.includes('lamb') ||
        categoryLower.includes('meat') ||
        categoryLower.includes('poultry')) {
      return { name: 'Meat' };
    }
    
    // Seafood
    if (categoryLower.includes('fish') || 
        categoryLower.includes('seafood') ||
        categoryLower.includes('salmon') ||
        categoryLower.includes('tuna') ||
        categoryLower.includes('shrimp') ||
        categoryLower.includes('crab') ||
        categoryLower.includes('lobster')) {
      return { name: 'Seafood' };
    }
    
    // Tree Nuts
    if (categoryLower.includes('nut') || 
        categoryLower.includes('almond') ||
        categoryLower.includes('walnut') ||
        categoryLower.includes('pecan') ||
        categoryLower.includes('cashew') ||
        categoryLower.includes('pistachio')) {
      return { name: 'Tree Nuts' };
    }
    
    // Legumes
    if (categoryLower.includes('bean') || 
        categoryLower.includes('pea') ||
        categoryLower.includes('lentil') ||
        categoryLower.includes('chickpea') ||
        categoryLower.includes('legume') ||
        categoryLower.includes('soy')) {
      return { name: 'Legumes' };
    }
    
    // Grains
    if (categoryLower.includes('grain') || 
        categoryLower.includes('cereal') ||
        categoryLower.includes('bread') ||
        categoryLower.includes('rice') ||
        categoryLower.includes('wheat') ||
        categoryLower.includes('oat') ||
        categoryLower.includes('pasta')) {
      return { name: 'Grains' };
    }
    
    // Dairy
    if (categoryLower.includes('dairy') || 
        categoryLower.includes('milk') ||
        categoryLower.includes('cheese') ||
        categoryLower.includes('yogurt') ||
        categoryLower.includes('butter') ||
        categoryLower.includes('cream')) {
      return { name: 'Dairy' };
    }
    
    // Herbs & Spices
    if (categoryLower.includes('spice') || 
        categoryLower.includes('herb') ||
        categoryLower.includes('seasoning') ||
        categoryLower.includes('pepper') ||
        categoryLower.includes('salt')) {
      return { name: 'Herbs & Spices' };
    }
    
    // Default to null if no match found
    return null;
  };
  
  // Helper function to format nutrient value with proper rounding and color coding for Notion
  const formatNutrientForNotion = (value: number | undefined | null, unit = '') => {
    if (value === undefined || value === null) {
      return {
        text: 'N/A',
        color: 'red'
      };
    }
  
    let formattedValue;
    
    // Determine decimal places based on unit
    if (unit === 'kcal') {
      // Calories - whole numbers (0 decimal places)
      formattedValue = Math.round(value);
    } else if (unit === 'g') {
      // Grams - 1 decimal place
      formattedValue = value.toFixed(1);
    } else if (unit === 'mg' || unit === 'µg') {
      // Milligrams and micrograms - 2 decimal places
      formattedValue = value.toFixed(2);
    } else {
      // Default - 2 decimal places
      formattedValue = value.toFixed(2);
    }
  
    const displayText = unit ? `${formattedValue} ${unit}` : String(formattedValue);
    
    return {
      text: displayText,
      color: 'blue'
    };
  };
  
  // Helper function to create a table row with color coding
  export const createTableRow = (label: string, value: number | undefined | null, unit = '') => {
    const formatted = formatNutrientForNotion(value, unit);
    
    return {
      object: "block",
      type: "table_row",
      table_row: {
        cells: [
          [{ text: { content: label } }],
          [{
            text: { content: formatted.text },
            annotations: {
              color: formatted.color
            }
          }]
        ]
      }
    };
  }; 