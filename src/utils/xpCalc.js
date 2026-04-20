export const XP_PER_SET = 10
export const XP_WORKOUT_COMPLETE = 50
export const XP_PR = 100
export const XP_STREAK_BONUS_PER_DAY = 25
export const MAX_STREAK_BONUS_DAYS = 7
export const XP_PER_LEVEL = 1000

export function getLevel(totalXP) {
  return Math.floor(totalXP / XP_PER_LEVEL)
}

export function getXPToNextLevel(totalXP) {
  return XP_PER_LEVEL - (totalXP % XP_PER_LEVEL)
}

export function getLevelProgress(totalXP) {
  return (totalXP % XP_PER_LEVEL) / XP_PER_LEVEL
}

export function calcSessionXP({ sets, prCount, streak }) {
  const setXP = sets * XP_PER_SET
  const workoutXP = XP_WORKOUT_COMPLETE
  const prXP = prCount * XP_PR
  const streakDays = Math.min(streak, MAX_STREAK_BONUS_DAYS)
  const streakXP = streakDays * XP_STREAK_BONUS_PER_DAY
  return setXP + workoutXP + prXP + streakXP
}
