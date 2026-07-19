# Contributing to MusicHub

Thanks for considering a contribution. MusicHub is a self-hosted personal media library manager built for homelabs — small in scope by design, so please read the [legal & ethical notice](./README.md) in the README before proposing any feature: nothing that circumvents copy protection or facilitates copyright infringement will be accepted, ever.

## Ways to contribute

- **Bug reports** — open an issue. Include your deployment method (Docker vs. bare `npm run dev`), steps to reproduce, and relevant logs.
- **Bug fixes / small improvements** — a PR is fine without prior discussion.
- **New features** — open an issue first to discuss scope and approach before writing code. This project intentionally stays lean; not every idea fits.
- **Translations** — MusicHub ships `pt-BR` (default) and `en`. Adding a language means a new file under `frontend/src/i18n/` with the same key structure as the existing two, plus registering it in `frontend/src/i18n/index.ts` and the language `<select>` in Settings.
- **Docs** — README/CONTRIBUTING/`docs/design/` fixes are always welcome.

## Reporting a security vulnerability

Do **not** open a public issue for a security vulnerability. Use GitHub's private security advisory feature on this repository, or contact the maintainer directly. See the Auth/Downloads/Integrations modules for the existing security patterns (path-traversal containment checks, SSRF guard on webhook URLs, DNS-then-IP-range validation) — new code touching the filesystem or making outbound requests should follow the same approach; grep for `assertNotPrivateTarget` and `resolve()` + `startsWith` in `backend/src/modules/` for examples.

## Development setup

Requires Node 20+, Docker (optional but recommended), and a local PostgreSQL + Redis if you skip Docker.

```bash
git clone https://github.com/SameDev/music-hub.git
cd music-hub
cp .env.example .env
npm install
npm run dev   # backend on :3000, frontend on :5173, concurrently
```

Or via Docker: `docker compose up` after copying `.env.example`. See the README's Quickstart for details.

Seeded admin credentials come from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`.

## Project structure

```
music-hub/
├── backend/   # NestJS API — Clean Architecture, one folder per module
├── frontend/  # React SPA — routes/components/contexts/lib
├── docker/    # Nginx reverse proxy config
└── docs/design/  # Design docs from the original build process
```

### Backend module layout

Every backend module under `backend/src/modules/<name>/` follows the same shape:

```
<name>.module.ts        # NestJS module wiring
<name>.controller.ts     # HTTP routes, DTO validation, guards
<name>.service.ts        # business logic
<name>.repository.ts     # Prisma queries — the only layer that talks to the DB
dto/                     # class-validator request/response DTOs
entities/                # response shapes (e.g. password-stripped user)
interfaces/               # module-internal contracts
```

Keep that separation when adding to an existing module or creating a new one — controllers stay thin (validation + guard wiring only), services hold logic, repositories hold Prisma calls.

### Frontend layout

```
src/routes/            # one file per page/route
src/components/layout/  # Sidebar, Topbar, AppLayout, Player, FullscreenPlayer
src/components/ui/      # small reusable pieces (Skeleton, ConfirmDialog, StatCard)
src/contexts/           # Auth, Player, Toast — React context providers
src/lib/                 # api client, url helpers, hooks
src/i18n/                # pt-BR.json / en.json — keep both in sync
```

## Coding conventions

- **TypeScript strict mode** everywhere — don't loosen `tsconfig.json` to make an error go away; fix the underlying type.
- **Backend**: DTOs use `class-validator`; the global `ValidationPipe` has `whitelist` + `forbidNonWhitelisted` on, so any new field must be declared on the DTO or it's silently rejected.
- **Auth**: admin-only endpoints use `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)` — see `backend/src/modules/settings/settings.controller.ts` for the reference pattern.
- **Filesystem access**: any code that builds a path from user input must resolve it and verify it stays within the intended root directory (`resolve()` + `startsWith(root + sep)`) — see `metadata.service.ts`'s `assertWithinLibrary` for the pattern.
- **Outbound network requests from user input** (e.g. webhook URLs): must go through an SSRF guard that resolves the hostname and rejects private/loopback ranges — see `backend/src/modules/integrations/lib/ssrf-guard.ts`.
- **No comments explaining *what* code does** — name things clearly instead. A comment is only worth adding for a non-obvious *why* (a workaround, a subtle constraint).
- **No speculative abstractions** — don't add config flags, feature toggles, or generalized helpers for a single call site. Solve the problem in front of you.
- **i18n**: every user-facing string goes through `useTranslation()` / `t()`. Add the key to *both* `pt-BR.json` and `en.json` in the same commit — a PR that updates one and not the other will be asked to fix it.
- **Silent mutations get a toast**: if a `useMutation` has no other visual feedback (no inline message, no visible list change), wire its `onSuccess`/`onError` to `useToast()` — see `frontend/src/contexts/ToastContext.tsx` and its usage in `Library.tsx`/`PlaylistDetail.tsx`.
- **Responsive by default**: new pages/components should work down to a ~375px mobile viewport — wide tables get `overflow-x-auto` + `min-w-[Npx]`, cramped form-field pairs stack with `grid-cols-1 sm:grid-cols-2`.

## Testing

- Backend services should have unit tests (`*.service.spec.ts`) that don't require external services (`npm test`).
- Flows touching auth, the database, or the queue belong in `backend/test/*.e2e-spec.ts` (`npm run test:e2e`) — these need a live Postgres + Redis and a seeded admin.
- Before opening a PR, at minimum run:
  ```bash
  cd backend && npm test && npm run lint
  cd frontend && npm run build && npm run lint
  ```
- For UI changes, actually click through the feature in a browser (or headless via Playwright) — a clean build and passing lint verify the code compiles, not that the feature works.

## Commits & pull requests

- Keep commits focused — one logical change per commit, with a message that explains *why*, not just *what*.
- Reference the issue you're fixing/discussed, if any.
- Open the PR against `main`, describe what changed and how you verified it (tests run, manual testing done).
- Be ready for review feedback — this is a small project maintained in spare time, so response times vary, but every PR gets looked at.

## License

By contributing, you agree your contribution is licensed under this project's [MIT License](./LICENSE).
