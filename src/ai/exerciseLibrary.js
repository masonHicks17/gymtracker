/**
 * exerciseLibrary.js
 * Constants and helpers used by workoutGenerator.js.
 * Exercise data itself lives in src/data/exercises.js.
 */

// Starting weight estimate = bodyweight × this percentage (for exercises with no history)
export const BW_PERCENTAGES = {
  // Barbell compounds
  'barbell-bench-press':         0.65,
  'incline-barbell-bench-press': 0.55,
  'decline-barbell-bench-press': 0.60,
  'barbell-overhead-press':      0.40,
  'close-grip-bench-press':      0.50,
  'barbell-deadlift':            0.90,
  'barbell-row':                 0.60,
  'pendlay-row':                 0.60,
  'barbell-back-squat':          0.75,
  'front-squat':                 0.60,
  'sumo-deadlift':               0.85,
  'stiff-leg-deadlift':          0.55,
  'romanian-deadlift':           0.55,
  'barbell-hip-thrust':          0.55,

  // Dumbbell (per dumbbell weight, so lower %)
  'dumbbell-bench-press':        0.30,
  'incline-dumbbell-press':      0.25,
  'dumbbell-shoulder-press':     0.20,
  'dumbbell-row':                0.35,
  'dumbbell-curl':               0.15,
  'goblet-squat':                0.25,
  'bulgarian-split-squat':       0.20,
  'walking-lunges':              0.20,
}

// Default % by equipment type for exercises NOT in BW_PERCENTAGES
export const DEFAULT_BW_PCT = {
  barbell:    0.50,
  dumbbell:   0.20,
  cable:      0.15,
  machine:    0.30,
  bodyweight: 0,
  other:      0.10,
}

// How much to adjust weight per ease rating step (lbs)
export const WEIGHT_INCREMENT = {
  barbell:    5,
  dumbbell:   5,
  cable:      5,
  machine:    10,
  bodyweight: 0,
  other:      5,
}

// Map programStyle + last session type → next session type
export const PPL_ROTATION    = ['push', 'pull', 'legs']
export const UPPER_LOWER_MAP = { push: 'legs', pull: 'legs', legs: 'push', 'full-body': 'legs' }

export function normalizeEase(ease) {
  if (!ease) return 'good'
  const s = String(ease).toLowerCase()
  if (s.includes('easy')) return 'easy'
  if (s.includes('hard')) return 'hard'
  return 'good'
}

export function roundToIncrement(weight, increment = 5) {
  if (increment === 0) return 0
  return Math.round(weight / increment) * increment
}
