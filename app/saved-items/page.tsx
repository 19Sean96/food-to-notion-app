"use client";

import React, { useState, useEffect } from 'react';
import { NotionCreationResponse } from '@/types';
import { useNotionIntegration } from '@/hooks/useNotionIntegration';
import { FoodCard } from '@/components/FoodCard';
import { FoodSearchItem, ProcessedFoodItem } from '@/types';

export default function SavedItemsPage() {
  const [notionDatabaseId, setNotionDatabaseId] = useState<string>('');
  const [existingFdcIds, setExistingFdcIds] = useState<Set<number>>(new Set());
  const [pageIds, setPageIds] = useState<Record<number, string>>({});

  // Notion integration hooks
  const { saveToNotion, updatePage, savingItems } = useNotionIntegration(notionDatabaseId);

  // Rehydrate saved data
  useEffect(() => {
    const savedDb = localStorage.getItem('notionDatabaseId');
    if (savedDb) setNotionDatabaseId(savedDb);
    const savedIds = JSON.parse(localStorage.getItem('existingFdcIds') || '[]');
    setExistingFdcIds(new Set(savedIds));
    const savedPageMap = JSON.parse(localStorage.getItem('pageIds') || '{}');
    setPageIds(savedPageMap);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Items</h1>
      {existingFdcIds.size === 0 ? (
        <p className="text-sm text-muted-foreground">No items saved to Notion yet.</p>
      ) : (
        <div className="space-y-6">
          {Array.from(existingFdcIds).map((fdcId) => {
            // stub FoodSearchItem for fetch
            const stubFood = { fdcId, description: '', lowercaseDescription: '', dataType: '', gtinUpc: '', publishedDate: '', brandOwner: '', brandName: '', ingredients: '', marketCountry: '', foodCategory: '', modifiedDate: '', dataSource: '', foodNutrients: [], servingSize: 1, servingSizeUnit: 'g' } as FoodSearchItem;
            return (
              <FoodCard
                key={fdcId}
                food={stubFood}
                isSaving={savingItems[fdcId] || false}
                onSaveToNotion={() => Promise.resolve({ success: false, message: '', foodName: '' } as NotionCreationResponse)}
                isAlreadyInNotion={true}
                notionPageId={pageIds[fdcId]}
                updatePage={updatePage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
} 