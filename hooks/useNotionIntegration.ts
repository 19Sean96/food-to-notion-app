import { useState, useCallback } from 'react';
import { ProcessedFoodItem, NotionCreationResponse } from '@/types';
import { createNotionPage } from '@/services/notionApi';
import { toast } from 'sonner';

export const useNotionIntegration = (databaseId: string) => {
  const [savingItems, setSavingItems] = useState<Record<number, boolean>>({});

  const saveToNotion = useCallback(
    async (food: ProcessedFoodItem): Promise<boolean> => {
      setSavingItems(prev => ({ ...prev, [food.id]: true }));

      try {
        const result: NotionCreationResponse = await createNotionPage(food, databaseId);

        if (result.success) {
          toast.success(`"${result.foodName}" successfully added to Notion.`);
          return true;
        } else {
          toast.error(result.message, {
            description: `Failed to add "${result.foodName}" to Notion. Please try again.`,
          });
          return false;
        }
      } catch (error) {
        console.error('Error saving to Notion:', error);
        toast.error('Failed to save to Notion', {
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        return false;
      } finally {
        setSavingItems(prev => ({ ...prev, [food.id]: false }));
      }
    },
    [databaseId]
  );

  return {
    saveToNotion,
    savingItems
  };
}; 