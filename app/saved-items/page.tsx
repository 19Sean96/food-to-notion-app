"use client";

import React from 'react';
import { FoodCard } from '@/components/FoodCard';
import { useAppStore } from '@/store/appStore';

export default function SavedItemsPage() {
  const { 
    savedFoodItems,
    savingItems,
    updateNotionPage
  } = useAppStore();

  const savedItemsArray = Object.values(savedFoodItems);

  return (
    <main className="flex-1 px-4 py-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Items ({savedItemsArray.length})</h1>
      {savedItemsArray.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items saved to Notion yet.</p>
      ) : (
        <div className="space-y-6">
          {savedItemsArray.map((food) => (
            <FoodCard
              key={food.id}
              initialData={food}
              isSaving={savingItems[food.id] || false}
              isAlreadyInNotion={true}
              updatePage={updateNotionPage}
            />
          ))}
        </div>
      )}
    </main>
  );
} 