import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFixtures, parseLocalDate } from '../api/queries/useFixtures';
import { useTeamsMap } from '../api/queries/useTeams';
import MatchCard from '../components/fixtures/MatchCard';
import Loader from '../components/common/Loader';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const FixturesPage = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language.startsWith('es') ? es : enUS;
  const [filterType, setFilterType] = useState('all');

  const { data, isLoading, error } = useFixtures();
  const { data: teamsMap, isLoading: isLoadingTeams } = useTeamsMap();

  const filteredAndGrouped = useMemo(() => {
    if (!data) return {};

    let filtered = data;
    if (filterType !== 'all') {
      filtered = data.filter(g => g.type === filterType);
    }

    // Agrupar por fecha
    return filtered
      .sort((a, b) => a._parsedDate - b._parsedDate)
      .reduce((groups, match) => {
        const dateStr = match.local_date?.split(' ')[0] || 'unknown';
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(match);
        return groups;
      }, {});
  }, [data, filterType]);

  if (isLoading || isLoadingTeams) return <Loader />;
  if (error) return <div className="text-red-500 text-center py-10">Error al cargar los partidos.</div>;

  const typeFilters = [
    { value: 'all', label: 'Todos' },
    { value: 'group', label: 'Grupos' },
    { value: 'r32', label: 'Ronda 32' },
    { value: 'r16', label: 'Octavos' },
    { value: 'qf', label: 'Cuartos' },
    { value: 'sf', label: 'Semis' },
    { value: 'final', label: 'Final' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold font-['Outfit']">{t('fixtures')}</h1>
        <div className="flex gap-2 flex-wrap">
          {typeFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === f.value
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {Object.keys(filteredAndGrouped).map(dateStr => {
          const firstMatch = filteredAndGrouped[dateStr][0];
          const date = firstMatch?._parsedDate || parseLocalDate(dateStr);

          return (
            <div key={dateStr} className="space-y-4">
              <h2 className="text-xl font-semibold sticky top-0 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] py-2 z-10 border-b border-gray-200 dark:border-gray-800">
                {!isNaN(date.getTime()) ? format(date, 'EEEE, d MMMM yyyy', { locale: dateLocale }) : dateStr}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAndGrouped[dateStr].map(match => (
                  <MatchCard key={match.id} match={match} teamsMap={teamsMap} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FixturesPage;
