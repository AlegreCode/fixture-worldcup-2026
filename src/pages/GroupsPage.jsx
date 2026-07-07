import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStandings } from '../api/queries/useStandings';
import { useTeamsMap } from '../api/queries/useTeams';
import GroupTable from '../components/standings/GroupTable';
import Loader from '../components/common/Loader';
import { useGSAP } from '../hooks/useGSAP';
import { staggerCards } from '../animations/gsapAnimations';

const GroupsPage = () => {
  const { t } = useTranslation();
  const { data: groups, isLoading: loadingGroups, error } = useStandings();
  const { data: teamsMap, isLoading: loadingTeams } = useTeamsMap();

  const containerRef = useGSAP(() => {
    staggerCards('.group-card', 0.08);
  }, [loadingGroups, loadingTeams]);

  if (loadingGroups || loadingTeams) return <Loader />;
  if (error) return <div className="text-red-500 text-center py-10">Error al cargar los grupos.</div>;

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['Outfit']">{t('groups')}</h1>
        <p className="text-gray-500 dark:text-gray-400">12 Grupos • 48 Equipos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups?.sort((a, b) => a.name.localeCompare(b.name)).map((groupData) => (
          <div key={groupData.name} className="group-card">
            <GroupTable groupData={groupData} teamsMap={teamsMap} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
