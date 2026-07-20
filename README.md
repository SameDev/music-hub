<div align="center">

# 🎵 MusicHub

**Modern self-hosted music server for homelabs.**
Organize, stream, tag, and manage your personal music collection through a beautiful web interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](#-installation)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](#-tech-stack)
[![NestJS](https://img.shields.io/badge/NestJS-backend-E0234E?logo=nestjs&logoColor=white)](#-tech-stack)
[![React](https://img.shields.io/badge/React-frontend-61DAFB?logo=react&logoColor=black)](#-tech-stack)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](#-tech-stack)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](#-tech-stack)
[![GitHub Release](https://img.shields.io/github/v/release/SameDev/music-hub)](https://github.com/SameDev/music-hub/releases)
[![GitHub Stars](https://img.shields.io/github/stars/SameDev/music-hub?style=social)](https://github.com/SameDev/music-hub/stargazers)

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Configuration](#-configuration) • [Roadmap](#-roadmap)

</div>

---

MusicHub is a self-hosted music library server built for homelabs. It gives you a private, fast, and good-looking home for your personal music collection — browse and search your library, stream tracks in-browser with a persistent player, edit metadata, build playlists, and keep an eye on everything from a live dashboard.

Grabbing new tracks into your library is one of the things MusicHub does, not the point of it — see [Philosophy](#-philosophy).

## 📸 Screenshots

| Dashboard | Library |
|---|---|
| ![Dashboard](docs/images/dashboard.png) | ![Library](docs/images/library.png) |

| Downloads | Player |
|---|---|
| ![Downloads](docs/images/downloads.png) | ![Player](docs/images/player.png) |

| Settings |
|---|
| ![Settings](docs/images/settings.png) |

## ✨ Why MusicHub?

- 🏠 **Self-hosted** — your library, your server, your rules
- 🎨 **Modern interface** — clean React SPA, dark-themed, built for daily use
- ▶️ **Streaming player** — persistent mini-player and a fullscreen "now playing" view
- 📊 **Live download progress** — real-time updates over WebSocket
- 🏷️ **Metadata editing** — read/write tags directly from the UI
- 📃 **Playlist management** — create, reorder, and curate from anywhere in the app
- 📱 **Mobile PWA** — installable on your phone or desktop home screen
- 🐳 **Docker ready** — prebuilt images, one command to run
- 💪 **ARM64 support** — runs on Raspberry Pi and other ARM boards
- 🔓 **Open source** — MIT licensed, no lock-in

## 🚀 Features

### Library
- Browse, search, and filter by title, artist, or genre
- Favorite tracks and view play history
- Stream in-browser with a persistent mini-player
- Optional fullscreen "now playing" view with cover art, volume, and seek

### Downloads
- Paste one or more URLs, pick format, quality, and destination
- Playlist expansion (a single playlist URL queues every track)
- Live progress over WebSocket, powered by yt-dlp + FFmpeg

### Metadata
- Read and write ID3-style tags on your files directly from the UI
- Cover art support

### Playlists
- Create, reorder, and manage playlists from the library or a track's own page
- Add-from-library workflow

### Dashboard
- Live counts (tracks/artists/albums)
- Disk usage, queue status, and system stats

### Settings
- Change library/temp paths, allowed formats, default quality, concurrency, and language
- All changes enforced live, without a restart

### Integrations
- Outbound webhooks fired on download completion/failure
- Hook into your own automation and scripts

### PWA
- Installable to your phone or desktop home screen
- Offline app shell, works like a native app

### Access control
- Default-allow for localhost and the Tailscale CGNAT range
- Extend with `CORS_ORIGIN` for anything else you want to reach your library from

## 🏗️ Architecture

```mermaid
flowchart LR
    Browser --> Frontend
    Frontend --> Backend
    Backend --> PostgreSQL
    Backend --> Redis
    Backend --> BullMQ
    Backend --> yt-dlp
    Backend --> FFmpeg
    Backend --> Library[(Music Library)]
```

The frontend is a React SPA talking to a NestJS API over REST + WebSocket. The backend persists metadata in PostgreSQL, queues background work (downloads, tagging) in Redis via BullMQ, and shells out to yt-dlp and FFmpeg for fetching and transcoding. Everything lands in a plain directory tree on disk — your library stays yours, readable by any other tool.

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis, BullMQ, Socket.IO |
| Frontend | React, Vite, TailwindCSS, TanStack Query, React Router, i18next, vite-plugin-pwa |
| Infra | Docker, Docker Compose, FFmpeg, yt-dlp, Nginx |

## 📦 Installation

### Option 1 — Prebuilt images (recommended)

No clone, no build, no `.env` required. Grab a single file and run it — sane defaults are baked in:

```bash
curl -O https://raw.githubusercontent.com/SameDev/music-hub/main/docker-compose.release.yml
docker compose -f docker-compose.release.yml up -d
```

That's it — MusicHub is available at `http://localhost:8095`.

Everything runs on default credentials out of the box, which is fine for a trusted home network. If you want your own secrets (recommended for anything reachable beyond localhost/Tailscale), create a `.env` next to the compose file — see [Configuration](#-configuration) for the variables it understands; any you don't set fall back to defaults automatically.

**CasaOS / ZimaOS / NAS one-click import**: use [`docker-compose.casaos.yml`](./docker-compose.casaos.yml) instead of `docker-compose.release.yml`. CasaOS's compose importer doesn't resolve `${VAR:-default}` shell substitution — it inserts the literal string, which breaks Postgres auth and the port mapping. `docker-compose.casaos.yml` has every default written as a plain value instead, so CasaOS's install screen prefills correctly and you edit whichever fields you want (password, library path, port) right there.

Images are published to `ghcr.io/samedev/music-hub-{backend,frontend,nginx}` for `linux/amd64` and `linux/arm64` on every tagged release. Pin a version with `MUSICHUB_VERSION=v0.1.0` in `.env`, or leave it unset to track `latest`.

### Option 2 — Build from source

```bash
git clone https://github.com/SameDev/music-hub.git
cd music-hub
docker compose up -d
```

Also runs with zero configuration out of the box; drop a `.env` in the same directory to override any default.

### Option 3 — Local development (no Docker)

```bash
npm install
npm run dev
```

Runs backend (NestJS, port `3000`) and frontend (Vite, port `5173`) concurrently. Requires a local PostgreSQL and Redis instance — see [Configuration](#-configuration). Node 20+ recommended.

## ⚙️ Configuration

Every variable below has a working default — you only need a `.env` file (copy from [`.env.example`](./.env.example)) to override one.

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://musichub:musichub@postgres:5432/musichub` |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Postgres credentials (Docker only) | `musichub` / `musichub` / `musichub` |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection, used by BullMQ and the queue system | `redis` / `6379` |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Signing secrets — generate your own for anything beyond a trusted network | example values |
| `CORS_ORIGIN` | Extra allowed origins beyond localhost + Tailscale CGNAT (comma-separated) | *(none)* |
| `LIBRARY_PATH` / `DOWNLOAD_TMP_PATH` | Where your library and in-progress downloads live *inside the container* (mirrors Settings, which can override these live) | `/data/library` / `/data/tmp` |
| `MUSICHUB_LIBRARY_PATH` | Host folder bind-mounted to `/data/library` — point this at your existing music collection | `/DATA/Media/Music` |
| `MUSICHUB_PORT` | Host port nginx binds to | `8095` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded on first boot — change the password after first login | `admin@example.com` / example value |
| `VITE_API_URL` | Only needed for advanced/non-default deployments | *(blank)* |

> Change `JWT_SECRET`, `JWT_REFRESH_SECRET`, `POSTGRES_PASSWORD`, and `ADMIN_PASSWORD` before exposing MusicHub beyond your own trusted network.

## 🛠️ Development

```bash
git clone https://github.com/SameDev/music-hub.git
cd music-hub
cp .env.example .env   # optional — edit if you want non-default values
npm install
npm run dev
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full development setup, conventions, and how to submit changes.

## 🧪 Testing

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

## 📁 Project Structure

```
music-hub/
├── backend/          # NestJS API (Clean Architecture, modular)
├── frontend/         # React SPA
├── docker/           # Nginx and other infra config
├── docs/design/       # Design documents and decision logs
└── docker-compose.yml
```

## 🗺️ Roadmap

- [x] Authentication
- [x] Downloads
- [x] Metadata
- [x] Playlists
- [x] Dashboard
- [ ] Lyrics support
- [ ] MusicBrainz integration
- [ ] Last.fm scrobbling
- [ ] Chromecast
- [ ] Plugin system
- [ ] Multi-library support

## 💭 Philosophy

MusicHub is a personal music library manager, first and foremost. Organization, streaming, and metadata are the core of the project — playback, tagging, and playlists are built and maintained with the most care.

Downloading is included as one auxiliary way to get tracks into your library, not the project's reason for existing. MusicHub does not include, and will not include, features designed to circumvent copy protection or facilitate copyright infringement. You are solely responsible for ensuring you have the rights or authorization to acquire and manage any content through this software.

## 🤝 Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how to set up your dev environment, the project's conventions, and how to submit changes. For anything beyond a small fix, please open an issue first to discuss the approach.

## 📄 License

[MIT](./LICENSE) © Samuel Conradt — SameDev

## ⚠️ Known Limitations

- **Theme**: Settings' `theme` field persists but doesn't change the running UI yet — the app is dark-themed only, matching the original design brief. `language` does switch live.
- **Docker on ARM/edge cases**: Docker/nginx configuration is statically audited and validated with `docker compose config`, and prebuilt images are published for both `amd64` and `arm64`, but real-world coverage across every host is still growing — please report an issue if something doesn't come up cleanly for you.
- **Test suite**: Unit and e2e coverage exists (`cd backend && npm test` / `npm run test:e2e`) but is still expanding module by module.
