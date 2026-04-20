import React from 'react'
import { useStats } from '../../hooks/useStats'
import { getLevelProgress, getLevel } from '../../utils/xpCalc'

export default function StreakWidget() {
  const { streak, totalXP, level, levelProgress, xpToNextLevel } = useStats()

  return (
    <div className="bg-surface-2 rounded-2xl p-4 flex items-center gap-4">
      {/* Streak */}
      <div className="text-center flex-1">
        <div className="text-4xl font-black">{streak}</div>
        <div className="text-xs text-muted mt-0.5">day streak 🔥</div>
      </div>

      <div className="w-px h-12 bg-white/10" />

      {/* Level + XP bar */}
      <div className="flex-1">
        <div className="flex items-baseline gap-1 mb-1.5">
          <span className="text-sm text-muted">Level</span>
          <span className="text-2xl font-black text-accent">{level}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${levelProgress * 100}%` }}
          />
        </div>
        <div className="text-xs text-muted mt-1">{xpToNextLevel} XP to next level</div>
      </div>
    </div>
  )
}
