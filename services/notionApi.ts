import axios from 'axios';
import { ProcessedFoodItem, NotionCreationResponse, NotionDatabaseInfo, NotionUpdateResponse } from '@/types';

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
      servingSizeDisplay: food.servingSizeDisplay ?? `${food.servingSize} ${food.servingSizeUnit}`,
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

export const updateNotionPage = async (
  pageId: string,
  food: ProcessedFoodItem,
  servingSizeDisplay: string
): Promise<NotionUpdateResponse> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/notion/pages/${pageId}`,
      { food, servingSizeDisplay }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update Notion page',
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};

export const getExistingFdcIds = async (databaseId: string): Promise<number[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notion/database/${databaseId}/ids`);
      return response.data.fdcIds || [];
    } catch (error) {
      console.error('Error fetching existing FDC IDs:', error);
      // Return an empty array on error so the app can continue to function
      return [];
    }
};

export const getFdcIdPageMap = async (
  databaseId: string
): Promise<Record<number, string>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/notion/database/${databaseId}/map`
    );
    return response.data.map || {};
  } catch (error) {
    console.error('Error fetching FDC ID map:', error);
    return {};
  }
};

export const getNotionPage = async (pageId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notion/pages/${pageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    throw error;
  }
};
