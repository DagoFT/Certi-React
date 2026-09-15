# Neon Salvaje

Neon Salvaje es un juego web por turnos desarrollado con React, TypeScript y Express. El jugador se enfrenta a una estrategia controlada por el backend dentro de un tablero de 8 × 6 casillas.

El objetivo es conseguir cristales, administrar la vida y utilizar los movimientos y ataques de forma estratégica antes de que terminen los turnos.

## Tecnologías

* React
* TypeScript
* Express
* Node.js
* Vite
* ESLint
* Playwright
* GitHub Actions
* Render

## Características

* Juego por turnos contra una IA controlada por el backend.
* Tablero de 8 × 6.
* Movimiento del jugador y de la IA.
* Cristales generados de forma aleatoria.
* Sistema de vida.
* Sistema de puntuación.
* Ataques.
* Validación de movimientos.
* Límite de turnos.
* Condiciones de victoria, derrota y empate.
* Comunicación entre frontend y backend mediante `fetch`.
* API REST con respuestas JSON.
* Pruebas E2E con Playwright.
* Validación automática mediante GitHub Actions.

## Cómo funciona el juego

El jugador comienza en una posición del tablero y debe desplazarse para recoger cristales y enfrentarse a la IA.

Cada acción del jugador se envía al backend mediante una petición HTTP. El backend procesa la acción, actualiza el estado de la partida y ejecuta la estrategia de la IA.

El flujo principal es:

```text
Jugador
   ↓
React
   ↓
fetch()
   ↓
Express
   ↓
Procesamiento de la acción
   ↓
Estrategia de la IA
   ↓
Nuevo estado de la partida
   ↓
JSON
   ↓
React
   ↓
Actualización de la interfaz
```

La IA no se ejecuta en React. Su lógica se encuentra en el backend.

## Reglas

El tablero tiene 8 columnas y 6 filas.

El jugador y la IA tienen:

* posición;
* vida;
* puntuación.

Además, la partida tiene:

* turno actual;
* cantidad máxima de turnos;
* cristales;
* estado de la partida;
* mensaje para el jugador.

### Movimiento

El jugador puede moverse una casilla por acción:

* arriba;
* abajo;
* izquierda;
* derecha.

No se permiten movimientos fuera del tablero.

Cuando el jugador llega a una casilla con un cristal, lo recoge automáticamente y aumenta su puntuación.

### Ataque

El jugador puede atacar cuando la IA se encuentra a una distancia de una casilla.

Un ataque válido reduce la vida de la IA.

La IA también puede atacar cuando el jugador se encuentra dentro de su alcance.

### Estrategia de la IA

La IA es controlada por el backend.

Su comportamiento sigue estas prioridades:

1. Si el jugador está cerca, intenta atacarlo.
2. Si no puede atacar, intenta acercarse al cristal más cercano.
3. Si no existen cristales disponibles, realiza un movimiento válido.

Esto hace que las decisiones de la IA dependan del estado actual de la partida.

## Finalización de la partida

La partida puede terminar de tres formas:

### Victoria del jugador

El jugador gana cuando la vida de la IA llega a cero.

### Victoria de la IA

La IA gana cuando la vida del jugador llega a cero.

### Empate o final por turnos

Cuando se alcanza el límite de turnos, se comparan las puntuaciones.

El jugador con mayor puntuación gana. Si ambas puntuaciones son iguales, la partida termina en empate.

## API

El backend proporciona las siguientes rutas:

| Método | Ruta                    | Función                                          |
| ------ | ----------------------- | ------------------------------------------------ |
| POST   | `/api/games`            | Crear una nueva partida                          |
| GET    | `/api/games/:id`        | Obtener el estado de una partida                 |
| POST   | `/api/games/:id/action` | Procesar una acción del jugador y ejecutar la IA |
| GET    | `/api/health`           | Comprobar el estado del servidor                 |

Las peticiones y respuestas relacionadas con la partida utilizan JSON.

## Estructura del proyecto

```text
Proyecto Final/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── eslint.config.js
│   └── ...
│
├── e2e/
│   └── ...
│
├── docs/
│   └── ...
│
├── package.json
├── package-lock.json
└── playwright.config.ts
```

### Frontend

El frontend contiene la interfaz del juego y administra el estado visual de la aplicación.

### Backend

El backend contiene la API, el estado de las partidas, las validaciones y la estrategia de la IA.

### E2E

Contiene las pruebas automatizadas realizadas con Playwright.

### Docs

Contiene documentación técnica complementaria del proyecto.

## Instalación

Se necesita Node.js y npm.

### Frontend

Desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

### Backend

Desde la carpeta `backend`:

```bash
npm install
npm run dev
```

## Compilación

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
```

## Linting

Frontend:

```bash
npm run lint
```

Backend:

```bash
npm run lint
```

El proyecto utiliza ESLint para detectar problemas en el código.

## Pruebas E2E

Las pruebas automatizadas utilizan Playwright.

Desde la raíz de `Proyecto Final`:

```bash
npm install
npx playwright install
npm run test:e2e
```

También existe una ejecución visual:

```bash
npm run test:e2e:visual
```

Las pruebas verifican la interacción principal del juego y la comunicación con el backend.

## Integración continua

El proyecto utiliza GitHub Actions para automatizar:

* linting del frontend y backend;
* pruebas E2E;
* construcción del proyecto;
* publicación de la aplicación.

Esto permite comprobar automáticamente que los cambios mantienen funcionando las partes principales del proyecto.

## Publicación

La aplicación está publicada en Render:

**https://neon-salvage.onrender.com**

La aplicación utiliza Express para servir el frontend compilado y proporcionar la API del juego.

## Autor

Diego Alejandro Gómez Alcázar

Proyecto académico — Ingeniería de Sistemas Computacionales.
