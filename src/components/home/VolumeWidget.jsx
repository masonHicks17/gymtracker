import React, { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { getExerciseById } from '../../data/exercises'

const VIEWS = [
  { id: 'week',     label: 'This Week' },
  { id: 'lifetime', label: 'All Time' },
]

// Primary muscle → display group mapping
const MUSCLE_TO_GROUP = {
  chest:       'Chest',
  back:        'Back',
  quads:       'Legs',
  hamstrings:  'Legs',
  glutes:      'Legs',
  calves:      'Legs',
  shoulders:   'Shoulders',
  biceps:      'Biceps',
  triceps:     'Triceps',
  core:        'Core',
  forearms:    'Arms',
  traps:       'Back',
}

const FILTER_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core']

function startOfWeek() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // Monday start
  return d.getTime()
}

export default function VolumeWidget() {
  const [view, setView] = useState('week')
  const [muscleFilter, setMuscleFilter] = useState('All')

  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  const stats = useMemo(() => {
    const weekStart = startOfWeek()
    const filtered = allSets.filter(s => {
      if (view === 'week' && s.completedAt < weekStart) return false
      if (muscleFilter !== 'All') {
        const ex = getExerciseById(s.exerciseId)
        const group = MUSCLE_TO_GROUP[ex?.muscleGroups?.[0]] ?? 'Other'
        if (group !== muscleFilter) return false
      }
      return true
    })

    const totalVolume = filtered.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
    const totalSets = filtered.length
    const exerciseIds = new Set(filtered.map(s => s.exerciseId))

    return { totalVolume, totalSets, exerciseCount: exerciseIds.size }
  }, [allSets, view, muscleFilter])

  const formattedVolume = stats.totalVolume >= 1_000_000
    ? `${(stats.totalVolume / 1_000_000).toFixed(1)}M`
    : stats.totalVolume >= 1000
    ? `${(stats.totalVolume / 1000).toFixed(1)}K`
    : stats.totalVolume.toLocaleString()

  return (
    <div className="bg-surface-2 rounded-2xl p-4">
      {/* Header + view toggle */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Volume Lifted</h3>
        <div className="flex bg-surface rounded-lg p-0.5 gap-0.5">
          {VIEWS.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                view === v.id ? 'bg-accent/20 text-accent' : 'text-muted'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Big number */}
      <div className="mb-3">
        <div className="text-4xl font-black tabular-nums leading-none">
          {formattedVolume}
          <span className="text-lg font-semibold text-muted ml-1.5">lbs</span>
        </div>
        <div className="text-xs text-muted mt-1">
          {stats.totalSets.toLocaleString()} sets · {stats.exerciseCount} exercise{stats.exerciseCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Muscle group filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-0.5 px-0.5">
        {FILTER_GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setMuscleFilter(g)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              muscleFilter === g
                ? 'bg-accent text-white'
                : 'bg-surface text-muted hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}
