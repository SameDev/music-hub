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
- 🧪 Backend test suite: unit + e2e (`cd backend && npm test` / `npm run test:e2e`)
- ⚠️ Docker/nginx: statically audited and fixed, but never actually run end-to-end in
  the environment this project was built in (no working Docker daemon available there).
  `docker compose config` validates cleanly; report an issue if `docker compose up`
  doesn't work for you.
- ⚠️ Settings' `theme` field persists but doesn't change the running UI yet (app is
  dark-themed only, matching the original design brief) — `language` does switch live.

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis, BullMQ, Socket.IO |
| Frontend | React, Vite, TailwindCSS, TanStack Query, React Router |
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

Runs backend (NestJS, port 3000) and frontend (Vite, port 5173) concurrently. Requires local PostgreSQL and Redis instances (see `.env.example`).

## Testing

```bash
cd backend
npm test          # unit tests — no external services required
npm run test:e2e  # e2e tests — requires a live Postgres + Redis + a seeded admin user (same as running the app)
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

MusicHub is developed in staged, reviewed steps — see `docs/design/` for the design process behind each module. Contributions welcome; open an issue to discuss before large changes.

## License

[MIT](./LICENSE) © Samuel Conradt - SameDev
