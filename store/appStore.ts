// This file will define the Zustand store.
// The state shape and actions will be defined in the next step. 

import { create } from 'zustand';
import { toast } from 'sonner';
import { 
  FoodQuery, 
  FoodResult, 
  ProcessedFoodItem, 
  DataTypeFilter,
  NotionCreationResponse,
  NotionDatabaseInfo,
} from '@/types';
import { searchFoods, processFoodDetails } from '@/services/usdaApi';
import { 
  getNotionDatabaseInfo,
  createNotionPage,
  updateNotionPage as apiUpdateNotionPage,
  getExistingFdcIds,
} from '@/services/notionApi';
import { v4 as uuidv4 } from 'uuid';

// STATE & SHAPE
interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  searchModalOpen: boolean;
  notionModalOpen: boolean;

  // Notion State
  notionDatabaseId: string;
  databaseInfo: NotionDatabaseInfo | null;
  databaseLoading: boolean;
  savingItems: Record<number, boolean>;
  pageIds: Record<number, string>; // Maps FDC ID to Notion Page ID
  savedFoodItems: Record<number, ProcessedFoodItem>; // Holds the authoritative data for saved items

  // Search State
  queries: FoodQuery[];
  results: FoodResult[];
  loading: boolean;
  dataTypeFilter: DataTypeFilter;
  existingFdcIds: Set<number>; // Tracks FDC IDs already in Notion

  // Actions
  toggleSidebar: () => void;
  toggleSearchModal: (isOpen?: boolean) => void;
  toggleNotionModal: (isOpen?: boolean) => void;

  setNotionDatabaseId: (id: string) => void;
  loadDatabaseInfo: () => Promise<void>;

  addQuery: () => void;
  removeQuery: (id: string) => void;
  updateQuery: (id: string, text: string) => void;
  updateDataTypeFilter: (filter: Partial<DataTypeFilter>) => void;
  searchAllFoods: () => Promise<void>;
  
  saveToNotion: (food: ProcessedFoodItem) => Promise<void>;
  updateNotionPage: (food: ProcessedFoodItem, pageId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // -----------------------------
  // INITIAL STATE
  // -----------------------------
  sidebarCollapsed: false,
  searchModalOpen: false,
  notionModalOpen: false,

  notionDatabaseId: '',
  databaseInfo: null,
  databaseLoading: false,
  savingItems: {},
  pageIds: {},
  savedFoodItems: {},

  queries: [{ id: uuidv4(), text: '' }],
  results: [],
  loading: false,
  dataTypeFilter: { foundation: true, branded: false },
  existingFdcIds: new Set(),

  // -----------------------------
  // ACTIONS
  // -----------------------------

  // UI Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleSearchModal: (isOpen) => set((state) => ({ searchModalOpen: isOpen ?? !state.searchModalOpen })),
  toggleNotionModal: (isOpen) => set((state) => ({ notionModalOpen: isOpen ?? !state.notionModalOpen })),

  // Notion Actions
  setNotionDatabaseId: (id) => set({ notionDatabaseId: id }),
  loadDatabaseInfo: async () => {
    const { notionDatabaseId } = get();
    if (!notionDatabaseId.trim()) return;

    set({ databaseLoading: true });
    try {
      const info = await getNotionDatabaseInfo(notionDatabaseId);
      set({ databaseInfo: info, databaseLoading: false });
      
      const ids = await getExistingFdcIds(notionDatabaseId);
      const idSet = new Set(ids);
      set({ existingFdcIds: idSet });

      if (idSet.size > 0) {
        const response = await fetch(`/api/notion/database/${notionDatabaseId}/pages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fdcIds: Array.from(idSet) }),
        });
        const { pages } = await response.json();
        const savedItemsMap = pages.reduce((acc: any, item: ProcessedFoodItem) => {
          acc[item.id] = item;
          return acc;
        }, {});
        set({ savedFoodItems: savedItemsMap });
      }

      toast.success(`Successfully connected to "${info.title}"`);
    } catch (error) {
      console.error('Failed to load database:', error);
      toast.error('Failed to connect to Notion database', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      set({ databaseInfo: null, databaseLoading: false });
    }
  },
  
  saveToNotion: async (food) => {
    const { notionDatabaseId } = get();
    set((state) => ({ savingItems: { ...state.savingItems, [food.id]: true } }));

    try {
      const result: NotionCreationResponse = await createNotionPage(food, notionDatabaseId);

      if (result.success && result.pageId) {
        toast.success(`"${result.foodName}" successfully added to Notion.`);
        set((state) => ({
          existingFdcIds: new Set(state.existingFdcIds).add(food.id),
          pageIds: { ...state.pageIds, [food.id]: result.pageId! },
          savedFoodItems: { ...state.savedFoodItems, [food.id]: food },
        }));
      } else {
        toast.error(result.message, {
          description: `Failed to add "${result.foodName}" to Notion.`,
        });
      }
    } catch (error) {
      console.error('Error saving to Notion:', error);
      toast.error('Failed to save to Notion', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      set((state) => ({ savingItems: { ...state.savingItems, [food.id]: false } }));
    }
  },

  updateNotionPage: async (food, pageId) => {
    set((state) => ({ savingItems: { ...state.savingItems, [food.id]: true } }));
    try {
      const result = await apiUpdateNotionPage(
        pageId,
        food,
        food.servingSizeDisplay ?? `${food.servingSize} ${food.servingSizeUnit}`
      );
      if (result.success) {
        toast.success(`Successfully updated "${food.description}" in Notion.`);
        
        // Update the local state to reflect the change
        set((state) => ({
          savedFoodItems: { ...state.savedFoodItems, [food.id]: food },
        }));

      } else {
        toast.error(result.message, { description: `Failed to update ${food.description}.` });
      }
    } catch (error) {
      console.error('Error updating Notion page:', error);
      toast.error('Failed to update Notion page', { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set((state) => ({ savingItems: { ...state.savingItems, [food.id]: false } }));
    }
  },

  // Search Actions
  addQuery: () => set((state) => ({
    queries: [...state.queries, { id: uuidv4(), text: '' }]
  })),
  removeQuery: (id) => set((state) => ({
    queries: state.queries.filter(q => q.id !== id)
  })),
  updateQuery: (id, text) => set((state) => ({
    queries: state.queries.map(q => (q.id === id ? { ...q, text } : q))
  })),
  updateDataTypeFilter: (filter) => set((state) => ({
    dataTypeFilter: { ...state.dataTypeFilter, ...filter }
  })),

  searchAllFoods: async () => {
    const { queries, dataTypeFilter } = get();
    const activeQueries = queries.filter(q => q.text.trim());

    if (activeQueries.length === 0) {
      toast.error('Please enter at least one search term.');
      return;
    }

    set({ loading: true, results: [] });

    try {
      const dataTypes = Object.entries(dataTypeFilter)
        .filter(([, value]) => value)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
      
      const searchPromises = activeQueries.map(async (query) => {
        const response = await searchFoods(query.text, dataTypes);
        return {
          queryId: query.id,
          queryText: query.text,
          foods: response.foods || [],
        };
      });

      const searchResults = await Promise.all(searchPromises);
      
      set({ results: searchResults, loading: false });
      
      const totalCount = searchResults.reduce((sum, res) => sum + res.foods.length, 0);
      if (totalCount > 0) {
        toast.success(`Found ${totalCount} food items matching your search.`);
      } else {
        toast.info('No results found for your search terms.');
      }

    } catch (error) {
      console.error('Error searching foods:', error);
      toast.error('Search failed. Please try again.');
      set({ loading: false });
    }
  },
})); 