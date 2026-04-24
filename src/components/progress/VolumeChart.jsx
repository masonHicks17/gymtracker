import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { db } from '../../db/schema'
import { formatDate } from '../../utils/formatters'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

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
      return { date: formatDate(w.date), volume }
    })
    .reverse()

  if (chartData.length === 0) return null

  const avgVolume = chartData.reduce((s, d) => s + d.volume, 0) / chartData.length
  const avgStr = avgVolume >= 1000 ? `${(avgVolume / 1000).toFixed(1)}K` : Math.round(avgVolume).toString()

  return (
    <div style={{ background: '#161616', border: `1px solid ${LINE}`, borderRadius: 22, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)' }}>
          Volume · last {chartData.length} sessions
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', letterSpacing: -0.3, fontFeatureSettings: '"tnum"' }}>
          avg <span style={{ color: 'var(--accent)' }}>{avgStr}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} barSize={20}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'rgba(244,242,238,0.32)', fontSize: 10, fontFamily: MONO }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'rgba(244,242,238,0.32)', fontSize: 10, fontFamily: MONO }} tickLine={false} axisLine={false} width={36} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <Tooltip
            contentStyle={{ background: '#1E1E1E', border: `1px solid ${LINE}`, borderRadius: 10, color: '#F4F2EE', fontFamily: MONO, fontSize: 11 }}
            formatter={(v) => [`${v.toLocaleString()} lbs`, 'Volume']}
          />
          <Bar dataKey="volume" fill="var(--accent)" radius={[4, 4, 0, 0]} fillOpacity={0.9} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
