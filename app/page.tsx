'use client';

import React from 'react';
import { FoodSearchForm } from '@/components/FoodSearchForm';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { FoodResultsList } from '@/components/FoodResultsList';
import { NotionSettings } from '@/components/NotionSettings';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { useNotionIntegration } from '@/hooks/useNotionIntegration';
import { ProcessedFoodItem } from '@/types';

export default function Home() {
  const [notionDatabaseId, setNotionDatabaseId] = React.useState('');

  const {
    queries,
    results,
    loading,
    feedbackMessage,
    dataTypeFilter,
    addQuery,
    removeQuery,
    updateQuery,
    updateDataTypeFilter,
    searchAllFoods,
    setFeedbackMessage
  } = useFoodSearch();

  const {
    saveToNotion,
    savingItems
  } = useNotionIntegration(setFeedbackMessage, notionDatabaseId);

  const handleSaveToNotion = async (food: ProcessedFoodItem) => {
    if (!notionDatabaseId) {
      setFeedbackMessage({
        type: 'error',
        message: 'Please enter a Notion database ID first',
        details: 'You need to provide a valid Notion database ID to save items.'
      });
      return;
    }

    await saveToNotion(food);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Food Nutrition Data Aggregator</h1>
          <p className="mt-1 text-sm text-gray-600">
            Search for foods to view nutrition information and save to Notion
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <NotionSettings
              databaseId={notionDatabaseId}
              onDatabaseIdChange={setNotionDatabaseId}
              disabled={loading}
            />
            
            <FoodSearchForm
              queries={queries}
              loading={loading}
              dataTypeFilter={dataTypeFilter}
              onAddQuery={addQuery}
              onRemoveQuery={removeQuery}
              onUpdateQuery={updateQuery}
              onUpdateDataTypeFilter={updateDataTypeFilter}
              onSearch={searchAllFoods}
            />
          </div>
          
          <div className="lg:col-span-2">
            {feedbackMessage && (
              <FeedbackMessage
                feedback={feedbackMessage}
                onDismiss={() => setFeedbackMessage(null)}
              />
            )}
            
            <FoodResultsList
              results={results}
              savingItems={savingItems}
              onSaveToNotion={handleSaveToNotion}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Data provided by USDA FoodData Central API. 
          </p>
        </div>
      </footer>
    </div>
  );
} 