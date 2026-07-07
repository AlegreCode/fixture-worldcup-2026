# 🏆 Fixture World Cup 2026

Una aplicación web moderna e interactiva para seguir el fixture, grupos, estadios y fases eliminatorias de la Copa Mundial de la FIFA 2026.

## 🚀 Tecnologías Destacadas

*   **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Enrutamiento:** [React Router v7](https://reactrouter.com/)
*   **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Animaciones:** [GSAP](https://gsap.com/)
*   **Manejo de Estado y Datos:** [TanStack Query](https://tanstack.com/query/latest)
*   **Internacionalización:** [i18next](https://www.i18next.com/) (Soporte para Inglés y Español)

## ⚙️ Configuración y Ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AlegreCode/fixture-worldcup-2026.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🏗️ Arquitectura y Estructura
*   `src/api/`: Clientes de API, endpoints y hooks especializados de TanStack Query.
*   `src/components/`: Componentes de interfaz de usuario comunes y específicos por función.
*   `src/pages/`: Componentes a nivel de página (Home, Fixtures, Groups, Knockout, etc.).
*   `src/animations/`: Definiciones de animaciones utilizando GSAP.
*   `src/hooks/`: Hooks personalizados de React.

## 🎨 Convenciones
* **Tema Oscuro/Claro**: Gestionado mediante clases en `document.documentElement` y guardado en `localStorage`.
* **API y Proxy**: Las llamadas a `/api` se envían a través de un proxy configurado en Vite.
