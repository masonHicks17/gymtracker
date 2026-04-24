import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { db } from '../../db/schema'
import { EXERCISES } from '../../data/exercises'
import { formatDate } from '../../utils/formatters'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

const RANGES = [
  { id: '1m', label: '1M', days: 30 },
  { id: '3m', label: '3M', days: 90 },
  { id: 'all', label: 'All', days: null },
]

export default function LiftChart() {
  const [selectedId, setSelectedId] = useState(EXERCISES[0]?.id ?? '')
  const [range, setRange] = useState('3m')

  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  const exercisesWithData = EXERCISES.filter(e =>
    allSets.some(s => s.exerciseId === e.id && s.actualWeight > 0)
  )

  const chartData = React.useMemo(() => {
    const rangeMs = RANGES.find(r => r.id === range)?.days
    const cutoff = rangeMs ? Date.now() - rangeMs * 86_400_000 : 0
    const relevant = allSets.filter(s => s.exerciseId === selectedId && s.actualWeight > 0 && s.completedAt >= cutoff)
    const byWorkout = {}
    for (const s of relevant) {
      if (!byWorkout[s.workoutId] || s.actualWeight > byWorkout[s.workoutId].weight) {
        byWorkout[s.workoutId] = { weight: s.actualWeight, date: s.completedAt }
      }
    }
    return Object.values(byWorkout)
      .sort((a, b) => a.date - b.date)
      .map(d => ({ weight: d.weight, date: formatDate(d.date) }))
  }, [allSets, selectedId, range])

  const exercise = EXERCISES.find(e => e.id === selectedId)
  const maxLift = chartData.length ? Math.max(...chartData.map(d => d.weight)) : null

  if (exercisesWithData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', letterSpacing: -0.4 }}>No lift data yet</div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Complete workouts to see progress</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#161616', border: `1px solid ${LINE}`, borderRadius: 22, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)', marginBottom: 4 }}>
            Top lift
          </div>
          {maxLift !== null && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 400, color: '#F4F2EE', letterSpacing: -1.2, lineHeight: 0.95, fontFeatureSettings: '"tnum"' }}>
                {maxLift}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6 }}>lb</div>
            </div>
          )}
        </div>
        {/* Range toggle */}
        <div style={{ display: 'flex', gap: 2, padding: 2, background: '#1E1E1E', borderRadius: 8, flexShrink: 0 }}>
          {RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              style={{
                padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: MONO, fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
                background: range === r.id ? '#161616' : 'transparent',
                color: range === r.id ? '#F4F2EE' : 'rgba(244,242,238,0.32)',
                boxShadow: range === r.id ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise selector */}
      <div style={{ padding: '0 18px 14px' }}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            width: '100%', background: '#1E1E1E', borderRadius: 10, padding: '10px 14px',
            color: '#F4F2EE', border: `1px solid ${LINE}`, outline: 'none',
            fontFamily: MONO, fontSize: 11, letterSpacing: 0.4,
          }}
        >
          {exercisesWithData.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {chartData.length >= 2 ? (
        <div style={{ padding: '0 14px 14px' }}>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(244,242,238,0.32)', fontSize: 10, fontFamily: MONO }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(244,242,238,0.32)', fontSize: 10, fontFamily: MONO }} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: '#1E1E1E', border: `1px solid ${LINE}`, borderRadius: 10, color: '#F4F2EE', fontFamily: MONO, fontSize: 11 }}
                formatter={(v) => [`${v} lbs`, 'Weight']}
              />
              <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0 20px', fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6 }}>
          Need at least 2 sessions to show a trend
        </div>
      )}
    </div>
  )
}
