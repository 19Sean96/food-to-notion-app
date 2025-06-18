import { useQuery } from '@tanstack/react-query';
import { getNotionPage } from '@/services/notionApi';

export const useNotionPage = (pageId?: string) => {
  return useQuery({
    queryKey: ['notionPage', pageId],
    queryFn: () => getNotionPage(pageId!),
    enabled: !!pageId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
