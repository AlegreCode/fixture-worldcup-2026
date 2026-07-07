import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const data = await axiosClient.get(ENDPOINTS.TEAMS);
      return data.teams || data || [];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Devuelve un Map de team_id → team object para lookups rápidos
 */
export const useTeamsMap = () => {
  const { data: teams, ...rest } = useTeams();

  const teamsMap = teams?.reduce((map, team) => {
    map[team.id] = team;
    return map;
  }, {}) || {};

  return { data: teamsMap, ...rest };
};
