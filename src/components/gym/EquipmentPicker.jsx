import React from 'react'
import { EQUIPMENT_TYPES } from '../../data/exercises'

const EQUIPMENT_LABELS = {
  barbell:    { label: 'Barbell',     emoji: '🏋️' },
  dumbbell:   { label: 'Dumbbells',   emoji: '💪' },
  cable:      { label: 'Cable Machine', emoji: '🔗' },
  machine:    { label: 'Machines',    emoji: '⚙️' },
  bodyweight: { label: 'Bodyweight',  emoji: '🤸' },
  other:      { label: 'Other',       emoji: '🎽' },
}

export default function EquipmentPicker({ selected, onChange }) {
  const toggle = (type) => {
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type))
    } else {
      onChange([...selected, type])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {EQUIPMENT_TYPES.map(type => {
        const { label, emoji } = EQUIPMENT_LABELS[type] ?? { label: type, emoji: '🏋️' }
        const isSelected = selected.includes(type)
        return (
          <button
            key={type}
            onClick={() => toggle(type)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              isSelected
                ? 'bg-accent/15 border-accent/40 text-white'
                : 'bg-surface-2 border-white/5 text-muted'
            }`}
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
            {isSelected && (
              <svg className="ml-auto text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
