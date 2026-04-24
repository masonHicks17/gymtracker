import React, { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { getExerciseById } from '../../data/exercises'

const VIEWS = [
  { id: 'week',     label: 'This Week' },
  { id: 'lifetime', label: 'All Time' },
]

// Primary muscle → display group mapping
const MUSCLE_TO_GROUP = {
  chest:       'Chest',
  back:        'Back',
  quads:       'Legs',
  hamstrings:  'Legs',
  glutes:      'Legs',
  calves:      'Legs',
  shoulders:   'Shoulders',
  biceps:      'Biceps',
  triceps:     'Triceps',
  core:        'Core',
  forearms:    'Arms',
  traps:       'Back',
}

const FILTER_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core']

function startOfWeek() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // Monday start
  return d.getTime()
}

export default function VolumeWidget() {
  const [view, setView] = useState('week')
  const [muscleFilter, setMuscleFilter] = useState('All')

  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  const stats = useMemo(() => {
    const weekStart = startOfWeek()
    const filtered = allSets.filter(s => {
      if (view === 'week' && s.completedAt < weekStart) return false
      if (muscleFilter !== 'All') {
        const ex = getExerciseById(s.exerciseId)
        const group = MUSCLE_TO_GROUP[ex?.muscleGroups?.[0]] ?? 'Other'
        if (group !== muscleFilter) return false
      }
      return true
    })

    const totalVolume = filtered.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
    const totalSets = filtered.length
    const exerciseIds = new Set(filtered.map(s => s.exerciseId))

    return { totalVolume, totalSets, exerciseCount: exerciseIds.size }
  }, [allSets, view, muscleFilter])

  const formattedVolume = stats.totalVolume >= 1_000_000
    ? `${(stats.totalVolume / 1_000_000).toFixed(1)}M`
    : stats.totalVolume >= 1000
    ? `${(stats.totalVolume / 1000).toFixed(1)}K`
    : stats.totalVolume.toLocaleString()

  // 7-day daily volumes for bar chart
  const dailyVols = React.useMemo(() => {
    const now = Date.now()
    return Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * 86_400_000
      const dayEnd   = dayStart + 86_400_000
      const daySets  = allSets.filter(s => (s.completedAt ?? 0) >= dayStart && (s.completedAt ?? 0) < dayEnd)
      return daySets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)
    })
  }, [allSets])
  const maxDaily = Math.max(...dailyVols, 1)
  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayIdx = (new Date().getDay() + 6) % 7 // 0=Mon

  const LINE = 'rgba(255,255,255,0.07)'
  const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
  const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`

  // Split volume into base number + suffix
  const volNum = stats.totalVolume >= 1_000_000
    ? `${(stats.totalVolume / 1_000_000).toFixed(1)}`
    : stats.totalVolume >= 1000
    ? `${(stats.totalVolume / 1000).toFixed(1)}`
    : stats.totalVolume.toLocaleString()
  const volSuffix = stats.totalVolume >= 1_000_000 ? 'M' : stats.totalVolume >= 1000 ? 'K' : ''

  return (
    <div style={{
      background: '#161616', border: `1px solid ${LINE}`,
      borderRadius: 22, padding: 18,
    }}>
      {/* Header + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)' }}>
          Volume · {view === 'week' ? 'this week' : 'all time'}
        </div>
        <div style={{
          display: 'flex', gap: 2, padding: 2,
          background: 'rgba(255,255,255,0.05)', borderRadius: 8,
        }}>
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: MONO, fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
                background: view === v.id ? '#2a2a2a' : 'transparent',
                color: view === v.id ? '#F4F2EE' : 'rgba(244,242,238,0.32)',
                boxShadow: view === v.id ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              }}
            >{v.label}</button>
          ))}
        </div>
      </div>

      {/* Big number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: 52, fontWeight: 400,
          color: '#F4F2EE', letterSpacing: -2.2, lineHeight: 0.95,
          fontFeatureSettings: '"tnum"',
        }}>
          {volNum}
          {volSuffix && <span style={{ color: 'var(--accent)' }}>{volSuffix}</span>}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, paddingBottom: 4 }}>lb</div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, marginBottom: 14 }}>
        {stats.totalSets} sets · {stats.exerciseCount} exercise{stats.exerciseCount !== 1 ? 's' : ''}
      </div>

      {/* 7-day bar chart */}
      {view === 'week' && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 34 }}>
            {dailyVols.map((v, i) => {
              const h = maxDaily > 0 ? v / maxDaily : 0
              const isToday = i === todayIdx
              return (
                <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: `${Math.max(h * 100, h > 0 ? 8 : 0)}%`,
                    background: isToday ? 'var(--accent)' : 'rgba(244,242,238,0.15)',
                    borderRadius: 2,
                    transition: 'height 0.4s',
                  }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            {DAY_LABELS.map((d, i) => (
              <div key={i} style={{
                fontFamily: MONO, fontSize: 9, letterSpacing: 0.4, width: 14, textAlign: 'center',
                color: i === todayIdx ? 'var(--accent)' : 'rgba(244,242,238,0.32)',
              }}>{d}</div>
            ))}
          </div>
        </div>
      )}

      {/* Muscle group filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTER_GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setMuscleFilter(g)}
            style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontFamily: MONO, fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
              background: muscleFilter === g ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
              color: muscleFilter === g ? '#0A0A0A' : 'rgba(244,242,238,0.32)',
              transition: 'all 0.15s',
            }}
          >{g}</button>
        ))}
      </div>
    </div>
  )
}
