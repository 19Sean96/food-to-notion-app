// API Types
export interface FoodSearchResponse {
  foods: FoodSearchItem[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface FoodSearchItem {
  fdcId: number;
  description: string;
  lowercaseDescription: string;
  dataType: string;
  gtinUpc: string;
  publishedDate: string;
  brandOwner: string;
  brandName: string;
  ingredients: string;
  marketCountry: string;
  foodCategory: string;
  modifiedDate: string;
  dataSource: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: FoodNutrient[];
}

export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
  derivationCode?: string;
  derivationDescription?: string;
}

export interface FoodCategory {
  id: number;
  code: string;
  description: string;
}

export interface FoodDetailsResponse {
  fdcId: number;
  description: string;
  lowercaseDescription?: string;
  dataType?: string;
  publicationDate?: string;
  foodClass?: string;
  modifiedDate?: string;
  availableDate?: string;
  brandOwner?: string;
  brandName?: string;
  dataSource?: string;
  ingredients?: string;
  marketCountry?: string;
  foodCategory?: string | FoodCategory;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: FoodNutrientDetail[];
  foodPortions?: any[];
  foodAttributes?: any[];
}

export interface FoodNutrientDetail {
  id: number;
  amount: number;
  dataPoints?: number;
  min?: number;
  max?: number;
  median?: number;
  type?: string;
  nutrient: Nutrient;
}

export interface Nutrient {
  id: number;
  number: string;
  name: string;
  rank: number;
  unitName: string;
}

// Application Types
export interface FoodQuery {
  id: string;
  text: string;
}

export interface FoodResult {
  queryId: string;
  queryText: string;
  foods: FoodSearchItem[];
}

export interface ProcessedFoodItem {
  id: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  dataType?: DataType;
  foodCategory?: string;
  ingredients?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  servingSizeMetric?: number;
  servingSizeMetricUnit?: string;
  servingSizeImperial?: number;
  servingSizeImperialUnit?: string;
  nutrients: {
    calories: number;
    energyKj: number;
    water: number;
    protein: number;
    carbs: {
      total: number;
      fiber: number;
      sugar: number;
      addedSugar: number;
    };
    fats: {
      total: number;
      saturated: number;
      trans: number;
      mufa: number;
      pufa: number;
      omega3: {
        ala: number;
        epa: number;
        dha: number;
      };
    };
    cholesterol: number;
    micronutrients: {
      sodium: number;
      potassium: number;
      calcium: number;
      iron: number;
      magnesium: number;
      phosphorus: number;
      zinc: number;
      iodine: number;
      selenium: number;
      copper: number;
    };
    vitamins: {
      a: number;
      d: number;
      e: number;
      k: number;
      b6: number;
      b12: number;
      folate: number;
    };
    aminoAcids: {
      leucine: number;
      lysine: number;
      methionine: number;
      cystine: number;
    };
    choline: number;
  };
  servingSizeDisplay?: string;
}

export interface NotionDatabaseProps {
  databaseId: string;
}

export interface NotionCreationResponse {
  success: boolean;
  message: string;
  foodName: string;
  pageId?: string;
}

export interface NotionUpdateResponse {
  success: boolean;
  message: string;
}

export interface NotionDatabaseInfo {
  title: string;
  pageCount: number;
  properties: Array<{
    name: string;
    type: string;
  }>;
}

export interface FeedbackMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

export type DataType = 'Foundational' | 'Branded';

export interface DataTypeFilter {
  foundation: boolean;
  branded: boolean;
} 