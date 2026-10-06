# In Their Words

A small platform for personal stories from across Asia, built with Nuxt 4 and Sanity for the Global Asia Institute take-home.

## Stack and setup

Requires Node 24 (see `.nvmrc`).

```
studio/   Sanity Studio (schemas in studio/schemaTypes, seed script in studio/scripts/make-seed.mjs)
web/      Nuxt 4 app (app code in web/app, server code in web/server)
```

```bash
# Studio
cd studio && npm install && npm run dev      # http://localhost:3333
npm run seed                                  # replaces the production dataset with the sample content

# Web
cd web && cp .env.example .env && npm install
npm run dev                                   # http://localhost:3000
npm run build && node --env-file=.env .output/server/index.mjs
```

## Content model

- `story`: title, slug, summary, featured image, author, published date, featured flag, tags and a Portable Text body.
- `author`: name, bio and avatar.
- `siteSettings`: a singleton holding the homepage eyebrow, heading and intro.

All sample stories and people are fictional.

## Key decisions

- **Nothing on the homepage is hardcoded.** The hero text lives in a Sanity Site settings singleton (fetched in the same single home query) with fallback copy in code, so editors can change the welcome message without a deploy.
- **Theme.** The brief describes "a platform for real personal stories" and mentions health stories in its privacy note, so the sample content mixes health, family, work and migration stories.
- **Caching.** Pages use standard `Cache-Control: s-maxage=60, stale-while-revalidate=300` headers on Vercel's CDN. Nuxt's `swr` rule was tried first, but on Vercel it maps to ISR and the homepage stayed stale, so plain HTTP caching was chosen for predictability.

## Privacy (PDPA)

| Area | Detail | Risk |
| --- | --- | --- |
| Consent | Analytics only run after an explicit opt in, and Global Privacy Control or Do Not Track counts as a no. | Reading behaviour can reveal sensitive interests, for example which stories about health, family or religion someone reads |

See `/privacy` on the site for the visitor-facing explanation.
