# Agent Guide - Fixture World Cup 2026

## Developer Commands
- `npm run dev`: Start Vite development server.
- `npm run build`: Typecheck with `tsc` and build for production.
- `npm run preview`: Preview the production build.

## Architecture & Tech Stack
- **Framework**: React 19 + Vite.
- **Styling**: Tailwind CSS 4.
- **State & Data Fetching**: TanStack Query (React Query) for API state.
- **Animations**: GSAP (via `useGSAP` custom hook).
- **Internationalization**: `i18next` (supports English and Spanish).
- **Routing**: `react-router-dom` v7.

## API & Integration
- **Proxy**: API calls to `/api` are proxied to `https://worldcup26.ir` via Vite config.
- **Client**: Axios is used in `src/api/axiosClient.js`.
- **Queries**: Specialized data hooks are located in `src/api/queries/`.

## Conventions
- **Styling**: Uses CSS variables for themes (defined in `src/index.css`).
- **Theming**: Dark/Light mode managed via `classList` on `document.documentElement` and persisted in `localStorage`.
- **i18n**: Translations are handled via `src/i18n.js`.

## Project Structure
- `src/api/`: API clients, endpoints, and TanStack Query hooks.
- `src/components/`: UI components (common and feature-specific).
- `src/pages/`: Page-level components.
- `src/animations/`: GSAP animation definitions.
- `src/hooks/`: Custom React hooks.
