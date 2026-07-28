# Design: Bored API Activity Wheel

Date: 2026-07-28. Approved by Patrick in the design session.

## Decisions (from the session)

- Stack: zero-build static app (plain HTML, CSS, vanilla ES modules). No framework, no bundler.
- Wheel: classic canvas pie wheel, not a port of the PatrickRobelWeb feature-wheel.
- Save for later: localStorage only. TodoList sync is explicitly out of scope for now.
- Data: the Bored API mirror (`https://bored-api.appbrewery.com`) sends no
  `Access-Control-Allow-Origin` header (verified 2026-07-28), so browsers cannot call it
  directly. The app therefore ships the full activity dataset as static JSON and makes
  zero network calls at runtime.

## Architecture

Static site, deployable as-is (Vercel static later) and iframe-friendly for the website
arcade.

```
index.html            single page: filters bar, wheel canvas, result card, saved panel
css/style.css         all styling
js/logic.js           pure functions, no DOM (Node-testable)
js/wheel.js           canvas wheel rendering + spin animation
js/app.js             DOM wiring, state, localStorage, share URL
data/activities.json  full dataset (~200 activities), committed
scripts/fetch-activities.mjs  one-off generator: pulls /filter?type=X for all 9 types
tests/logic.test.mjs  node --test suite for logic.js
```

## Data

`activities.json` is an array of the API's activity objects:
`{activity, type, participants, price, accessibility, duration, kidFriendly, link, key}`.
Generated once by `scripts/fetch-activities.mjs` (9 requests, well under the mirror's
rate limit) and committed. Regeneration is manual and rare; the dataset is stable.

## Components

### logic.js (pure)

- `filterActivities(all, {participants, price, types})` where participants is
  `any | 1 | 2 | 4plus`, price is `any | free | cheap` (free: price === 0, cheap:
  price <= 0.3), types is a set of type strings (empty set means all).
- `pickCandidates(pool, n, rng)` returns up to 8 distinct random activities for the wheel.
- `segmentAtAngle(finalAngle, segmentCount)` maps the wheel's resting angle to the
  winning segment index.
- `findByKey(all, key)` for the share URL.

### wheel.js

- Draws an 8-segment pie on canvas with alternating segment colors and short labels
  (activity text truncated with an ellipsis character).
- `spin()` animates with momentum: random target rotation (several full turns plus a
  random offset), cubic ease-out deceleration via requestAnimationFrame, resolves with
  the winning segment index. A pointer at the top marks the winner.
- Fewer than 8 matching activities: the wheel shows however many exist (minimum 2).

### app.js

- Filters bar: participants (any / 1 / 2 / 4+), price (any / free / cheap), type
  multi-select chips. Changing filters re-picks candidates and redraws the wheel.
- Spin button: disabled while spinning and when fewer than 2 activities match.
- Result card: shown after landing, with the activity text large and metadata chips
  (type, participants, price, accessibility, duration, kid-friendly).
- Actions on the result: "Spin again" (new candidates, respin) and "Save for later".
- Saved panel: localStorage-backed list (key `baw-saved-v1`), each entry removable.
- Share: "Copy link" writes `?key=XXXX` to the clipboard; on load with `?key`, the app
  shows that activity's result card directly (no spin).

## Error handling

- Empty filter result: message "No activities match, loosen the filters", spin disabled.
- Bad or unknown `?key`: ignored, normal start.
- localStorage unavailable (iframe privacy modes): save button hidden, rest works.

## Testing

- `node --test tests/logic.test.mjs` covers all logic.js functions (TDD).
- Wheel animation and UI verified in the browser (screenshot check); no e2e framework.

## Out of scope

TodoList sync, party mode, streaks and daily mode, share-card images, sound effects,
backend or proxy of any kind.
