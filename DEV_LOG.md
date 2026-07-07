# Historial de Desarrollo - Fixture Mundial 2026

## Fase 1: Configuración Inicial
- Inicialización del proyecto con **React 19** y **Vite**.
- Configuración de **Tailwind CSS 4** para los estilos.
- Instalación y configuración de herramientas clave:
  - **React Router** para navegación.
  - **TanStack Query (React Query)** para gestión del estado y peticiones a la API.
  - **GSAP** para animaciones interactivas (`useGSAP`).
  - **i18next** para internacionalización (soporte Español/Inglés).
  - **Axios** como cliente HTTP.

## Fase 2: Implementación con API-Football (V3)
- Creación de componentes principales de la interfaz con modo claro/oscuro.
- Implementación de páginas:
  - **Dashboard (Inicio)**: Resumen del torneo.
  - **Fixtures (Partidos)**: Listado de partidos pasados, presentes y futuros.
  - **Groups (Grupos)**: Tablas de posiciones.
  - **Knockout Bracket**: Cuadro de eliminatorias.
  - **Stats**: Estadísticas de jugadores (goleadores, asistentes).
  - **Match Details**: Información detallada de un partido.
- **Problema encontrado**: La capa gratuita de API-Football no provee datos de la temporada 2026.

## Fase 3: Migración a API Open Source (worldcup26.ir)
- Identificación de alternativa gratuita y abierta: `https://github.com/rezarahiminia/worldcup2026`.
- Refactorización completa de la capa de acceso a datos:
  - Implementación de sistema de autenticación por JWT (`authService.js`).
  - Reescritura de endpoints (`endpoints.js`).
  - Actualización de todos los hooks de React Query (`useFixtures`, `useStandings`, `useTeams`, etc.) para mapear la nueva estructura JSON.
  - Implementación de filtro de partidos "en vivo" desde el frontend.
  - Cálculo de tabla de goleadores desde el cliente debido a la ausencia del endpoint específico.
- Inclusión de nueva sección de **Estadios**, proporcionada por la nueva API.
- Actualización de componentes UI (`MatchCard`, `TeamBadge`, `GroupTable`) para renderizar correctamente los nuevos datos.

## Fase 4: Refinamientos y Solución de Errores
- Instalación de "skills" recomendados para mejorar diseño y prácticas:
  - `anthropics/skills@frontend-design`
  - `vercel-labs/agent-skills@vercel-react-best-practices`
- Solución de error **CORS** que bloqueaba la autenticación:
  - Configuración de un proxy local en `vite.config.js` (`/api` -> `https://worldcup26.ir`).
  - Actualización de `axiosClient` para dirigir las peticiones al proxy local, evitando restricciones del navegador en desarrollo.

## Fase 5: Refinamientos post-migración (Banderas y Bracket)
- **Problema de Banderas Resuelto**: 
  - Las respuestas de la API (`/get/games`) no incluían URLs de banderas, solo los IDs de equipo (`home_team_id`, `away_team_id`).
  - Se modificaron `HomePage`, `FixturesPage` y `MatchDetailPage` para cargar el diccionario de equipos (`useTeamsMap`).
  - Se actualizó `MatchCard.jsx` para interceptar el `teamsMap` y renderizar `<img>` con la bandera correcta, o mostrar un fallback (código FIFA/nombre corto) en su defecto.
- **Implementación del Bracket de Eliminatorias**:
  - Se reescribió `KnockoutPage.jsx` (antes era un placeholder estático).
  - Ahora consume los partidos mediante `useFixtures()`, filtrando por las fases (`r32`, `r16`, `qf`, `sf`, `third`, `final`).
  - Renderiza un bracket horizontal dinámico agrupando los partidos por fase.
  - Implementación de scroll horizontal (tipo carrusel) para navegar cómodamente por las rondas de eliminación.

## Fase 6: Rediseño visual del Bracket de Eliminatorias
- **Nuevo Layout de Árbol (Bracket Clásico)**:
  - Se dividió la fase de eliminatorias en dos llaves (Izquierda y Derecha) que convergen en el centro para la Final.
  - Se eliminó el diseño secuencial anterior para dar paso a un grid estructurado en 7 columnas (`r16`, `qf`, `sf`, `Final`, `sf`, `qf`, `r16`).
  - Se añadieron líneas conectoras mediante CSS (`border`) para unir visualmente los cruces entre rondas.
- **Componente Compacto**:
  - Creación de `BracketMatch.jsx`, una versión reducida de la tarjeta de partido optimizada para este diseño, mostrando únicamente las banderas de los equipos, el resultado y el estado.

## Fase 7: Responsividad del Bracket
- **Layout Híbrido (Desktop vs Mobile)**:
  - **Desktop (`xl` y superior)**: Se mantiene el árbol convergente. Se le agregó `min-h-[700px]` para asegurar que las líneas CSS no se rompan ni se aplasten si la ventana es baja.
  - **Mobile y Tablets (`< xl`)**: Se implementó una vista de lista apilada. Las fases (Octavos, Cuartos, Semis, Final) se ordenan de arriba hacia abajo usando un `grid` de 1 o 2 columnas. Las líneas conectoras se ocultan para mantener la legibilidad y evitar el overflow horizontal en pantallas estrechas.
  - Se actualizó `BracketMatch.jsx` haciéndolo un contenedor flexible (`w-full xl:max-w-[200px]`) que se expande correctamente en las cuadrículas móviles.

## Fase 8: Optimización de UX (Eliminación de Scroll Horizontal)
- Se identificó que el bracket requería demasiada anchura en monitores estándar, provocando un scroll horizontal forzado.
- **Rediseño Fluido**:
  - Se eliminaron las restricciones duras (`min-w-[1200px]`, `w-[200px]`) de `KnockoutPage.jsx`, reemplazándolas por dimensiones flexibles (`flex-1 min-w-[120px] max-w-[150px]`).
  - Se disminuyó la separación entre las rondas del árbol (`gap-3` en vez de `gap-8`).
- **Compactación**: 
  - Se afinó `BracketMatch.jsx` reduciendo márgenes, disminuyendo el tamaño de la tipografía y achicando los contenedores de las banderas, garantizando que todo el esquema encaje a la perfección dentro del Viewport sin usar la barra de desplazamiento.

## Fase 9: Refinamiento de Interfaz de Eliminatorias
- **Corrección de Líneas Conectoras**:
  - Se arregló el desvío matemático de las líneas CSS que unen los partidos (R16 -> QF -> SF). El problema derivaba de paddings asimétricos (`py-4`, `py-16`, `py-32`) en las columnas. Al igualarlas a `py-4`, el cálculo del `50%` de altura se alinea píxel a píxel con los centros relativos de los contenedores adyacentes.
- **Detalles en Tarjetas (BracketMatch)**:
  - Se añadió la fecha y hora de cada partido en la parte superior del componente de forma compacta.
  - Se agregó el código de país (Norma ISO 3166-1 alfa-3, `fifa_code`) junto a la bandera (visible en pantallas medianas y grandes) para favorecer la lectura rápida y estandarizada.

## Fase 10: Refinamiento de Geometría y Overflow en Eliminatorias
- **Fix de Overflow en Tarjetas**: 
  - Se aumentó el ancho máximo permitido para las columnas de los costados (`max-w-[150px]` -> `max-w-[180px]`) en `KnockoutPage.jsx`. Esto asegura que al renderizar el texto de los marcadores junto a los nuevos códigos ISO, las banderas no sean empujadas fuera de la tarjeta azul redondeada.
- **Limpieza de Líneas en la Final**:
  - Se eliminaron las llaves (`[ ]`) flotantes que rodeaban al componente de la Final, sustituyéndolas por una conexión directa y horizontal proveniente de las Semifinales.
  - Se ajustó el trazo de la llave de Semifinales de `h-[25%]` a `h-[50%]` para que enlace correctamente con la posición real de los partidos de Cuartos de Final (QF).

## Fase 11: Correcciones de Textos Nulos y Overflow de Tarjetas
- **Manejo de Valores "null" (String)**:
  - Se detectó que la API enviaba la palabra `"null"` como texto plano para partidos sin comenzar (ej. MEX vs ENG), lo cual imprimía un largo `"null VS null"`. Se mitigó interceptando este string y devolviendo el caracter de fallback `"-"`.
- **Fijación de Contenedores (`min-w-fit`)**:
  - Se implementó la clase `min-w-fit` en `BracketMatch.jsx` obligando al fondo redondeado de la tarjeta a engullir siempre la totalidad de sus elementos internos.
- **Expansión Libre de Contenedor Padre**:
  - Se eliminó el tope absoluto de `max-w-[1100px]` en `KnockoutPage.jsx`, garantizando que en pantallas grandes el árbol distribuya el espacio a su gusto, sin aplastar a las columnas hasta expulsar las banderas.
- **Aclaración de Siglas**:
  - Se incorporó un texto sutil en la esquina inferior izquierda indicando el significado de `TBD` (To Be Determined / Por definir) para asistir a los usuarios menos familiarizados con este término.

## Fase 12: Reconstrucción del Sistema de Conectores del Bracket
- **Desvinculación del Centro**: Se retiró la fecha (`dateStr`) del flujo normal del layout en `BracketMatch.jsx` usando posicionamiento absoluto (`-top-4`). Esto evita que la fecha empuje el componente hacia abajo, garantizando que el centro visual de la tarjeta coincida perfectamente con el centro matemático donde apuntan las líneas.
- **Columnas Conectoras Estructurales (`BracketConnector`)**:
  - Se eliminaron los pequeños stubs horizontales y verticales absolutos dispersos por todas las columnas, los cuales eran propensos a generar huecos o traslapes por errores de subpíxeles o gaps.
  - Se creó un nuevo componente `BracketConnector.jsx` que actúa como una columna física (`w-6`) intercalada entre las rondas. Este componente dibuja llaves continuas (usando `border-y` y `border-l/r`) que conectan un par de partidos hacia el siguiente nivel. 
## Fase 13: Líneas SVG Dinámicas para el Bracket
- **Descarte de CSS puro**: Se comprobó que el enfoque basado en CSS puro (stubs, flexbox) fallaba al intentar alinear líneas con tarjetas que podían variar ligeramente en posición debido al header superior y los paddings dinámicos.
- **Overlay SVG + ResizeObserver**: Se implementó una solución profesional dibujando las líneas a través de un overlay `<svg>` absoluto. Se mide en tiempo real la posición de cada tarjeta en el DOM usando `getBoundingClientRect()`, y se dibujan paths exactos que unen los puntos de inicio y fin. Esto asegura conectividad matemática perfecta independientemente de cambios en la fuente o tamaño de ventana.

## Fase 14: Corrección del Mapeo del Bracket por Relaciones de la API
- **Diagnóstico**: El código anterior ordenaba los partidos R16 por fecha cronológica y los dividía en mitades (`slice(0,4)` / `slice(4,8)`). Esto era incorrecto porque el orden temporal no coincide con la estructura del torneo. Por ejemplo, BRA-NOR (Jul 5) y MEX-ENG (Jul 5) caían en el lado izquierdo del bracket por fecha, pero su cuarto de final (NOR vs ENG) pertenece al lado derecho.
- **Solución — Árbol de la API**: Se reemplazó el `useMemo` por un recorrido del árbol de la API usando los campos `home_team_label` y `away_team_label` (e.g. `"Winner Match 89"`). La lógica parte de la Final, extrae los IDs de las Semis, luego los de los Cuartos, y finalmente los de los Octavos, construyendo `leftSide` y `rightSide` con la asignación exacta que dicta la API. La función `padArray` fue eliminada al no ser necesaria.

## Fase 15: Eliminación de la pestaña de Estadísticas
- **Motivo**: La API gratuita (`worldcup26.ir`) no proporciona endpoints de estadísticas de jugadores. La tabla de goleadores se calculaba client-side a partir de los campos `home_scorers` y `away_scorers`, los cuales frecuentemente devuelven `"null"`, ofreciendo datos poco fiables e incompletos.
- **Archivos eliminados**:
  - `src/pages/StatsPage.jsx` — Página completa de estadísticas (goleadores + estadios).
  - `src/api/queries/usePlayerStats.js` — Hook que construía la tabla de goleadores desde el cliente.
- **Archivos modificados**:
  - `src/App.jsx` — Se eliminó la ruta `/stats`, el ítem de navegación correspondiente, y los imports de `StatsPage` y el ícono `BarChart3`.
  - `src/i18n.js` — Se eliminaron las claves de traducción `stats` y `scorers` de ambos idiomas (ES/EN).
- **Conservado**: El hook `useStadiums.js` y el endpoint `STADIUMS` se mantienen intactos porque `MatchDetailPage` los utiliza para mostrar información del estadio en el detalle de cada partido.

## Fase 16: Corrección de nombre de grupo "undefined"
- **Diagnóstico**: En la pestaña Grupos, cada tabla mostraba `"Grupo undefined"` en su encabezado. La causa fue un desajuste entre el campo esperado por el frontend (`groupData.group`) y el campo real de la API (`groupData.name`). La API devuelve `{ name: "A", teams: [...] }`, no `{ group: "A" }`.
- **Correcciones**:
  - `src/components/standings/GroupTable.jsx` — Se cambió `groupData.group` → `groupData.name` en la interpolación del título.
  - `src/pages/GroupsPage.jsx` — Se corrigió la `key` del `.map()` de `groupData.group` → `groupData.name`, eliminando también un warning potencial de React por key `undefined`.

## Fase 17: Ordenamiento alfabético de Grupos
- **Diagnóstico**: La API devuelve los grupos en orden arbitrario (H, I, D, E, F, G, A, B, L, K, C, J), no en orden alfabético.
- **Corrección**: Se añadió `.sort((a, b) => a.name.localeCompare(b.name))` antes del `.map()` en `src/pages/GroupsPage.jsx`, garantizando que los grupos se rendericen siempre de A a L.

## Fase 18: Creación de Pie de Página (Footer)
- **Implementación**: Se creó el componente `src/components/layout/Footer.jsx` para mostrar los créditos a **AlegreCode**.
- **Diseño**:
  - Incorpora un gradiente superior decorativo (`--color-primary` a `--color-secondary`).
  - Utiliza micro-animación en el icono de corazón (efecto "pulse").
  - Compatible con el modo oscuro a través de las variables CSS existentes.
- **Internacionalización**: Se añadieron las claves `footer_made_with` y `footer_by` en `src/i18n.js` para soportar Español e Inglés.
- **Layout**: Se integró en `src/App.jsx` debajo del elemento `<main>` y dentro del wrapper principal, para respetar la estructura responsiva y el sidebar de la aplicación.

## Fase 19: Favicon y detalles finales
- **Actualización de Favicon**:
  - Se reemplazó el favicon por defecto de Vite por un nuevo diseño SVG personalizado ("WC").
  - Se actualizó el `index.html` para enlazar correctamente el nuevo logo `favicon.svg`.
