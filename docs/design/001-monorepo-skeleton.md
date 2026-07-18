# Design: MusicHub Monorepo Skeleton

Status: Approved — ready for implementation
Date: 2026-07-18

## Understanding Summary

- MusicHub is an open-source personal media library manager for homelabs — lets users organize, tag, and download audio they own rights to. Not a piracy tool.
- Stack: NestJS + Prisma + PostgreSQL + Redis + BullMQ + Socket.IO (backend); React + Vite + TailwindCSS + TanStack Query + React Router (frontend); Docker, FFmpeg, yt-dlp, Nginx (infra).
- Clean Architecture, modular backend: Auth, Users, Library, Downloads, Queue, Metadata, Playlists, Settings, Integrations, WebSocket. Each module: Controller / Service / Repository / DTO / Entity / Interface.
- Dark-themed, self-hosting-style UI (inspired by Jellyfin, Navidrome, Immich, Grafana, CasaOS).
- Development proceeds in staged, approved steps. This document covers the **first step only: monorepo skeleton**, no feature logic.

## Assumptions

- Node.js LTS (20.x), TypeScript strict mode on both apps.
- Single-instance self-hosted deployment target — homelab scale, not multi-tenant SaaS.
- No auth, no real DB schema, no yt-dlp/FFmpeg wiring in this step — deferred to their own future steps.
- Git repo initialized with first commit at end of this step.

## Decision Log

| # | Decision | Alternatives considered | Rationale |
|---|----------|--------------------------|-----------|
| 1 | Repo tooling: npm workspaces | Turborepo, separate repos | Simple, native, sufficient for 2 apps at current scale. Add Turborepo later if build/CI speed becomes a problem. |
| 2 | Code language: English (code/docs), Portuguese (UI strings, default locale) | Full English, full Portuguese | Matches OSS contributor expectations for code while respecting spec's PT-BR-first user base and built-in i18n requirement. |
| 3 | License: MIT | AGPL-3.0, none yet | Permissive, standard for self-hosting tools, lowest friction for adoption/contribution. |
| 4 | First implementation step: monorepo skeleton | Auth module, Library module, Downloads module | Foundation needed before any feature module; avoids rework from structural changes later. |
| 5 | Skeleton structure: stub folders per module, no shared types package (Approach A) | Approach B (shared `packages/shared` now), Approach C (no module stubs, minimal bootstrap only) | Shows full intended architecture immediately (important for OSS readability) without building shared-package infra before any real DTO exists (YAGNI). |
| 6 | Docker volumes: named volume `library_data` for now | Host bind mount configured now | Real host library path belongs to Settings module (user-configurable path) — premature to hardcode in skeleton. |
| 7 | Husky/lint-staged: deferred | Set up now | Adds friction before any real code exists to lint; revisit once first feature module lands. |

## Final Design

### 1. Root layout

```
music-hub/
├── backend/                 # NestJS app
├── frontend/                # React+Vite app
├── docker/                  # nginx conf, other infra config
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json             # npm workspaces root
├── LICENSE                  # MIT
└── README.md
```

Root `package.json`:
```json
{
  "name": "music-hub",
  "private": true,
  "workspaces": ["backend", "frontend"]
}
```

No `packages/shared` — see Decision #5.

Root scripts proxy into workspaces (`dev`, `build`, `lint` run both apps via `concurrently`/sequential `-w` calls).

`.gitignore`: `node_modules`, `dist`, `.env`, local docker volume mounts if any.

README (English): project pitch, legal/ethical notice (personal library manager, user responsible for content rights), stack list, quickstart (`docker compose up`), staged-development note, contributing pointer, license line.

### 2. Backend structure

```
backend/
├── src/
│   ├── main.ts                  # bootstrap, helmet, cors, swagger setup
│   ├── app.module.ts            # imports all feature modules
│   ├── config/                  # env validation (class-validator based)
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts    # PrismaClient wrapper, empty schema for now
│   └── modules/
│       ├── auth/
│       ├── users/
│       ├── library/
│       ├── downloads/
│       ├── queue/
│       ├── metadata/
│       ├── playlists/
│       ├── settings/
│       ├── integrations/
│       └── websocket/
├── prisma/
│   └── schema.prisma            # datasource+generator only, no models yet
├── test/
├── Dockerfile
├── tsconfig.json
├── eslint.config.js
└── package.json
```

Each module folder gets identical stub shape:
```
<module>/
├── <module>.module.ts
├── <module>.controller.ts
├── <module>.service.ts
├── <module>.repository.ts
├── dto/          (.gitkeep)
├── entities/     (.gitkeep)
└── interfaces/   (.gitkeep)
```

Controller/service/repository contain minimal valid NestJS classes (`@Injectable()`/`@Controller()`), no real methods — just enough to compile and register in `app.module.ts`.

`main.ts`: Nest factory, global `ValidationPipe`, Helmet, CORS from env, Swagger doc bootstrap at `/api/docs`, listen on `PORT` env var.

No auth guards, no real Prisma models yet — schema.prisma ready for first model in the Auth-module step.

### 3. Frontend structure

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # router root
│   ├── routes/
│   │   ├── Dashboard.tsx        # placeholder page
│   │   ├── Library.tsx          # placeholder
│   │   ├── Downloads.tsx        # placeholder
│   │   └── Settings.tsx         # placeholder
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # fixed nav, dark theme
│   │   │   ├── Topbar.tsx       # search bar placeholder
│   │   │   └── AppLayout.tsx    # sidebar+topbar+content shell
│   │   └── ui/                  # empty, future shared UI atoms
│   ├── lib/
│   │   ├── queryClient.ts       # TanStack Query client setup
│   │   └── api.ts               # fetch wrapper stub, baseURL from env
│   ├── i18n/
│   │   ├── index.ts             # pt-BR default, en fallback
│   │   ├── pt-BR.json
│   │   └── en.json
│   └── styles/
│       └── index.css            # Tailwind entry + dark theme tokens
├── index.html
├── vite.config.ts
├── tailwind.config.ts           # dark mode class strategy, color tokens
├── tsconfig.json
├── Dockerfile
└── package.json
```

Router (`react-router`) wires 4 placeholder routes matching spec's dashboard nav — each just a heading + "coming soon" note.

Sidebar: fixed left, dark bg, icon+label per route (lucide-react icons), responsive collapse on mobile.

i18n: `i18next` + `react-i18next`, default locale `pt-BR`, `en` fallback.

TanStack Query client wired at App root, no real queries yet (no live endpoints).

### 4. Docker & infra

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes: [pg_data:/var/lib/postgresql/data]
    env_file: .env

  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]

  backend:
    build: ./backend
    depends_on: [postgres, redis]
    volumes:
      - library_data:/data/library
      - backend_logs:/app/logs
    env_file: .env

  frontend:
    build: ./frontend
    depends_on: [backend]

  nginx:
    image: nginx:alpine
    volumes: [./docker/nginx.conf:/etc/nginx/nginx.conf:ro]
    ports: ["80:80"]
    depends_on: [frontend, backend]

volumes:
  pg_data:
  redis_data:
  library_data:
  backend_logs:
```

`docker/nginx.conf`: reverse proxy — `/` → frontend, `/api` → backend, `/socket.io` → backend WS upgrade headers.

`backend/Dockerfile`, `frontend/Dockerfile`: multi-stage (build + slim runtime), non-root user. No ffmpeg/yt-dlp install yet — deferred to Downloads-module step.

`.env.example`: `POSTGRES_*`, `REDIS_*`, `JWT_SECRET` placeholder, `PORT`, `LIBRARY_PATH`, `CORS_ORIGIN`.

### 5. Tooling & config

- ESLint (`@typescript-eslint`, flat config) + Prettier, shared baseline via root `.prettierrc`, per-app `eslint.config.js`.
- TS strict mode on both apps; `noUncheckedIndexedAccess` on backend.
- Husky/lint-staged deferred (Decision #7).
- Root scripts: `dev` (concurrently runs both apps), `build`, `lint`.
- README covers: legal/ethical notice, feature status list (✅/🚧), stack table, quickstart, local dev without Docker, structure tree, contributing pointer, license line.
- LICENSE: MIT, copyright holder "Samuel Conradt - SameDev".

## Open Items

None.
