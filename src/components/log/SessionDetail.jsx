import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { deleteWorkout } from '../../db/queries'
import { sessionTypeLabel, formatDuration } from '../../utils/formatters'
import { getExerciseById } from '../../data/exercises'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

export default function SessionDetail({ workoutId, onBack }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const workout = useLiveQuery(() => db.workouts.get(workoutId), [workoutId])
  const sets = useLiveQuery(() => db.sets.where('workoutId').equals(workoutId).toArray(), [workoutId]) ?? []

  if (!workout) return null

  const byExercise = {}
  for (const s of sets) {
    if (!byExercise[s.exerciseId]) byExercise[s.exerciseId] = []
    byExercise[s.exerciseId].push(s)
  }

  const totalVolume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
  const volStr = totalVolume >= 1_000_000
    ? `${(totalVolume / 1_000_000).toFixed(1)}M`
    : totalVolume >= 1000
    ? `${(totalVolume / 1000).toFixed(1)}`
    : totalVolume.toString()
  const volUnit = totalVolume >= 1_000_000 ? 'M lb' : totalVolume >= 1000 ? 'K lb' : 'lb'

  const d = new Date(workout.date)
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

  const handleDelete = async () => {
    await deleteWorkout(workoutId)
    setConfirmDelete(false)
    onBack()
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0A0A0A' }}>
      {/* Back header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top,0px) + 16px) 18px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: 19, border: `1px solid ${LINE}`,
            background: '#161616', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="#F4F2EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 1, textTransform: 'uppercase' }}>
          Log · Session
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setConfirmDelete(true)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px',
            fontFamily: MONO, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase',
            color: 'rgba(239,68,68,0.7)',
          }}
        >
          Delete
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '6px 22px 18px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
          {weekday} · {dateStr}{workout.duration ? ` · ${formatDuration(workout.duration)}` : ''}
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 36, color: '#F4F2EE', letterSpacing: -1.2, lineHeight: 1 }}>
          {sessionTypeLabel(workout.type)}
        </div>
      </div>

      {/* Totals strip */}
      <div style={{ padding: '0 22px 18px', borderBottom: `1px solid ${LINE}`, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            ['Volume', volStr, volUnit],
            ['Sets', sets.length.toString(), null],
            ['Duration', workout.duration ? formatDuration(workout.duration) : '—', null],
          ].map(([l, v, u], i) => (
            <div key={l} style={{ borderLeft: i > 0 ? `1px solid ${LINE}` : 'none', paddingLeft: i > 0 ? 10 : 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>{l}</div>
              <div style={{ fontFamily: DISPLAY, fontSize: 22, color: '#F4F2EE', letterSpacing: -0.5, marginTop: 2, fontFeatureSettings: '"tnum"' }}>
                {v}{u && <span style={{ fontSize: 10, color: 'rgba(244,242,238,0.32)', marginLeft: 2 }}>{u}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise breakdowns */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.entries(byExercise).map(([exerciseId, exSets], exI) => {
          const exercise = getExerciseById(exerciseId) ?? { name: exerciseId }
          const maxW = Math.max(...exSets.map(s => s.actualWeight || 0))
          const total = exSets.reduce((s, r) => s + (r.actualWeight || 0) * (r.reps || 0), 0)
          return (
            <div key={exerciseId} style={{ background: '#161616', border: `1px solid ${LINE}`, borderRadius: 22 }}>
              {/* Exercise header */}
              <div style={{
                padding: '14px 18px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                borderBottom: `1px solid ${LINE}`,
              }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    {String(exI + 1).padStart(2, '0')} · {exSets.length} sets
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', letterSpacing: -0.3, marginTop: 2 }}>
                    {exercise.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Total</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 18, color: 'var(--accent)', letterSpacing: -0.3, fontFeatureSettings: '"tnum"' }}>
                    {total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total}
                    <span style={{ fontSize: 10, color: 'rgba(244,242,238,0.32)', marginLeft: 2 }}>lb</span>
                  </div>
                </div>
              </div>
              {/* Set rows with weight bars */}
              <div style={{ padding: '10px 18px 14px' }}>
                {exSets.map((s, i) => (
                  <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '22px 1fr 60px 50px', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ height: 4, background: '#1E1E1E', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: maxW > 0 ? `${((s.actualWeight || 0) / maxW) * 100}%` : '0%',
                        background: 'var(--accent)', borderRadius: 2,
                      }} />
                    </div>
                    <div style={{ fontFamily: DISPLAY, fontSize: 14, color: '#F4F2EE', textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                      {s.actualWeight || 0}<span style={{ fontSize: 10, color: 'rgba(244,242,238,0.32)' }}> lb</span>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(244,242,238,0.58)', textAlign: 'right' }}>
                      ×{s.reps || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div style={{ height: 20 }} />
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Session?">
        <div className="px-5 pb-6 space-y-3">
          <p className="text-sm text-muted">
            Delete <span className="text-white font-semibold">{sessionTypeLabel(workout.type)}</span>? All sets will be removed.
          </p>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete Session</Button>
          <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}
