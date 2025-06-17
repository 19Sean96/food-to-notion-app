import { useState, useCallback } from 'react';
import { ProcessedFoodItem, NotionCreationResponse } from '@/types';
import { createNotionPage, updateNotionPage as apiUpdateNotionPage } from '@/services/notionApi';
import { toast } from 'sonner';

export const useNotionIntegration = (databaseId: string) => {
  const [savingItems, setSavingItems] = useState<Record<number, boolean>>({});

  const saveToNotion = useCallback(
    async (food: ProcessedFoodItem): Promise<NotionCreationResponse> => {
      setSavingItems(prev => ({ ...prev, [food.id]: true }));

      try {
        const result: NotionCreationResponse = await createNotionPage(food, databaseId);

        if (result.success) {
          toast.success(`"${result.foodName}" successfully added to Notion.`);
        } else {
          toast.error(result.message, {
            description: `Failed to add "${result.foodName}" to Notion. Please try again.`,
          });
        }
        return result;
      } catch (error) {
        console.error('Error saving to Notion:', error);
        toast.error('Failed to save to Notion', {
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error', foodName: food.description };
      } finally {
        setSavingItems(prev => ({ ...prev, [food.id]: false }));
      }
    },
    [databaseId]
  );

  const updatePage = useCallback(
    async (food: ProcessedFoodItem, pageId: string): Promise<boolean> => {
      setSavingItems(prev => ({ ...prev, [food.id]: true }));
      try {
        const result = await apiUpdateNotionPage(
          pageId,
          food,
          food.servingSizeDisplay ?? `${food.servingSize} ${food.servingSizeUnit}`
        );
        if (result.success) {
          toast.success('Successfully updated Notion page.');
          return true;
        } else {
          toast.error(result.message, { description: `Failed to update ${food.description} in Notion.` });
          return false;
        }
      } catch (error) {
        console.error('Error updating Notion page:', error);
        toast.error('Failed to update Notion page', { description: error instanceof Error ? error.message : 'Unknown error' });
        return false;
      } finally {
        setSavingItems(prev => ({ ...prev, [food.id]: false }));
      }
    },
    [databaseId]
  );

  return {
    saveToNotion,
    updatePage,
    savingItems
  };
}; 