import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';

export const useStandings = () => {
  return useQuery({
    queryKey: ['standings'],
    queryFn: async () => {
      const data = await axiosClient.get(ENDPOINTS.GROUPS);
      return data.groups || data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
