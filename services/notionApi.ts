import axios from 'axios';
import { ProcessedFoodItem, NotionCreationResponse, NotionDatabaseInfo } from '@/types';

const API_BASE_URL = '/api';

export const getNotionDatabaseInfo = async (databaseId: string): Promise<NotionDatabaseInfo> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notion/database/${databaseId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        throw new Error(
            error.response?.data?.error || error.message || 'Failed to fetch database information'
        );
    }
    throw new Error('An unexpected error occurred');
  }
};

export const createNotionPage = async (
  food: ProcessedFoodItem,
  databaseId: string
): Promise<NotionCreationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/notion/pages`, {
      food,
      databaseId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to create Notion page',
            foodName: food.description,
        };
    }
    return {
        success: false,
        message: 'An unexpected error occurred',
        foodName: food.description,
    }
  }
}; 