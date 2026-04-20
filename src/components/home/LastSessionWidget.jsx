import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { formatDate, sessionTypeLabel, formatDuration } from '../../utils/formatters'

export default function LastSessionWidget({ onViewLog }) {
  const lastWorkout = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().filter(w => w.status === 'complete').first(),
    []
  )
  const sets = useLiveQuery(
    () => lastWorkout ? db.sets.where('workoutId').equals(lastWorkout.id).toArray() : Promise.resolve([]),
    [lastWorkout?.id]
  ) ?? []

  if (!lastWorkout) {
    return (
      <div className="bg-surface-2 rounded-2xl p-5 text-center">
        <div className="text-3xl mb-2">🏋️</div>
        <p className="text-sm text-muted">No workouts yet</p>
        <p className="text-xs text-muted/60 mt-1">Head to the Workout tab to get started</p>
      </div>
    )
  }

  const volume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)

  return (
    <button onClick={onViewLog} className="w-full text-left bg-surface-2 rounded-2xl p-4 active:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Last Session</span>
        <span className="text-xs text-accent font-semibold">View →</span>
      </div>
      <div className="font-bold text-lg">{sessionTypeLabel(lastWorkout.type)}</div>
      <div className="flex gap-3 text-sm text-muted mt-1">
        <span>{formatDate(lastWorkout.date)}</span>
        <span>·</span>
        <span>{sets.length} sets</span>
        {volume > 0 && <><span>·</span><span>{volume.toLocaleString()} lbs</span></>}
        {lastWorkout.duration && <><span>·</span><span>{formatDuration(lastWorkout.duration)}</span></>}
      </div>
    </button>
  )
}
