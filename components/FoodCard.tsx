import React from 'react';
import { Save, Info, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { FoodSearchItem, ProcessedFoodItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { formatUnit, formatNutrient } from '@/utils/formatters';
import { useFoodDetails } from '@/hooks/useFoodDetails';

interface FoodCardProps {
  food: FoodSearchItem;
  isSaving: boolean;
  onSaveToNotion: (food: ProcessedFoodItem) => void;
  isAlreadyInNotion: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, isSaving, onSaveToNotion, isAlreadyInNotion }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showRawJson, setShowRawJson] = React.useState(false);

  // Use React Query to fetch detailed food information
  const { data: detailedFood, isLoading, error } = useFoodDetails(food.fdcId);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleRawJson = () => {
    setShowRawJson(!showRawJson);
  };

  // Helper to safely get string values
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value.description || '';
    }
    return '';
  };

  // Basic serving info from search result
  const servingInfo = food.servingSize && food.servingSizeUnit
    ? `${food.servingSize}${formatUnit(food.servingSizeUnit)}`
    : 'Not specified';

  // Show loading state while fetching details
  if (isLoading) {
    return (
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="line-clamp-2">{getStringValue(food.description)}</CardTitle>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {food.brandName && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {getStringValue(food.brandName)}
              </span>
            )}
            
            {food.foodCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                {getStringValue(food.foodCategory)}
              </span>
            )}
          </div>
          
          <CardDescription>
            Serving size: {servingInfo}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600 font-medium">Loading nutrition data...</p>
            <p className="text-sm text-gray-500 mt-1">Fetching detailed information</p>
          </div>
        </CardContent>
        
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            icon={<Loader2 className="animate-spin" size={16} />}
          >
            Loading...
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show error state if fetching failed
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return (
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="line-clamp-2">{getStringValue(food.description)}</CardTitle>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {food.brandName && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {getStringValue(food.brandName)}
              </span>
            )}
            
            {food.foodCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                {getStringValue(food.foodCategory)}
              </span>
            )}
          </div>
          
          <CardDescription>
            Serving size: {servingInfo}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 font-medium">Failed to load nutrition data</p>
            <p className="text-sm text-red-500 mt-1">
              {errorMessage || 'Unable to fetch detailed information'}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            icon={<AlertCircle size={16} />}
          >
            Error Loading Data
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show detailed food information once loaded
  if (!detailedFood) {
    return null;
  }

  const nutrients = detailedFood.nutrients;

  // Format calories with one decimal place
  const calories = detailedFood.nutrients.calories;
  const hasValidCalories = calories > 0;
  const displayCalories = hasValidCalories ? calories.toFixed(1) : 'N/A';

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      {isAlreadyInNotion && (
        <div className="flex items-center gap-2 bg-green-50 text-green-800 text-sm font-medium px-4 py-2 border-b">
          <CheckCircle size={16} />
          <span>Already saved to Notion</span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{getStringValue(detailedFood.description)}</CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-1">
          {detailedFood.brandName && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
              {getStringValue(detailedFood.brandName)}
            </span>
          )}
          
          {detailedFood.foodCategory && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
              {getStringValue(detailedFood.foodCategory)}
            </span>
          )}
        </div>
        
        <CardDescription>
          Serving size: {detailedFood.servingSize && detailedFood.servingSizeUnit
            ? `${detailedFood.servingSize}${formatUnit(detailedFood.servingSizeUnit)}`
            : servingInfo}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        {/* Macronutrient overview */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800 font-medium">Calories</p>
            <p className="text-lg font-bold text-blue-900">
              {hasValidCalories ? `${displayCalories} kcal` : 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-800 font-medium">Protein</p>
            <p className="text-lg font-bold text-green-900">{formatNutrient(nutrients.protein, 'g')}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-md">
            <p className="text-sm text-amber-800 font-medium">Carbs</p>
            <p className="text-lg font-bold text-amber-900">{formatNutrient(nutrients.carbs.total, 'g')}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-md">
            <p className="text-sm text-red-800 font-medium">Fat</p>
            <p className="text-lg font-bold text-red-900">{formatNutrient(nutrients.fats.total, 'g')}</p>
          </div>
        </div>
        
        {/* Detailed nutrition table */}
        {showDetails && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Detailed Nutrition Information</h4>
            
            {/* Foundational Data */}
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Foundational Data</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium text-gray-900">
                    {hasValidCalories ? `${displayCalories} kcal` : 'N/A'}
                  </span>
                  
                  <span className="text-gray-600">Water</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.water, 'g')}</span>
                  
                  {/* Carbohydrate breakdown */}
                  <span className="text-gray-600">Total Carbs</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.carbs.total, 'g')}</span>
                  
                  <span className="text-gray-600">Dietary Fiber</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.carbs.fiber, 'g')}</span>
                  
                  <span className="text-gray-600">Total Sugars</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.carbs.sugar, 'g')}</span>
                  
                  <span className="text-gray-600">Added Sugars</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.carbs.addedSugar, 'g')}</span>
                  
                  {/* Fat breakdown */}
                  <span className="text-gray-600">Total Fat</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.total, 'g')}</span>
                  
                  <span className="text-gray-600">Saturated Fat</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.saturated, 'g')}</span>
                  
                  <span className="text-gray-600">Trans Fat</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.trans, 'g')}</span>
                  
                  <span className="text-gray-600">Cholesterol</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.cholesterol, 'mg')}</span>
                </div>
              </div>
              
              {/* Core Micronutrients */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Core Micronutrients</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Vitamin A</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.a, 'µg')}</span>
                  
                  <span className="text-gray-600">Vitamin D</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.d, 'µg')}</span>
                  
                  <span className="text-gray-600">Vitamin E</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.e, 'mg')}</span>
                  
                  <span className="text-gray-600">Vitamin K</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.k, 'µg')}</span>
                  
                  <span className="text-gray-600">Vitamin B6</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.b6, 'mg')}</span>
                  
                  <span className="text-gray-600">Vitamin B12</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.b12, 'µg')}</span>
                  
                  <span className="text-gray-600">Folate (DFE)</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.vitamins.folate, 'µg')}</span>
                  
                  <span className="text-gray-600">Calcium</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.calcium, 'mg')}</span>
                  
                  <span className="text-gray-600">Iron</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.iron, 'mg')}</span>
                  
                  <span className="text-gray-600">Magnesium</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.magnesium, 'mg')}</span>
                  
                  <span className="text-gray-600">Zinc</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.zinc, 'mg')}</span>
                  
                  <span className="text-gray-600">Iodine</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.iodine, 'µg')}</span>
                  
                  <span className="text-gray-600">Sodium</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.sodium, 'mg')}</span>
                  
                  <span className="text-gray-600">Potassium</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.micronutrients.potassium, 'mg')}</span>
                </div>
              </div>
              
              {/* Functional Clinical Data */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Functional Clinical Data</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">MUFA</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.mufa, 'g')}</span>
                  
                  <span className="text-gray-600">PUFA</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.pufa, 'g')}</span>
                  
                  <span className="text-gray-600">Omega-3 ALA</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.omega3.ala, 'g')}</span>
                  
                  <span className="text-gray-600">Omega-3 EPA</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.omega3.epa, 'g')}</span>
                  
                  <span className="text-gray-600">Omega-3 DHA</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.fats.omega3.dha, 'g')}</span>
                  
                  <span className="text-gray-600">Leucine</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.aminoAcids.leucine, 'g')}</span>
                  
                  <span className="text-gray-600">Lysine</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.aminoAcids.lysine, 'g')}</span>
                  
                  <span className="text-gray-600">Methionine</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.aminoAcids.methionine, 'g')}</span>
                  
                  <span className="text-gray-600">Cystine</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.aminoAcids.cystine, 'g')}</span>
                  
                  <span className="text-gray-600">Choline</span>
                  <span className="font-medium text-gray-900">{formatNutrient(nutrients.choline, 'mg')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raw JSON Data */}
        {showRawJson && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Raw JSON Data</h4>
            <pre className="text-xs bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(detailedFood, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={toggleDetails}
          icon={showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </Button>

        <Button 
          variant="outline"
          size="sm"
          onClick={toggleRawJson}
          icon={showRawJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        >
          {showRawJson ? 'Hide Raw JSON' : 'View Raw JSON'}
        </Button>
        
        <Button
          variant="success"
          size="sm"
          onClick={() => onSaveToNotion(detailedFood)}
          isLoading={isSaving}
          disabled={isAlreadyInNotion || isSaving}
          icon={<Save size={16} />}
        >
          {isAlreadyInNotion ? 'Saved' : 'Save to Notion'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 