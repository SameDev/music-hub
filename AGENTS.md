# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this is

Lunare — self-hosted music library server for homelabs. NestJS backend + React SPA frontend, npm workspaces monorepo. Downloading tracks (yt-dlp) is auxiliary; the core product is library organization, streaming, tagging, playlists. No features that circumvent copy protection or facilitate copyright infringement — this is a hard project boundary, not a style preference.

## Commands

Root (runs both via npm workspaces):
```bash
npm install
npm run dev              # backend :3000 + frontend :5173, concurrently
npm run build             # backend then frontend
npm run lint              # backend then frontend
```

Backend (`backend/`):
```bash
npm run start:dev         # nest start --watch
npm test                  # jest unit tests, no external services needed
npm run test:e2e          # jest e2e — needs live Postgres + Redis + seeded admin
npx jest path/to/x.spec.ts              # single unit test file
npx jest --config test/jest-e2e.json path/to/x.e2e-spec.ts   # single e2e file
npm run lint
```

Frontend (`frontend/`):
```bash
npm run dev
npm run build              # tsc && vite build — this is the type-check gate
npm run lint
```

Minimum before opening a PR: `cd backend && npm test && npm run lint` and `cd frontend && npm run build && npm run lint`. For UI changes, actually click through in a browser — build/lint only prove it compiles.

Local dev without Docker needs a local Postgres + Redis (see `.env.example`). Docker: `docker compose up -d` (build from source) or `docker-compose.release.yml` (prebuilt `ghcr.io/samedev/lunare-{backend,frontend,nginx}` images, no clone needed).

## Architecture

```
Browser -> Frontend (React SPA) -> Backend (NestJS REST + WebSocket)
                                       -> PostgreSQL (Prisma)
                                       -> Redis (BullMQ queues)
                                       -> yt-dlp / FFmpeg (shelled out)
                                       -> library dir on disk (plain files, not a black box)
```

Prisma models (`backend/prisma/schema.prisma`): `User`, `Artist`, `Album`, `Track`, `Favorite`, `PlayHistory`, `DownloadJob`, `Playlist`, `PlaylistTrack`, `AppSettings`, `Webhook`.

### Backend — Clean Architecture, one folder per module

`backend/src/modules/<name>/`: `auth`, `dashboard`, `downloads`, `integrations`, `library`, `metadata`, `playlists`, `queue`, `settings`, `users`, `websocket`.

Every module follows the same layered shape — keep it when touching or adding a module:
```
<name>.module.ts        # NestJS wiring
<name>.controller.ts    # HTTP routes, DTO validation, guards — thin, no logic
<name>.service.ts       # business logic
<name>.repository.ts    # the only layer that talks to Prisma
dto/                    # class-validator request/response DTOs
entities/                # response shapes (e.g. password-stripped user)
interfaces/               # module-internal contracts
```

Downloads run through BullMQ (`modules/queue`), backed by Redis; progress is pushed to the client over the `websocket` module (Socket.IO).

### Frontend

```
src/routes/              # one file per page/route
src/components/layout/   # Sidebar, Topbar, AppLayout, Player, FullscreenPlayer
src/components/ui/       # Skeleton, ConfirmDialog, StatCard, etc.
src/contexts/            # Auth, Player, Toast (React context providers)
src/lib/                 # api client, url helpers, hooks
src/i18n/                # pt-BR.json (default) / en.json
```

Data fetching goes through TanStack Query. Player state lives in `PlayerContext`, not component state.

## Security patterns — follow these exactly, don't reinvent

- **Path traversal**: any path built from user input must be resolved and checked to stay within the intended root — `resolve()` + `startsWith(root + sep)`. Reference implementation: `assertWithinLibrary` in `metadata.service.ts`.
- **SSRF**: any outbound request built from user input (e.g. webhook URLs) must go through hostname resolution + private/loopback range rejection before the request fires. Reference: `backend/src/modules/integrations/lib/ssrf-guard.ts` (`assertNotPrivateTarget`).
- **Auth**: admin-only endpoints use `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)`. Reference: `backend/src/modules/settings/settings.controller.ts`.
- **CORS**: default-allow is localhost + Tailscale CGNAT range; anything else must go through `CORS_ORIGIN` (see `backend/src/config/cors-origin.util.ts`), not a code-level allowlist hack.
- Report vulnerabilities privately via GitHub security advisory — never a public issue.

## Conventions

- **TypeScript strict mode everywhere.** Don't loosen `tsconfig.json` to silence an error — fix the type.
- Global `ValidationPipe` has `whitelist` + `forbidNonWhitelisted` on: any DTO field not declared is silently dropped, not passed through. Add it to the DTO.
- **i18n**: every user-facing string goes through `useTranslation()`/`t()`. Add the key to both `pt-BR.json` and `en.json` in the same commit.
- **Silent mutations need a toast**: if a `useMutation` has no other visible feedback, wire `onSuccess`/`onError` to `useToast()` (`frontend/src/contexts/ToastContext.tsx`; see usage in `Library.tsx`/`PlaylistDetail.tsx`).
- **Responsive down to ~375px**: wide tables get `overflow-x-auto` + `min-w-[Npx]`; cramped form pairs stack via `grid-cols-1 sm:grid-cols-2`.
- No comments explaining *what* — name things clearly. Comment only a non-obvious *why*.
- No speculative abstractions — solve the call site in front of you, not a hypothetical future one.
- New features: open an issue to discuss scope/approach before writing code — this project stays intentionally lean. Bug fixes don't need that.
