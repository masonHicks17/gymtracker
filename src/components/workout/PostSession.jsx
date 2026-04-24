import React, { useState } from 'react'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

const EASE_OPTIONS = [
  { id: 'too-easy',   label: 'Easy',  sub: 'Level up', color: '#70D194' },
  { id: 'just-right', label: 'Solid', sub: 'Hold',     color: 'var(--accent)' },
  { id: 'too-hard',   label: 'Hard',  sub: 'Scale',    color: '#FF6B6B' },
]

export default function PostSession({ exercises, prs, xpEarned, onSubmit }) {
  const [ratings, setRatings] = useState({})

  const setRating = (exerciseId, ease) => {
    setRatings(prev => ({ ...prev, [exerciseId]: ease }))
  }

  const allRated = exercises?.every(e => ratings[e.id])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px' }}>
      {/* Summary strip */}
      {(prs?.length > 0 || xpEarned > 0) && (
        <div style={{ marginBottom: 16, padding: '10px 12px', background: 'rgba(var(--accent-rgb),0.08)', border: '1px solid rgba(var(--accent-rgb),0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontSize: 10, color: '#0A0A0A', fontWeight: 700, letterSpacing: 0.5,
          }}>
            +{xpEarned}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 14, color: '#F4F2EE', letterSpacing: -0.2 }}>
              +{xpEarned} XP earned
            </div>
            {prs?.length > 0 && (
              <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.5, marginTop: 2, textTransform: 'uppercase' }}>
                {prs.length} new PR{prs.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rate each lift */}
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)', padding: '0 4px', marginBottom: 10 }}>
        Rate each lift
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exercises?.map(ex => (
          <div key={ex.id} style={{ background: '#161616', border: `1px solid ${LINE}`, borderRadius: 18, padding: '14px 16px' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 15, color: '#F4F2EE', letterSpacing: -0.2, marginBottom: 10 }}>
              {ex.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {EASE_OPTIONS.map(opt => {
                const on = ratings[ex.id] === opt.id
                const borderColor = on ? opt.color + (opt.color.startsWith('var') ? '' : '88') : LINE
                const bg = on ? opt.color + (opt.color.startsWith('var') ? '' : '20') : 'transparent'
                return (
                  <button
                    key={opt.id}
                    onClick={() => setRating(ex.id, opt.id)}
                    style={{
                      padding: '8px 0', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${on ? (opt.color.startsWith('var') ? 'var(--accent)' : opt.color + '88') : LINE}`,
                      background: on ? (opt.color.startsWith('var') ? 'rgba(var(--accent-rgb),0.13)' : opt.color + '20') : 'transparent',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: DISPLAY, fontSize: 13, color: on ? (opt.color.startsWith('var') ? 'var(--accent)' : opt.color) : '#F4F2EE', letterSpacing: -0.2 }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 8, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.5, marginTop: 2, textTransform: 'uppercase' }}>
                      {opt.sub}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
        <button
          onClick={() => onSubmit(ratings)}
          disabled={!allRated}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: allRated ? 'var(--accent)' : 'rgba(244,242,238,0.1)',
            color: allRated ? '#0A0A0A' : 'rgba(244,242,238,0.32)',
            border: 'none', cursor: allRated ? 'pointer' : 'default',
            fontFamily: DISPLAY, fontSize: 19, fontWeight: 400, letterSpacing: -0.3,
          }}
        >
          Save Session
        </button>
        <button
          onClick={() => onSubmit({})}
          style={{
            background: 'transparent', border: 'none', padding: '10px 0',
            fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: 'rgba(244,242,238,0.32)',
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Skip ratings
        </button>
        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
