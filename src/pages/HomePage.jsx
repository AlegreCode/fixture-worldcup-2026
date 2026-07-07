import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveFixtures, useNextFixtures, useLastResults } from '../api/queries/useFixtures';
import { useTeamsMap } from '../api/queries/useTeams';
import MatchCard from '../components/fixtures/MatchCard';
import Loader from '../components/common/Loader';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { fadeInUp, staggerCards } from '../animations/gsapAnimations';

const HomePage = () => {
  const { t } = useTranslation();

  const { data: liveData, isLoading: isLoadingLive } = useLiveFixtures();
  const { data: nextMatches, isLoading: isLoadingNext } = useNextFixtures(4);
  const { data: lastMatches, isLoading: isLoadingLast } = useLastResults(4);
  const { data: teamsMap, isLoading: isLoadingTeams } = useTeamsMap();

  const containerRef = useGSAP(() => {
    fadeInUp('.hero-section');
    staggerCards('.match-card-item', 0.12);
  }, [isLoadingNext, isLoadingLast, isLoadingTeams]);

  if (isLoadingLive || isLoadingNext || isLoadingLast || isLoadingTeams) {
    return <Loader />;
  }

  const liveMatches = liveData || [];

  return (
    <div ref={containerRef} className="space-y-10">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Outfit']">{t('title')}</h1>
          <p className="text-lg opacity-90 mb-6 max-w-xl">
            {t('hero_subtitle') || 'Sigue toda la acción de la Copa Mundial 2026 en Estados Unidos, México y Canadá.'}
          </p>
          <Link to="/fixtures" className="inline-flex items-center gap-2 bg-[var(--color-secondary)] hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold transition-colors">
            {t('view_calendar') || 'Ver Calendario Completo'} <ChevronRight size={20} />
          </Link>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20 text-[120px]">🏆</div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            {t('live')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <div key={match.id} className="match-card-item">
                <MatchCard match={match} teamsMap={teamsMap} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Next Matches */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold">{t('next_matches')}</h2>
            <Link to="/fixtures" className="text-[var(--color-primary)] dark:text-[var(--color-secondary)] hover:underline text-sm font-medium">
              {t('view_all') || 'Ver todos'}
            </Link>
          </div>
          <div className="space-y-4">
            {nextMatches.map((match) => (
              <div key={match.id} className="match-card-item">
                <MatchCard match={match} teamsMap={teamsMap} />
              </div>
            ))}
          </div>
        </section>

        {/* Latest Results */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold">{t('latest_results')}</h2>
          </div>
          <div className="space-y-4">
            {lastMatches.map((match) => (
              <div key={match.id} className="match-card-item">
                <MatchCard match={match} teamsMap={teamsMap} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
