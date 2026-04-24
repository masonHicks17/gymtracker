import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { SESSION_TYPES } from '../../data/exercises'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const ROTATION = ['push', 'pull', 'legs']

const MUSCLE_MAP = {
  push: 'Chest · Shoulders · Triceps',
  pull: 'Back · Biceps',
  legs: 'Quads · Hamstrings · Glutes',
  upper: 'Full upper body',
  lower: 'Full lower body',
  'full-body': 'Everything',
}

export default function NextWorkoutWidget({ onStartWorkout }) {
  const lastWorkout = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().filter(w => w.status === 'complete').first(),
    []
  )
  const lastSets = useLiveQuery(
    () => lastWorkout ? db.sets.where('workoutId').equals(lastWorkout.id).count() : Promise.resolve(0),
    [lastWorkout?.id]
  ) ?? 0

  const nextType = React.useMemo(() => {
    if (!lastWorkout) return 'push'
    const idx = ROTATION.indexOf(lastWorkout.type)
    return idx === -1 ? 'push' : ROTATION[(idx + 1) % ROTATION.length]
  }, [lastWorkout])

  const session = SESSION_TYPES.find(s => s.id === nextType) ?? SESSION_TYPES[0]
  const muscles = MUSCLE_MAP[nextType] ?? session.description ?? ''

  const daysAgo = lastWorkout
    ? Math.round((Date.now() - lastWorkout.date) / 86_400_000)
    : null

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.13), rgba(var(--accent-rgb),0.06))',
      border: '1px solid rgba(var(--accent-rgb),0.33)',
      borderRadius: 22, padding: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Faint chart motif */}
      <svg width="100" height="60" viewBox="0 0 100 60" style={{
        position: 'absolute', right: -8, top: -8, opacity: 0.12, pointerEvents: 'none',
      }}>
        <path d="M0 50 L20 42 L40 45 L60 25 L80 28 L100 8" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
      </svg>

      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
        Up next
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 400, color: '#F4F2EE', letterSpacing: -1, lineHeight: 1.02, marginBottom: 4 }}>
        {session.label}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(244,242,238,0.58)', marginBottom: 14, lineHeight: 1.4 }}>
        {muscles}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
        {[
          ['Est. sets', lastSets > 0 ? `~${Math.round(lastSets / 1.2)}` : '~18'],
          ['Last', daysAgo != null ? (daysAgo === 0 ? 'Today' : `${daysAgo}d ago`) : 'Never'],
        ].map(([label, value]) => (
          <div key={label}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', letterSpacing: -0.4, marginTop: 2, fontFeatureSettings: '"tnum"' }}>{value}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStartWorkout}
        style={{
          width: '100%', height: 46, borderRadius: 23,
          background: 'var(--accent)', border: 'none',
          fontFamily: MONO, fontSize: 11, letterSpacing: 1.4,
          textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: '#0A0A0A',
        }}
      >
        Start Workout
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
