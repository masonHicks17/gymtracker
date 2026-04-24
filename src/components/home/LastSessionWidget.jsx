import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { sessionTypeLabel, formatDuration } from '../../utils/formatters'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

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
      <div style={{
        background: '#161616', border: `1px solid ${LINE}`,
        borderRadius: 22, padding: '20px 18px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🏋️</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', letterSpacing: -0.4 }}>No workouts yet</div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, marginTop: 6, textTransform: 'uppercase' }}>
          Head to Workout to get started
        </div>
      </div>
    )
  }

  const volume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
  const dateStr = new Date(lastWorkout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const statParts = [
    `${sets.length} sets`,
    volume > 0 ? `${volume >= 1000 ? (volume / 1000).toFixed(1) + 'K' : volume} lb` : null,
    lastWorkout.duration ? formatDuration(lastWorkout.duration) : null,
  ].filter(Boolean).join(' · ')

  return (
    <button
      onClick={onViewLog}
      style={{
        width: '100%', textAlign: 'left', display: 'block',
        background: '#161616', border: `1px solid ${LINE}`,
        borderRadius: 22, padding: 0, cursor: 'pointer',
      }}
    >
      <div style={{ padding: '16px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)', marginBottom: 4 }}>
            Last session · {dateStr}
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 400, color: '#F4F2EE', letterSpacing: -0.5, lineHeight: 1.1 }}>
            {sessionTypeLabel(lastWorkout.type)}
          </div>
          {statParts && (
            <div style={{ fontSize: 12, color: 'rgba(244,242,238,0.58)', marginTop: 3 }}>
              {statParts}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 12 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', letterSpacing: 0.8, textTransform: 'uppercase' }}>View</div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  )
}
