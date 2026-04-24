import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { EXERCISES } from '../../data/exercises'
import { formatDate } from '../../utils/formatters'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

export default function PRHistory() {
  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  const maxByExercise = {}
  for (const s of allSets) {
    if (!s.actualWeight) continue
    if (!maxByExercise[s.exerciseId] || s.actualWeight > maxByExercise[s.exerciseId].weight) {
      maxByExercise[s.exerciseId] = { weight: s.actualWeight, date: s.completedAt }
    }
  }

  const prs = Object.entries(maxByExercise)
    .map(([id, data]) => ({
      exercise: EXERCISES.find(e => e.id === id) ?? { name: id, id },
      ...data,
    }))
    .sort((a, b) => b.weight - a.weight)

  if (prs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', letterSpacing: -0.4 }}>No PRs yet</div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Go lift!</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '4px 4px 10px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)' }}>
          Personal records
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {prs.length} total
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {prs.map(({ exercise, weight, date }, i) => (
          <div
            key={exercise.id ?? exercise.name}
            style={{
              background: '#161616', border: `1px solid ${LINE}`,
              borderRadius: 14, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, minWidth: 20 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 15, color: '#F4F2EE', letterSpacing: -0.2 }}>
                {exercise.name}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.5, marginTop: 2, textTransform: 'uppercase' }}>
                {formatDate(date)}
              </div>
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 22, color: 'var(--accent)', letterSpacing: -0.4, fontFeatureSettings: '"tnum"' }}>
              {weight}<span style={{ fontSize: 10, color: 'rgba(244,242,238,0.32)', marginLeft: 2 }}>lb</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
