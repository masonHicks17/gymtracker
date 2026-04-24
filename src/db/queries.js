import { db } from './schema'

// ── User Stats ────────────────────────────────────────────────────
export async function getStats() {
  return db.userStats.get(1)
}

export async function initStats() {
  const existing = await db.userStats.get(1)
  if (!existing) {
    await db.userStats.add({
      id: 1,
      totalXP: 0,
      streak: 0,
      lastWorkoutDate: null,
      goalType: 'strength',
      accentColor: '#FF9E5E',
      apiKey: '',
    })
  } else if (existing.accentColor === '#3b82f6') {
    // Migrate old default blue → design-system orange
    await db.userStats.update(1, { accentColor: '#FF9E5E' })
  }
}

export async function updateStats(changes) {
  return db.userStats.update(1, changes)
}

// ── Gyms ──────────────────────────────────────────────────────────
export async function getGyms() {
  return db.gyms.toArray()
}

export async function addGym(gym) {
  return db.gyms.add({ ...gym, createdAt: Date.now() })
}

export async function updateGym(id, changes) {
  return db.gyms.update(id, changes)
}

export async function deleteGym(id) {
  return db.gyms.delete(id)
}

// ── Workouts ──────────────────────────────────────────────────────
export async function getWorkouts(limit = 50) {
  return db.workouts.orderBy('date').reverse().limit(limit).toArray()
}

export async function getWorkout(id) {
  return db.workouts.get(id)
}

export async function addWorkout(workout) {
  return db.workouts.add({
    ...workout,
    date: Date.now(),
    status: 'pending',
  })
}

export async function updateWorkout(id, changes) {
  return db.workouts.update(id, changes)
}

// ── Sets ──────────────────────────────────────────────────────────
export async function getSetsForWorkout(workoutId) {
  return db.sets.where('workoutId').equals(workoutId).toArray()
}

export async function getSetsForExercise(exerciseId, limit = 30) {
  return db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .reverse()
    .limit(limit)
    .toArray()
}

export async function addSet(set) {
  return db.sets.add({ ...set, completedAt: Date.now() })
}

export async function updateSet(id, changes) {
  return db.sets.update(id, changes)
}

// ── Max Lifts ─────────────────────────────────────────────────────
export async function getMaxLift(exerciseId) {
  const sets = await db.sets.where('exerciseId').equals(exerciseId).toArray()
  if (!sets.length) return null
  return sets.reduce((max, s) => (s.actualWeight > max ? s.actualWeight : max), 0)
}

export async function getAllMaxLifts() {
  const allSets = await db.sets.toArray()
  const maxByExercise = {}
  for (const s of allSets) {
    if (!s.actualWeight) continue
    if (!maxByExercise[s.exerciseId] || s.actualWeight > maxByExercise[s.exerciseId].weight) {
      maxByExercise[s.exerciseId] = { weight: s.actualWeight, date: s.completedAt }
    }
  }
  return maxByExercise
}

export async function getLiftHistory(exerciseId) {
  const sets = await db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .filter(s => s.actualWeight > 0)
    .toArray()
  // Group by workoutId, take max per session
  const byWorkout = {}
  for (const s of sets) {
    if (!byWorkout[s.workoutId] || s.actualWeight > byWorkout[s.workoutId].weight) {
      byWorkout[s.workoutId] = { weight: s.actualWeight, date: s.completedAt }
    }
  }
  return Object.values(byWorkout).sort((a, b) => a.date - b.date)
}

// ── Last logged weight for an exercise ───────────────────────────
export async function getLastWeight(exerciseId) {
  const sets = await db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .filter(s => s.actualWeight > 0)
    .reverse()
    .limit(1)
    .toArray()
  return sets[0]?.actualWeight ?? null
}

export async function getLastEase(exerciseId) {
  const sets = await db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .reverse()
    .limit(1)
    .toArray()
  return sets[0]?.ease ?? null
}

// Consecutive "just right" count for auto progressive overload
export async function getConsecutiveJustRight(exerciseId) {
  const recent = await db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .reverse()
    .limit(9)
    .toArray()
  let count = 0
  for (const s of recent) {
    if (s.ease === 'just-right') count++
    else break
  }
  return count
}

// ── Progress Photos ────────────────────────────────────────────────
export async function getProgressPhotos() {
  return db.progressPhotos.orderBy('date').reverse().toArray()
}

export async function addProgressPhoto(photo) {
  return db.progressPhotos.add({ ...photo, date: Date.now() })
}

// ── Delete workout + its sets ──────────────────────────────────────
export async function deleteWorkout(workoutId) {
  await db.sets.where('workoutId').equals(workoutId).delete()
  await db.workouts.delete(workoutId)
}

// ── Session stats helpers ─────────────────────────────────────────
export async function getSessionVolume(workoutId) {
  const sets = await getSetsForWorkout(workoutId)
  return sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
}

export async function getRecentWorkouts(days = 30) {
  const since = Date.now() - days * 86400000
  return db.workouts
    .where('date')
    .above(since)
    .filter(w => w.status === 'complete')
    .toArray()
}

/**
 * Loads the last N complete sessions in the format the workout generator expects:
 * [{ type, exercises: [{ id, actualWeight, ease, reps }] }]
 */
export async function loadLastSessionsForGenerator(limit = 3) {
  const workouts = await db.workouts
    .orderBy('date')
    .reverse()
    .filter(w => w.status === 'complete')
    .limit(limit)
    .toArray()

  return Promise.all(workouts.map(async w => {
    const sets = await db.sets.where('workoutId').equals(w.id).toArray()
    // Dedupe: one entry per exerciseId (best set = highest actual weight)
    const byExercise = {}
    for (const s of sets) {
      const existing = byExercise[s.exerciseId]
      if (!existing || s.actualWeight > (existing.actualWeight ?? 0)) {
        byExercise[s.exerciseId] = s
      }
    }
    return {
      type: w.type,
      exercises: Object.values(byExercise).map(s => ({
        id:           s.exerciseId,
        actualWeight: s.actualWeight ?? 0,
        ease:         s.ease ?? null,
        reps:         s.reps ?? 0,
      })),
    }
  }))
}
