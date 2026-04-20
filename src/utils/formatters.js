export function formatWeight(lbs) {
  if (lbs === 0 || lbs == null) return 'BW'
  return `${lbs} lbs`
}

export function formatDate(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today - 86400000)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDuration(ms) {
  const mins = Math.floor(ms / 60000)
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  if (hours > 0) return `${hours}h ${remainingMins}m`
  return `${mins}m`
}

export function formatVolume(lbs) {
  if (lbs >= 1000) return `${(lbs / 1000).toFixed(1)}k lbs`
  return `${lbs} lbs`
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function sessionTypeLabel(type) {
  const labels = {
    push: 'Push Day',
    pull: 'Pull Day',
    legs: 'Leg Day',
    'full-body': 'Full Body',
    deload: 'Deload',
    calisthenics: 'Calisthenics',
  }
  return labels[type] || type
}
