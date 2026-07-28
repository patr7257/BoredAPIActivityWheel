# Idea: Bored API Activity Wheel

From the 2026-07-27 brainstorm (idea #11 of 30). Tag: fun.

## Concept

You are bored. You open the page, optionally set a few filters (how many people, how much
money, what mood), and spin a big satisfying wheel. The wheel lands on a random activity
fetched from the Bored API. Big fun factor, instant gratification, very showable on a
portfolio.

## Target user

Anyone bored: Patrick, friends, site visitors. Also a portfolio showcase piece, so visual
polish and a fun spin animation matter more than feature depth.

## Feature sketch

- Big wheel with a handful of candidate activities loaded on it; spin with momentum,
  land on one, show it big with its metadata (type, participants, price, accessibility).
- Filters: participants (1, 2, 4+), price (free, cheap, any), type (recreational, social,
  diy, education, ...).
- "Spin again" and "Save for later" (localStorage list of saved activities).
- Shareable result (URL with the activity key or a share-card).
- Stretch: streak/daily mode, or "party mode" where the wheel decides for a group.

## API facts

- Mirror: `https://bored-api.appbrewery.com` (original boredapi.com is unreliable).
  - `GET /random` returns `{activity, type, participants, price, accessibility, key}`.
  - `GET /filter?type=social` etc. for filtered pulls.
- No key, no auth. CORS status to verify at design time; if CORS blocks the browser,
  either proxy through a tiny serverless route or ship the open dataset as static JSON.

## Open questions for the design session

- Stack: zero-build (MiniGames style, arcade-iframe friendly) vs small Next.js app.
- Reuse the PatrickRobelWeb feature-wheel look or build a simpler classic pie wheel?
- Hosting: Vercel (static/Next) is the obvious default; no backend need identified.
- How it appears on the website: arcade tab game vs standalone project entry with a link.
