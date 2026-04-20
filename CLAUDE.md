# Heavy Lifting — Developer Guide

## Project Philosophy

Build **incrementally**. Each session should leave the app in a fully working, deployable state. Prefer finishing one feature completely over half-building two. When in doubt, keep it simple and defer to the backlog.

No feature should be considered done until:
1. It renders correctly on a mobile viewport (375px wide)
2. It works in free-tier mode (no API key)
3. The data it produces persists across a page reload

---

## Running the App

```bash
npm run dev       # local dev server → http://localhost:5174
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

Deploy `dist/` to Vercel or Netlify (drag-and-drop or `vercel --prod`).

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 (Vite) | No router — tabs use `useState` in `App.jsx` |
| Styling | Tailwind CSS v3 | Design tokens in `tailwind.config.js` |
| Database | Dexie.js (IndexedDB) | `dexie-react-hooks` for live queries |
| Charts | Recharts | `LineChart` + `BarChart` |
| AI | Anthropic API (direct fetch) | Browser header required; user supplies key |
| PWA | vite-plugin-pwa + Workbox | Service worker, offline cache, iOS install |

---

## File Structure

```
src/
  App.jsx               — Tab shell; single useState('home') router
  index.css             — Tailwind + --accent CSS var + iOS fixes
  db/
    schema.js           — Dexie DB + table definitions (FOUNDATION)
    queries.js          — All CRUD helper functions
    seed.js             — Sample gyms + workout history for testing
  data/
    exercises.js        — Master exercise library (~130 exercises) + KNOWN_MACHINES (30 specific machines)
  ai/
    workoutGenerator.js — Pure-logic workout generator (no API required)
    exerciseLibrary.js  — Constants for generator: BW_PERCENTAGES, WEIGHT_INCREMENT, PPL_ROTATION
    workoutGenerator.test.js — 21 Vitest tests
    client.js           — fetch() wrapper for Anthropic API
    suggestSwap.js      — Exercise swap prompt + fallback
  utils/
    weightCalc.js       — 3-layer weight recommendation
    xpCalc.js           — XP + level math
    streakCalc.js       — Streak logic
    formatters.js       — Date/weight/duration display helpers
  hooks/
    useWorkout.js       — Active session state machine (core)
    useGym.js           — Gym + equipment CRUD
    useStats.js         — Streak, XP, PR live reads
    useSettings.js      — API key, accent color, goal
  components/
    layout/             — BottomNav, Header
    shared/             — Button, Modal, Badge, Spinner, PRCelebration, SettingsModal
    home/               — StreakWidget, LastSessionWidget, NextWorkoutWidget, VolumeWidget
    gym/                — GymManager, EquipmentPicker, SpecificEquipmentPicker
    workout/            — WorkoutSetup, ActiveSession, ExerciseCard, SetLogger,
                           RestTimer, ExerciseSwap, PostSession
    log/                — SessionList, SessionDetail
    progress/           — LiftChart, VolumeChart, PRHistory
  pages/
    Home, Workout, Log, Progress
vitest.config.js        — test runner config (environment: node)
```

---

## Data Models (Dexie v1)

```js
gyms:           ++id, name, createdAt
                  { name, equipment: string[],
                    specificEquipment: [{id, name, type, custom?}] }

exercises:      ++id, name, equipmentType, *muscleGroups
                  { name, category, muscleGroups[], equipmentType,
                    sessionTypes[], defaultSets, defaultReps, defaultWeight }

workouts:       ++id, gymId, date, type, status
                  { gymId, date, type, exercises[], status, duration }

sets:           ++id, workoutId, exerciseId, completedAt
                  { workoutId, exerciseId, setNumber, actualWeight,
                    reps, targetWeight, ease, completedAt }

progressPhotos: ++id, date
                  { date, bodyweight, imageData (base64), notes }

userStats:      ++id (single row at id=1)
                  { totalXP, streak, lastWorkoutDate, goalType,
                    accentColor, apiKey }
```

> ⚠️ When adding new DB fields in a future version, bump `db.version()` and add a migration — never mutate v1 schema directly.

---

## Key Patterns

### Live Queries (Dexie)
Use `useLiveQuery` from `dexie-react-hooks` for any data that should auto-refresh when the DB changes. Direct `db.*` calls inside `useLiveQuery` callbacks are reactive.

```jsx
const workouts = useLiveQuery(() => db.workouts.orderBy('date').reverse().toArray(), [])
```

### Accent Color
Stored in `userStats.accentColor`. Applied as CSS custom property via `useSettings`:
```js
document.documentElement.style.setProperty('--accent', color)
```
In Tailwind, reference as `bg-accent`, `text-accent`, `border-accent/40` etc.

### Active Session State Machine
`useWorkout.js` manages state: `idle → generating → ready → active → post-session → complete`

Data lives in React state during the session; is written to Dexie only on `complete`. Never call `addWorkout` more than once per session.

Key methods exported: `startGeneration`, `startSession`, `logSet`, `finishWorkout`, `cancelWorkout` (deletes in-progress session + all sets), `submitEaseRatings`, `swapExercise`, `addExercise`, `removeExercise`, `updateExerciseSets`, `reset`.

### Pure-Logic Workout Generator (`ai/workoutGenerator.js`)
Replaces Claude API for exercise selection. Always works offline, no key required.

```js
generateWorkout({ gym, goal, lastSessions, bodyweight, programStyle, daysSinceRest, overrideSessionType })
// → { dayType, exercises[], sessionNotes }
```

- **Rotation**: PPL (push→pull→legs) or upper/lower or full-body based on `programStyle`
- **Deload**: auto-triggered when `daysSinceRest >= 5` — uses 60% of normal weights
- **Selection**: favorites first → history (continuity) → non-BW when gym has equipment → random within each tier (different exercises each generation)
- **Weights**: history + ease adjustment (±WEIGHT_INCREMENT per equipment type), or bodyweight% estimate for new exercises
- **Goal schemes**: strength=5×4/180s rest, mass=4×10/90s, toning=3×13/60s
- **Muscle diversity**: max 2 exercises per primary muscle group per session

Tested via `vitest` — run `npm test` (21 tests).

### Gym Equipment Model
Two layers:
1. `equipment: string[]` — general types (`barbell`, `dumbbell`, `cable`, `machine`, `bodyweight`, `other`)
2. `specificEquipment: [{id, name, type, custom?}]` — named machines (from `KNOWN_MACHINES` or user-created)

`extractEquipmentTypes(gym)` in `workoutGenerator.js` merges both into a flat type array for exercise filtering.

### Weight Recommendation (3-layer, `utils/weightCalc.js`)
1. Base: last logged weight or exercise default  
2. Ease: too-easy +5%, too-hard −10%, 3× just-right → auto +5%  
3. AI overlay: Claude suggestion, capped ±15% from base (only if API key set)

### AI Fallback
Every AI call has a deterministic fallback that doesn't require a network call. Check `hasApiKey` before calling Claude. The app must work end-to-end in free-tier mode.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `background` | `#1a1a1a` | Page background |
| `surface` | `#242424` | Cards, nav |
| `surface-2` | `#2e2e2e` | Input fields, nested cards |
| `accent` | `var(--accent)` default `#3b82f6` | CTA, active state, charts |
| `pr` | `#f59e0b` | PRs only — gold, never reused |
| `muted` | `#a0a0a0` | Labels, secondary text |
| `success` | `#22c55e` | Completed sets |
| `danger` | `#ef4444` | Destructive actions |

Typography: system font (`-apple-system, SF Pro`). Numbers/stats always `font-black`. Labels `text-muted uppercase tracking-wider text-xs`.

---

## iOS Safari Notes

| Issue | Fix Applied |
|---|---|
| `100vh` bug | `100dvh` in `.full-height` class |
| Input zoom | All inputs have `font-size: 16px !important` in `index.css` |
| Vibration API | Guarded with `if (navigator.vibrate)` everywhere |
| Home screen icon | `<link rel="apple-touch-icon">` in `index.html` (manifest icons ignored) |
| Background timer | `RestTimer` uses `Date.now() - startTime` delta, not `setInterval` decrement |
| Private browsing | `db.open()` wrapped in try/catch with banner in `schema.js` |
| Install prompt | Detected via `window.navigator.standalone`, manual banner shown |

---

## Exercise Library (`src/data/exercises.js`)

Each exercise object:
```js
{
  id: 'barbell-bench-press',        // kebab-case slug, stable across versions
  name: 'Barbell Bench Press',
  category: 'push',                  // 'push' | 'pull' | 'legs' | 'core'
  muscleGroups: ['chest', 'triceps', 'shoulders'],
  equipmentType: 'barbell',          // 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'other'
  sessionTypes: ['push', 'full-body'],
  defaultSets: 4,
  defaultReps: 8,
  defaultWeight: 135,               // lbs; 0 for bodyweight
}
```

`getExercisesForSession(sessionType, equipmentTypes[])` — filters to session type + available equipment. Bodyweight only included when `equipmentTypes` is empty, `'bodyweight'` is in the list, or `sessionType === 'calisthenics'`. This prevents cable-only gyms from flooding with BW exercises.

`getSwapCandidates(exercise, equipmentTypes[])` — returns exercises targeting the same primary muscle group with available equipment. Used by `suggestSwap.js`.

`KNOWN_MACHINES` — array of 30 specific machines/stations organized by category (Barbell, Cable, Plate-Loaded, Selectorized, Calisthenics, Accessories). Each: `{id, name, type, category}`. Used by `SpecificEquipmentPicker`. Custom user-added machines get `custom: true` and a `custom-{slug}-{timestamp}` id.

---

## Gamification (V1)

- **XP**: 10/set · 50/workout · 100/PR · streak bonus (25 × min(streak,7))
- **Level**: floor(totalXP / 1000)
- **Streak**: consecutive calendar days with a completed workout
- **PR**: `actualWeight > all-time max for that exerciseId`

---

## Version Roadmap

### V1 ✅ (complete — all features shipped and build verified)
- [x] 4-tab navigation (Home, Workout, Log, Progress)
- [x] Gym + equipment management with full edit support
- [x] Per-gym specific machine inventory (30 known + custom unlisted)
- [x] Pure-logic workout generator (no API, 21 tests passing)
- [x] Exercise variety — randomized within priority tiers each generation
- [x] Free-tier workout builder (strategic random selection)
- [x] Workout preview: add/remove exercises, adjust sets per exercise
- [x] Exercise swap in both preview (ready) and active session
- [x] AI workout generation (Claude, with fallback)
- [x] Active session: set logging, rest timer, exercise swap, cancel with confirmation
- [x] Post-session ease ratings → drives weight recommendations
- [x] Session log with search + detail view + delete sessions
- [x] Lift history chart + volume chart + PR history
- [x] Home dashboard: streak, XP level, last session, next workout
- [x] Volume widget: lifetime / this-week toggle, muscle group filter
- [x] XP system, streak counter, PR celebration
- [x] Settings: goal, accent color, API key, dev seed tools
- [x] PWA manifest + service worker + iOS install banner
- [x] Seed data: 5 sample gyms + 6 weeks of workout history

### V2 (next)
- [ ] Progress photos (camera capture + comparison view)
- [ ] Calendar integration (Google/Apple)
- [ ] MyFitnessPal macro sync
- [ ] Widget customization (drag/reorder home widgets)
- [ ] Badges + achievements
- [ ] Calisthenics mode (bodyweight progression)
- [ ] Deload week auto-detection

### V3 (future)
- [ ] User accounts + cloud backup
- [ ] Onboarding flow
- [ ] App Store (iOS + Android via PWA/Capacitor)

---

## Backlog / Known Issues

- **No rest timer persistence**: if user backgrounds app for longer than the rest period, timer shows 0:00 correctly but no audio/visual alert on return
- **Bundle size**: ~733KB — consider code-splitting Recharts into a lazy chunk when the Progress tab is first opened
- **Deload detection**: V1 deload is manual (user selects it); should auto-suggest after 4 consecutive hard-rated sessions
- **Sets for bodyweight exercises**: reps counting works but "weight" field shows 0 — consider switching to a "weight added" model for weighted pull-ups etc.
- **Gym favorites UI**: `gym.favoriteExerciseIds[]` is read by the generator (favorites get highest priority) but there's no UI to star/unstar exercises yet
- **Volume widget week boundary**: currently Monday-start; no user setting to change to Sunday-start

---

## Session Handoff Notes

When picking up a session, check:
1. Is `npm run dev` running? (`http://localhost:5174`)
2. Has any DB schema change been made? If yes, bump version in `schema.js`
3. What was the last completed backlog item? (check git log)
4. Run `npm run build` before ending any session to confirm no type/import errors
