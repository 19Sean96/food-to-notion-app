import { useQuery } from '@tanstack/react-query';
import { getFoodDetails, processFoodDetails } from '@/services/usdaApi';
import { ProcessedFoodItem } from '@/types';

export const useFoodDetails = (fdcId: number) => {
  return useQuery<ProcessedFoodItem, Error>({
    queryKey: ['foodDetails', fdcId],
    queryFn: async () => {
      const details = await getFoodDetails(fdcId);
      return processFoodDetails(details);
    },
    enabled: !!fdcId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 