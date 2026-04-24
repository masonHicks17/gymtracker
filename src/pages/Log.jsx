import React, { useState } from 'react'
import Header from '../components/layout/Header'
import SessionList from '../components/log/SessionList'

export default function Log() {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="flex flex-col full-height" style={{ background: '#0A0A0A' }}>
      <Header
        title="Log"
        eyebrow="All sessions"
        right={
          <button
            onClick={() => setShowSearch(s => !s)}
            style={{
              width: 38, height: 38, borderRadius: 19,
              border: `1px solid ${showSearch ? 'var(--accent)' : 'rgba(255,255,255,0.07)'}`,
              background: 'transparent',
              color: showSearch ? 'var(--accent)' : 'rgba(244,242,238,0.58)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
          </button>
        }
      />
      <SessionList showSearch={showSearch} />
    </div>
  )
}
