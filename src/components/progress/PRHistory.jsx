import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { EXERCISES } from '../../data/exercises'
import { formatDate, formatWeight } from '../../utils/formatters'
import { PRBadge } from '../shared/Badge'

export default function PRHistory() {
  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  // Build max per exercise
  const maxByExercise = {}
  for (const s of allSets) {
    if (!s.actualWeight) continue
    if (!maxByExercise[s.exerciseId] || s.actualWeight > maxByExercise[s.exerciseId].weight) {
      maxByExercise[s.exerciseId] = { weight: s.actualWeight, date: s.completedAt }
    }
  }

  const prs = Object.entries(maxByExercise)
    .map(([id, data]) => ({
      exercise: EXERCISES.find(e => e.id === id) ?? { name: id },
      ...data,
    }))
    .sort((a, b) => b.weight - a.weight)

  if (prs.length === 0) {
    return (
      <div className="text-center py-8 text-muted text-sm">
        <div className="text-4xl mb-2">🏆</div>
        <p>No PRs yet — go lift!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Personal Records</h3>
      {prs.map(({ exercise, weight, date }) => (
        <div key={exercise.id ?? exercise.name} className="flex items-center justify-between bg-surface-2 rounded-xl px-4 py-3">
          <div>
            <div className="font-semibold text-sm">{exercise.name}</div>
            <div className="text-xs text-muted mt-0.5">{formatDate(date)}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-pr">{formatWeight(weight)}</span>
            <PRBadge />
          </div>
        </div>
      ))}
    </div>
  )
}
