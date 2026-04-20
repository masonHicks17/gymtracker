import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { deleteWorkout } from '../../db/queries'
import { formatDate, formatWeight, sessionTypeLabel, formatDuration } from '../../utils/formatters'
import { getExerciseById } from '../../data/exercises'
import { PRBadge } from '../shared/Badge'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

export default function SessionDetail({ workoutId, onBack }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const workout = useLiveQuery(() => db.workouts.get(workoutId), [workoutId])
  const sets = useLiveQuery(() => db.sets.where('workoutId').equals(workoutId).toArray(), [workoutId]) ?? []

  if (!workout) return null

  // Group sets by exerciseId
  const byExercise = {}
  for (const s of sets) {
    if (!byExercise[s.exerciseId]) byExercise[s.exerciseId] = []
    byExercise[s.exerciseId].push(s)
  }

  const totalVolume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)

  const handleDelete = async () => {
    await deleteWorkout(workoutId)
    setConfirmDelete(false)
    onBack()
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 pb-safe">
      {/* Back + header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-accent text-sm font-semibold -mx-1 py-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 text-xs text-danger/70 hover:text-danger px-3 py-1.5 rounded-xl hover:bg-danger/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
          Delete
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-black">{sessionTypeLabel(workout.type)}</h2>
        <p className="text-muted text-sm mt-0.5">
          {formatDate(workout.date)}
          {workout.duration ? ` · ${formatDuration(workout.duration)}` : ''}
          {totalVolume > 0 ? ` · ${totalVolume.toLocaleString()} lbs` : ''}
        </p>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Session?">
        <div className="px-5 pb-6 space-y-3">
          <p className="text-sm text-muted">
            Delete <span className="text-white font-semibold">{sessionTypeLabel(workout.type)}</span> on {formatDate(workout.date)}? All sets will be removed.
          </p>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete Session</Button>
          <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>Cancel</Button>
        </div>
      </Modal>

      {/* Exercises */}
      <div className="space-y-3">
        {Object.entries(byExercise).map(([exerciseId, exSets]) => {
          const exercise = getExerciseById(exerciseId) ?? { name: exerciseId }
          const maxWeight = Math.max(...exSets.map(s => s.actualWeight || 0))
          return (
            <div key={exerciseId} className="bg-surface-2 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold">{exercise.name}</span>
                <span className="text-sm text-muted">{maxWeight > 0 ? `${maxWeight} lbs max` : 'BW'}</span>
              </div>
              <div className="space-y-1.5">
                {exSets.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-muted">{i + 1}</span>
                    <span className="font-semibold">{formatWeight(s.actualWeight)}</span>
                    <span className="text-muted">× {s.reps} reps</span>
                    {s.ease && (
                      <span className={`ml-auto text-xs capitalize ${
                        s.ease === 'too-easy' ? 'text-green-400' :
                        s.ease === 'too-hard' ? 'text-red-400' : 'text-muted'
                      }`}>{s.ease.replace('-', ' ')}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
