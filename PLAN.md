# PLAN.md

Design session held 2026-07-28. The approved spec lives at
`docs/superpowers/specs/2026-07-28-activity-wheel-design.md`; read that first.

## Goals

- Shippable zero-build static wheel app: spin, land, show activity, with filters,
  save-for-later (localStorage) and a shareable `?key` URL.
- Portfolio-quality visual polish on the wheel and result card.

## Decided (was "Open decisions")

- Stack: zero-build static (HTML, CSS, vanilla ES modules). No framework.
- Wheel: classic canvas pie wheel with momentum spin, not the website feature-wheel.
- CORS: the mirror blocks browser calls, so the dataset ships as committed static JSON
  (`data/activities.json`), zero runtime network.
- Website integration: decided later from PatrickRobelWeb via its add-website-project
  skill; this repo just stays iframe-friendly.

## Milestones

1. DONE 2026-07-28: design session output (spec).
2. MVP: dataset script + logic.js (TDD) + wheel + result card.
3. Filters, saved list, share URL, visual polish.
