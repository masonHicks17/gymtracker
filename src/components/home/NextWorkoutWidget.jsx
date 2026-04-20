import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { SESSION_TYPES } from '../../data/exercises'
import { sessionTypeLabel } from '../../utils/formatters'

// Simple PPL rotation
const ROTATION = ['push', 'pull', 'legs']

export default function NextWorkoutWidget({ onStartWorkout }) {
  const lastWorkout = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().filter(w => w.status === 'complete').first(),
    []
  )

  const nextType = React.useMemo(() => {
    if (!lastWorkout) return 'push'
    const idx = ROTATION.indexOf(lastWorkout.type)
    if (idx === -1) return 'push'
    return ROTATION[(idx + 1) % ROTATION.length]
  }, [lastWorkout])

  const session = SESSION_TYPES.find(s => s.id === nextType) ?? SESSION_TYPES[0]

  return (
    <button
      onClick={onStartWorkout}
      className="w-full text-left bg-accent/10 border border-accent/25 rounded-2xl p-4 active:bg-accent/15 transition-colors"
    >
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Up Next</div>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{session.emoji}</span>
        <div>
          <div className="font-bold text-lg">{session.label}</div>
          <div className="text-sm text-muted">{session.description}</div>
        </div>
        <div className="ml-auto text-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </button>
  )
}
