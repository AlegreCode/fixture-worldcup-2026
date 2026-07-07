import React from 'react';

const TeamBadge = ({ team, size = 'md', hideName = false }) => {
  if (!team) return null;

  // Soporte para ambos formatos de datos (nombre del campo puede variar)
  const name = team.name_en || team.name || '';
  const logo = team.flag || team.logo || '';
  const isArgentina = name === 'Argentina' || team.fifa_code === 'ARG';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg font-bold',
  };

  const highlightClass = isArgentina
    ? 'ring-2 ring-yellow-400 dark:ring-[var(--color-secondary)] shadow-[0_0_10px_rgba(212,168,67,0.7)] rounded-full'
    : '';

  return (
    <div className={`flex flex-col items-center gap-2 ${isArgentina ? 'scale-105 transition-transform' : ''}`}>
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${highlightClass}`}>
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-contain drop-shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
            {(team.fifa_code || name.slice(0, 3)).toUpperCase()}
          </div>
        )}
      </div>
      {!hideName && (
        <span className={`text-center font-medium ${isArgentina ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]'} ${sizeClasses[size].split(' ')[2]}`}>
          {name}
        </span>
      )}
    </div>
  );
};

export default TeamBadge;
