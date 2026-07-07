import React from 'react';

const GroupTable = ({ groupData, teamsMap }) => {
  const groupName = `Grupo ${groupData.name}`;
  const teams = groupData.teams || [];

  return (
    <div className="bg-white dark:bg-[#12182b] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-white font-semibold font-['Outfit']">{groupName}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Equipo</th>
              <th scope="col" className="px-2 py-3 text-center">GF</th>
              <th scope="col" className="px-2 py-3 text-center">GC</th>
              <th scope="col" className="px-2 py-3 text-center">DG</th>
              <th scope="col" className="px-4 py-3 text-center font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams
              .sort((a, b) => parseInt(b.pts || 0) - parseInt(a.pts || 0))
              .map((teamStats, index) => {
                const teamInfo = teamsMap?.[teamStats.team_id];
                const teamName = teamInfo?.name_en || `Team ${teamStats.team_id}`;
                const isArgentina = teamName === 'Argentina';
                const gf = parseInt(teamStats.gf || 0);
                const ga = parseInt(teamStats.ga || 0);
                const isQualified = index < 2;

                return (
                  <tr
                    key={teamStats.team_id}
                    className={`
                      border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors
                      ${isArgentina ? 'bg-blue-50/50 dark:bg-[#d4a843]/10' : 'bg-white dark:bg-transparent'}
                    `}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${isQualified ? 'bg-[var(--color-accent)] text-white' : 'text-gray-500 bg-gray-100 dark:bg-gray-800'}`}>
                        {index + 1}
                      </span>
                      {teamInfo?.flag && (
                        <img src={teamInfo.flag} alt={teamName} className="w-6 h-6 object-contain" />
                      )}
                      <span className={isArgentina ? 'text-[var(--color-secondary)] font-bold' : ''}>
                        {teamName}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center">{gf}</td>
                    <td className="px-2 py-3 text-center">{ga}</td>
                    <td className="px-2 py-3 text-center">{gf - ga}</td>
                    <td className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">{teamStats.pts}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTable;
