import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FoodQuery, FoodResult, FeedbackMessage, DataTypeFilter } from '@/types';
import { searchFoods } from '@/services/usdaApi';
import { getExistingFdcIds } from '@/services/notionApi';

export const useFoodSearch = (databaseId: string) => {
  const [queries, setQueries] = useState<FoodQuery[]>([{ id: uuidv4(), text: '' }]);
  const [results, setResults] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);
  const [dataTypeFilter, setDataTypeFilter] = useState<DataTypeFilter>({
    foundation: true,
    branded: false
  });
  const [existingFdcIds, setExistingFdcIds] = useState<Set<number>>(new Set());

  const addQuery = useCallback(() => {
    setQueries(prev => [...prev, { id: uuidv4(), text: '' }]);
  }, []);

  const removeQuery = useCallback((id: string) => {
    setQueries(prev => {
      // Don't allow removing the last query
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter(query => query.id !== id);
    });
  }, []);

  const updateQuery = useCallback((id: string, text: string) => {
    setQueries(prev => 
      prev.map(query => 
        query.id === id ? { ...query, text } : query
      )
    );
  }, []);

  const updateDataTypeFilter = useCallback((filter: DataTypeFilter) => {
    // Ensure at least one filter is selected
    if (!filter.foundation && !filter.branded) {
      return;
    }
    setDataTypeFilter(filter);
  }, []);

  const addExistingFdcId = useCallback((id: number) => {
    setExistingFdcIds(prev => new Set(prev).add(id));
  }, []);

  const searchAllFoods = useCallback(async () => {
    setLoading(true);
    setFeedbackMessage(null);

    const activeQueries = queries.filter(q => q.text.trim() !== '');
    if (activeQueries.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const dataTypes = Object.entries(dataTypeFilter)
        .filter(([, checked]) => checked)
        .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1));
      
      const searchPromises = activeQueries.map(query => searchFoods(query.text, dataTypes));
      const searchResults = await Promise.all(searchPromises);

      const allFoods = searchResults.flatMap((result, index) => ({
        queryId: activeQueries[index].id,
        queryText: activeQueries[index].text,
        foods: result.foods || [],
      }));

      setResults(allFoods);

      if (databaseId) {
        const ids = await getExistingFdcIds(databaseId);
        setExistingFdcIds(new Set(ids));
      }

      const totalFoods = allFoods.reduce((sum, result) => sum + result.foods.length, 0);
      const queryLabel = activeQueries.length === 1 ? 'query' : 'queries';
      setFeedbackMessage({
        type: 'info',
        message: `Found ${totalFoods} food item(s) for ${activeQueries.length} ${queryLabel}.`
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setFeedbackMessage({
        type: 'error',
        message: 'Search failed',
        details: message,
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [queries, dataTypeFilter, databaseId]);

  return {
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
  };
}; 