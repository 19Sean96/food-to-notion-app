import React from 'react';
import { Save, Info, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { FoodSearchItem, ProcessedFoodItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { formatNutrient } from '@/utils/formatters';
import { useFoodDetails } from '@/hooks/useFoodDetails';
import { useNotionPage } from '@/hooks/useNotionPage';
import { ServingSizeSelector } from '@/components/ServingSizeSelector';
import { Unit, toMetric, toImperial } from '@/lib/conversion';
import { scaleFoodItem } from '@/lib/nutrientScaling';

interface FoodCardProps {
  food: FoodSearchItem;
  isSaving: boolean;
  onSaveToNotion: (food: ProcessedFoodItem) => void;
  isAlreadyInNotion: boolean;
  notionPageId?: string;
  updatePage?: (food: ProcessedFoodItem, pageId: string) => Promise<boolean>;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, isSaving, onSaveToNotion, isAlreadyInNotion, notionPageId, updatePage }) => {
  // Helper to safely get string values
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value.description || '';
    }
    return '';
  };

  const [showDetails, setShowDetails] = React.useState(false);
  const [showRawJson, setShowRawJson] = React.useState(false);

  // Serving size state
  const [servingQty, setServingQty] = React.useState<number>(food.servingSize || 1);
  const [servingUnit, setServingUnit] = React.useState<Unit>((food.servingSizeUnit as Unit) || 'g');
  const [showAsLabel, setShowAsLabel] = React.useState<string>('');

  // Editable title state
  const [editedTitle, setEditedTitle] = React.useState<string>(getStringValue(food.description));
  const [isEditingTitle, setIsEditingTitle] = React.useState<boolean>(false);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch data either from Notion page or USDA API
  const notionQuery = useNotionPage(notionPageId);
  const usdaQuery = useFoodDetails(food.fdcId);

  const detailedFood = notionPageId ? notionQuery.data?.page : usdaQuery.data;
  const isLoading = notionPageId ? notionQuery.isLoading : usdaQuery.isLoading;
  const error = notionPageId ? notionQuery.error : usdaQuery.error;

  // Update when detailedFood arrives
  React.useEffect(() => {
    if (detailedFood?.servingSize && detailedFood?.servingSizeUnit) {
      setServingQty(detailedFood.servingSize);
      setServingUnit(detailedFood.servingSizeUnit as Unit);
    }
  }, [detailedFood]);

  // Sync title when detailed data loads
  React.useEffect(() => {
    if (detailedFood?.description) {
      setEditedTitle(getStringValue(detailedFood.description));
    }
  }, [detailedFood]);

  // Auto-focus input when editing starts
  React.useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  // Track original values for update detection
  const originalTitleRef = React.useRef<string>(getStringValue(food.description));
  const originalQtyRef = React.useRef<number>(food.servingSize || 1);
  const originalUnitRef = React.useRef<Unit>((food.servingSizeUnit as Unit) || 'g');
  const originalShowAsRef = React.useRef<string>('');

  // When detailedFood loaded, update originals
  React.useEffect(() => {
    if (detailedFood) {
      originalTitleRef.current = getStringValue(detailedFood.description);
      if (detailedFood.servingSize) originalQtyRef.current = detailedFood.servingSize;
      if (detailedFood.servingSizeUnit) originalUnitRef.current = detailedFood.servingSizeUnit as Unit;
    }
  }, [detailedFood]);

  // Determine if any editable fields have changed
  const isDirty =
    editedTitle !== originalTitleRef.current ||
    servingQty !== originalQtyRef.current ||
    servingUnit !== originalUnitRef.current ||
    showAsLabel !== originalShowAsRef.current;

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleRawJson = () => {
    setShowRawJson(!showRawJson);
  };

  type NutrientEntry = { label: string; value: number; unit: 'g' | 'mg' | 'µg' | 'kcal' };

  const getAllNutrientEntries = (n: any): NutrientEntry[] => {
    return [
      { label: 'Calories', value: n.calories, unit: 'kcal' },
      { label: 'Water', value: n.water, unit: 'g' },
      { label: 'Protein', value: n.protein, unit: 'g' },
      { label: 'Total Carbs', value: n.carbs.total, unit: 'g' },
      { label: 'Dietary Fiber', value: n.carbs.fiber, unit: 'g' },
      { label: 'Total Sugars', value: n.carbs.sugar, unit: 'g' },
      { label: 'Added Sugar', value: n.carbs.addedSugar, unit: 'g' },
      { label: 'Total Fat', value: n.fats.total, unit: 'g' },
      { label: 'Saturated Fat', value: n.fats.saturated, unit: 'g' },
      { label: 'Trans Fat', value: n.fats.trans, unit: 'g' },
      { label: 'MUFA', value: n.fats.mufa, unit: 'g' },
      { label: 'PUFA', value: n.fats.pufa, unit: 'g' },
      { label: 'Omega-3 ALA', value: n.fats.omega3.ala, unit: 'g' },
      { label: 'Omega-3 EPA', value: n.fats.omega3.epa, unit: 'g' },
      { label: 'Omega-3 DHA', value: n.fats.omega3.dha, unit: 'g' },
      { label: 'Cholesterol', value: n.cholesterol, unit: 'mg' },
      { label: 'Sodium', value: n.micronutrients.sodium, unit: 'mg' },
      { label: 'Potassium', value: n.micronutrients.potassium, unit: 'mg' },
      { label: 'Calcium', value: n.micronutrients.calcium, unit: 'mg' },
      { label: 'Iron', value: n.micronutrients.iron, unit: 'mg' },
      { label: 'Magnesium', value: n.micronutrients.magnesium, unit: 'mg' },
      { label: 'Phosphorus', value: n.micronutrients.phosphorus, unit: 'mg' },
      { label: 'Zinc', value: n.micronutrients.zinc, unit: 'mg' },
      { label: 'Iodine', value: n.micronutrients.iodine, unit: 'µg' },
      { label: 'Selenium', value: n.micronutrients.selenium, unit: 'µg' },
      { label: 'Copper', value: n.micronutrients.copper, unit: 'mg' },
      { label: 'Vitamin A', value: n.vitamins.a, unit: 'µg' },
      { label: 'Vitamin D', value: n.vitamins.d, unit: 'µg' },
      { label: 'Vitamin E', value: n.vitamins.e, unit: 'mg' },
      { label: 'Vitamin K', value: n.vitamins.k, unit: 'µg' },
      { label: 'Vitamin B6', value: n.vitamins.b6, unit: 'mg' },
      { label: 'Vitamin B12', value: n.vitamins.b12, unit: 'µg' },
      { label: 'Folate', value: n.vitamins.folate, unit: 'µg' },
      { label: 'Leucine', value: n.aminoAcids.leucine, unit: 'g' },
      { label: 'Lysine', value: n.aminoAcids.lysine, unit: 'g' },
      { label: 'Methionine', value: n.aminoAcids.methionine, unit: 'g' },
      { label: 'Cystine', value: n.aminoAcids.cystine, unit: 'g' },
      { label: 'Choline', value: n.choline, unit: 'mg' },
    ];
  };

  // Basic serving info (not used in UI now)

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
            Serving size: {servingQty} {servingUnit}
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
            Serving size: {servingQty} {servingUnit}
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

  // Scale nutrients based on edited serving
  // Use original detailedFood to calculate scaling ratio, then override display fields
  const baseScaledFood = scaleFoodItem(
    detailedFood as any,
    servingQty,
    servingUnit
  );
  const scaledFood: ProcessedFoodItem = {
    ...baseScaledFood,
    description: editedTitle,
    servingSizeDisplay: showAsLabel
      ? `${showAsLabel} (${Number(servingQty.toFixed(2))} ${servingUnit})`
      : `${Number(servingQty.toFixed(2))} ${servingUnit}`,
  };

  // Compute dual measurement units
  const metric = toMetric(servingQty, servingUnit);
  const imperial = toImperial(servingQty, servingUnit);
  const scaledFoodWithDual = {
    ...scaledFood,
    servingSizeMetric: Number(metric.value.toFixed(2)),
    servingSizeMetricUnit: metric.unit,
    servingSizeImperial: Number(imperial.value.toFixed(2)),
    servingSizeImperialUnit: imperial.unit,
  };

  const nutrients = scaledFood.nutrients;

  // Format calories with one decimal place
  const calories = scaledFood.nutrients.calories;
  const hasValidCalories = calories > 0;
  const displayCalories = hasValidCalories ? calories.toFixed(2) : 'N/A';

  return (
    <Card className="nutrition-card interactive-element">
      {isAlreadyInNotion && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 border-b border-emerald-200 rounded-t-xl">
          <CheckCircle className="w-4 h-4" />
          <span>Already saved to Notion</span>
        </div>
      )}
      
      <CardHeader>
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
            className="w-full text-lg font-semibold border-b border-input focus:outline-none bg-transparent p-0"
          />
        ) : (
          <CardTitle
            className="line-clamp-2 flex items-center gap-1 cursor-pointer underline decoration-muted-foreground underline-offset-2"
            onClick={() => setIsEditingTitle(true)}
          >
            {editedTitle}
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </CardTitle>
        )}
        
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
          <div className="mt-2">
            <ServingSizeSelector
              quantity={servingQty}
              unit={servingUnit}
              onChange={(q, u) => {
                setServingQty(q);
                setServingUnit(u);
              }}
              showAs={showAsLabel}
              onShowAsChange={setShowAsLabel}
            />
            {/* Dual measurement display */}
            {metric.unit !== servingUnit && (
              <p className="text-xs text-muted-foreground">
                Equivalent: {metric.value.toFixed(2)} {metric.unit}
              </p>
            )}
            {imperial.unit !== servingUnit && (
              <p className="text-xs text-muted-foreground">
                Equivalent: {imperial.value.toFixed(2)} {imperial.unit}
              </p>
            )}
          </div>
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
              {getAllNutrientEntries(nutrients).map(({ label, value, unit }) => (
                <div key={label} className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{formatNutrient(value, unit)}</span>
                </div>
              ))}
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
                  {JSON.stringify(notionPageId ? notionQuery.data : scaledFood, null, 2)}
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
        
        {notionPageId ? (
          <Button
            onClick={() => {
              if (updatePage && notionPageId) {
                updatePage(scaledFoodWithDual, notionPageId);
              }
            }}
            disabled={!isDirty || isSaving}
            size="sm"
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Update Page
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => onSaveToNotion(scaledFoodWithDual)}
            disabled={isSaving}
            size="sm"
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save to Notion
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}; 