# CLAUDE.md, BoredAPIActivityWheel (Patrick, pr@zrm.dk)

Idea-stage project: a spin-a-wheel UI over random activities from the Bored API. No code
exists yet; the stack is deliberately undecided until the design session.

## Facts

- Repo: `patr7257/BoredAPIActivityWheel` (private for now, flip public when showable).
- Local clone lives at `C:\Users\pr\repos\1-Personal\BoredAPIActivityWheel`, sibling to
  `PatrickRobelWeb` (same convention as MusicTimelineQuiz and MiniGames).
- Showcase relationship: this repo holds the project; a project entry on the portfolio
  website is added LATER from the PatrickRobelWeb repo via its `add-website-project`
  skill. Do not edit PatrickRobelWeb from here.
- API: Bored API. The original `https://www.boredapi.com` has been unreliable; use the
  maintained mirror `https://bored-api.appbrewery.com` (e.g. `/random`, `/filter?type=...`).
  No API key. Fallback option: self-host the open activity dataset as a static JSON.

## Read first

- `IDEA.md`: full concept, feature sketch, open questions.
- `PLAN.md`: skeleton to be filled in the design session (start there with the
  superpowers brainstorming/design flow before writing any code).

## Open design decisions (do not pre-empt, decide with Patrick)

- Zero-build static app (MiniGames style, could be iframed by the website arcade) vs a
  small Next.js app on Vercel.
- Whether to visually echo the website's feature-wheel (that component lives in
  PatrickRobelWeb and would need porting or reimplementing).
