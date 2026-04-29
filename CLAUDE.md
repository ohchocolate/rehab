# CLAUDE.md — Eva's Rehab × Fitness Tracker

> This file is Claude Code's persistent memory. Read this before touching any file.  
> Last updated: 2026-04-21

---

## Project Overview

**Name**: Eva's Kinetic Chain Recovery Tracker (evolving toward personal fitness platform)  
**Owner**: Eva (ACE-certified trainer, badminton/tennis player)  
**Primary goal**: Personal rehab + body recomposition tracker, shared with family & friends in late July 2026 (China trip)  
**Long-term vision**: Expand into a personal fitness app — rehab is the starting seed, not the final scope  
**Deployment**: GitHub Pages — `ohchocolate/rehab` → `https://ohchocolate.github.io/rehab/`  
**Design language**: Dark + light themes, editorial, bilingual (中/EN), data-forward

---

## Current State (as of 2026-04-29)

### Shipped ✅
- Single-file `index.html` + extracted `src/app.js` + `styles/main.css` (modules) deployed to GitHub Pages
- Four rehab modules: 🦶 右踝康复 · 🌀 胸腰椎 · 💪 上肢激活 · 🦵 下肢力量
- Daily check-in with streak counter (auto-recomputed from history)
- Custom exercise add/edit/delete (per module)
- Pre-countdown for timers, save-on-exit popup, manual `+1 组` escape hatch
- 打卡收藏夹 — **redesigned 2026-04-29 as month calendar** (7×N grid + month nav + inline detail panel; rating-animal badges in cells)
- Day / night theme toggle with high-contrast reward card in light mode
- GitHub API data persistence (sessions saving to repo) + **history sync from GitHub on load** (streak survives cache clears + cross-device)
- **rehab-bandit prep (2026-04-28)**:
  - 6-template registry (`upper_ankle`, `lower_ankle`, `stretch_ankle`, `travel_minimal`, `ankle_only`, `rest`)
  - "今日建议" card on home page with cycle button + ✈️ travel-mode toggle
  - Post-checkin 1–5 rating modal (🐌🐢🐰🐎🦄) — feedback signal for the bandit
  - Session JSON now carries `template_id`, `suggested_template_id`, `travel_mode`, `feedback_score`

### Known Issues (active)
1. ~~Day mode color bug~~ ✅ Fixed (commit `6f26b7e`)
2. **Settings button disappears after save**: Treat as bug unless proven otherwise. Settings should be persistently reachable from a top-right corner icon, independent of screen state.
3. ~~Partial session interruption not recorded~~ ✅ Fixed — save-on-exit popup + setsPartial state
4. ~~No pre-countdown~~ ✅ Fixed
5. ~~No manual set-count recovery~~ ✅ Fixed — `+1 组（手动计入）` button
6. ~~No "已保存 ✓" confirmation~~ ✅ Fixed — save-toast with success/retry/link
7. ~~Exercise ordering~~ ✅ Fixed — sorted by `category` (warmup/main/cooldown) per module
8. ~~Lower body module missing~~ ✅ Shipped 2026-04-22
9. **Suggestion card is a stub**: cycles deterministically by date hash; will be wired to rehab-bandit project — preserve `getCurrentSuggestion()` seam in `src/app.js`
10. **History sync only fetches dates, not session content**: re-opening calendar on a fresh device shows checkmarks but not the rating animal or reward content (those need a per-day fetch — out of scope until charts page)

---

## Stack Decision — Settled

**Current stack**: Single-file vanilla HTML/CSS/JS. No build step. `git push` = deploy.

This was the right call for v0. As the app grows, revisit if:
- `index.html` exceeds ~1500 lines
- Multiple pages needed (charts page, PT notes page, weekly overview)
- Component reuse becomes painful

**Before migrating**: propose to Eva with concrete reasoning. Don't silently introduce React/Vite.

Migration preference order: **single-file vanilla → multi-file vanilla with ES modules → React+Vite** (last resort).

---

## Repository Structure

```
/
├── CLAUDE.md                  ← you are here
├── context.md                 ← training background & rehab context (domain knowledge)
├── README.md
├── index.html                 ← main app (currently everything)
├── styles/                    ← if/when extracted
├── src/                       ← if/when extracted
└── data/
    └── sessions/              ← one JSON file per training session
        └── YYYY-MM-DD.json
```

---

## Design System

### Dual Theme (Dark = night/default, Light = day)

Both themes must:
- Maintain editorial feel (Georgia/Songti SC serif)
- Preserve accent colors with adjusted saturation per background
- Ensure **WCAG AA contrast** for all text — especially surprise/celebration sections (known bug area)

#### Dark Theme (Night — default)
```css
--bg-primary:    #07090C;
--bg-card:       #0F1319;
--bg-elevated:   #161C24;
--text-primary:  #E8E4DE;
--text-muted:    #888;        /* lifted from #666 for readability */
--text-dim:      #444;        /* lifted from #333 */
--accent-blue:   #60A5FA;
--accent-orange: #F97316;
--accent-green:  #34D399;
--accent-amber:  #F59E0B;
--accent-purple: #A78BFA;
```

#### Light Theme (Day)
```css
--bg-primary:    #FAF8F3;     /* warm off-white, not pure white */
--bg-card:       #FFFFFF;
--bg-elevated:   #F0ECE4;
--text-primary:  #1A1A1A;
--text-muted:    #555;
--text-dim:      #888;
--accent-blue:   #2563EB;     /* deeper — pop against white */
--accent-orange: #EA580C;
--accent-green:  #059669;
--accent-amber:  #D97706;
--accent-purple: #7C3AED;
```

**Do not** simply invert the dark theme. Day mode deserves a fresh design pass.

### Surprise / Celebration Section (Known Bug Area)
When a milestone triggers (惊喜 unlock, streak achievement):
- Dark mode: use `--text-primary` on accent-colored backdrop — not muted text
- Light mode: use accent color text on `--bg-card` with weight 600+
- **Never** use `--text-dim` or `--text-muted` for celebration content — it's the emotional peak of the app

### Typography
- Display/Headers: `'Georgia', 'Songti SC', serif` — editorial tone
- Monospace data: `'JetBrains Mono', 'Menlo', monospace` — numbers, timers, metrics
- Never use: Inter, Roboto, Arial, system-ui

### Persistent UI Principles
- **Settings/theme toggle reachable from every screen.** Top-right corner, always visible.
- Current state (logged in / theme / streak) should be glanceable without scrolling.
- Back button behavior must preserve in-progress timer state (see Known Issue #3).

### Component Conventions
- Border radius: `10–14px` cards, `8px` inner elements
- Card: `background: var(--bg-card)`, subtle border matching `--bg-elevated`
- Active/selected: colored background + high-contrast text
- Expandable cards: `border: 1px solid {accent}55` when open
- Tags: `fontSize: 10px`, `padding: 2px 7px`, `borderRadius: 20px`

### Bilingual Convention
- Section headers: Chinese primary, English subtitle
- Data labels: English (chart-friendly)
- Coaching cues: Chinese only (full tone preserved)
- Chart axes/legends: English

---

## Session Data Schema

One JSON file per session at `/data/sessions/YYYY-MM-DD.json`:

```json
{
  "date": "2026-04-20",
  "schemaVersion": 1,
  "streak": 12,
  "checkin_time": "2026-04-20T14:23:00.000Z",
  "modules": ["ankle", "spine", "upper"],
  "exercises": [
    {
      "id": "active_hang",
      "name": "Active Hang",
      "module": "upper",
      "category": "main",
      "plannedSets": 6,
      "completedSets": 4,
      "completed": false,
      "plannedDurationSec": 30
    }
  ],
  "template_id": "upper_ankle",
  "suggested_template_id": "stretch_ankle",
  "travel_mode": false,
  "feedback_score": 4
}
```

**Schema evolution rules**:
- Additive changes (new optional fields) are safe
- Breaking changes require `schemaVersion` bump + migration plan
- Old JSONs must remain readable forever — never lose historical data
- `category` field on exercises enables future ordering (warmup / main / cooldown)
- **Bandit-contract fields** (`template_id`, `suggested_template_id`, `travel_mode`, `feedback_score`) are read by the sibling **rehab-bandit** project — see "rehab-bandit Integration" section below before changing any of them

`feedback_score`: 1–5 (animal ladder 🐌🐢🐰🐎🦄). 1 = template was too hard / wrong fit; 5 = peak day.  
Pain (legacy / not yet wired): 0 none / 1 mild / 2 moderate / 3 severe  
Energy (legacy / not yet wired): 1–5

---

## rehab-bandit Integration

**rehab-bandit** is a separate Eva-owned project (started 2026-04-28) — a contextual bandit / RL agent that recommends the day's training template. It lives outside this repo but reads `data/sessions/*.json` from this repo as its training corpus.

The fields below are an **integration contract**, not internal app state. Don't rename, drop, or repurpose them without coordinating with the bandit project.

| Field | Meaning | Source |
|-------|---------|--------|
| `template_id` | Template the user actually trained, derived from completed modules | `deriveTemplateFromModules()` in `src/app.js` |
| `suggested_template_id` | Template the bandit (or current stub) suggested via the home-page card | `getCurrentSuggestion()` in `src/app.js` |
| `travel_mode` | Whether the user toggled ✈️ (restricts candidates to `travelOK: true`) | `localStorage.rehab_travel_mode` |
| `feedback_score` | 1–5 self-rating from the animal modal — bandit's reward signal | `askRating()` in `src/app.js` |

**Template registry** (single source of truth — `trainingTemplates` in `src/app.js`):
- `upper_ankle` — 上肢 + 右踝
- `lower_ankle` — 下肢 + 右踝 (PT 放行后)
- `stretch_ankle` — 胸腰椎 + 右踝 (low-intensity recovery)
- `travel_minimal` — 酒店/地板可做，胸椎+踝+上肢
- `ankle_only` — 只跑右踝 HEP，10 分钟
- `rest` — 主动休息

Currently `getCurrentSuggestion()` cycles deterministically by date hash. The bandit will eventually replace its body — preserve the function signature.

---

## GitHub API Integration

**Strategy**: Public repo + Fine-Grained PAT in browser `localStorage`. Token never in source.

### Token setup flow
1. App loads → no token in `localStorage` → show setup screen
2. User pastes PAT (scope: this repo only, Contents: Read & Write)
3. Save to `localStorage.gh_token`
4. Settings icon in top-right allows re-entering / clearing token at any time

### Write flow
```
保存打卡 →
  GET  /repos/{owner}/{repo}/contents/data/sessions/{date}.json  (fetch SHA if exists)
  PUT  /repos/{owner}/{repo}/contents/data/sessions/{date}.json  (create or update)
  → Show "已保存 ✓ HH:MM" with link to GitHub file
  → On error: red banner + retry button, never silent failure
```

### Read flow (future charts page)
```
  GET  /repos/{owner}/{repo}/contents/data/sessions
  → For each file: fetch, atob, JSON.parse
  → Aggregate, sort by date, render
```

### Error handling
- 401: token invalid → setup screen
- 409: SHA conflict → re-fetch + retry once
- Network error: cache write locally, retry on next load

---

## Save Confirmation (P0 — currently missing)

Every GitHub write must produce visible feedback:
1. **Success**: toast "已保存 ✓ 14:23" + tiny link "查看记录" → opens the JSON file on GitHub in new tab
2. **Failure**: red banner with explicit error (network / auth / conflict) + retry button
3. **Today's state**: after saving, home screen shows "今日已打卡 ✓" persistently (survives reopen) — sourced from GitHub, not localStorage, so it's true across devices

---

## Quick Check-in UX

Tap in ~20 seconds, fill metrics later.

```
今天练了什么？          [日期 auto-filled]

[🦶 右踝] [🌀 胸腰椎] [💪 上肢]   ← multi-select

今天感觉
[😴1] [😐2] [🙂3] [💪4] [🔥5]

右脚踝                右肩
[0 无] [1 轻] [2 中] [3 重]

备注（可选）

        [保存打卡 →]

📊 记录指标（可选）  ← collapsed by default
```

### Pre-countdown for timers (P0)
Before any exercise timer starts, show a 3-second ready countdown (user-adjustable to 5s in settings).  
Visual: large numeral, subtle pulse, optional vibration.

### Partial completion handling (P0)
If user exits mid-exercise:
- Auto-save current progress to a `draft` state
- On return: show "继续 / 保存已完成 N 组 / 放弃" choice
- "+1 组" manual increment button always available as escape hatch

### Milestone auto-detection
After saving, check client-side:
- `activeHang_max_sec >= 30` → "🎉 Active Hang 30秒达成！"
- `singleLegRDL_R_hold_sec >= 5` (first time) → "🦶 单腿RDL首次无辅助！"
- `floorPress_lb > previous max` → "💪 推力新高！"
- Session count hits 10, 20, 30, 50, 100 → "📅 第N次训练！"
- Streak hits 3, 7, 14, 30 → "🔥 N日连续！"

---

## Future Roadmap — Extension Points

This app is designed to grow. Keep these expansion seams open.

### v1 — Rehab Tracker (current, July 2026 target)
Current scope. **Don't feature-creep before July.**

### v2 — Daily Training Plan
Eva wants to add daily fitness beyond rehab. Possible shapes:
- Simple: every day full-body routine
- Split: upper/lower alternating days
- Structured: integrate with existing Module A/B/C framework

**Architecture implication now**: the `exercises` array already supports `category: "rehab" | "warmup" | "main" | "cooldown"` so ordering can be programmatic (addresses Known Issue #7).

### v3 — Progress Charts Page
Separate route showing:
1. Stability Timeline (single-leg RDL hold)
2. Shoulder Recovery (active hang duration)
3. Push Strength Rebuild (floor press load)
4. Session Heatmap (GitHub-contribution style)
5. Pain Trend (declining scores)

Chart lib: `Chart.js` via CDN (vanilla-friendly). Dark + light theme aware.

### v4 — PT Notes Integration
Upload HEP PDFs or paste notes → app extracts exercises → merges with existing plan.  
Possibly LLM-assisted parsing (out of scope for near-term).

### v5 — Shareable snapshot
Public read-only page for family/friends: streak + key milestones + select charts. No token required to view.

### Architecture seams to protect now
- Keep session JSON schema **extensible** (additive only)
- Keep `exercises[]` as structured array with `category` field, not free text
- Keep theme system in CSS variables (no hardcoded colors in components)
- Separate **data layer** (GitHub API) from **UI layer** — even within single-file, use clearly named functions (`saveSessionToGitHub`, not inline fetch)

---

## Domain Knowledge

> Full details in `context.md`. Quick reference:

**Structural bugs** (never regress):
- Right ankle: instability + recent sprain — no single-leg explosive work until PT cleared
- Right shoulder: impingement — no overhead pressing; Active Hang is rehab tool
- Thoracic: left rotation > right — extra right-side volume always

**New clearance (2026-04)**: PT approved squats and RDLs. Bodyweight full/sumo squat tested pain-free. Lower body module can now be planned.

**Sport context**: Badminton + tennis. Rehab serves kinetic chain:  
foot grip → ankle → knee → **hip rotation** → core → thoracic → shoulder → racket.

**Training framework**:
- Module A (Maintenance, daily ~10min): Active Hang, Cat-Cow, Ankle mobility
- Module B (Fat-burn circuit, ~35min): Box jump, Woodchop, Farmer's walk
- Module C (Debug/Recovery, ~10min): Floor press, Single-leg RDL, Thoracic rotation

---

## Git Conventions

```
feat: add day mode toggle
fix: surprise section contrast in day mode
data: session log 2026-04-20
refactor: extract github.js as module
docs: update CLAUDE.md with v2 roadmap
```

Branch: `main` only. Tag milestones: `v0.1-launch`, `v1.0-july-share`.

---

## Cache Busting (GitHub Pages)

Safari / iOS 会长时间缓存 CSS/JS。每次改 `styles/main.css` 或 `src/*.js` 后，在 `index.html` 里 bump 版本号，三处一起改：

```html
<link rel="stylesheet" href="styles/main.css?v=YYYY-MM-DD[a-z]">
<script type="module" src="src/app.js?v=YYYY-MM-DD[a-z]"></script>
```

以及 `src/app.js` 顶部的 import：

```js
import { ... } from './github.js?v=YYYY-MM-DD[a-z]';
```

规则：
- 日期用 commit 当天（`date +%F`）
- 同一天多次发布加字母后缀（`2026-04-22a` → `2026-04-22b` → …）
- 三处**必须同步**，不然 import 链上半截会走旧缓存
- 不要用 `Date.now()` 之类的动态时间戳 —— 每次访问都 miss cache，浪费用户带宽

Eva 首次切到新版本需 hard refresh 一次（Cmd+Shift+R）拉走旧 `index.html`。之后所有访问都跟着新 URL 走。

---

## What Claude Code Should Never Do

- Don't change the color palette without asking
- Don't remove Chinese text — bilingual is intentional
- Don't hardcode GitHub token in source — localStorage only
- Don't migrate to React without explicit Eva approval — current vanilla stack works
- Don't introduce a build step silently
- Don't break the session JSON schema — additive changes only, bump `schemaVersion` if breaking
- Don't rename or change semantics of the bandit-contract fields (`template_id`, `suggested_template_id`, `travel_mode`, `feedback_score`) — coordinate with the rehab-bandit project first
- Don't change template IDs in `trainingTemplates` registry — they're keys the bandit indexes on
- Don't remove the settings icon from persistent view (Known Issue #2)
- Don't use `--text-dim` or `--text-muted` for celebration / milestone content
- Don't reach for utilitarian/mechanical emoji (🪫⚡🔋📊⚙️) on user-facing surfaces — Eva's aesthetic is warm/playful (animals, weather, characters). Settings/diagnostic surfaces are the only exception.
- Don't scope-creep past July 2026 targets — roadmap v2+ is intentionally deferred

---

## Working With Eva

- Full ACE-trainer vocabulary — no need to simplify exercise science
- She prefers discussion before large changes: propose → confirm → implement
- Use **Opus** for architecture / product decisions; **Sonnet** for focused implementation
- When in doubt about scope, ask — she's explicit about avoiding feature creep before July
- July 2026 China trip is a real deadline, not aspirational
- She codes alongside Claude Code ("vibe coding") — keep changes reviewable, commits atomic
