import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';

export const useStadiums = () => {
  return useQuery({
    queryKey: ['stadiums'],
    queryFn: async () => {
      const data = await axiosClient.get(ENDPOINTS.STADIUMS);
      return data.stadiums || data || [];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
