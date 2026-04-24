import React, { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { deleteWorkout } from '../../db/queries'
import { sessionTypeLabel, formatDuration } from '../../utils/formatters'
import SessionDetail from './SessionDetail'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const SANS    = `'Inter', -apple-system, system-ui, sans-serif`
const LINE    = 'rgba(255,255,255,0.07)'

export default function SessionList({ showSearch }) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const workouts = useLiveQuery(
    () => db.workouts.orderBy('date').reverse().filter(w => w.status === 'complete').toArray(),
    []
  ) ?? []

  const allSets = useLiveQuery(() => db.sets.toArray(), []) ?? []

  const filtered = workouts.filter(w =>
    !search || sessionTypeLabel(w.type).toLowerCase().includes(search.toLowerCase())
  )

  // Totals
  const totalVolume = useMemo(
    () => allSets.reduce((s, r) => s + (r.actualWeight || 0) * (r.reps || 0), 0),
    [allSets]
  )
  const totalTime = useMemo(
    () => workouts.reduce((s, w) => s + (w.duration || 0), 0),
    [workouts]
  )

  const fmtVolume = totalVolume >= 1_000_000
    ? `${(totalVolume / 1_000_000).toFixed(1)}M`
    : totalVolume >= 1000
    ? `${(totalVolume / 1000).toFixed(1)}K`
    : totalVolume.toString()

  const fmtTime = totalTime >= 3600
    ? `${Math.round(totalTime / 3600)}h`
    : `${Math.round(totalTime / 60)}m`

  // Group by month
  const monthGroups = useMemo(() => {
    const groups = {}
    for (const w of filtered) {
      const d = new Date(w.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!groups[key]) {
        groups[key] = {
          label: d.toLocaleDateString('en-US', { month: 'long' }),
          year: d.getFullYear().toString(),
          sessions: [],
        }
      }
      groups[key].sessions.push(w)
    }
    return Object.values(groups)
  }, [filtered])

  if (selectedId) {
    return <SessionDetail workoutId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Totals strip */}
      <div style={{ padding: '0 22px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid ${LINE}`, marginBottom: 16 }}>
        {[
          ['Sessions', workouts.length.toString(), null],
          ['Volume', fmtVolume, 'lb'],
          ['Time', fmtTime, null],
        ].map(([l, v, u], i) => (
          <div key={l} style={{ borderLeft: i > 0 ? `1px solid ${LINE}` : 'none', paddingLeft: i > 0 ? 12 : 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>{l}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 24, color: '#F4F2EE', letterSpacing: -0.6, marginTop: 3, fontFeatureSettings: '"tnum"' }}>
              {v}{u && <span style={{ fontSize: 11, color: 'rgba(244,242,238,0.32)', marginLeft: 3 }}>{u}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      {showSearch && (
        <div style={{ padding: '0 18px 14px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sessions…"
            autoFocus
            style={{
              width: '100%', background: '#1E1E1E', borderRadius: 14, padding: '12px 16px',
              fontSize: 14, color: '#F4F2EE', border: `1px solid ${LINE}`, outline: 'none',
              fontFamily: SANS,
            }}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, color: '#F4F2EE', letterSpacing: -0.5 }}>No sessions yet</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Complete a workout to see it here</div>
        </div>
      ) : (
        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {monthGroups.map(group => (
            <div key={group.label + group.year}>
              {/* Month header */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, padding: '0 4px' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 22, color: '#F4F2EE', letterSpacing: -0.5, fontStyle: 'italic', fontWeight: 400 }}>
                  {group.label}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8 }}>{group.year}</div>
                <div style={{ flex: 1 }} />
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  {group.sessions.length} sess.
                </div>
              </div>
              {/* Session rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.sessions.map(w => (
                  <SessionRow key={w.id} workout={w} allSets={allSets} onOpen={() => setSelectedId(w.id)} />
                ))}
              </div>
            </div>
          ))}
          <div style={{ height: 20 }} />
        </div>
      )}
    </div>
  )
}

function SessionRow({ workout, allSets, onOpen }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const sets = allSets.filter(s => s.workoutId === workout.id)
  const totalVolume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.reps || 0), 0)

  const d = new Date(workout.date)
  const dayNum = d.getDate().toString().padStart(2, '0')
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

  const volStr = totalVolume >= 1000
    ? `${(totalVolume / 1000).toFixed(1)}K`
    : totalVolume.toString()

  const handleDelete = async (e) => {
    e.stopPropagation()
    await deleteWorkout(workout.id)
    setConfirmDelete(false)
  }

  return (
    <>
      <div
        onClick={onOpen}
        style={{
          background: '#161616', border: `1px solid ${LINE}`,
          borderRadius: 18, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer',
        }}
      >
        {/* Date block */}
        <div style={{ textAlign: 'center', minWidth: 38 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 400, color: '#F4F2EE', lineHeight: 1, letterSpacing: -0.6 }}>
            {dayNum}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 3 }}>
            {weekday}
          </div>
        </div>
        <div style={{ width: 1, height: 32, background: LINE, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 15, color: '#F4F2EE', letterSpacing: -0.2 }}>
            {sessionTypeLabel(workout.type)}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.5, marginTop: 3 }}>
            {sets.length} sets
            {totalVolume > 0 && <span style={{ color: 'rgba(244,242,238,0.58)' }}> · {volStr} lb</span>}
            {workout.duration ? ` · ${formatDuration(workout.duration)}` : ''}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="rgba(244,242,238,0.32)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
    </>
  )
}
