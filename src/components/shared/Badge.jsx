import React from 'react'

export function PRBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 bg-pr/20 text-pr text-xs font-bold px-2 py-0.5 rounded-full ${className}`}>
      PR
    </span>
  )
}

export function XPBadge({ xp, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 bg-accent/20 text-accent text-xs font-bold px-2 py-0.5 rounded-full ${className}`}>
      +{xp} XP
    </span>
  )
}

export function StreakBadge({ streak, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 text-sm font-bold px-3 py-1 rounded-full ${className}`}>
      🔥 {streak}
    </span>
  )
}
