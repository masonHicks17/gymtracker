import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'
import { getAllMaxLifts } from '../db/queries'
import { getLevel, getLevelProgress, getXPToNextLevel } from '../utils/xpCalc'

export function useStats() {
  const stats = useLiveQuery(() => db.userStats.get(1), []) ?? {}
  const recentWorkouts = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().limit(5).toArray(),
    []
  ) ?? []

  const totalXP = stats.totalXP ?? 0

  return {
    streak: stats.streak ?? 0,
    totalXP,
    level: getLevel(totalXP),
    levelProgress: getLevelProgress(totalXP),
    xpToNextLevel: getXPToNextLevel(totalXP),
    recentWorkouts,
    lastWorkout: recentWorkouts[0] ?? null,
  }
}

export function useMaxLifts() {
  return useLiveQuery(() => getAllMaxLifts(), []) ?? {}
}
