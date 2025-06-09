import { useState, useCallback } from 'react';
import { ProcessedFoodItem, FeedbackMessage, NotionCreationResponse } from '@/types';
import { createNotionPage } from '@/services/notionApi';

export const useNotionIntegration = (
  setGlobalFeedback: (feedback: FeedbackMessage | null) => void,
  databaseId: string
) => {
  const [savingItems, setSavingItems] = useState<Record<number, boolean>>({});

  const saveToNotion = useCallback(
    async (food: ProcessedFoodItem): Promise<boolean> => {
      setSavingItems(prev => ({ ...prev, [food.id]: true }));

      try {
        const result: NotionCreationResponse = await createNotionPage(food, databaseId);

        if (result.success) {
          setGlobalFeedback({
            type: 'success',
            message: `✓ ${result.foodName} successfully added`
          });
          return true;
        } else {
          setGlobalFeedback({
            type: 'error',
            message: result.message,
            details: `Failed to add ${result.foodName} to Notion`
          });
          return false;
        }
      } catch (error) {
        console.error('Error saving to Notion:', error);
        setGlobalFeedback({
          type: 'error',
          message: 'Failed to save to Notion',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
        return false;
      } finally {
        setSavingItems(prev => ({ ...prev, [food.id]: false }));
      }
    },
    [setGlobalFeedback, databaseId]
  );

  return {
    saveToNotion,
    savingItems
  };
}; 