# MSU Denver Future Students site (demo concept)

A Next.js 16 site for future students, running on Pantheon and reading its content from a headless WordPress site on Pantheon. Built for a Pantheon sales engineering presentation. Not affiliated with MSU Denver.

## How it fits together

- **WordPress on Pantheon** holds the content: each program is a post whose category is its area of study, and the newest post in the Notice category is the site-wide banner.
- **Next.js on Pantheon** reads WordPress over the REST API and caches everything with `'use cache'` and surrogate keys.
- **When an editor publishes,** the Next.js Webhook plugin on WordPress sends a webhook to `/api/revalidate`, which refreshes only the cached content that changed. No rebuild.
- **Every pull request** gets its own Pantheon environment at `https://pr-NUMBER-SITE.pantheonsite.io`. The `Accessibility` workflow waits for that environment, runs axe against it, and fails the pull request on any serious or critical WCAG 2.1 AA issue.

## Environment variables

Set with Pantheon Secrets Manager (`--type=env --scope=web,ic`):

- `WORDPRESS_API_URL`, for example `https://live-msud-cms.pantheonsite.io/wp-json/wp/v2`
- `WEBHOOK_SECRET`, the same value as `NEXTJS_WEBHOOK_SECRET` on the WordPress site

## Local development

```bash
cp .env.local.example .env.local   # then fill in the two values
npm install
npm run dev
```

## The accessibility check

```bash
cd a11y
npm ci
npx playwright install chromium
BASE_URL=http://localhost:3000 npx playwright test
```

## Releasing

Merging to `main` deploys to Dev. Test and Live deploy from Git tags such as `pantheon_test_1` and `pantheon_live_1`, created on GitHub's Releases page.
