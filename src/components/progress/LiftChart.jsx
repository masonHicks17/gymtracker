import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { db } from '../../db/schema'
import { EXERCISES } from '../../data/exercises'
import { formatDate } from '../../utils/formatters'

export default function LiftChart() {
  const [selectedId, setSelectedId] = useState(EXERCISES[0]?.id ?? '')

  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  // Exercises that have any logged sets
  const exercisesWithData = EXERCISES.filter(e =>
    allSets.some(s => s.exerciseId === e.id && s.actualWeight > 0)
  )

  // Build chart data: max weight per workout session for selected exercise
  const chartData = React.useMemo(() => {
    const relevant = allSets.filter(s => s.exerciseId === selectedId && s.actualWeight > 0)
    const byWorkout = {}
    for (const s of relevant) {
      if (!byWorkout[s.workoutId] || s.actualWeight > byWorkout[s.workoutId].weight) {
        byWorkout[s.workoutId] = { weight: s.actualWeight, date: s.completedAt }
      }
    }
    return Object.values(byWorkout)
      .sort((a, b) => a.date - b.date)
      .map(d => ({ weight: d.weight, date: formatDate(d.date) }))
  }, [allSets, selectedId])

  const exercise = EXERCISES.find(e => e.id === selectedId)
  const maxLift = chartData.length ? Math.max(...chartData.map(d => d.weight)) : null

  return (
    <div className="space-y-4">
      {/* Exercise selector */}
      {exercisesWithData.length === 0 ? (
        <div className="text-center py-8 text-muted text-sm">
          <div className="text-4xl mb-2">📈</div>
          <p>Complete workouts to see lift history</p>
        </div>
      ) : (
        <>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="w-full bg-surface-2 rounded-xl px-4 py-3 text-white border border-white/10 outline-none focus:border-accent/50"
          >
            {exercisesWithData.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          {/* Max badge */}
          {maxLift !== null && (
            <div className="flex items-center justify-between bg-surface-2 rounded-xl px-4 py-3">
              <span className="text-sm text-muted">All-time max</span>
              <span className="text-xl font-black text-pr">{maxLift} lbs</span>
            </div>
          )}

          {/* Chart */}
          {chartData.length >= 2 ? (
            <div className="bg-surface-2 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#a0a0a0', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#a0a0a0', fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: '#242424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }}
                    formatter={(v) => [`${v} lbs`, 'Weight']}
                  />
                  <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-sm text-muted py-4">
              Need at least 2 sessions to show a trend
            </div>
          )}
        </>
      )}
    </div>
  )
}
