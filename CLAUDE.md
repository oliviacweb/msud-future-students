# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture

This is a **Next.js 16** app (App Router) with WordPress integration using `'use cache'`, `cacheTag()`, and `cacheLife()` APIs. Uses `@pantheon-systems/nextjs-cache-handler` for persistent caching. Tailwind CSS v4 for styling.

### Key Differences from Next.js 15

- **No `Surrogate-Key` headers in next.config** — cache tags are set programmatically via `cacheTag()` in `lib/wordpressService.ts`. The adapter (`experimental.adapterPath`) exposes these tags to the internal router, which sets surrogate keys on responses.
- **No `export const revalidate`** — uses `'use cache'` directive with infinite `cacheLife` instead of ISR
- **No `export const dynamic`** — route segment config is incompatible with `cacheComponents: true`. Use client components for dynamic content.
- **`revalidateTag()` requires two arguments** in Next.js 16: `revalidateTag(key, { expire: 0 })`
- **`cacheComponents: true`** in next.config enables the `'use cache'` directive

### Cache System

`next.config.mjs` registers two cache handlers:
- `cacheHandler` → `cache-handler.mjs` (legacy: ISR, route handlers, fetch cache)
- `cacheHandlers.remote` → `cacheHandlers/remote-handler.mjs` (Next.js 16 `'use cache'`)

The adapter at `pantheon-adapter.js` is configured via `experimental.adapterPath` — it makes the site expose cache tags to the internal router for CDN surrogate key headers.

In-memory cache disabled (`cacheMaxMemorySize: 0`). Auto-selects GCS vs file-based storage (GCS is automatically configured when deployed on Pantheon).

### Data Flow

- `lib/wordpressService.ts` fetches every published post from the WordPress REST API in one call
- Posts in the `Notice` category become the site-wide banner (newest wins); every other post is a program, and its first category is its area of study
- `getSiteContent()` is the `'use cache'` wrapper: infinite `cacheLife`, tagged `post-list` plus `post-{id}`, `post-{slug}` and `term-{id}` for every post
- `getProgram(slug)` reads from the same cached content
- `components/ProgramFinder.tsx` is the client-side filter (toggle buttons with `aria-pressed` and a polite live region)
- Types are in `lib/types.ts`

### Accessibility check

- `a11y/` is a separate package (Playwright + axe) so Pantheon's build never installs it; it is excluded from `tsconfig.json` and ESLint
- `.github/workflows/a11y.yml` waits for the pull request's Pantheon environment (`pr-NUMBER-SITE.pantheonsite.io`) to serve a build newer than the commit, using the `x-build-time` meta tag that `next.config.mjs` stamps in, then runs axe on `/` and `/programs`

### API Routes

| Endpoint | Purpose |
|---|---|
| `POST /api/revalidate` | Revalidate surrogate keys from WordPress webhook (secured with `WEBHOOK_SECRET`) |

### Environment Variables

- `WORDPRESS_API_URL` — WordPress REST API base (default: `https://developer.wordpress.org/news/wp-json/wp/v2`)
- `WEBHOOK_SECRET` — Shared secret for `/api/revalidate` (required)

## Code Style Guidelines

- **Small, focused functions** with single responsibilities and descriptive names
- **Early returns / guard clauses** over nested if statements — keep code flat
- **Targeted try-catch blocks** — catch specific errors close to where they occur
- **No unnecessary nesting** — break nested logic into separate functions
- **Document function purpose** with JSDoc comments explaining the objective
