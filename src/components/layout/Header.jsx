import React from 'react'
import { useStats } from '../../hooks/useStats'
import { getLevel } from '../../utils/xpCalc'

export default function Header({ title, right, showLevel = false }) {
  const { totalXP, streak } = useStats()

  return (
    <header className="flex items-center justify-between px-4 pt-safe pb-3 bg-background sticky top-0 z-40">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        {showLevel && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted">Lvl</span>
            <span className="text-sm font-bold text-accent">{getLevel(totalXP)}</span>
          </div>
        )}
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-surface px-2 py-1 rounded-full">
            <span className="text-xs">🔥</span>
            <span className="text-xs font-semibold">{streak}</span>
          </div>
        )}
        {right}
      </div>
    </header>
  )
}
