import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: {
        translation: {
          "title": "Fixture Mundial 2026",
          "home": "Inicio",
          "fixtures": "Partidos",
          "groups": "Grupos",
          "knockout": "Eliminatorias",

          "live": "EN VIVO",
          "next_matches": "Próximos Partidos",
          "latest_results": "Últimos Resultados",
          "view_all": "Ver todos",
          "view_calendar": "Ver Calendario Completo",
          "hero_subtitle": "Sigue toda la acción de la Copa Mundial 2026 en Estados Unidos, México y Canadá.",
          "stadiums": "Estadios",

          "capacity": "Capacidad",
          "city": "Ciudad",
          "round_of_32": "Ronda de 32",
          "round_of_16": "Octavos de Final",
          "quarterfinals": "Cuartos de Final",
          "semifinals": "Semifinales",
          "third_place": "Tercer Puesto",
          "final": "Final",
          "tbd": "Por definir",
          "footer_made_with": "Creado con",
          "footer_by": "por"
        }
      },
      en: {
        translation: {
          "title": "World Cup 2026 Fixture",
          "home": "Home",
          "fixtures": "Matches",
          "groups": "Groups",
          "knockout": "Knockout",

          "live": "LIVE",
          "next_matches": "Next Matches",
          "latest_results": "Latest Results",
          "view_all": "View all",
          "view_calendar": "View Full Calendar",
          "hero_subtitle": "Follow all the action from the 2026 World Cup in the United States, Mexico & Canada.",
          "stadiums": "Stadiums",

          "capacity": "Capacity",
          "city": "City",
          "round_of_32": "Round of 32",
          "round_of_16": "Round of 16",
          "quarterfinals": "Quarterfinals",
          "semifinals": "Semifinals",
          "third_place": "Third Place",
          "final": "Final",
          "tbd": "To be defined",
          "footer_made_with": "Made with",
          "footer_by": "by"
        }
      }
    }
  });

export default i18n;
