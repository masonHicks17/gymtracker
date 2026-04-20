// 3-layer weight recommendation system

const EASE_MULTIPLIERS = {
  'too-easy':   1.05,
  'just-right': 1.00,
  'too-hard':   0.90,
}

export function roundToNearest(weight, increment = 2.5) {
  return Math.round(weight / increment) * increment
}

// Layer 1 + 2: math-only recommendation
// lastWeight: last logged weight (null if no history)
// ease: last ease rating ('too-easy' | 'just-right' | 'too-hard' | null)
// consecutiveJustRight: number of consecutive just-right sessions (auto-overload trigger)
// defaultWeight: exercise default
export function recommendWeight({ lastWeight, ease, consecutiveJustRight = 0, defaultWeight = 45, sessionType = 'push' }) {
  let base = lastWeight ?? defaultWeight

  // Deload day: drop to 60% of base
  if (sessionType === 'deload') {
    return roundToNearest(base * 0.60)
  }

  // Auto progressive overload: 3+ consecutive just-right → treat as too-easy
  const effectiveEase = consecutiveJustRight >= 3 ? 'too-easy' : (ease ?? 'just-right')
  const multiplier = EASE_MULTIPLIERS[effectiveEase] ?? 1.0

  return roundToNearest(base * multiplier)
}

// Merge AI suggestion with math recommendation
// aiWeight: weight from Claude (may be null)
// mathWeight: result of recommendWeight()
// baseLine: the layer-1 base weight
export function mergeAIWeight({ aiWeight, mathWeight, baseLine }) {
  if (!aiWeight) return mathWeight
  // Average, capped at ±15% from baseline
  const avg = (aiWeight + mathWeight) / 2
  const min = baseLine * 0.85
  const max = baseLine * 1.15
  return roundToNearest(Math.min(Math.max(avg, min), max))
}

// Estimated 1RM (Epley formula)
export function estimate1RM(weight, reps) {
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}
