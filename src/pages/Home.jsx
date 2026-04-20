import React, { useState } from 'react'
import Header from '../components/layout/Header'
import StreakWidget from '../components/home/StreakWidget'
import LastSessionWidget from '../components/home/LastSessionWidget'
import NextWorkoutWidget from '../components/home/NextWorkoutWidget'
import VolumeWidget from '../components/home/VolumeWidget'
import SettingsModal from '../components/shared/SettingsModal'

export default function Home({ onNavigate }) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex flex-col full-height">
      <Header
        title="Heavy Lifting"
        showLevel
        right={
          <button onClick={() => setShowSettings(true)} className="text-muted p-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pb-safe space-y-3 pt-1">
        <StreakWidget />
        <NextWorkoutWidget onStartWorkout={() => onNavigate('workout')} />
        <VolumeWidget />
        <LastSessionWidget onViewLog={() => onNavigate('log')} />
      </div>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
