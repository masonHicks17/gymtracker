import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { deleteWorkout } from '../../db/queries'
import { formatDate, sessionTypeLabel, formatDuration } from '../../utils/formatters'
import SessionDetail from './SessionDetail'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

export default function SessionList() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const workouts = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().filter(w => w.status === 'complete').toArray(),
    []
  ) ?? []

  const filtered = workouts.filter(w =>
    !search || sessionTypeLabel(w.type).toLowerCase().includes(search.toLowerCase())
  )

  if (selectedId) {
    return <SessionDetail workoutId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-safe">
      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search sessions…"
        className="w-full bg-surface-2 rounded-xl px-4 py-3 text-sm text-white placeholder-muted/50 border border-white/10 focus:border-accent/50 outline-none"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-semibold">No sessions yet</p>
          <p className="text-sm mt-1">Complete a workout to see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(workout => (
            <SessionRow key={workout.id} workout={workout} onOpen={() => setSelectedId(workout.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function SessionRow({ workout, onOpen }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sets = useLiveQuery(() => db.sets.where('workoutId').equals(workout.id).toArray(), [workout.id]) ?? []
  const totalVolume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)

  const handleDelete = async (e) => {
    e.stopPropagation()
    await deleteWorkout(workout.id)
    setConfirmDelete(false)
  }

  return (
    <>
      <div className="flex items-stretch gap-2">
        <button
          onClick={onOpen}
          className="flex-1 text-left bg-surface-2 rounded-2xl p-4 border border-white/5 active:bg-white/5 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-base">{sessionTypeLabel(workout.type)}</span>
            <span className="text-sm text-muted">{formatDate(workout.date)}</span>
          </div>
          <div className="flex gap-3 text-xs text-muted">
            <span>{sets.length} sets</span>
            {totalVolume > 0 && <span>{totalVolume.toLocaleString()} lbs volume</span>}
            {workout.duration && <span>{formatDuration(workout.duration)}</span>}
          </div>
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex-shrink-0 w-11 flex items-center justify-center bg-surface-2 rounded-2xl border border-white/5 text-danger/60 hover:text-danger hover:bg-danger/10 transition-colors"
          title="Delete session"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
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
    </>
  )
}
