# Faith Community Reflection Tool

A free, private, research-informed tool that helps a person reflect on their experience inside a religious or spiritual community — across a first service, a week, a month, a year, and beyond — and see how patterns associated with high-control group dynamics shift over time.

It is **not a diagnosis** and **not a verdict** on anyone's faith or any organization. It's a mirror, not a judge: it surfaces known risk indicators, reflects them back across time, and points people toward outside support and their own judgment.

---

## Why this exists

Coercive control in a group rarely arrives all at once. It escalates — a little more of your time, a few more questions discouraged, a relationship outside the group quietly costing you. By the time the pattern is obvious, a person is often too far inside to see it clearly. A single snapshot hides that gradual climb; this tool is built to make it visible.

## What it does

- Adapts its questions to how long the person has been involved, and to their vantage point (currently involved, leaving, or worried about someone else).
- Tracks six research-based dimensions across each stage of involvement.
- Charts how each dimension shifts over time and flags when one is quietly escalating.
- Returns an overall reflection, a per-dimension breakdown, a side-by-side comparison of any two stages, a printable summary, and links to real support resources (US and international).
- Includes plain-language disclaimers explaining how every score is calculated and its limits.

## What it's built on

The questions are grounded in established frameworks rather than invented:

- **Steven Hassan's BITE model** — Behavior, Information, Thought, and Emotional control
- **Robert Lifton's** criteria for thought reform
- **Janja Lalich's** work on bounded choice
- The clinical literature on **religious trauma** (including Marlene Winell)

## Privacy

Privacy was the first requirement, not the last. Everything runs in the user's own browser. There is **no account, no database, and nothing stored or transmitted** — because the people who need this most may have real reasons to fear being watched. Closing or refreshing the page clears all answers.

---

## Important: this tool is pending professional review

This is a reflection and awareness aid, not a clinical instrument. The question wording and result tiers have not yet been formally reviewed by a licensed mental health professional. It should not be used as a substitute for therapy, medical advice, or a person's own judgment. If you are in distress, please reach out to a trusted person or one of the support resources listed in the tool's results.

---

## Tech

Built with **React** and **Vite**. No backend — it compiles to static files that can be hosted anywhere.

### Run it locally

You'll need [Node.js](https://nodejs.org) (LTS version).

```
npm install
npm run dev
```

Then open the local address shown in the terminal.

### Build for deployment

```
npm run build
```

This produces a `dist/` folder of static files. Drag that folder to a static host (such as Netlify or Cloudflare Pages) to put it online. A full step-by-step deployment guide for non-developers is included as `HOW-TO-DEPLOY.md`.

---

## Project structure

```
sentinel-tool/
├── index.html                          # Entry page
├── src/
│   ├── main.jsx                        # Mounts the app + privacy footer
│   └── ReligiousHarmReflectionTool.jsx # The tool itself
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Build configuration
├── HOW-TO-DEPLOY.md                    # Beginner deployment guide
└── README.md                           # This file
```

---

## A note on use

This is built to be given away. If it helps someone recognize a pattern they couldn't see, or gives a worried friend a way to think through what they're observing, it's done its job. Please use it with care for the people it's meant to serve.

---

*Built by Ben Biddick / North Bridge Solutions.*
