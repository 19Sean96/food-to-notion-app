'use client';

import React from 'react';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { FoodResultsList } from '@/components/FoodResultsList';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { useNotionIntegration } from '@/hooks/useNotionIntegration';
import { ProcessedFoodItem } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/Button';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';

export default function Home() {
  const [notionDatabaseId, setNotionDatabaseId] = React.useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

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

  const notionSettingsProps = {
    databaseId: notionDatabaseId,
    onDatabaseIdChange: setNotionDatabaseId,
    disabled: loading,
  };

  const foodSearchFormProps = {
    queries,
    loading,
    dataTypeFilter,
    onAddQuery: addQuery,
    onRemoveQuery: removeQuery,
    onUpdateQuery: updateQuery,
    onUpdateDataTypeFilter: updateDataTypeFilter,
    onSearch: searchAllFoods,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="mr-2"
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarCollapsed ? <PanelRightClose size={20} /> : <PanelLeftClose size={20} />}
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Food Nutrition Data Aggregator</h1>
                        <p className="mt-1 text-xs text-gray-600">
                            Search for foods to view nutrition information and save to Notion
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
            <Sidebar 
                notionSettingsProps={notionSettingsProps}
                foodSearchFormProps={foodSearchFormProps}
                isCollapsed={isSidebarCollapsed}
            />
          
            <div className="flex-1 mt-8 lg:mt-0">
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