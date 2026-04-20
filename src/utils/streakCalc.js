const MS_PER_DAY = 86400000

export function isToday(timestamp) {
  const today = new Date()
  const d = new Date(timestamp)
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

export function isYesterday(timestamp) {
  const yesterday = new Date(Date.now() - MS_PER_DAY)
  const d = new Date(timestamp)
  return d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
}

export function calcNewStreak(currentStreak, lastWorkoutDate) {
  if (!lastWorkoutDate) return 1
  if (isToday(lastWorkoutDate)) return currentStreak // already worked out today
  if (isYesterday(lastWorkoutDate)) return currentStreak + 1
  return 1 // streak broken
}
