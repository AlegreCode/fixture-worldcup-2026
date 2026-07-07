import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { ENDPOINTS } from '../endpoints';

/**
 * Parsea la fecha de la API (formato "MM/DD/YYYY HH:mm") a un Date válido.
 */
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date(0);
  const [datePart, timePart] = dateStr.split(' ');
  const [month, day, year] = datePart.split('/');
  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart || '00:00'}:00`);
}

export const useFixtures = () => {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: async () => {
      const data = await axiosClient.get(ENDPOINTS.GAMES);
      const games = data.games || data || [];
      // Enriquecer cada partido con un Date parseado
      return games.map(g => ({ ...g, _parsedDate: parseLocalDate(g.local_date) }));
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });
};

export const useLiveFixtures = () => {
  return useQuery({
    queryKey: ['fixtures', 'live'],
    queryFn: async () => {
      const data = await axiosClient.get(ENDPOINTS.GAMES);
      const games = data.games || data || [];
      return games.filter(g =>
        g.finished === 'FALSE' &&
        g.time_elapsed !== 'notstarted'
      );
    },
    refetchInterval: 60000, // 1 min
  });
};

/**
 * Hooks de conveniencia que filtran client-side
 */
export const useNextFixtures = (count = 4) => {
  const { data: allGames, ...rest } = useFixtures();

  const nextGames = allGames
    ?.filter(g => g.finished === 'FALSE' && g.time_elapsed === 'notstarted')
    .sort((a, b) => a._parsedDate - b._parsedDate)
    .slice(0, count) || [];

  return { data: nextGames, ...rest };
};

export const useLastResults = (count = 4) => {
  const { data: allGames, ...rest } = useFixtures();

  const lastGames = allGames
    ?.filter(g => g.finished === 'TRUE')
    .sort((a, b) => b._parsedDate - a._parsedDate)
    .slice(0, count) || [];

  return { data: lastGames, ...rest };
};

export { parseLocalDate };
