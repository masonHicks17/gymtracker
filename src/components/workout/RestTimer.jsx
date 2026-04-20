import React, { useState, useEffect, useRef, useCallback } from 'react'
import { formatTime } from '../../utils/formatters'

export default function RestTimer({ seconds = 90, onComplete }) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(true)
  const [done, setDone] = useState(false)
  const startRef = useRef(Date.now())
  const totalRef = useRef(seconds)

  useEffect(() => {
    if (!running) return
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000)
      const left = Math.max(0, totalRef.current - elapsed)
      setRemaining(left)
      if (left === 0) {
        setDone(true)
        setRunning(false)
        // Vibrate if supported (Android only — graceful skip on iOS)
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
        onComplete?.()
      }
    }
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [running, onComplete])

  const skip = useCallback(() => {
    setRunning(false)
    setRemaining(0)
    setDone(true)
    onComplete?.()
  }, [onComplete])

  const reset = useCallback((newSeconds) => {
    const s = newSeconds ?? totalRef.current
    totalRef.current = s
    startRef.current = Date.now()
    setRemaining(s)
    setRunning(true)
    setDone(false)
  }, [])

  const progress = 1 - remaining / totalRef.current
  const circumference = 2 * Math.PI * 44

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={done ? '#22c55e' : 'var(--accent)'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-all duration-200"
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${done ? 'timer-done' : ''}`}>
          <span className={`text-2xl font-black tabular-nums ${done ? 'text-success' : 'text-white'}`}>
            {done ? '✓' : formatTime(remaining)}
          </span>
          <span className="text-xs text-muted">{done ? 'Done' : 'rest'}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => reset(60)} className="text-xs text-muted bg-surface-2 px-3 py-1.5 rounded-full">60s</button>
        <button onClick={() => reset(90)} className="text-xs text-muted bg-surface-2 px-3 py-1.5 rounded-full">90s</button>
        <button onClick={() => reset(120)} className="text-xs text-muted bg-surface-2 px-3 py-1.5 rounded-full">2m</button>
        {!done && (
          <button onClick={skip} className="text-xs text-accent bg-accent/15 px-3 py-1.5 rounded-full font-semibold">
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
