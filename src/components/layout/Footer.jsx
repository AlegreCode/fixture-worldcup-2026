import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-12 mb-20 md:mb-8">
      <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-50"></div>
      <div className="pt-8 pb-4 flex flex-col items-center justify-center gap-4 text-center">
        <p className="font-['Outfit'] font-bold text-lg text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] flex items-center gap-2">
          ⚽ FIFA World Cup 2026™
        </p>
        <div className="text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] flex items-center gap-1.5 flex-wrap justify-center">
          {t('footer_made_with')} 
          <Heart size={16} className="text-red-500 fill-red-500 animate-pulse inline-block" /> 
          {t('footer_by')} <span className="font-bold text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]">AlegreCode</span>
          <span className="mx-2 opacity-50">·</span>
          © {currentYear}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
