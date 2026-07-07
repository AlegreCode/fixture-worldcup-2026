import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { parseLocalDate } from '../../api/queries/useFixtures';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const BracketMatch = ({ match, teamsMap, reverse = false, domId }) => {
  const { i18n } = useTranslation();
  if (!match) return <div id={domId} className="w-full h-[40px] opacity-0" />;

  const isLive = match.finished === 'FALSE' && match.time_elapsed !== 'notstarted';
  const isFinished = match.finished === 'TRUE';

  const homeTeamInfo = teamsMap ? teamsMap[match.home_team_id] : null;
  const awayTeamInfo = teamsMap ? teamsMap[match.away_team_id] : null;
  
  const homeFlag = homeTeamInfo?.flag;
  const awayFlag = awayTeamInfo?.flag;
  const homeCode = homeTeamInfo?.fifa_code || 'TBD';
  const awayCode = awayTeamInfo?.fifa_code || 'TBD';

  const dateLocale = i18n.language.startsWith('es') ? es : enUS;
  const date = match._parsedDate || parseLocalDate(match.local_date);
  const dateStr = !isNaN(date.getTime()) ? format(date, 'MMM d HH:mm', { locale: dateLocale }) : match.local_date;

  const renderTeam = (flag, code, reverseSide) => (
    <div className={`flex items-center gap-1.5 ${reverseSide ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-gray-800 shadow-inner">
        {flag ? (
          <img src={flag} alt={code} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[8px] font-bold text-gray-400">{code}</span>
        )}
      </div>
      <span className="text-[9px] font-bold text-gray-300 hidden md:block tracking-wider">{code}</span>
    </div>
  );

  const homeScore = match.home_score !== 'null' && match.home_score !== null ? match.home_score : '-';
  const awayScore = match.away_score !== 'null' && match.away_score !== null ? match.away_score : '-';

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      {/* Date */}
      <span className="absolute -top-4 text-[8px] text-gray-500 font-medium uppercase tracking-widest">{dateStr}</span>
      
      <Link to={`/fixtures/${match.id}`} className="block w-full">
        <div id={domId} className={`
          flex items-center justify-between px-1.5 py-1.5 rounded-full min-w-fit
          bg-[#1a233a] border border-[#2d3a5a] shadow-lg
          hover:border-[var(--color-primary)] hover:shadow-[0_0_15px_var(--color-primary)] transition-all duration-300
          ${reverse ? 'flex-row-reverse' : 'flex-row'}
        `}>
          {renderTeam(homeFlag, homeCode, reverse)}
          
          <div className="flex flex-col items-center justify-center flex-1 mx-1">
            <div className={`flex items-center gap-1 font-bold font-['Outfit'] text-xs ${(isLive || isFinished) ? 'text-white' : 'text-gray-500'}`}>
              <span>{homeScore}</span>
              <span className="text-[8px] mx-0.5 text-gray-600">VS</span>
              <span>{awayScore}</span>
            </div>
            {isLive && <span className="text-[8px] text-red-500 font-bold animate-pulse absolute -bottom-3">LIVE</span>}
          </div>

          {renderTeam(awayFlag, awayCode, !reverse)}
        </div>
      </Link>
    </div>
  );
};

export default BracketMatch;
