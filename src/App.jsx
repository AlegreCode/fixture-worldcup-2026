import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Trophy, CalendarDays, LayoutGrid, Network } from 'lucide-react';

// Imports reales
import HomePage from './pages/HomePage';
import FixturesPage from './pages/FixturesPage';
import GroupsPage from './pages/GroupsPage';
import KnockoutPage from './pages/KnockoutPage';

import MatchDetailPage from './pages/MatchDetailPage';
import Footer from './components/layout/Footer';

const queryClient = new QueryClient();

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => i18n.changeLanguage(i18n.language.startsWith('es') ? 'en' : 'es');

  const navItems = [
    { to: "/", icon: <Trophy size={20} />, label: t('home') },
    { to: "/fixtures", icon: <CalendarDays size={20} />, label: t('fixtures') },
    { to: "/groups", icon: <LayoutGrid size={20} />, label: t('groups') },
    { to: "/knockout", icon: <Network size={20} />, label: t('knockout') },

  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 transition-all duration-300">
      
      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <aside className="fixed bottom-0 w-full md:w-64 md:h-screen md:top-0 left-0 bg-white dark:bg-[#12182b] border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-800 z-50 flex md:flex-col justify-around md:justify-start px-2 md:px-4 py-2 md:py-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
        
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center text-white font-bold">
            WC
          </div>
          <h1 className="font-['Outfit'] font-bold text-xl text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] leading-tight">
            Fixture <br/><span className="text-[var(--color-secondary)]">2026</span>
          </h1>
        </div>

        <nav className="flex md:flex-col w-full gap-1 md:gap-2 justify-around md:justify-start">
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({isActive}) => `
                flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl transition-all
                ${isActive ? 'bg-[var(--color-primary)]/10 dark:bg-[var(--color-secondary)]/10 text-[var(--color-primary)] dark:text-[var(--color-secondary)] font-semibold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50'}
              `}
            >
              {item.icon}
              <span className="text-[10px] md:text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex flex-col gap-4 mt-auto">
          <button onClick={toggleLanguage} className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
            🌐 {i18n.language.startsWith('es') ? 'English' : 'Español'}
          </button>
          <button onClick={toggleTheme} className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
            {theme === 'dark' ? '🌞 Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
        
        {/* Mobile Header (Settings only) */}
        <div className="md:hidden flex justify-end gap-2 mb-6">
          <button onClick={toggleLanguage} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            {i18n.language.startsWith('es') ? 'EN' : 'ES'}
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>

        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/fixtures/:id" element={<MatchDetailPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/knockout" element={<KnockoutPage />} />

          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
