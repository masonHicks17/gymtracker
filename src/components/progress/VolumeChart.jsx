import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { db } from '../../db/schema'
import { formatDate } from '../../utils/formatters'

export default function VolumeChart() {
  const workouts = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().limit(10).filter(w => w.status === 'complete').toArray(),
    []
  ) ?? []

  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  const chartData = workouts
    .map(w => {
      const wSets = allSets.filter(s => s.workoutId === w.id)
      const volume = wSets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
      return { date: formatDate(w.date), volume, type: w.type }
    })
    .reverse()

  if (chartData.length === 0) return null

  return (
    <div className="bg-surface-2 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Volume (last 10 sessions)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barSize={24}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#a0a0a0', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#a0a0a0', fontSize: 11 }} tickLine={false} axisLine={false} width={45} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <Tooltip
            contentStyle={{ background: '#242424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }}
            formatter={(v) => [`${v.toLocaleString()} lbs`, 'Volume']}
          />
          <Bar dataKey="volume" fill="var(--accent)" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
