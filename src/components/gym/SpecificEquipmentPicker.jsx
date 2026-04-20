import React, { useState, useMemo } from 'react'
import { KNOWN_MACHINES, EQUIPMENT_TYPES } from '../../data/exercises'

const TYPE_LABELS = {
  barbell:    'Barbell',
  dumbbell:   'Dumbbell',
  cable:      'Cable',
  machine:    'Machine',
  bodyweight: 'Bodyweight',
  other:      'Other',
}

// Group KNOWN_MACHINES by category for display
const CATEGORIES = [...new Set(KNOWN_MACHINES.map(m => m.category))]

export default function SpecificEquipmentPicker({ selected = [], onChange }) {
  const [search, setSearch] = useState('')
  const [customName, setCustomName] = useState('')
  const [customType, setCustomType] = useState('machine')

  // selected: [{id, name, type}]
  const selectedIds = new Set(selected.map(m => m.id))

  const toggle = (machine) => {
    if (selectedIds.has(machine.id)) {
      onChange(selected.filter(m => m.id !== machine.id))
    } else {
      onChange([...selected, { id: machine.id, name: machine.name, type: machine.type }])
    }
  }

  const removeCustom = (id) => {
    onChange(selected.filter(m => m.id !== id))
  }

  const addCustom = () => {
    const name = customName.trim()
    if (!name) return
    const id = `custom-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    onChange([...selected, { id, name, type: customType, custom: true }])
    setCustomName('')
  }

  const filteredMachines = useMemo(() => {
    if (!search.trim()) return KNOWN_MACHINES
    const q = search.toLowerCase()
    return KNOWN_MACHINES.filter(m =>
      m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    )
  }, [search])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return CATEGORIES
    return [...new Set(filteredMachines.map(m => m.category))]
  }, [filteredMachines, search])

  const customSelected = selected.filter(m => m.custom)

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search machines…"
        className="w-full bg-surface rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted/50 border border-white/10 focus:border-accent/50 outline-none"
      />

      {/* Known machines by category */}
      <div className="space-y-3">
        {filteredCategories.map(cat => {
          const machines = filteredMachines.filter(m => m.category === cat)
          if (!machines.length) return null
          return (
            <div key={cat}>
              <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-1.5 px-0.5">{cat}</div>
              <div className="space-y-1">
                {machines.map(m => {
                  const isOn = selectedIds.has(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggle(m)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        isOn
                          ? 'bg-accent/15 border-accent/40 text-white'
                          : 'bg-surface border-white/5 text-muted'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${
                        isOn ? 'bg-accent border-accent text-white' : 'border-white/20'
                      }`}>
                        {isOn && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </span>
                      <span className="text-sm font-medium flex-1">{m.name}</span>
                      <span className={`text-xs ${isOn ? 'text-accent/70' : 'text-muted/50'}`}>
                        {TYPE_LABELS[m.type] ?? m.type}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Custom machines added by user */}
      {customSelected.length > 0 && (
        <div>
          <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-1.5 px-0.5">Your Custom Equipment</div>
          <div className="space-y-1">
            {customSelected.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent/10 border border-accent/20">
                <span className="text-sm font-medium flex-1 text-white">{m.name}</span>
                <span className="text-xs text-accent/70">{TYPE_LABELS[m.type] ?? m.type}</span>
                <button
                  type="button"
                  onClick={() => removeCustom(m.id)}
                  className="text-muted/60 hover:text-danger transition-colors p-0.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add custom machine */}
      <div className="border-t border-white/10 pt-3">
        <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-2 px-0.5">Add Unlisted Equipment</div>
        <div className="flex gap-2">
          <input
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="e.g. TechnoGym Row"
            className="flex-1 bg-surface rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted/50 border border-white/10 focus:border-accent/50 outline-none"
          />
          <select
            value={customType}
            onChange={e => setCustomType(e.target.value)}
            className="bg-surface rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:border-accent/50 outline-none"
          >
            {EQUIPMENT_TYPES.map(t => (
              <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addCustom}
            disabled={!customName.trim()}
            className="px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-opacity flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
