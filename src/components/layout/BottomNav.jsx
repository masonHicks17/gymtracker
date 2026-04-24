import React from 'react'

const MONO = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`

const TABS = [
  {
    id: 'home', label: 'Home',
    icon: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v11a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>,
  },
  {
    id: 'workout', label: 'Workout',
    icon: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="10" width="2.5" height="4" rx="0.6" fill={c}/><rect x="4.5" y="7.5" width="2" height="9" rx="0.6" fill={c}/><rect x="17.5" y="7.5" width="2" height="9" rx="0.6" fill={c}/><rect x="19.5" y="10" width="2.5" height="4" rx="0.6" fill={c}/><rect x="6.5" y="11" width="11" height="2" rx="0.5" fill={c}/></svg>,
  },
  {
    id: 'log', label: 'Log',
    icon: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M15 3v5h5"/><path d="M9 14h7M9 18h7M9 10h3"/></svg>,
  },
  {
    id: 'progress', label: 'Progress',
    icon: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18l5-5 4 3 7-8"/><path d="M16 8h3v3"/></svg>,
  },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: '#0A0A0A',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)',
      display: 'flex',
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        const color = isActive ? 'var(--accent)' : 'rgba(244,242,238,0.32)'
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 5, paddingTop: 10, paddingBottom: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              position: 'relative',
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 24, height: 2, borderRadius: 1, background: 'var(--accent)',
              }} />
            )}
            {tab.icon(color)}
            <span style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: 0.8,
              textTransform: 'uppercase', color,
            }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function WorkoutIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="18" y2="12"/>
      <circle cx="3" cy="12" r="2" fill={active ? 'currentColor' : 'none'}/>
      <circle cx="21" cy="12" r="2" fill={active ? 'currentColor' : 'none'}/>
      <rect x="6" y="8" width="3" height="8" rx="1" fill={active ? 'currentColor' : 'none'}/>
      <rect x="15" y="8" width="3" height="8" rx="1" fill={active ? 'currentColor' : 'none'}/>
    </svg>
  )
}

function LogIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="15" y2="17"/>
      <line x1="9" y1="9" x2="11" y2="9"/>
    </svg>
  )
}

function ProgressIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}
