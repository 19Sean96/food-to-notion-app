import React from 'react';
import { FoodCard } from './FoodCard';
import { FoodResult, ProcessedFoodItem } from '@/types';

interface FoodResultsListProps {
  results: FoodResult[];
  savingItems: Record<number, boolean>;
  onSaveToNotion: (food: ProcessedFoodItem) => Promise<void>;
}

export const FoodResultsList: React.FC<FoodResultsListProps> = ({
  results,
  savingItems,
  onSaveToNotion,
}) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {results.map((result) => (
        <div key={result.queryId} className="mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{`Results for "${result.queryText}"`}</h2>
            <p className="text-gray-500">
              {result.foods.length === 0
                ? 'No foods found'
                : `${result.foods.length} food${result.foods.length === 1 ? '' : 's'} found`}
            </p>
          </div>
          
          {result.foods.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-gray-600 text-center">
              No foods found for this query. Try using different keywords.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {result.foods.map((food) => (
                <FoodCard 
                  key={food.fdcId} 
                  food={food} 
                  isSaving={!!savingItems[food.fdcId]}
                  onSaveToNotion={onSaveToNotion}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 