# Eva's Rehab Tracker

A personal rehab and training tracker built to make daily PT easier to start, easier to finish, and easier to learn from.

This project began as a simple ankle rehab timer after an injury, then grew into a lightweight recovery platform: exercise modules, timers, daily check-ins, GitHub-backed history, rating feedback, and training-template data for a recommendation system.

## Why This Exists

Rehab is hard to sustain because the work is repetitive, the progress is subtle, and the reward often arrives weeks later. This app creates a shorter feedback loop:

- Pick a focused rehab/training module.
- Do the exercise with a timer and set tracking.
- Save the session as structured JSON.
- Get a small reward card after check-in.
- Build a real history that can later power recommendations.

The long-term goal is not just "track exercises", but to turn personal recovery into a data loop.

## Current Features

- Four training modules:
  - Right ankle rehab
  - Thoracic/lumbar mobility
  - Upper-body activation
  - Lower-body strength
- Exercise timers with pre-countdown, set tracking, partial-save flow, and manual `+1 set`.
- Daily check-in with streak tracking.
- GitHub API persistence to `data/sessions/YYYY-MM-DD.json`.
- History calendar with rating badges and reward-card archive.
- Light/dark theme.
- Custom exercise add/edit/delete.
- Training template suggestions for the sibling `rehab-bandit` project.
- Post-check-in 1-5 feedback score used as a future bandit reward signal.

## Data Model

Each check-in is saved as one JSON file:

```text
data/sessions/YYYY-MM-DD.json
```

Important fields:

```json
{
  "date": "2026-04-28",
  "schemaVersion": 1,
  "modules": ["ankle"],
  "exercises": [],
  "template_id": "ankle_only",
  "suggested_template_id": "upper_ankle",
  "travel_mode": false,
  "feedback_score": 2
}
```

The `template_id`, `suggested_template_id`, `travel_mode`, and `feedback_score` fields are part of the integration contract with `rehab-bandit`.

## Rehab Bandit Integration

This repo is the data source for [`rehab-bandit`](../rehab-bandit), a small contextual-bandit service that will learn daily rehab plan recommendations from real check-in history.

Current suggestion logic is still local and deterministic. The roadmap is:

1. Collect clean session data from real use.
2. Start with rule-based recommendations.
3. Let `rehab-bandit` observe and learn in the background.
4. Switch recommendations to the bandit once the safety rails are ready.

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- ES modules
- GitHub Pages deployment
- GitHub Contents API for persistence
- No build step

## Local Use

Open `index.html` directly in a browser, or serve the directory with any static file server.

GitHub sync requires a fine-grained GitHub token with Contents read/write access to this repo. The token is stored only in browser `localStorage`.

## Project Notes

- `CLAUDE.md` contains project memory and implementation rules for AI coding assistants.
- `docs/plan.md` contains the frontend engineering plan.
- `context.md` is local/private training context and should not be committed unless intentionally sanitized.

## Status

Active personal project. The app is already used for daily rehab tracking; the next major work is stabilizing the bandit data contract and gradually extracting `src/app.js` into smaller vanilla JS modules.
