'use client';

import React, { useState, useEffect } from 'react';
import { FoodCard } from '@/components/FoodCard';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { SearchModal } from '@/components/SearchModal';
import { NotionSetupModal } from '@/components/NotionSetupModal';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { useNotionIntegration } from '@/hooks/useNotionIntegration';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { 
  Search, 
  Database, 
  TrendingUp, 
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getNotionDatabaseInfo } from '@/services/notionApi';

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notionModalOpen, setNotionModalOpen] = useState(false);
  const [notionDatabaseId, setNotionDatabaseId] = useState('');

  const {
    queries,
    results,
    loading,
    feedbackMessage,
    dataTypeFilter,
    existingFdcIds,
    addQuery,
    removeQuery,
    updateQuery,
    updateDataTypeFilter,
    addExistingFdcId,
    searchAllFoods,
    setFeedbackMessage
  } = useFoodSearch(notionDatabaseId);

  const {
    saveToNotion,
    savingItems
  } = useNotionIntegration(notionDatabaseId);

  // Database connection state
  const [databaseInfo, setDatabaseInfo] = useState<any>(null);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  
  const handleLoadDatabase = async () => {
    if (!notionDatabaseId.trim()) return;
    
    setDatabaseLoading(true);
    try {
      // Fetch real database information from the backend service
      const info = await getNotionDatabaseInfo(notionDatabaseId);

      // Map API response to UI-friendly shape
      const mapped = {
        name: info.title || 'Notion Database',
        totalPages: info.pageCount ?? 0,
        properties: info.properties?.map((p: { name: string }) => p.name) || [],
      };

      setDatabaseInfo(mapped);

      // Optionally update saved FDC IDs for duplicate checks
      // const ids = await getExistingFdcIds(notionDatabaseId);
      // ids.forEach(id => addExistingFdcId(id));
    } catch (error) {
      console.error('Failed to load database:', error);
      toast.error('Failed to connect to Notion database', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setDatabaseInfo(null);
    } finally {
      setDatabaseLoading(false);
    }
  };

  const handleSaveFood = async (food: any) => {
    const success = await saveToNotion(food);
    if (success) {
      addExistingFdcId(food.id);
    }
  };

  const handleSearch = async () => {
    const activeQueries = queries.filter(q => q.text.trim());
    if (activeQueries.length === 0) {
      toast.error('Please enter at least one search term');
      return;
    }
    
    setSearchModalOpen(false); // Close modal immediately
    
    try {
      await searchAllFoods();
      
      // Show success toast after search completes
      setTimeout(() => {
        const totalResults = results.reduce((sum, result) => sum + result.foods.length, 0);
        if (totalResults > 0) {
          toast.success(`Found ${totalResults} food items matching your search`);
        } else {
          toast.info('No results found for your search terms');
        }
      }, 500);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    }
  };

  const totalSearches = queries.filter(q => q.text.trim()).length;
  const totalResults = results.reduce((sum, result) => sum + result.foods.length, 0);
  const totalSaved = existingFdcIds.size;
  const notionConnected = !!databaseInfo;

  // Surface feedback messages through toast notifications instead of inline banners
  useEffect(() => {
    if (feedbackMessage) {
      const { type, message, details } = feedbackMessage;
      const options = details ? { description: details } : undefined;
      switch (type) {
        case 'success':
          toast.success(message, options);
          break;
        case 'error':
          toast.error(message, options);
          break;
        default:
          toast.info(message, options);
      }
      // Clear the message after showing so it doesn't re-trigger
      setFeedbackMessage(null);
    }
  }, [feedbackMessage, setFeedbackMessage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenNotionSetup={() => setNotionModalOpen(true)}
          notionConnected={notionConnected}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Quick Actions */}
          <header className="bg-card border-b border-border px-8 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nutrition Hub</h1>
                <p className="text-muted-foreground mt-1">Professional nutrition data management</p>
              </div>
              <div className="flex items-center gap-4">
                {notionConnected && databaseInfo && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {databaseInfo.name} is connected
                  </div>
                )}
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Quick Actions Row */}
            <div className="flex gap-4">
              <Button onClick={() => setSearchModalOpen(true)}>
                <Search className="w-4 h-4" />
                Search Foods
              </Button>
              <Button 
                variant="outline"
                onClick={() => setNotionModalOpen(true)}
              >
                <Database className="w-4 h-4" />
                {notionConnected ? 'Manage Database' : 'Setup Notion'}
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Results Section */}
            {results.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="h-full overflow-y-auto space-y-6 pb-8 px-3">
                    {results.map((result, index) => (
                      <div key={index}>
                        {/* Query Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <h2 className="text-xl font-bold">
                            Results for "{result.queryText}"
                          </h2>
                          <div className="text-sm text-muted-foreground">
                            {result.foods.length} items found
                          </div>
                        </div>
                        
                        {/* Food Cards for this query */}
                        <div className="space-y-4 mb-6">
                          {result.foods.map((food) => (
                            <FoodCard
                              key={food.fdcId}
                              food={food}
                              isSaving={savingItems[food.fdcId] || false}
                              onSaveToNotion={handleSaveFood}
                              isAlreadyInNotion={existingFdcIds.has(food.fdcId)}
                            />
                          ))}
                        </div>
                        
                        {/* Divider between queries (except for last one) */}
                        {index < results.length - 1 && (
                          <div className="border-t border-border my-6"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Database className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Your Nutrition Search</h3>
                <p className="text-muted-foreground max-w-md">
                  Use the navigation sidebar to search for food items and discover detailed nutrition information from the USDA database.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
             <SearchModal
         isOpen={searchModalOpen}
         onClose={() => setSearchModalOpen(false)}
         queries={queries}
         loading={loading}
         dataTypeFilter={dataTypeFilter}
         onAddQuery={addQuery}
         onRemoveQuery={removeQuery}
         onUpdateQuery={updateQuery}
         onUpdateDataTypeFilter={updateDataTypeFilter}
         onSearch={handleSearch}
       />

             <NotionSetupModal
         isOpen={notionModalOpen}
         onClose={() => setNotionModalOpen(false)}
         databaseId={notionDatabaseId}
         onDatabaseIdChange={setNotionDatabaseId}
         onLoadDatabase={handleLoadDatabase}
         loading={databaseLoading}
         databaseInfo={databaseInfo}
         connected={notionConnected}
       />
    </div>
  );
} 