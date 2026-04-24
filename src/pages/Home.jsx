import React, { useState } from 'react'
import StreakWidget from '../components/home/StreakWidget'
import LastSessionWidget from '../components/home/LastSessionWidget'
import NextWorkoutWidget from '../components/home/NextWorkoutWidget'
import VolumeWidget from '../components/home/VolumeWidget'
import SettingsModal from '../components/shared/SettingsModal'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`

function getEyebrow() {
  const now = new Date()
  const day = now.toLocaleDateString('en-US', { weekday: 'long' })
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${day} · ${date}`
}

export default function Home({ onNavigate }) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex flex-col full-height" style={{ background: '#0A0A0A' }}>
      {/* Editorial header */}
      <header style={{
        padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 20px 14px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
        position: 'sticky', top: 0, zIndex: 40, background: '#0A0A0A',
      }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: 'rgba(244,242,238,0.32)', textTransform: 'uppercase', marginBottom: 4 }}>
            {getEyebrow()}
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 400, color: '#F4F2EE', letterSpacing: -1, lineHeight: 1 }}>
            Heavy
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: 38, height: 38, borderRadius: 19,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'transparent', color: 'rgba(244,242,238,0.58)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1"/>
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-safe" style={{ padding: '4px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <StreakWidget />
        <NextWorkoutWidget onStartWorkout={() => onNavigate('workout')} />
        <VolumeWidget />
        <LastSessionWidget onViewLog={() => onNavigate('log')} />
        <div style={{ height: 8 }} />
      </div>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
