import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFixtures } from '../api/queries/useFixtures';
import { useTeamsMap } from '../api/queries/useTeams';
import BracketMatch from '../components/fixtures/BracketMatch';
import Loader from '../components/common/Loader';



const KnockoutPage = () => {
  const { t } = useTranslation();
  const { data: fixtures, isLoading: isLoadingFixtures } = useFixtures();
  const { data: teamsMap, isLoading: isLoadingTeams } = useTeamsMap();

  const containerRef = useRef(null);
  const [svgPaths, setSvgPaths] = useState([]);

  const { leftSide, rightSide, final, third, allR16, allQf, allSf } = useMemo(() => {
    const empty = { leftSide: { r16: Array(4).fill(null), qf: Array(2).fill(null), sf: [null] }, rightSide: { sf: [null], qf: Array(2).fill(null), r16: Array(4).fill(null) }, final: null, third: null, allR16: Array(8).fill(null), allQf: Array(4).fill(null), allSf: Array(2).fill(null) };
    if (!fixtures) return empty;

    // Index matches by their numeric ID
    const byId = {};
    fixtures.forEach(f => { byId[f.id] = f; });

    // Extract the referenced match ID from a label like "Winner Match 89"
    const extractId = (label) => {
      if (!label) return null;
      const m = String(label).match(/Match\s+(\d+)/i);
      return m ? m[1] : null;
    };

    // All matches by type (for mobile list view)
    const getAll = (type) => fixtures.filter(f => f.type === type).sort((a, b) => a._parsedDate - b._parsedDate);
    const allR16 = getAll('r16');
    const allQf  = getAll('qf');
    const allSf  = getAll('sf');

    const finalMatch = fixtures.find(f => f.type === 'final') || null;
    const thirdMatch = fixtures.find(f => f.type === 'third') || null;

    if (!finalMatch) return { ...empty, final: finalMatch, third: thirdMatch, allR16, allQf, allSf };

    // Walk the tree: Final → SF → QF → R16
    const sf1Id = extractId(finalMatch.home_team_label); // left SF
    const sf2Id = extractId(finalMatch.away_team_label); // right SF
    const sf1 = byId[sf1Id] || null;
    const sf2 = byId[sf2Id] || null;

    // Left side QFs from SF1
    const qfL0Id = extractId(sf1?.home_team_label);
    const qfL1Id = extractId(sf1?.away_team_label);
    const qfL0 = byId[qfL0Id] || null;
    const qfL1 = byId[qfL1Id] || null;

    // Right side QFs from SF2
    const qfR0Id = extractId(sf2?.home_team_label);
    const qfR1Id = extractId(sf2?.away_team_label);
    const qfR0 = byId[qfR0Id] || null;
    const qfR1 = byId[qfR1Id] || null;

    // Left R16s from left QFs
    const r16L0 = byId[extractId(qfL0?.home_team_label)] || null;
    const r16L1 = byId[extractId(qfL0?.away_team_label)] || null;
    const r16L2 = byId[extractId(qfL1?.home_team_label)] || null;
    const r16L3 = byId[extractId(qfL1?.away_team_label)] || null;

    // Right R16s from right QFs
    const r16R0 = byId[extractId(qfR0?.home_team_label)] || null;
    const r16R1 = byId[extractId(qfR0?.away_team_label)] || null;
    const r16R2 = byId[extractId(qfR1?.home_team_label)] || null;
    const r16R3 = byId[extractId(qfR1?.away_team_label)] || null;

    return {
      allR16,
      allQf,
      allSf,
      leftSide: {
        r16: [r16L0, r16L1, r16L2, r16L3],
        qf:  [qfL0, qfL1],
        sf:  [sf1],
      },
      rightSide: {
        sf:  [sf2],
        qf:  [qfR0, qfR1],
        r16: [r16R0, r16R1, r16R2, r16R3],
      },
      final: finalMatch,
      third: thirdMatch,
    };
  }, [fixtures]);


  // SVG drawing logic
  useEffect(() => {
    if (isLoadingFixtures || isLoadingTeams || !containerRef.current) return;

    const drawLines = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const getRect = (id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect() : null;
      };

      const connections = [
        // LTR
        { from: ['r16-l-0', 'r16-l-1'], to: 'qf-l-0', dir: 'ltr' },
        { from: ['r16-l-2', 'r16-l-3'], to: 'qf-l-1', dir: 'ltr' },
        { from: ['qf-l-0', 'qf-l-1'], to: 'sf-l-0', dir: 'ltr' },
        { from: ['sf-l-0'], to: 'final', dir: 'ltr' },
        // RTL
        { from: ['r16-r-0', 'r16-r-1'], to: 'qf-r-0', dir: 'rtl' },
        { from: ['r16-r-2', 'r16-r-3'], to: 'qf-r-1', dir: 'rtl' },
        { from: ['qf-r-0', 'qf-r-1'], to: 'sf-r-0', dir: 'rtl' },
        { from: ['sf-r-0'], to: 'final', dir: 'rtl' },
      ];

      const newPaths = [];

      connections.forEach(({ from, to, dir }) => {
        const toRect = getRect(to);
        if (!toRect) return;

        const toX = dir === 'ltr' ? toRect.left - containerRect.left : toRect.right - containerRect.left;
        const toY = toRect.top - containerRect.top + toRect.height / 2;

        if (from.length === 2) {
          const f1Rect = getRect(from[0]);
          const f2Rect = getRect(from[1]);
          if (!f1Rect || !f2Rect) return;

          const f1X = dir === 'ltr' ? f1Rect.right - containerRect.left : f1Rect.left - containerRect.left;
          const f1Y = f1Rect.top - containerRect.top + f1Rect.height / 2;

          const f2X = dir === 'ltr' ? f2Rect.right - containerRect.left : f2Rect.left - containerRect.left;
          const f2Y = f2Rect.top - containerRect.top + f2Rect.height / 2;

          const midX = (f1X + toX) / 2;
          
          newPaths.push({
            d: `M ${f1X} ${f1Y} H ${midX} V ${toY} H ${toX} M ${f2X} ${f2Y} H ${midX} V ${toY} H ${toX}`,
            color: 'stroke-gray-700'
          });
        } else if (from.length === 1) {
          const f1Rect = getRect(from[0]);
          if (!f1Rect) return;

          const f1X = dir === 'ltr' ? f1Rect.right - containerRect.left : f1Rect.left - containerRect.left;
          const f1Y = f1Rect.top - containerRect.top + f1Rect.height / 2;

          newPaths.push({
            d: `M ${f1X} ${f1Y} L ${toX} ${toY}`,
            color: 'stroke-[var(--color-primary)]'
          });
        }
      });

      setSvgPaths(newPaths);
    };

    // Draw initially
    // We use setTimeout to ensure the DOM is fully painted
    const timeoutId = setTimeout(drawLines, 50);
    
    // Add resize listener
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(drawLines);
    });
    observer.observe(document.body);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [fixtures, isLoadingFixtures, isLoadingTeams]);

  if (isLoadingFixtures || isLoadingTeams) return <Loader />;

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">
      <h1 className="text-3xl font-bold font-['Outfit'] mb-6 z-10 px-4 xl:px-0">{t('knockout')}</h1>
      
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* =========================================
          VISTA DESKTOP (Tree convergente)
          ========================================= */}
      <div className="hidden xl:flex flex-1 relative w-full h-full pb-10 justify-center">
        
        {/* SVG Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <svg className="w-full h-full">
            {svgPaths.map((path, i) => (
              <path key={i} d={path.d} className={`${path.color} fill-none transition-all duration-300`} strokeWidth="2" strokeLinecap="round" />
            ))}
          </svg>
        </div>

        <div ref={containerRef} className="flex items-stretch justify-center min-h-[700px] h-full mx-auto px-2 gap-4 w-full relative z-10">
          
          {/* LADO IZQUIERDO */}
          {/* R16 Left */}
          <div className="flex flex-col justify-around py-4 flex-1 min-w-[120px] max-w-[180px]">
            <div className="text-center text-[10px] text-gray-500 font-bold mb-4">{t('round_of_16').toUpperCase()}</div>
            {leftSide.r16.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col justify-center relative">
                <BracketMatch match={m} teamsMap={teamsMap} domId={`r16-l-${i}`} />
              </div>
            ))}
          </div>

          {/* QF Left */}
          <div className="flex flex-col justify-around py-4 flex-1 min-w-[120px] max-w-[180px]">
            <div className="text-center text-[10px] text-gray-500 font-bold mb-4">{t('quarterfinals').toUpperCase()}</div>
            {leftSide.qf.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col justify-center relative">
                <BracketMatch match={m} teamsMap={teamsMap} domId={`qf-l-${i}`} />
              </div>
            ))}
          </div>

          {/* SF Left */}
          <div className="flex flex-col justify-around py-4 flex-1 min-w-[120px] max-w-[180px]">
            <div className="text-center text-[10px] text-gray-500 font-bold mb-4">{t('semifinals').toUpperCase()}</div>
            {leftSide.sf.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col justify-center relative">
                <BracketMatch match={m} teamsMap={teamsMap} domId={`sf-l-${i}`} />
              </div>
            ))}
          </div>

          {/* CENTRO: Trofeo, Final y 3er Puesto */}
          <div className="flex flex-col items-center justify-center w-[160px] relative z-20 gap-6">
            {/* Trophy Placeholder */}
            <div className="w-20 h-24 flex items-center justify-center text-5xl drop-shadow-[0_10px_20px_rgba(212,168,67,0.5)]">
              🏆
            </div>

            {/* Final */}
            <div className="flex flex-col items-center w-full">
              <div className="text-center text-[var(--color-secondary)] font-bold mb-2 tracking-widest text-xs">FINAL</div>
              <div className="relative w-full">
                <BracketMatch match={final} teamsMap={teamsMap} domId="final" />
              </div>
            </div>

            {/* 3er Puesto */}
            <div className="flex flex-col items-center mt-8 opacity-80 w-full">
              <div className="text-center text-[10px] text-gray-500 font-bold mb-2 tracking-widest">3º Y 4º PUESTO</div>
              <BracketMatch match={third} teamsMap={teamsMap} />
            </div>
          </div>

          {/* LADO DERECHO (Orden invertido) */}
          {/* SF Right */}
          <div className="flex flex-col justify-around py-4 flex-1 min-w-[120px] max-w-[180px]">
            <div className="text-center text-[10px] text-gray-500 font-bold mb-4">{t('semifinals').toUpperCase()}</div>
            {rightSide.sf.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col justify-center relative items-end">
                <BracketMatch match={m} teamsMap={teamsMap} reverse={true} domId={`sf-r-${i}`} />
              </div>
            ))}
          </div>

          {/* QF Right */}
          <div className="flex flex-col justify-around py-4 flex-1 min-w-[120px] max-w-[180px]">
            <div className="text-center text-[10px] text-gray-500 font-bold mb-4">{t('quarterfinals').toUpperCase()}</div>
            {rightSide.qf.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col justify-center relative items-end">
                <BracketMatch match={m} teamsMap={teamsMap} reverse={true} domId={`qf-r-${i}`} />
              </div>
            ))}
          </div>

          {/* R16 Right */}
          <div className="flex flex-col justify-around py-4 flex-1 min-w-[120px] max-w-[180px]">
            <div className="text-center text-[10px] text-gray-500 font-bold mb-4">{t('round_of_16').toUpperCase()}</div>
            {rightSide.r16.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col justify-center relative items-end">
                <BracketMatch match={m} teamsMap={teamsMap} reverse={true} domId={`r16-r-${i}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          VISTA MÓVIL / TABLET (Lista Apilada)
          ========================================= */}
      <div className="xl:hidden flex flex-col gap-10 px-4 pb-10">
        
        {/* Octavos */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-center text-[var(--color-secondary)] uppercase">{t('round_of_16')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allR16.map((m, i) => (
              <BracketMatch key={i} match={m} teamsMap={teamsMap} />
            ))}
          </div>
        </section>

        {/* Cuartos */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-center text-[var(--color-secondary)] uppercase">{t('quarterfinals')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allQf.map((m, i) => (
              <BracketMatch key={i} match={m} teamsMap={teamsMap} />
            ))}
          </div>
        </section>

        {/* Semis */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-center text-[var(--color-secondary)] uppercase">{t('semifinals')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allSf.map((m, i) => (
              <BracketMatch key={i} match={m} teamsMap={teamsMap} />
            ))}
          </div>
        </section>

        {/* Finales */}
        <section className="bg-white/5 dark:bg-[#1a233a]/50 p-6 rounded-2xl border border-[var(--color-primary)]/20 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-xl font-bold mb-4 text-center text-[var(--color-secondary)] tracking-widest">FINAL</h2>
            <div className="w-full max-w-sm mb-8">
              <BracketMatch match={final} teamsMap={teamsMap} />
            </div>
            
            <h2 className="text-sm font-bold mb-4 text-center text-gray-500 tracking-widest mt-4">3º Y 4º PUESTO</h2>
            <div className="w-full max-w-sm">
              <BracketMatch match={third} teamsMap={teamsMap} />
            </div>
          </div>
        </section>

      </div>

      {/* Aclaración TBD */}
      <div className="absolute bottom-4 left-4 text-[10px] text-gray-500/80 z-20 pointer-events-none">
        *TBD = {t('tbd')} (To Be Determined)
      </div>

    </div>
  );
};

export default KnockoutPage;
