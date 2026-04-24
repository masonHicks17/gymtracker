import React, { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { useSettings } from '../../hooks/useSettings'
import { seedAll, clearAll } from '../../db/seed'

const ACCENT_COLORS = [
  { label: 'Orange', value: '#FF9E5E' },
  { label: 'Lime',   value: '#C8F751' },
  { label: 'Violet', value: '#B79BFF' },
  { label: 'Coral',  value: '#FF7A6B' },
  { label: 'Cyan',   value: '#6BD5F0' },
  { label: 'Sand',   value: '#E6D4A8' },
]

const GOALS = [
  { id: 'strength', label: 'Strength', desc: 'Heavy weight, low reps' },
  { id: 'mass',     label: 'Mass',     desc: 'Moderate weight, 8–12 reps' },
  { id: 'toning',   label: 'Toning',   desc: 'Lighter weight, high reps' },
]

export default function SettingsModal({ open, onClose }) {
  const { stats, accentColor, goalType, setSetting } = useSettings()
  const [seedMsg, setSeedMsg] = useState('')

  const handleSeed = async () => {
    setSeedMsg('Loading…')
    try {
      const r = await seedAll()
      setSeedMsg(`✓ Added ${r.gyms} gyms, ${r.workouts} workouts, ${r.sets} sets (${r.skipped} skipped)`)
    } catch (e) {
      setSeedMsg('Error: ' + e.message)
    }
  }

  const handleClear = async () => {
    if (!window.confirm('Delete ALL data? This cannot be undone.')) return
    await clearAll()
    setSeedMsg('✓ All data cleared')
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings" fullScreen>
      <div className="px-5 pb-8 space-y-7">

        {/* Goal */}
        <section>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Training Goal</h3>
          <div className="flex flex-col gap-2">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setSetting('goalType', g.id)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                  goalType === g.id ? 'border-accent/40 bg-accent/10' : 'border-white/5 bg-surface-2'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm">{g.label}</div>
                  <div className="text-xs text-muted">{g.desc}</div>
                </div>
                {goalType === g.id && (
                  <svg className="text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Accent color */}
        <section>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Accent Color</h3>
          <div className="flex gap-3 flex-wrap">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setSetting('accentColor', c.value)}
                title={c.label}
                className={`w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-surface transition-all ${
                  accentColor === c.value ? 'ring-white scale-110' : 'ring-transparent'
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-surface-2 rounded-2xl p-4 space-y-2">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Your Stats</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Total XP</span>
            <span className="font-bold text-accent">{(stats?.totalXP ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Current streak</span>
            <span className="font-bold">🔥 {stats?.streak ?? 0} days</span>
          </div>
        </section>

        {/* Dev tools */}
        <section>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Dev Tools</h3>
          <div className="flex gap-2">
            <button
              onClick={handleSeed}
              className="flex-1 bg-surface-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white active:bg-white/5 transition-colors"
            >
              🌱 Load Sample Data
            </button>
            <button
              onClick={handleClear}
              className="bg-surface-2 border border-danger/30 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger active:bg-danger/10 transition-colors"
            >
              🗑️ Clear
            </button>
          </div>
          {seedMsg && (
            <p className={`mt-2 text-xs ${seedMsg.startsWith('Error') ? 'text-danger' : 'text-success'}`}>
              {seedMsg}
            </p>
          )}
        </section>

      </div>
    </Modal>
  )
}
