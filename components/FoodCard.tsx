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
      <Card className="nutrition-card interactive-element">
        <CardHeader>
          <CardTitle className="line-clamp-2">{getStringValue(food.description)}</CardTitle>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {food.brandName && (
              <span className="nutrition-badge nutrition-badge-protein">
                {getStringValue(food.brandName)}
              </span>
            )}
            
            {food.foodCategory && (
              <span className="nutrition-badge bg-secondary text-secondary-foreground border-border">
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
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="font-medium">Loading nutrition data...</p>
            <p className="text-sm text-muted-foreground mt-1">Fetching detailed information</p>
          </div>
        </CardContent>
        
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            <Loader2 className="animate-spin w-4 h-4" />
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
      <Card className="nutrition-card border-destructive/50">
        <CardHeader>
          <CardTitle className="line-clamp-2">{getStringValue(food.description)}</CardTitle>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {food.brandName && (
              <span className="nutrition-badge nutrition-badge-protein">
                {getStringValue(food.brandName)}
              </span>
            )}
            
            {food.foodCategory && (
              <span className="nutrition-badge bg-secondary text-secondary-foreground border-border">
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
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
            <p className="font-medium text-destructive">Failed to load nutrition data</p>
            <p className="text-sm text-muted-foreground mt-1">
              {errorMessage || 'Unable to fetch detailed information'}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            <AlertCircle className="w-4 h-4" />
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
    <Card className="nutrition-card interactive-element">
      {isAlreadyInNotion && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 border-b border-emerald-200 rounded-t-xl">
          <CheckCircle className="w-4 h-4" />
          <span>Already saved to Notion</span>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="line-clamp-2">{getStringValue(detailedFood.description)}</CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {detailedFood.brandName && (
            <span className="nutrition-badge nutrition-badge-protein">
              {getStringValue(detailedFood.brandName)}
            </span>
          )}
          
          {detailedFood.foodCategory && (
            <span className="nutrition-badge bg-secondary text-secondary-foreground border-border">
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
      
      <CardContent className="flex-1 space-y-4">
        {/* Macronutrient overview with consistent styling */}
        <div className="grid grid-cols-2 gap-3">
          <div className="nutrition-card-header p-3 rounded-lg">
            <p className="text-sm font-medium text-foreground">Calories</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-nutrition-calories">
                {hasValidCalories ? displayCalories : 'N/A'}
              </span>
              {hasValidCalories && (
                <span className="text-sm font-medium text-nutrition-calories/80">kcal</span>
              )}
            </div>
          </div>
          <div className="nutrition-card-header p-3 rounded-lg">
            <p className="text-sm font-medium text-foreground">Protein</p>
            <p className="text-xl font-bold text-nutrition-protein">{formatNutrient(nutrients.protein, 'g')}</p>
          </div>
        </div>

        {/* Secondary nutrients */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground">Carbs</p>
            <p className="text-xl font-bold text-nutrition-carbs">{formatNutrient(nutrients.carbs.total, 'g')}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground">Fat</p>
            <p className="text-xl font-bold text-nutrition-fat">{formatNutrient(nutrients.fats.total, 'g')}</p>
          </div>
        </div>

        {/* Expandable detailed nutrition */}
        {showDetails && (
          <div className="space-y-3 pt-3 border-t border-border">
            <h4 className="font-semibold text-sm">Detailed Nutrition Information</h4>
            
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Dietary Fiber</span>
                <span className="font-medium">{formatNutrient(nutrients.carbs.fiber, 'g')}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Total Sugars</span>
                <span className="font-medium">{formatNutrient(nutrients.carbs.sugar, 'g')}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Saturated Fat</span>
                <span className="font-medium">{formatNutrient(nutrients.fats.saturated, 'g')}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Sodium</span>
                <span className="font-medium">{formatNutrient(nutrients.micronutrients.sodium, 'mg')}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Cholesterol</span>
                <span className="font-medium">{formatNutrient(nutrients.cholesterol, 'mg')}</span>
              </div>
            </div>

            {/* Raw JSON toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRawJson}
              className="w-full mt-3"
            >
              <Info className="w-4 h-4" />
              {showRawJson ? 'Hide' : 'Show'} Raw Data
            </Button>

            {showRawJson && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <pre className="text-xs overflow-auto max-h-40 text-muted-foreground">
                  {JSON.stringify(detailedFood, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDetails}
          className="flex-1"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showDetails ? 'Less Info' : 'More Info'}
        </Button>
        
        <Button
          onClick={() => onSaveToNotion(detailedFood)}
          disabled={isSaving || isAlreadyInNotion}
          size="sm"
          className="flex-1"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : isAlreadyInNotion ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save to Notion
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 