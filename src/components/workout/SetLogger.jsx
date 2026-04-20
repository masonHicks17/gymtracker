import React, { useState } from 'react'
import { formatWeight } from '../../utils/formatters'
import { PRBadge } from '../shared/Badge'

export default function SetLogger({ exercise, setNumber, targetWeight, onLog, disabled }) {
  const [weight, setWeight] = useState(String(targetWeight ?? ''))
  const [reps, setReps] = useState(String(exercise?.defaultReps ?? 10))
  const [logged, setLogged] = useState(false)
  const [isPR, setIsPR] = useState(false)

  const handleLog = async () => {
    const w = parseFloat(weight) || 0
    const r = parseInt(reps) || 0
    const pr = await onLog({ setNumber, actualWeight: w, reps: r, targetWeight: parseFloat(targetWeight) || 0 })
    setLogged(true)
    setIsPR(pr)
  }

  const adjust = (field, delta) => {
    if (field === 'weight') {
      setWeight(prev => {
        const v = (parseFloat(prev) || 0) + delta
        return String(Math.max(0, v))
      })
    } else {
      setReps(prev => {
        const v = (parseInt(prev) || 0) + delta
        return String(Math.max(1, v))
      })
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      logged ? 'bg-success/10 border border-success/20' : 'bg-surface-2 border border-white/5'
    }`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        logged ? 'bg-success text-black' : 'bg-white/10 text-muted'
      }`}>
        {logged ? '✓' : setNumber}
      </div>

      {/* Weight input */}
      <div className="flex items-center gap-1 flex-1">
        <button onClick={() => adjust('weight', -2.5)} disabled={logged || disabled} className="text-muted w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-lg disabled:opacity-30">−</button>
        <div className="flex-1 text-center">
          <input
            value={weight}
            onChange={e => setWeight(e.target.value)}
            disabled={logged || disabled}
            inputMode="decimal"
            className="w-full bg-transparent text-center font-bold text-lg outline-none disabled:opacity-60"
            placeholder="0"
          />
          <div className="text-[10px] text-muted -mt-1">lbs</div>
        </div>
        <button onClick={() => adjust('weight', 2.5)} disabled={logged || disabled} className="text-muted w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-lg disabled:opacity-30">+</button>
      </div>

      <div className="text-muted text-xs">×</div>

      {/* Reps input */}
      <div className="flex items-center gap-1">
        <button onClick={() => adjust('reps', -1)} disabled={logged || disabled} className="text-muted w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-lg disabled:opacity-30">−</button>
        <div className="w-10 text-center">
          <input
            value={reps}
            onChange={e => setReps(e.target.value)}
            disabled={logged || disabled}
            inputMode="numeric"
            className="w-full bg-transparent text-center font-bold text-lg outline-none disabled:opacity-60"
          />
          <div className="text-[10px] text-muted -mt-1">reps</div>
        </div>
        <button onClick={() => adjust('reps', 1)} disabled={logged || disabled} className="text-muted w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-lg disabled:opacity-30">+</button>
      </div>

      {/* Log / PR badge */}
      {logged ? (
        isPR ? <PRBadge /> : <span className="text-success text-lg">✓</span>
      ) : (
        <button
          onClick={handleLog}
          disabled={disabled}
          className="bg-accent text-white text-sm font-bold px-3 py-2 rounded-xl disabled:opacity-30 active:scale-95 transition-transform"
        >
          Log
        </button>
      )}
    </div>
  )
}
