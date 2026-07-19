# MusicHub

Self-hosted personal media library manager for homelabs — organize, tag, and download audio you own the rights to, through a modern web interface.

> **Legal & ethical notice**: MusicHub is **not** a piracy tool. It is a personal media library manager. Users are solely responsible for ensuring they have the rights or authorization to download and manage any content through this software. MusicHub does not include, and will not include, features designed to circumvent copy protection or facilitate copyright infringement.

## Status

Functional v1. All backend modules and their frontend pages are built and have been verified against a real running stack (Postgres, Redis, BullMQ, yt-dlp, ffmpeg) — see [`docs/design/`](./docs/design/) for the design process behind the skeleton step.

- ✅ Auth (JWT access/refresh, Argon2, rate-limited login, RBAC)
- ✅ Users (self-service profile/password, admin user management)
- ✅ Library (search/filter/favorites/history, streaming playback, cover art)
- ✅ Downloads (yt-dlp, playlist expansion, live progress via WebSocket)
- ✅ Queue (BullMQ, concurrency enforced live from Settings)
- ✅ Metadata (tag read/write via ffmpeg)
- ✅ Playlists (CRUD, ordering, add-from-library)
- ✅ Settings (persisted config, library/temp path changes take effect live)
- ✅ Integrations (outbound webhooks on download events)
- ✅ Dashboard (live stats)
- ✅ Mobile-responsive UI, installable as a PWA (offline app shell, home-screen icon)
- ✅ Streaming-style fullscreen player (cover art, volume, seek) + toast notifications
- 🧪 Backend test suite: unit + e2e (`cd backend && npm test` / `npm run test:e2e`)
- ⚠️ Docker/nginx: statically audited and fixed, but never actually run end-to-end in
  the environment this project was built in (no working Docker daemon available there).
  `docker compose config` validates cleanly; report an issue if `docker compose up`
  doesn't work for you.
- ⚠️ Settings' `theme` field persists but doesn't change the running UI yet (app is
  dark-themed only, matching the original design brief) — `language` does switch live.

## Features at a glance

- **Library** — browse, search, and filter your collection by title, artist, genre; favorite tracks, view play history, stream in-browser with a persistent mini-player and an optional fullscreen "now playing" view.
- **Downloads** — paste one or more URLs, pick format/quality/destination, watch live progress over WebSocket. Powered by yt-dlp + ffmpeg.
- **Playlists** — create, reorder, and manage playlists from the library or a track's own page.
- **Metadata** — read/write ID3-style tags on your files directly from the UI.
- **Dashboard** — live counts (tracks/artists/albums), disk usage, queue and system stats.
- **Integrations** — outbound webhooks fired on download completion/failure, for hooking into your own automation.
- **Settings** — change library/temp paths, allowed formats, default quality, concurrency, and language, all enforced live without a restart.
- **PWA** — installable to your phone or desktop home screen; works like a native app shell.
- **Access control** — default-allow localhost + Tailscale CGNAT range, plus anything you explicitly configure via `CORS_ORIGIN` — built for reaching your library from your own devices without extra setup.

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis, BullMQ, Socket.IO |
| Frontend | React, Vite, TailwindCSS, TanStack Query, React Router, i18next, vite-plugin-pwa |
| Infra | Docker, Docker Compose, FFmpeg, yt-dlp, Nginx |

## Quickstart (Docker)

```bash
cp .env.example .env
# edit .env with your own secrets
docker compose up
```

App available at `http://localhost`.

## Local development (without Docker)

```bash
npm install
npm run dev
```

Runs backend (NestJS, port 3000) and frontend (Vite, port 5173) concurrently. Requires local PostgreSQL and Redis instances (see `.env.example`). Node 20+ recommended.

## Configuration

All configuration lives in `.env` (copy from `.env.example`). Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection, used by BullMQ and the queue system |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Long random secrets — generate your own, never reuse the example values |
| `CORS_ORIGIN` | Extra allowed origins beyond localhost + Tailscale CGNAT (comma-separated); leave blank to only allow those defaults |
| `LIBRARY_PATH` / `DOWNLOAD_TMP_PATH` | Where your library and in-progress downloads live on disk (mirrors Settings, which can override these live) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded on first boot — change the password after first login |
| `VITE_API_URL` | Only needed for advanced/non-default deployments; leave blank for both Docker and plain `npm run dev` |

## Testing

```bash
cd backend
npm test          # unit tests — no external services required
npm run test:e2e  # e2e tests — requires a live Postgres + Redis + a seeded admin user (same as running the app)
```

```bash
cd frontend
npm run lint       # eslint
npm run build      # tsc + vite build, catches type errors
```

## Project structure

```
music-hub/
├── backend/        # NestJS API (Clean Architecture, modular)
├── frontend/        # React SPA
├── docker/          # Nginx and other infra config
├── docs/design/      # Design documents and decision logs
└── docker-compose.yml
```

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how to set up your dev environment, the project's conventions, and how to submit changes. For anything beyond a small fix, please open an issue first to discuss the approach.

## License

[MIT](./LICENSE) © Samuel Conradt - SameDev
