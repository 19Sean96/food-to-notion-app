import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FoodQuery, FoodResult, FeedbackMessage, DataTypeFilter } from '@/types';
import { searchFoods } from '@/services/usdaApi';

export const useFoodSearch = () => {
  const [queries, setQueries] = useState<FoodQuery[]>([{ id: uuidv4(), text: '' }]);
  const [results, setResults] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);
  const [dataTypeFilter, setDataTypeFilter] = useState<DataTypeFilter>({
    foundation: true,
    branded: false
  });

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

  const searchAllFoods = useCallback(async () => {
    // Filter out empty queries
    const validQueries = queries.filter(query => query.text.trim() !== '');
    
    if (validQueries.length === 0) {
      setFeedbackMessage({
        type: 'error',
        message: 'Please enter at least one food to search for.'
      });
      return;
    }

    // Convert filter to dataType array for API
    const dataTypes: string[] = [];
    if (dataTypeFilter.foundation) dataTypes.push('Foundation');
    if (dataTypeFilter.branded) dataTypes.push('Branded');

    setLoading(true);
    setFeedbackMessage(null);
    setResults([]); // Clear previous results

    try {
      const newResults: FoodResult[] = [];

      // Process each query
      for (const query of validQueries) {
        try {
          // Search for foods and get basic information immediately
          const searchResult = await searchFoods(query.text, dataTypes, 15);
          
          newResults.push({
            queryId: query.id,
            queryText: query.text,
            foods: searchResult.foods
          });
        } catch (searchError) {
          console.error(`Error searching for query "${query.text}":`, searchError);
          newResults.push({
            queryId: query.id,
            queryText: query.text,
            foods: []
          });
        }
      }

      setResults(newResults);

      if (newResults.some(result => result.foods.length === 0)) {
        setFeedbackMessage({
          type: 'info',
          message: 'Some searches returned no results. Try using more general terms.'
        });
      } else if (newResults.length > 0) {
        const totalFoods = newResults.reduce((sum, result) => sum + result.foods.length, 0);
        setFeedbackMessage({
          type: 'success',
          message: `Found ${totalFoods} food items for ${newResults.length} ${newResults.length === 1 ? 'query' : 'queries'}. Loading detailed nutrition data...`
        });
      }
    } catch (error) {
      console.error('Error during food search:', error);
      setFeedbackMessage({
        type: 'error',
        message: 'An error occurred while searching for foods.',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  }, [queries, dataTypeFilter]);

  return {
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
  };
}; 