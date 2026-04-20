import React from 'react'
import { formatWeight } from '../../utils/formatters'

const SESSION_DAY_LABELS = {
  push: { label: 'Push Day', color: 'text-blue-400 bg-blue-400/15' },
  pull: { label: 'Pull Day', color: 'text-purple-400 bg-purple-400/15' },
  legs: { label: 'Leg Day', color: 'text-green-400 bg-green-400/15' },
  'full-body': { label: 'Full Body', color: 'text-orange-400 bg-orange-400/15' },
  deload: { label: 'Deload', color: 'text-yellow-400 bg-yellow-400/15' },
  calisthenics: { label: 'Calisthenics', color: 'text-pink-400 bg-pink-400/15' },
}

export default function ExerciseCard({ exercise, sessionType, index, total, onSwap }) {
  const dayLabel = SESSION_DAY_LABELS[sessionType]

  return (
    <div className="bg-surface-2 rounded-2xl p-5 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {dayLabel && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${dayLabel.color}`}>
                {dayLabel.label}
              </span>
            )}
            <span className="text-xs text-muted">{index + 1} / {total}</span>
          </div>
          <h3 className="text-xl font-black leading-tight">{exercise.name}</h3>
          <p className="text-sm text-muted mt-0.5 capitalize">
            {exercise.muscleGroups?.join(' · ')}
          </p>
        </div>
        <button
          onClick={onSwap}
          className="flex-shrink-0 text-muted hover:text-white bg-white/5 p-2 rounded-xl transition-colors"
          title="Swap exercise"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </button>
      </div>

      {/* Target stats */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-center">
          <div className="text-xs text-muted mb-0.5">Target Weight</div>
          <div className="text-2xl font-black text-accent">{formatWeight(exercise.targetWeight)}</div>
        </div>
        <div className="bg-white/5 rounded-xl px-3 py-2 text-center">
          <div className="text-xs text-muted mb-0.5">Sets</div>
          <div className="text-2xl font-black">{exercise.sets}</div>
        </div>
        <div className="bg-white/5 rounded-xl px-3 py-2 text-center">
          <div className="text-xs text-muted mb-0.5">Reps</div>
          <div className="text-2xl font-black">{exercise.reps}</div>
        </div>
      </div>
    </div>
  )
}
