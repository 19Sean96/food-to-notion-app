import React from 'react';
import { FoodCard } from './FoodCard';
import { FoodResult, ProcessedFoodItem } from '@/types';

interface FoodResultsListProps {
  results: FoodResult[];
  savingItems: Record<number, boolean>;
  onSaveToNotion: (food: ProcessedFoodItem) => Promise<void>;
  existingFdcIds: Set<number>;
}

export const FoodResultsList: React.FC<FoodResultsListProps> = ({
  results,
  savingItems,
  onSaveToNotion,
  existingFdcIds,
}) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Search for food to see results</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your search results will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {results.map((result) => (
        <div key={result.queryId}>
          <h2 className="text-2xl font-bold mb-4">Results for "{result.queryText}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {result.foods.map((food) => (
              <FoodCard
                key={food.fdcId}
                food={food}
                isSaving={savingItems[food.fdcId] || false}
                onSaveToNotion={onSaveToNotion}
                isAlreadyInNotion={existingFdcIds.has(food.fdcId)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 