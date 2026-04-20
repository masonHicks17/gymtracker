import React, { useState, useEffect } from 'react'
import BottomNav from './components/layout/BottomNav'
import Home from './pages/Home'
import Workout from './pages/Workout'
import Log from './pages/Log'
import Progress from './pages/Progress'
import { initStats } from './db/queries'

// iOS standalone detection
const isStandalone = window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches

export default function App() {
  const [tab, setTab] = useState('home')
  const [showInstallBanner, setShowInstallBanner] = useState(!isStandalone)

  useEffect(() => {
    // Init DB stats row on first load
    initStats().catch(console.warn)

    // Hide install banner after 6 seconds
    if (!isStandalone) {
      const t = setTimeout(() => setShowInstallBanner(false), 6000)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className="full-height flex flex-col bg-background text-white overflow-hidden">
      {/* iOS install banner */}
      {showInstallBanner && !isStandalone && (
        <div className="bg-surface-2 border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 safe-top">
          <p className="text-xs text-muted flex-1">
            Install app: tap <strong className="text-white">Share</strong> → <strong className="text-white">Add to Home Screen</strong>
          </p>
          <button onClick={() => setShowInstallBanner(false)} className="text-muted flex-shrink-0 p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'home'     && <Home onNavigate={setTab} />}
        {tab === 'workout'  && <Workout />}
        {tab === 'log'      && <Log />}
        {tab === 'progress' && <Progress />}
      </div>

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
