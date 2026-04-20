/**
 * workoutGenerator.js
 * Pure-logic workout generator — no external API required.
 *
 * generateWorkout(params) → { dayType, exercises[], sessionNotes }
 */
import { getExercisesForSession } from '../data/exercises'
import {
  BW_PERCENTAGES,
  DEFAULT_BW_PCT,
  WEIGHT_INCREMENT,
  PPL_ROTATION,
  UPPER_LOWER_MAP,
  normalizeEase,
  roundToIncrement,
} from './exerciseLibrary'

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {object} params
 * @param {object}   params.gym              - { name, equipment: string[], specificEquipment?, favoriteExerciseIds? }
 * @param {string}   params.goal             - 'toning' | 'mass' | 'strength'
 * @param {object[]} params.lastSessions     - [{type, exercises:[{id,actualWeight,ease,reps}]}]
 * @param {number}   params.bodyweight       - lbs (used for first-time weight estimates)
 * @param {string}   params.programStyle     - 'ppl' | 'upper_lower' | 'full_body'
 * @param {number}   params.daysSinceRest    - consecutive training days without a rest day
 * @param {string}   [params.overrideSessionType] - user-selected type; skips rotation if set
 */
export function generateWorkout({
  gym,
  goal = 'strength',
  lastSessions = [],
  bodyweight = 160,
  programStyle = 'ppl',
  daysSinceRest = 1,
  overrideSessionType,
} = {}) {
  // 1. Determine session type
  const sessionType = overrideSessionType
    ?? determineSessionType(lastSessions, programStyle, daysSinceRest)

  const isDeload = sessionType === 'deload'

  // 2. Get available equipment types from gym
  const equipmentTypes = extractEquipmentTypes(gym)

  // 3. Get candidate exercises for this session
  const queryType = isDeload ? 'full-body' : sessionType
  const candidates = getExercisesForSession(queryType, equipmentTypes)

  // 4. Build history map: exerciseId → { weight, ease, reps }
  const historyMap = buildHistoryMap(lastSessions)

  // 5. Favorites set
  const favoriteIds = new Set(gym?.favoriteExerciseIds ?? [])

  // 6. Select exercises (5 for focused sessions, 6 for full-body/deload)
  const count = (queryType === 'full-body') ? 6 : 5
  const selected = selectExercises(candidates, historyMap, favoriteIds, equipmentTypes, count)

  // 7. Attach weight/sets/reps/notes to each exercise
  const exercises = selected.map(ex =>
    buildEntry(ex, historyMap, bodyweight, goal, isDeload)
  )

  const dayType = toDayLabel(sessionType)
  return {
    dayType,
    exercises,
    sessionNotes: buildSessionNotes(dayType, goal, isDeload),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Day type selection
// ─────────────────────────────────────────────────────────────────────────────

function determineSessionType(lastSessions, programStyle, daysSinceRest) {
  if (daysSinceRest >= 5) return 'deload'
  if (!lastSessions.length) {
    return programStyle === 'full_body' ? 'full-body' : 'push'
  }

  const lastType = lastSessions[0]?.type

  if (programStyle === 'ppl') {
    const idx = PPL_ROTATION.indexOf(lastType)
    return idx === -1 ? 'push' : PPL_ROTATION[(idx + 1) % PPL_ROTATION.length]
  }

  if (programStyle === 'upper_lower') {
    return UPPER_LOWER_MAP[lastType] ?? 'push'
  }

  return 'full-body'
}

function toDayLabel(sessionType) {
  return {
    push:         'Push',
    pull:         'Pull',
    legs:         'Legs',
    'full-body':  'Full Body',
    deload:       'Deload',
    calisthenics: 'Calisthenics',
    upper:        'Upper',
    lower:        'Lower',
  }[sessionType] ?? 'Full Body'
}

// ─────────────────────────────────────────────────────────────────────────────
// Equipment helpers
// ─────────────────────────────────────────────────────────────────────────────

export function extractEquipmentTypes(gym) {
  if (!gym) return []
  const types = new Set()

  if (Array.isArray(gym.equipment)) {
    for (const eq of gym.equipment) {
      if (typeof eq === 'string') types.add(eq)
      else if (eq?.type) types.add(eq.type)
    }
  }
  if (Array.isArray(gym.specificEquipment)) {
    for (const eq of gym.specificEquipment) {
      if (eq?.type) types.add(eq.type)
    }
  }

  return [...types]
}

// ─────────────────────────────────────────────────────────────────────────────
// History
// ─────────────────────────────────────────────────────────────────────────────

export function buildHistoryMap(lastSessions) {
  const map = {}
  // lastSessions[0] = most recent; iterate in reverse so most recent wins
  for (let i = (lastSessions?.length ?? 0) - 1; i >= 0; i--) {
    const session = lastSessions[i]
    for (const ex of (session?.exercises ?? [])) {
      const id = ex.id ?? ex.exerciseId
      if (!id) continue
      map[id] = {
        weight: ex.actualWeight ?? ex.targetWeight ?? 0,
        ease:   ex.ease ?? ex.easeRating ?? null,
        reps:   ex.reps ?? 0,
      }
    }
  }
  return map
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercise selection
// ─────────────────────────────────────────────────────────────────────────────

function selectExercises(candidates, historyMap, favoriteIds, equipmentTypes, count) {
  const hasNonBW = equipmentTypes.length > 0 && equipmentTypes.some(t => t !== 'bodyweight')

  // Shuffle first so same-priority candidates vary each generation
  const pool = [...candidates].sort(() => Math.random() - 0.5)

  // Stable-sort by priority — random order is preserved within each tier
  pool.sort((a, b) => {
    // 1. Favorites first
    const favA = favoriteIds.has(a.id) ? 2 : 0
    const favB = favoriteIds.has(b.id) ? 2 : 0
    if (favB !== favA) return favB - favA

    // 2. History (continuity + known weights)
    const hA = historyMap[a.id] != null ? 1 : 0
    const hB = historyMap[b.id] != null ? 1 : 0
    if (hB !== hA) return hB - hA

    // 3. When gym has real equipment, prefer it over bodyweight
    if (hasNonBW) {
      const bwA = a.equipmentType === 'bodyweight' ? 0 : 1
      const bwB = b.equipmentType === 'bodyweight' ? 0 : 1
      if (bwB !== bwA) return bwB - bwA
    }

    return 0 // equal — keep random order from shuffle above
  })

  // Pick with muscle-group diversity (max 2 per primary muscle)
  const selected = []
  const muscleCount = {}

  for (const ex of pool) {
    if (selected.length >= count) break
    const primary = ex.muscleGroups?.[0] ?? 'other'
    const already = muscleCount[primary] ?? 0
    if (already >= 2) continue
    selected.push(ex)
    muscleCount[primary] = already + 1
  }

  return selected
}

// ─────────────────────────────────────────────────────────────────────────────
// Weight / sets / reps
// ─────────────────────────────────────────────────────────────────────────────

function calcWeight(ex, historyMap, bodyweight, isDeload) {
  const history = historyMap[ex.id]
  let weight

  if (history?.weight > 0) {
    const inc  = WEIGHT_INCREMENT[ex.equipmentType] ?? 5
    const ease = normalizeEase(history.ease)
    if (ease === 'easy') weight = history.weight + inc
    else if (ease === 'hard') weight = Math.max(0, history.weight - inc)
    else weight = history.weight
  } else if (ex.equipmentType === 'bodyweight') {
    weight = 0
  } else {
    const pct = BW_PERCENTAGES[ex.id] ?? DEFAULT_BW_PCT[ex.equipmentType] ?? 0.25
    weight = roundToIncrement(bodyweight * pct, 5)
    // Don't go below the exercise default
    weight = Math.max(weight, ex.defaultWeight ?? 0)
  }

  if (isDeload) weight = roundToIncrement(weight * 0.60, 5)

  return Math.max(0, weight)
}

function getGoalScheme(goal, isDeload) {
  if (isDeload) return { sets: 3, reps: 10, restSeconds: 60 }
  return {
    strength: { sets: 5, reps: 4,  restSeconds: 180 },
    mass:     { sets: 4, reps: 10, restSeconds: 90  },
    toning:   { sets: 3, reps: 13, restSeconds: 60  },
  }[goal] ?? { sets: 4, reps: 10, restSeconds: 90 }
}

function buildEntry(ex, historyMap, bodyweight, goal, isDeload) {
  const { sets, reps, restSeconds } = getGoalScheme(goal, isDeload)
  const targetWeight = calcWeight(ex, historyMap, bodyweight, isDeload)
  const notes = buildNotes(ex, historyMap, isDeload)

  return {
    id: ex.id,
    name: ex.name,
    sets,
    reps,
    targetWeight,
    restSeconds,
    muscleGroups:  ex.muscleGroups,
    equipmentType: ex.equipmentType,
    notes,
  }
}

function buildNotes(ex, historyMap, isDeload) {
  if (isDeload) return 'Deload — 60% weight, focus on form'
  const h = historyMap[ex.id]
  if (!h) return 'First time — start conservative and build up'
  const ease = normalizeEase(h.ease)
  const inc  = WEIGHT_INCREMENT[ex.equipmentType] ?? 5
  if (ease === 'easy') return `+${inc} lbs — last session felt easy`
  if (ease === 'hard') return `-${inc} lbs — dial it back and nail the reps`
  return 'Same weight as last session — solid effort'
}

function buildSessionNotes(dayType, goal, isDeload) {
  if (isDeload) return 'Deload week — weights at 60%, prioritize recovery and form'
  return {
    strength: `${dayType} — heavy sets (3–5 reps), full rest between`,
    mass:     `${dayType} — moderate weight, controlled tempo, 8–12 reps`,
    toning:   `${dayType} — lighter weight, 12–15 reps, minimal rest`,
  }[goal] ?? `${dayType} session`
}
