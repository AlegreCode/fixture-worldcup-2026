import React from 'react';
import { useTranslation } from 'react-i18next';
import LivePulse from '../common/LivePulse';
import { Link } from 'react-router-dom';
import { parseLocalDate } from '../../api/queries/useFixtures';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const MatchCard = ({ match, teamsMap }) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language.startsWith('es') ? es : enUS;

  const date = match._parsedDate || parseLocalDate(match.local_date);
  const isLive = match.finished === 'FALSE' && match.time_elapsed !== 'notstarted';
  const isFinished = match.finished === 'TRUE';

  const homeTeamInfo = teamsMap ? teamsMap[match.home_team_id] : null;
  const awayTeamInfo = teamsMap ? teamsMap[match.away_team_id] : null;

  const homeName = match.home_team_name_en || match.home_team_label || homeTeamInfo?.name_en || t('tbd');
  const awayName = match.away_team_name_en || match.away_team_label || awayTeamInfo?.name_en || t('tbd');
  
  const homeFlag = homeTeamInfo?.flag;
  const awayFlag = awayTeamInfo?.flag;

  const hasArgentina = homeName === 'Argentina' || awayName === 'Argentina';

  // Etiqueta de la ronda
  const roundLabels = {
    group: `Grupo ${match.group}`,
    r32: 'Ronda de 32',
    r16: 'Octavos',
    qf: 'Cuartos',
    sf: 'Semifinal',
    third: '3er Puesto',
    final: 'Final',
  };
  const roundLabel = roundLabels[match.type] || match.type;

  return (
    <Link to={`/fixtures/${match.id}`} className="block">
      <div className={`
        relative overflow-hidden rounded-xl p-4 transition-all duration-300
        bg-white/60 dark:bg-[#12182b]/80 backdrop-blur-sm border
        hover:-translate-y-1 hover:shadow-xl
        ${hasArgentina ? 'border-[var(--color-secondary)] shadow-[0_0_15px_rgba(212,168,67,0.2)]' : 'border-gray-200 dark:border-gray-800 shadow-md'}
      `}>
        {/* Header */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="font-semibold">
            {!isNaN(date.getTime()) ? format(date, 'MMM d, yyyy - HH:mm', { locale: dateLocale }) : match.local_date}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              {roundLabel}
            </span>
            {isLive && (
              <div className="flex items-center gap-1 text-red-500 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                <LivePulse /> LIVE
              </div>
            )}
          </div>
        </div>

        {/* Teams and Score */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center gap-2 w-1/3">
            {homeFlag ? (
              <img src={homeFlag} alt={homeName} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                {homeTeamInfo?.fifa_code || homeName.slice(0, 3).toUpperCase()}
              </div>
            )}
            <span className={`text-center font-semibold text-sm ${homeName === 'Argentina' ? 'text-[var(--color-secondary)]' : ''}`}>
              {homeName}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-4 w-1/3">
            <div className="text-3xl font-bold font-['Outfit'] tracking-tight whitespace-nowrap">
              {(isFinished || isLive) ? (
                <span>
                  {match.home_score ?? 0} <span className="text-gray-400 mx-1">-</span> {match.away_score ?? 0}
                </span>
              ) : (
                <span className="text-xl text-gray-400">VS</span>
              )}
            </div>
            {isLive && match.time_elapsed && (
              <span className="text-xs text-red-500 font-bold mt-1 animate-pulse">
                {match.time_elapsed}'
              </span>
            )}
            {isFinished && (
              <span className="text-xs text-gray-500 mt-1 uppercase font-semibold">FT</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-1/3">
            {awayFlag ? (
              <img src={awayFlag} alt={awayName} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                {awayTeamInfo?.fifa_code || awayName.slice(0, 3).toUpperCase()}
              </div>
            )}
            <span className={`text-center font-semibold text-sm ${awayName === 'Argentina' ? 'text-[var(--color-secondary)]' : ''}`}>
              {awayName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
