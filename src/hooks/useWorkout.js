import { useState, useCallback } from 'react'
import { db } from '../db/schema'
import {
  addWorkout, updateWorkout, addSet,
  getLastWeight, getLastEase, getConsecutiveJustRight,
  getMaxLift, updateStats, getStats,
  deleteWorkout, loadLastSessionsForGenerator,
} from '../db/queries'
import { generateWorkout } from '../ai/workoutGenerator'
import { recommendWeight } from '../utils/weightCalc'
import { calcSessionXP } from '../utils/xpCalc'
import { calcNewStreak } from '../utils/streakCalc'

// States: idle | generating | ready | active | post-session | complete
const INITIAL = {
  status: 'idle',
  workout: null,
  currentIndex: 0,
  completedSets: {},
  workoutId: null,
  prs: [],
  startTime: null,
  xpEarned: 0,
}

async function enrichExerciseTargets(exercises, sessionType) {
  return Promise.all((exercises ?? []).map(async (exercise) => {
    const [lastWeight, ease, consecutiveJustRight, prevMax] = await Promise.all([
      getLastWeight(exercise.id),
      getLastEase(exercise.id),
      getConsecutiveJustRight(exercise.id),
      getMaxLift(exercise.id),
    ])

    const recommendedWeight = recommendWeight({
      lastWeight: prevMax ?? lastWeight,
      ease,
      consecutiveJustRight,
      defaultWeight: exercise.targetWeight ?? exercise.defaultWeight ?? 0,
      sessionType,
    })

    return {
      ...exercise,
      targetWeight: exercise.equipmentType === 'bodyweight' ? 0 : recommendedWeight,
      reps: exercise.reps ?? exercise.defaultReps ?? 10,
    }
  }))
}

export function useWorkout() {
  const [state, setState] = useState(INITIAL)

  // ── Generation ──────────────────────────────────────────────────
  const startGeneration = useCallback(async ({ gym, sessionType, apiKey, goalType }) => {
    setState(s => ({ ...s, status: 'generating' }))

    try {
      // Load last sessions from DB for the generator
      const lastSessions = await loadLastSessionsForGenerator(3)

      // Load bodyweight + programStyle from stats
      const stats = await getStats()
      const bodyweight = stats?.bodyweight ?? 160
      const programStyle = stats?.programStyle ?? 'ppl'

      const result = generateWorkout({
        gym,
        goal: goalType ?? 'strength',
        lastSessions,
        bodyweight,
        programStyle,
        daysSinceRest: 1,           // TODO: calculate from DB
        overrideSessionType: sessionType,
      })

      const exercises = await enrichExerciseTargets(
        result.exercises,
        sessionType ?? result.dayType.toLowerCase()
      )

      setState(s => ({
        ...s,
        status: 'ready',
        workout: {
          gym,
          sessionType: sessionType ?? result.dayType.toLowerCase(),
          exercises,
          sessionNotes: result.sessionNotes,
        },
      }))
    } catch (err) {
      console.error('Workout generation failed:', err)
      setState(s => ({ ...s, status: 'idle' }))
    }
  }, [])

  // ── Session start ───────────────────────────────────────────────
  const startSession = useCallback(async () => {
    const { workout } = state
    const workoutId = await addWorkout({
      gymId:     workout.gym?.id ?? null,
      type:      workout.sessionType ?? 'full-body',
      exercises: workout.exercises,
      status:    'active',
    })
    setState(s => ({
      ...s,
      status: 'active',
      workoutId,
      startTime: Date.now(),
      completedSets: {},
      currentIndex: 0,
      prs: [],
    }))
  }, [state])

  // ── Set logging ─────────────────────────────────────────────────
  const logSet = useCallback(async ({ exerciseId, setNumber, actualWeight, reps, targetWeight }) => {
    const { workoutId } = state
    const prevMax = await getMaxLift(exerciseId)
    const isPR = actualWeight > 0 && (prevMax === null || actualWeight > prevMax)
    const setId = await addSet({ workoutId, exerciseId, setNumber, actualWeight, reps, targetWeight, ease: null })

    setState(s => ({
      ...s,
      completedSets: {
        ...s.completedSets,
        [exerciseId]: [...(s.completedSets[exerciseId] ?? []), { setId, actualWeight, reps }],
      },
      prs: isPR ? [...s.prs, exerciseId] : s.prs,
    }))

    return isPR
  }, [state])

  // ── Navigation ──────────────────────────────────────────────────
  const goToExercise = useCallback((index) => {
    setState(s => ({ ...s, currentIndex: index }))
  }, [])

  const nextExercise = useCallback(() => {
    setState(s => ({
      ...s,
      currentIndex: Math.min(s.currentIndex + 1, (s.workout?.exercises?.length ?? 1) - 1),
    }))
  }, [])

  // ── Finish (go to post-session) ─────────────────────────────────
  const finishWorkout = useCallback(() => {
    setState(s => ({ ...s, status: 'post-session' }))
  }, [])

  // ── Cancel (discard in-progress session) ────────────────────────
  const cancelWorkout = useCallback(async () => {
    const { workoutId } = state
    if (workoutId) {
      try { await deleteWorkout(workoutId) } catch (_) {}
    }
    setState(INITIAL)
  }, [state])

  // ── Post-session ease ratings + XP ─────────────────────────────
  const submitEaseRatings = useCallback(async (ratings) => {
    const { workoutId, prs, startTime } = state
    const totalSets = Object.values(state.completedSets).reduce((sum, s) => sum + s.length, 0)

    // Write ease ratings back to all sets for each exercise
    await Promise.all(
      Object.entries(ratings).map(async ([exerciseId, ease]) => {
        const sets = await db.sets.where('workoutId').equals(workoutId)
          .and(s => s.exerciseId === exerciseId).toArray()
        await Promise.all(sets.map(s => db.sets.update(s.id, { ease })))
      })
    )

    const duration = Date.now() - (startTime ?? Date.now())
    await updateWorkout(workoutId, { status: 'complete', duration })

    const currentStats = await getStats()
    const newStreak = calcNewStreak(currentStats?.streak ?? 0, currentStats?.lastWorkoutDate)
    const earned = calcSessionXP({ sets: totalSets, prCount: prs.length, streak: newStreak })

    await updateStats({
      totalXP:         (currentStats?.totalXP ?? 0) + earned,
      streak:          newStreak,
      lastWorkoutDate: Date.now(),
    })

    setState(s => ({ ...s, status: 'complete', xpEarned: earned }))
  }, [state])

  // ── Workout editor (ready state) ────────────────────────────────
  const swapExercise = useCallback(async (index, newExercise) => {
    const [recommendedExercise] = await enrichExerciseTargets(
      [newExercise],
      state.workout?.sessionType ?? 'full-body'
    )

    setState(s => ({
      ...s,
      workout: {
        ...s.workout,
        exercises: s.workout.exercises.map((ex, i) => i === index ? recommendedExercise : ex),
      },
    }))
  }, [state.workout?.sessionType])

  const addExercise = useCallback(async (exercise) => {
    const [recommendedExercise] = await enrichExerciseTargets(
      [exercise],
      state.workout?.sessionType ?? 'full-body'
    )

    setState(s => ({
      ...s,
      workout: {
        ...s.workout,
        exercises: [...(s.workout?.exercises ?? []), recommendedExercise],
      },
    }))
  }, [state.workout?.sessionType])

  const removeExercise = useCallback((index) => {
    setState(s => ({
      ...s,
      workout: {
        ...s.workout,
        exercises: s.workout.exercises.filter((_, i) => i !== index),
      },
    }))
  }, [])

  const updateExerciseSets = useCallback((index, sets) => {
    setState(s => ({
      ...s,
      workout: {
        ...s.workout,
        exercises: s.workout.exercises.map((ex, i) =>
          i === index ? { ...ex, sets: Math.max(1, sets) } : ex
        ),
      },
    }))
  }, [])

  // ── Reset ───────────────────────────────────────────────────────
  const reset = useCallback(() => setState(INITIAL), [])

  return {
    ...state,
    startGeneration,
    startSession,
    logSet,
    goToExercise,
    nextExercise,
    finishWorkout,
    cancelWorkout,
    submitEaseRatings,
    reset,
    swapExercise,
    addExercise,
    removeExercise,
    updateExerciseSets,
    currentExercise: state.workout?.exercises?.[state.currentIndex] ?? null,
  }
}
