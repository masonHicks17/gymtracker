import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { useStats } from '../../hooks/useStats'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

export default function StreakWidget() {
  const { streak, level, levelProgress, xpToNextLevel } = useStats()

  // Which of the last 7 days had a completed workout?
  const activeDays = useLiveQuery(async () => {
    const workouts = await db.workouts
      .where('status').equals('complete')
      .toArray()
    const now = Date.now()
    return Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * 86_400_000
      const dayEnd   = dayStart + 86_400_000
      return workouts.some(w => w.date >= dayStart && w.date < dayEnd)
    })
  }, []) ?? Array(7).fill(false)

  return (
    <div style={{
      background: '#161616', border: `1px solid ${LINE}`,
      borderRadius: 22, overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left — Streak */}
      <div style={{ padding: '20px 18px', borderRight: `1px solid ${LINE}` }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, color: 'rgba(244,242,238,0.32)', textTransform: 'uppercase' }}>
          Streak
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <div style={{
            fontFamily: DISPLAY, fontSize: 54, fontWeight: 400,
            lineHeight: 1, letterSpacing: -2, color: '#F4F2EE',
            fontFeatureSettings: '"tnum"',
          }}>{streak}</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8 }}>days</div>
        </div>
        {/* 7-day activity dots */}
        <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
          {activeDays.map((on, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 1.5,
              background: on ? 'var(--accent)' : LINE,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Right — Level */}
      <div style={{ padding: '20px 18px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, color: 'rgba(244,242,238,0.32)', textTransform: 'uppercase' }}>
          Level · {level}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <div style={{
            fontFamily: DISPLAY, fontSize: 54, fontWeight: 400,
            lineHeight: 1, letterSpacing: -2, color: 'var(--accent)',
            fontFeatureSettings: '"tnum"',
          }}>{level}</div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 3, borderRadius: 1.5, background: LINE, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${levelProgress * 100}%`,
              background: 'var(--accent)', borderRadius: 1.5,
              transition: 'width 0.5s',
            }} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, marginTop: 6, textTransform: 'uppercase' }}>
            {xpToNextLevel} xp to {level + 1}
          </div>
        </div>
      </div>
    </div>
  )
}
