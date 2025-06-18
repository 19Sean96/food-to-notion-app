'use client';

import React from 'react';
import { Save, Info, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { FoodSearchItem, ProcessedFoodItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { formatNutrient } from '@/utils/formatters';
import { useFoodDetails } from '@/hooks/useFoodDetails';
import { ServingSizeSelector } from '@/components/ServingSizeSelector';
import { Unit, toMetric, toImperial } from '@/lib/conversion';
import { scaleFoodItem } from '@/lib/nutrientScaling';

interface FoodCardProps {
  food?: FoodSearchItem;
  initialData?: Partial<ProcessedFoodItem>;
  isSaving: boolean;
  onSaveToNotion?: (food: ProcessedFoodItem) => void;
  isAlreadyInNotion: boolean;
  notionPageId?: string;
  updatePage?: (food: ProcessedFoodItem, pageId: string) => Promise<void>;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, initialData, isSaving, onSaveToNotion, isAlreadyInNotion, notionPageId, updatePage }) => {
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) return value.description || '';
    return '';
  };

  const fdcId = food?.fdcId || initialData?.id;

  // State for editable properties
  const [editedTitle, setEditedTitle] = React.useState<string>(getStringValue(initialData?.description || food?.description));
  const [servingQty, setServingQty] = React.useState<number>(1);
  const [servingUnit, setServingUnit] = React.useState<Unit>('g');
  const [showAsLabel, setShowAsLabel] = React.useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = React.useState<boolean>(false);
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [showRawJson, setShowRawJson] = React.useState(false);

  // Always fetch full data from USDA
  const { data: detailedFood, isLoading, error } = useFoodDetails(fdcId || 0);

  // Effect to initialize and sync state when data arrives
  React.useEffect(() => {
    const source = initialData || detailedFood;
    if (source) {
      setEditedTitle(source.description || '');
      setServingQty(source.servingSize || 1);
      setServingUnit((source.servingSizeUnit as Unit) || 'g');
    }
  }, [detailedFood, initialData]);

  React.useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const isDirty = React.useMemo(() => {
    if (!detailedFood) return false;
    const originalDescription = initialData?.description ?? detailedFood.description;
    const originalServingSize = initialData?.servingSize ?? detailedFood.servingSize;
    const originalServingUnit = initialData?.servingSizeUnit ?? detailedFood.servingSizeUnit;
    return (
      editedTitle !== originalDescription ||
      servingQty !== originalServingSize ||
      servingUnit !== originalServingUnit ||
      showAsLabel !== ''
    );
  }, [editedTitle, servingQty, servingUnit, showAsLabel, detailedFood, initialData]);

  if (isLoading) {
    return (
      <Card className="nutrition-card">
        <CardHeader>
          <CardTitle className="line-clamp-2">{editedTitle || 'Loading...'}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !detailedFood || typeof detailedFood.servingSize === 'undefined' || typeof detailedFood.servingSizeUnit === 'undefined') {
    return (
      <Card className="nutrition-card border-destructive/50">
        <CardHeader>
          <CardTitle className="line-clamp-2">{editedTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="ml-4 font-medium text-destructive">Failed to load nutrition data</p>
        </CardContent>
      </Card>
    );
  }

  const scaledFood = scaleFoodItem(detailedFood as ProcessedFoodItem & { servingSize: number; servingSizeUnit: Unit }, servingQty, servingUnit);
  scaledFood.description = editedTitle;

  const nutrients = scaledFood.nutrients;
  const displayCalories = (nutrients.calories > 0) ? nutrients.calories.toFixed(1) : 'N/A';
  
  const foodToSaveOrUpdate = {
      ...scaledFood,
      servingSizeMetric: Number(toMetric(servingQty, servingUnit).value.toFixed(2)),
      servingSizeMetricUnit: toMetric(servingQty, servingUnit).unit,
      servingSizeImperial: Number(toImperial(servingQty, servingUnit).value.toFixed(2)),
      servingSizeImperialUnit: toImperial(servingQty, servingUnit).unit,
  };

  const handleSave = () => {
    if (onSaveToNotion) {
        onSaveToNotion(foodToSaveOrUpdate);
    }
  }

  const handleUpdate = () => {
    if (updatePage && notionPageId) {
        updatePage(foodToSaveOrUpdate, notionPageId);
    }
  }

  type NutrientEntry = { label: string; value: number; unit: string };
  const getAllNutrientEntries = (n: any): NutrientEntry[] => [
    { label: 'Calories', value: n.calories, unit: 'kcal' },
    { label: 'Water', value: n.water, unit: 'g' },
    { label: 'Protein', value: n.protein, unit: 'g' },
    { label: 'Total Carbs', value: n.carbs.total, unit: 'g' },
    { label: 'Dietary Fiber', value: n.carbs.fiber, unit: 'g' },
    { label: 'Total Sugars', value: n.carbs.sugar, unit: 'g' },
    { label: 'Added Sugars', value: n.carbs.addedSugar, unit: 'g' },
    { label: 'Total Fat', value: n.fats.total, unit: 'g' },
    { label: 'Saturated Fat', value: n.fats.saturated, unit: 'g' },
    { label: 'Trans Fat', value: n.fats.trans, unit: 'g' },
    { label: 'MUFA', value: n.fats.mufa, unit: 'g' },
    { label: 'PUFA', value: n.fats.pufa, unit: 'g' },
    { label: 'Omega-3 ALA', value: n.fats.omega3.ala, unit: 'g' },
    { label: 'Omega-3 EPA', value: n.fats.omega3.epa, unit: 'g' },
    { label: 'Omega-3 DHA', value: n.fats.omega3.dha, unit: 'g' },
    { label: 'Cholesterol', value: n.cholesterol, unit: 'mg' },
    { label: 'Choline', value: n.choline, unit: 'mg' },
    { label: 'Vitamin A', value: n.vitamins.a, unit: 'µg' },
    { label: 'Vitamin D', value: n.vitamins.d, unit: 'µg' },
    { label: 'Vitamin E', value: n.vitamins.e, unit: 'mg' },
    { label: 'Vitamin K', value: n.vitamins.k, unit: 'µg' },
    { label: 'Vitamin B6', value: n.vitamins.b6, unit: 'mg' },
    { label: 'Vitamin B12', value: n.vitamins.b12, unit: 'µg' },
    { label: 'Folate (DFE)', value: n.vitamins.folate, unit: 'µg' },
    { label: 'Calcium', value: n.micronutrients.calcium, unit: 'mg' },
    { label: 'Iron', value: n.micronutrients.iron, unit: 'mg' },
    { label: 'Magnesium', value: n.micronutrients.magnesium, unit: 'mg' },
    { label: 'Zinc', value: n.micronutrients.zinc, unit: 'mg' },
    { label: 'Iodine', value: n.micronutrients.iodine, unit: 'µg' },
    { label: 'Sodium', value: n.micronutrients.sodium, unit: 'mg' },
    { label: 'Potassium', value: n.micronutrients.potassium, unit: 'mg' },
    { label: 'Leucine', value: n.aminoAcids.leucine, unit: 'g' },
    { label: 'Lysine', value: n.aminoAcids.lysine, unit: 'g' },
    { label: 'Methionine', value: n.aminoAcids.methionine, unit: 'g' },
    { label: 'Cystine', value: n.aminoAcids.cystine, unit: 'g' }
  ];

  return (
    <Card className="nutrition-card group focus-within:ring-0 focus-within:ring-offset-0">
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
            className="w-full text-lg font-semibold border-b-2 border-primary focus:outline-none bg-transparent"
          />
        ) : (
          <CardTitle
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {editedTitle}
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </CardTitle>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
            {detailedFood.brandName && <span className="nutrition-badge">{detailedFood.brandName}</span>}
            {detailedFood.foodCategory && <span className="nutrition-badge bg-secondary text-secondary-foreground">{detailedFood.foodCategory}</span>}
        </div>
        <CardDescription className="pt-2">
            <ServingSizeSelector
              quantity={servingQty}
              unit={servingUnit}
              onChange={(q, u) => { setServingQty(q); setServingUnit(u); }}
              showAs={showAsLabel}
              onShowAsChange={setShowAsLabel}
            />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-2xl font-bold text-nutrition-calories">{displayCalories}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-2xl font-bold text-nutrition-protein">{formatNutrient(nutrients.protein, 'g')}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-2xl font-bold text-nutrition-carbs">{formatNutrient(nutrients.carbs.total, 'g')}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="text-xl font-bold text-nutrition-fat">{formatNutrient(nutrients.fats.total, 'g')}</p>
            </div>
        </div>
        {showDetails && (
          <div className="space-y-3 pt-3 border-t">
            <h4 className="font-semibold text-sm">Detailed Nutrition</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {getAllNutrientEntries(nutrients).map(({ label, value, unit }) => (
                <div key={label} className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{formatNutrient(value, unit)}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowRawJson(!showRawJson)} className="w-full">
              <Info className="w-4 h-4" />
              {showRawJson ? 'Hide' : 'Show'} Raw Data
            </Button>
            {showRawJson && (
              <pre className="text-xs overflow-auto max-h-40 bg-muted p-2 rounded-lg">
                {JSON.stringify(scaledFood, null, 2)}
              </pre>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="flex-1">
          <ChevronDown className={`w-4 h-4 transition-transform ${showDetails && "rotate-180"}`} />
          {showDetails ? 'Less Info' : 'More Info'}
        </Button>
        {isAlreadyInNotion ? (
          <Button onClick={handleUpdate} disabled={!isDirty || isSaving} size="sm" className="flex-1">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
            {isSaving ? 'Updating...' : 'Update Page'}
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="flex-1">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save to Notion'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}; 