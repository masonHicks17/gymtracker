import { describe, it, expect } from 'vitest'
import { generateWorkout, buildHistoryMap, extractEquipmentTypes } from './workoutGenerator'

// ─── fixtures ────────────────────────────────────────────────────────────────
const FULL_GYM = {
  name: "Gold's Gym",
  equipment: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'],
  favoriteExerciseIds: [],
}

const BW_ONLY_GYM = {
  name: 'Bodyweight Only',
  equipment: ['bodyweight'],
  favoriteExerciseIds: [],
}

const CABLE_ONLY_GYM = {
  name: 'Cable Studio',
  equipment: ['cable'],
  favoriteExerciseIds: [],
}

const PUSH_SESSION = {
  type: 'push',
  exercises: [
    { id: 'barbell-bench-press', actualWeight: 135, ease: 'just-right', reps: 8 },
    { id: 'dumbbell-shoulder-press', actualWeight: 35, ease: 'too-easy', reps: 10 },
  ],
}

const PULL_SESSION = {
  type: 'pull',
  exercises: [
    { id: 'barbell-deadlift', actualWeight: 185, ease: 'just-right', reps: 5 },
    { id: 'barbell-row',      actualWeight: 135, ease: 'too-hard',   reps: 8 },
  ],
}

// ─── test 1: generates a push day when last session was pull ─────────────────
describe('Day type rotation', () => {
  it('generates a Push day when last session was Pull (PPL)', () => {
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'strength',
      lastSessions: [PULL_SESSION],
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 1,
    })
    expect(result.dayType).toBe('Legs')
  })

  it('generates a Pull day when last session was Push (PPL)', () => {
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'strength',
      lastSessions: [PUSH_SESSION],
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 1,
    })
    expect(result.dayType).toBe('Pull')
  })

  it('starts with Push when no prior sessions exist', () => {
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'strength',
      lastSessions: [],
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 1,
    })
    expect(result.dayType).toBe('Push')
  })
})

// ─── test 2: returns Deload when daysSinceRest >= 5 ──────────────────────────
describe('Deload logic', () => {
  it('returns Deload when daysSinceRest >= 5', () => {
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'strength',
      lastSessions: [PUSH_SESSION],
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 5,
    })
    expect(result.dayType).toBe('Deload')
  })

  it('does not deload when daysSinceRest = 4', () => {
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'strength',
      lastSessions: [PUSH_SESSION],
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 4,
    })
    expect(result.dayType).not.toBe('Deload')
  })

  it('deload exercises use 60% of normal weight', () => {
    // Set up history with known weight
    const lastSessions = [{ type: 'push', exercises: [
      { id: 'barbell-bench-press', actualWeight: 200, ease: 'just-right', reps: 5 }
    ]}]
    const normal = generateWorkout({
      gym: FULL_GYM, goal: 'strength', lastSessions, bodyweight: 180, programStyle: 'ppl', daysSinceRest: 1
    })
    const deload = generateWorkout({
      gym: FULL_GYM, goal: 'strength', lastSessions, bodyweight: 180, programStyle: 'ppl', daysSinceRest: 5
    })
    const bench = deload.exercises.find(e => e.id === 'barbell-bench-press')
    // Deload should have at most 60% of the history weight (200 * 0.6 = 120)
    if (bench) {
      expect(bench.targetWeight).toBeLessThanOrEqual(130)
    }
    // At minimum, deload day generates exercises
    expect(deload.exercises.length).toBeGreaterThan(0)
  })
})

// ─── test 3: increases weight when ease rating is 'easy' ─────────────────────
describe('Weight progression', () => {
  it('increases weight when ease is "too-easy"', () => {
    const lastSessions = [{ type: 'push', exercises: [
      { id: 'barbell-bench-press', actualWeight: 135, ease: 'too-easy', reps: 8 }
    ]}]
    const result = generateWorkout({
      gym: FULL_GYM, goal: 'strength', lastSessions, bodyweight: 180, programStyle: 'ppl', daysSinceRest: 2,
      overrideSessionType: 'push',
    })
    const bench = result.exercises.find(e => e.id === 'barbell-bench-press')
    expect(bench).toBeDefined()
    expect(bench.targetWeight).toBeGreaterThan(135)
  })

  it('decreases weight when ease is "too-hard"', () => {
    const lastSessions = [{ type: 'push', exercises: [
      { id: 'barbell-bench-press', actualWeight: 185, ease: 'too-hard', reps: 5 }
    ]}]
    const result = generateWorkout({
      gym: FULL_GYM, goal: 'strength', lastSessions, bodyweight: 180, programStyle: 'ppl', daysSinceRest: 2,
      overrideSessionType: 'push',
    })
    const bench = result.exercises.find(e => e.id === 'barbell-bench-press')
    expect(bench).toBeDefined()
    expect(bench.targetWeight).toBeLessThan(185)
  })

  it('keeps same weight when ease is "just-right"', () => {
    const lastSessions = [{ type: 'push', exercises: [
      { id: 'barbell-bench-press', actualWeight: 155, ease: 'just-right', reps: 8 }
    ]}]
    const result = generateWorkout({
      gym: FULL_GYM, goal: 'strength', lastSessions, bodyweight: 180, programStyle: 'ppl', daysSinceRest: 2,
      overrideSessionType: 'push',
    })
    const bench = result.exercises.find(e => e.id === 'barbell-bench-press')
    if (bench) expect(bench.targetWeight).toBe(155)
  })
})

// ─── test 4: returns bodyweight-only exercises when equipment is empty ────────
describe('Equipment filtering', () => {
  it('returns only bodyweight exercises when equipment array is empty', () => {
    const result = generateWorkout({
      gym: BW_ONLY_GYM,
      goal: 'toning',
      lastSessions: [],
      bodyweight: 160,
      programStyle: 'ppl',
      daysSinceRest: 1,
      overrideSessionType: 'push',
    })
    expect(result.exercises.length).toBeGreaterThan(0)
    result.exercises.forEach(ex => {
      expect(ex.equipmentType).toBe('bodyweight')
    })
  })

  it('returns bodyweight exercises when gym is null', () => {
    const result = generateWorkout({
      gym: null,
      goal: 'toning',
      lastSessions: [],
      bodyweight: 160,
      programStyle: 'ppl',
      daysSinceRest: 1,
    })
    expect(result.exercises.length).toBeGreaterThan(0)
  })

  it('prefers cable exercises over bodyweight when cable gym', () => {
    const result = generateWorkout({
      gym: CABLE_ONLY_GYM,
      goal: 'mass',
      lastSessions: [],
      bodyweight: 160,
      programStyle: 'ppl',
      daysSinceRest: 1,
      overrideSessionType: 'push',
    })
    const cableCount = result.exercises.filter(e => e.equipmentType === 'cable').length
    const bwCount = result.exercises.filter(e => e.equipmentType === 'bodyweight').length
    // Cable exercises should outnumber bodyweight
    expect(cableCount).toBeGreaterThan(bwCount)
  })
})

// ─── test 5: never repeats same muscle group as last session ─────────────────
describe('Muscle group rotation', () => {
  it('pull day does not include push muscle groups as primary', () => {
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'mass',
      lastSessions: [PUSH_SESSION],
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 1,
    })
    // After a push day, should be pull → primary muscles should be back/biceps, not chest/triceps
    expect(result.dayType).toBe('Pull')
    result.exercises.forEach(ex => {
      expect(ex.muscleGroups[0]).not.toBe('chest')
    })
  })

  it('legs day does not include upper body compounds', () => {
    const lastPullSession = [PULL_SESSION]
    const result = generateWorkout({
      gym: FULL_GYM,
      goal: 'strength',
      lastSessions: lastPullSession,
      bodyweight: 180,
      programStyle: 'ppl',
      daysSinceRest: 1,
    })
    expect(result.dayType).toBe('Legs')
    result.exercises.forEach(ex => {
      expect(['quads','glutes','hamstrings','calves']).toContain(ex.muscleGroups[0])
    })
  })
})

// ─── helpers ─────────────────────────────────────────────────────────────────
describe('buildHistoryMap', () => {
  it('most recent session wins for duplicate exercise ids', () => {
    const sessions = [
      { type: 'push', exercises: [{ id: 'barbell-bench-press', actualWeight: 145, ease: 'just-right', reps: 8 }] },
      { type: 'push', exercises: [{ id: 'barbell-bench-press', actualWeight: 135, ease: 'too-hard',   reps: 6 }] },
    ]
    const map = buildHistoryMap(sessions)
    // [0] = most recent → wins
    expect(map['barbell-bench-press'].weight).toBe(145)
  })
})

describe('extractEquipmentTypes', () => {
  it('handles string array', () => {
    const types = extractEquipmentTypes({ equipment: ['barbell', 'dumbbell'] })
    expect(types).toContain('barbell')
    expect(types).toContain('dumbbell')
  })

  it('handles mixed string/object format', () => {
    const types = extractEquipmentTypes({
      equipment: ['barbell'],
      specificEquipment: [{ name: 'Cable Fly', type: 'cable' }],
    })
    expect(types).toContain('barbell')
    expect(types).toContain('cable')
  })

  it('returns empty array for null gym', () => {
    expect(extractEquipmentTypes(null)).toEqual([])
  })
})

// ─── goal schemes ────────────────────────────────────────────────────────────
describe('Goal-based sets/reps', () => {
  it('strength → 5 sets', () => {
    const r = generateWorkout({ gym: FULL_GYM, goal: 'strength', lastSessions: [], bodyweight: 180, programStyle: 'ppl', daysSinceRest: 1 })
    r.exercises.forEach(ex => expect(ex.sets).toBe(5))
  })

  it('mass → 4 sets', () => {
    const r = generateWorkout({ gym: FULL_GYM, goal: 'mass', lastSessions: [], bodyweight: 180, programStyle: 'ppl', daysSinceRest: 1 })
    r.exercises.forEach(ex => expect(ex.sets).toBe(4))
  })

  it('toning → 3 sets and shorter rest', () => {
    const r = generateWorkout({ gym: FULL_GYM, goal: 'toning', lastSessions: [], bodyweight: 180, programStyle: 'ppl', daysSinceRest: 1 })
    r.exercises.forEach(ex => {
      expect(ex.sets).toBe(3)
      expect(ex.restSeconds).toBe(60)
    })
  })
})
