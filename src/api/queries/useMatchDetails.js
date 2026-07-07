import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';

export const useMatchDetails = (matchId) => {
  return useQuery({
    queryKey: ['matchDetails', matchId],
    queryFn: async () => {
      const data = await axiosClient.get(`${ENDPOINTS.GAME}/${matchId}`);
      return data.game || data;
    },
    enabled: !!matchId,
    staleTime: 2 * 60 * 1000,
  });
};
