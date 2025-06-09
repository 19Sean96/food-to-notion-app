import axios from 'axios';
import { FoodSearchResponse, FoodDetailsResponse, ProcessedFoodItem } from '@/types';

const API_BASE_URL = '/api';

// Nutrient IDs based on provided tables
const NUTRIENT_IDS = {
  // Foundational Data
  ENERGY_KCAL: '208',        // Energy (kcal)
  ENERGY_KJ: '268',          // Energy (kJ)
  WATER: '255',              // Water
  PROTEIN: '203',            // Protein
  TOTAL_FAT: '204',          // Total fat
  TOTAL_FAT_NLEA: '298',     // Total fat (NLEA)
  SATURATED_FAT: '606',      // Saturated fat
  TRANS_FAT: '605',          // Trans fat
  CARBOHYDRATES: '205',      // Total carbohydrate
  FIBER: '291',              // Dietary fiber
  TOTAL_SUGARS: '269',       // Total sugars
  ADDED_SUGARS: '539',       // Added sugars
  CHOLESTEROL: '601',        // Cholesterol
  SODIUM: '307',             // Sodium

  // Core Micronutrients
  VITAMIN_D: '328',          // Vitamin D
  CALCIUM: '301',            // Calcium
  IRON: '303',               // Iron
  POTASSIUM: '306',          // Potassium
  MAGNESIUM: '304',          // Magnesium
  ZINC: '309',               // Zinc
  IODINE: '314',             // Iodine
  FOLATE_DFE: '417',         // Folate (DFE)
  VITAMIN_B12: '418',        // Vitamin B12
  VITAMIN_B6: '415',         // Vitamin B6
  VITAMIN_A_RAE: '320',      // Vitamin A (RAE)
  VITAMIN_E: '323',          // Vitamin E (α-tocopherol)
  VITAMIN_K: '430',          // Vitamin K

  // Functional Clinical Data
  MUFA: '645',               // Monounsaturated fatty acids
  PUFA: '646',               // Polyunsaturated fatty acids
  OMEGA3_ALA: '851',         // Omega-3 ALA
  OMEGA3_EPA: '629',         // Omega-3 EPA
  OMEGA3_DHA: '631',         // Omega-3 DHA
  LEUCINE: '504',            // Leucine
  LYSINE: '505',             // Lysine
  METHIONINE: '506',         // Methionine
  CYSTINE: '526',            // Cystine
  CHOLINE: '421',            // Total Choline
  SELENIUM: '317',           // Selenium
  PHOSPHORUS: '305',         // Phosphorus
  COPPER: '312',             // Copper
};

/**
 * Search for foods based on a query string via our own API proxy
 */
export const searchFoods = async (query: string, dataTypes: string[] = ['Foundation'], pageSize: number = 15): Promise<FoodSearchResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usda/search`, {
      params: {
        query,
        dataTypes: dataTypes.join(','),
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error;
  }
};

/**
 * Get detailed information for a specific food by its ID via our own API proxy
 */
export const getFoodDetails = async (fdcId: number): Promise<FoodDetailsResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usda/food/${fdcId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching food details for ID ${fdcId}:`, error);
    throw error;
  }
};

/**
 * Find nutrient value from nutrient array
 */
const findNutrientValue = (nutrients: any[], nutrientId: string): number => {
  const nutrient = nutrients.find(n => {
    const number = n.nutrient?.number || n.number || n.nutrientNumber;
    return number === nutrientId;
  });
  return nutrient?.amount || nutrient?.value || 0;
};

/**
 * Process food details into a more usable format
 */
export const processFoodDetails = (foodDetails: FoodDetailsResponse): ProcessedFoodItem => {
  const nutrients = foodDetails.foodNutrients || [];

  // Find calories by matching both Energy and kcal unit
  let calories = 0;
  for (const nutrient of nutrients) {
    if (nutrient.nutrient?.name?.includes('Energy') && 
        nutrient.nutrient?.unitName === 'kcal') {
      calories = nutrient.amount || 0;
      break;
    }
  }

  // Process foodCategory - extract description if it's an object
  let foodCategory: string | undefined;
  if (foodDetails.foodCategory) {
    if (typeof foodDetails.foodCategory === 'string') {
      foodCategory = foodDetails.foodCategory;
    } else if (typeof foodDetails.foodCategory === 'object' && 'description' in foodDetails.foodCategory) {
      foodCategory = foodDetails.foodCategory.description;
    }
  }

  // Initialize the processed food item
  const processed: ProcessedFoodItem = {
    id: foodDetails.fdcId,
    description: foodDetails.description,
    brandOwner: foodDetails.brandOwner,
    brandName: foodDetails.brandName,
    foodCategory,
    ingredients: foodDetails.ingredients,
    servingSize: foodDetails.servingSize,
    servingSizeUnit: foodDetails.servingSizeUnit,
    nutrients: {
      calories,
      energyKj: findNutrientValue(nutrients, NUTRIENT_IDS.ENERGY_KJ),
      water: findNutrientValue(nutrients, NUTRIENT_IDS.WATER),
      protein: findNutrientValue(nutrients, NUTRIENT_IDS.PROTEIN),
      carbs: {
        total: findNutrientValue(nutrients, NUTRIENT_IDS.CARBOHYDRATES),
        fiber: findNutrientValue(nutrients, NUTRIENT_IDS.FIBER),
        sugar: findNutrientValue(nutrients, NUTRIENT_IDS.TOTAL_SUGARS),
        addedSugar: findNutrientValue(nutrients, NUTRIENT_IDS.ADDED_SUGARS),
      },
      fats: {
        total: findNutrientValue(nutrients, NUTRIENT_IDS.TOTAL_FAT) || 
               findNutrientValue(nutrients, NUTRIENT_IDS.TOTAL_FAT_NLEA),
        saturated: findNutrientValue(nutrients, NUTRIENT_IDS.SATURATED_FAT),
        trans: findNutrientValue(nutrients, NUTRIENT_IDS.TRANS_FAT),
        mufa: findNutrientValue(nutrients, NUTRIENT_IDS.MUFA),
        pufa: findNutrientValue(nutrients, NUTRIENT_IDS.PUFA),
        omega3: {
          ala: findNutrientValue(nutrients, NUTRIENT_IDS.OMEGA3_ALA),
          epa: findNutrientValue(nutrients, NUTRIENT_IDS.OMEGA3_EPA),
          dha: findNutrientValue(nutrients, NUTRIENT_IDS.OMEGA3_DHA),
        },
      },
      cholesterol: findNutrientValue(nutrients, NUTRIENT_IDS.CHOLESTEROL),
      micronutrients: {
        sodium: findNutrientValue(nutrients, NUTRIENT_IDS.SODIUM),
        potassium: findNutrientValue(nutrients, NUTRIENT_IDS.POTASSIUM),
        calcium: findNutrientValue(nutrients, NUTRIENT_IDS.CALCIUM),
        iron: findNutrientValue(nutrients, NUTRIENT_IDS.IRON),
        magnesium: findNutrientValue(nutrients, NUTRIENT_IDS.MAGNESIUM),
        phosphorus: findNutrientValue(nutrients, NUTRIENT_IDS.PHOSPHORUS),
        zinc: findNutrientValue(nutrients, NUTRIENT_IDS.ZINC),
        iodine: findNutrientValue(nutrients, NUTRIENT_IDS.IODINE),
        selenium: findNutrientValue(nutrients, NUTRIENT_IDS.SELENIUM),
        copper: findNutrientValue(nutrients, NUTRIENT_IDS.COPPER),
      },
      vitamins: {
        a: findNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_A_RAE),
        d: findNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_D),
        e: findNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_E),
        k: findNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_K),
        b6: findNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_B6),
        b12: findNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_B12),
        folate: findNutrientValue(nutrients, NUTRIENT_IDS.FOLATE_DFE),
      },
      aminoAcids: {
        leucine: findNutrientValue(nutrients, NUTRIENT_IDS.LEUCINE),
        lysine: findNutrientValue(nutrients, NUTRIENT_IDS.LYSINE),
        methionine: findNutrientValue(nutrients, NUTRIENT_IDS.METHIONINE),
        cystine: findNutrientValue(nutrients, NUTRIENT_IDS.CYSTINE),
      },
      choline: findNutrientValue(nutrients, NUTRIENT_IDS.CHOLINE),
    },
  };

  return processed;
}; 