import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMatchDetails } from '../api/queries/useMatchDetails';
import { useTeamsMap } from '../api/queries/useTeams';
import { useStadiums } from '../api/queries/useStadiums';
import Loader from '../components/common/Loader';
import { ChevronLeft } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { fadeInUp } from '../animations/gsapAnimations';
import { parseLocalDate } from '../api/queries/useFixtures';
import { format } from 'date-fns';

const MatchDetailPage = () => {
  const { id } = useParams();
  const { data: match, isLoading: isLoadingMatch, error } = useMatchDetails(id);
  const { data: stadiums, isLoading: isLoadingStadiums } = useStadiums();
  const { data: teamsMap, isLoading: isLoadingTeams } = useTeamsMap();

  const containerRef = useGSAP(() => {
    fadeInUp('.match-hero');
    fadeInUp('.detail-panel', 0.2);
  });

  if (isLoadingMatch || isLoadingStadiums || isLoadingTeams) return <Loader />;
  if (error || !match) return <div className="text-center py-10 text-red-500">Error al cargar detalles del partido.</div>;

  const date = parseLocalDate(match.local_date);
  const stadium = stadiums?.find(s => s.id === match.stadium_id);
  const isFinished = match.finished === 'TRUE';
  const isLive = match.finished === 'FALSE' && match.time_elapsed !== 'notstarted';

  const roundLabels = {
    group: `Grupo ${match.group}`,
    r32: 'Ronda de 32',
    r16: 'Octavos de Final',
    qf: 'Cuartos de Final',
    sf: 'Semifinal',
    third: 'Tercer Puesto',
    final: 'Final',
  };

  return (
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto">
      <Link to="/fixtures" className="inline-flex items-center text-gray-500 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-secondary)] transition-colors">
        <ChevronLeft size={20} /> Volver a partidos
      </Link>

      {/* Hero Scoreboard */}
      <div className="match-hero bg-gradient-to-br from-[var(--color-primary-dark)] to-[#12182b] rounded-2xl shadow-xl overflow-hidden text-white p-8">
        <div className="text-center mb-2 text-sm font-bold text-gray-300">
          {roundLabels[match.type] || match.type}
        </div>
        <div className="text-center mb-6 text-xs text-gray-400">
          {!isNaN(date.getTime()) && format(date, 'PPPp')}
        </div>

        <div className="flex justify-between items-center">
          <div className="w-1/3 flex flex-col items-center">
            {teamsMap?.[match.home_team_id]?.flag ? (
              <img src={teamsMap[match.home_team_id].flag} alt="Home Flag" className="w-16 h-16 object-contain mb-2 drop-shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold mb-2">TBD</div>
            )}
            <p className={`text-xl font-bold ${(match.home_team_name_en === 'Argentina') ? 'text-[var(--color-secondary)]' : ''}`}>
              {match.home_team_name_en || match.home_team_label || 'TBD'}
            </p>
          </div>
          <div className="w-1/3 text-center">
            <div className="text-5xl font-bold font-['Outfit'] mb-2 whitespace-nowrap">
              {(isFinished || isLive) ? (
                <span>{match.home_score} <span className="text-gray-400">-</span> {match.away_score}</span>
              ) : (
                <span className="text-3xl text-gray-400">VS</span>
              )}
            </div>
            {isLive && <span className="text-red-400 text-sm font-bold animate-pulse">{match.time_elapsed}'</span>}
            {isFinished && <span className="text-gray-400 text-sm uppercase font-semibold">FT</span>}
          </div>
          <div className="w-1/3 flex flex-col items-center">
            {teamsMap?.[match.away_team_id]?.flag ? (
              <img src={teamsMap[match.away_team_id].flag} alt="Away Flag" className="w-16 h-16 object-contain mb-2 drop-shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold mb-2">TBD</div>
            )}
            <p className={`text-xl font-bold ${(match.away_team_name_en === 'Argentina') ? 'text-[var(--color-secondary)]' : ''}`}>
              {match.away_team_name_en || match.away_team_label || 'TBD'}
            </p>
          </div>
        </div>
      </div>

      {/* Detail panels */}
      <div className="detail-panel grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scorers */}
        <div className="bg-white dark:bg-[#12182b] rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 dark:border-gray-700">⚽ Goleadores</h3>
          {(!match.home_scorers || match.home_scorers === 'null') && (!match.away_scorers || match.away_scorers === 'null') ? (
            <p className="text-gray-500">No hay goles registrados.</p>
          ) : (
            <div className="space-y-3">
              {match.home_scorers && match.home_scorers !== 'null' && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">{match.home_team_name_en}</p>
                  <p className="font-medium">{match.home_scorers}</p>
                </div>
              )}
              {match.away_scorers && match.away_scorers !== 'null' && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">{match.away_team_name_en}</p>
                  <p className="font-medium">{match.away_scorers}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stadium */}
        <div className="bg-white dark:bg-[#12182b] rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 dark:border-gray-700">🏟️ Estadio</h3>
          {stadium ? (
            <div className="space-y-2">
              <p className="font-semibold text-lg">{stadium.name_en || stadium.fifa_name}</p>
              <p className="text-gray-500">{stadium.city_en}, {stadium.country_en}</p>
              <p className="text-sm text-gray-400">Capacidad: {stadium.capacity?.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">Información del estadio no disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPage;
