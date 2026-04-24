import React from 'react'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`

export default function Header({ title, eyebrow, right }) {
  return (
    <header style={{
      padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 22px 14px',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
      position: 'sticky', top: 0, zIndex: 40, background: '#0A0A0A',
      flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: 1.4,
            color: 'rgba(244,242,238,0.32)', textTransform: 'uppercase', marginBottom: 4,
          }}>{eyebrow}</div>
        )}
        <div style={{
          fontFamily: DISPLAY, fontSize: 32, fontWeight: 400, color: '#F4F2EE',
          letterSpacing: -1, lineHeight: 1,
        }}>{title}</div>
      </div>
      {right}
    </header>
  )
}
