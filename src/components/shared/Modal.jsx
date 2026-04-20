import React, { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, fullScreen = false }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative bg-surface rounded-t-3xl safe-bottom ${fullScreen ? 'h-[90dvh] flex flex-col' : 'max-h-[85dvh]'} overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-lg font-bold">{title}</h2>
            <button onClick={onClose} className="text-muted p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}
        <div className={`overflow-y-auto pb-safe ${fullScreen ? 'flex-1' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
