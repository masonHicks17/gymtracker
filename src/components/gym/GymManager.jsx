import React, { useState } from 'react'
import { useGyms } from '../../hooks/useGym'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import EquipmentPicker from './EquipmentPicker'
import SpecificEquipmentPicker from './SpecificEquipmentPicker'
import { KNOWN_MACHINES } from '../../data/exercises'

const EMPTY_FORM = { name: '', equipment: [], specificEquipment: [] }

export default function GymManager({ onSelect, selectedGymId }) {
  const { gyms, addGym, updateGym, deleteGym } = useGyms()
  const [editingGym, setEditingGym] = useState(null) // null=closed, EMPTY_FORM=new, {id,...}=editing
  const [tab, setTab] = useState('general') // 'general' | 'specific'
  const [deleteTarget, setDeleteTarget] = useState(null)

  const openNew = () => {
    setEditingGym({ ...EMPTY_FORM })
    setTab('general')
  }

  const openEdit = (gym, e) => {
    e.stopPropagation()
    setEditingGym({
      id: gym.id,
      name: gym.name ?? '',
      equipment: gym.equipment ?? [],
      specificEquipment: gym.specificEquipment ?? [],
    })
    setTab('general')
  }

  const handleSave = async () => {
    if (!editingGym?.name?.trim()) return
    const data = {
      name: editingGym.name.trim(),
      equipment: editingGym.equipment,
      specificEquipment: editingGym.specificEquipment,
    }
    if (editingGym.id) {
      await updateGym(editingGym.id, data)
    } else {
      await addGym(data)
    }
    setEditingGym(null)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTarget) await deleteGym(deleteTarget)
    setDeleteTarget(null)
  }

  const patch = (field, value) =>
    setEditingGym(g => ({ ...g, [field]: value }))

  const handleEquipmentChange = (newTypes) => {
    setEditingGym(g => {
      const addedTypes = newTypes.filter(t => !g.equipment.includes(t))
      const removedTypes = g.equipment.filter(t => !newTypes.includes(t))

      // Add all known machines for newly selected types (avoid duplicates)
      const existingIds = new Set(g.specificEquipment.map(m => m.id))
      const toAdd = KNOWN_MACHINES
        .filter(m => addedTypes.includes(m.type) && !existingIds.has(m.id))
        .map(m => ({ id: m.id, name: m.name, type: m.type }))

      // Remove known machines for deselected types (keep custom ones)
      const removedIds = new Set(
        KNOWN_MACHINES.filter(m => removedTypes.includes(m.type)).map(m => m.id)
      )
      const kept = g.specificEquipment.filter(m => !removedIds.has(m.id))

      return { ...g, equipment: newTypes, specificEquipment: [...kept, ...toAdd] }
    })
  }

  const isNew = editingGym && !editingGym.id

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Gyms</h3>
        <button onClick={openNew} className="text-accent text-sm font-semibold">
          + Add Gym
        </button>
      </div>

      {gyms.length === 0 && (
        <div className="text-center py-8 text-muted text-sm">
          <div className="text-3xl mb-2">🏋️</div>
          <p>No gyms yet. Add your first gym!</p>
        </div>
      )}

      <div className="space-y-2">
        {gyms.map(gym => (
          <GymRow
            key={gym.id}
            gym={gym}
            selected={selectedGymId === gym.id}
            onSelect={() => onSelect?.(gym)}
            onEdit={(e) => openEdit(gym, e)}
            onDelete={(e) => { e.stopPropagation(); setDeleteTarget(gym.id) }}
          />
        ))}
      </div>

      {/* Add / Edit modal */}
      {editingGym && (
        <Modal open onClose={() => setEditingGym(null)} title={isNew ? 'New Gym' : 'Edit Gym'} fullScreen>
          <div className="flex flex-col h-full">
            {/* Name input */}
            <div className="px-5 pt-1 pb-4">
              <input
                value={editingGym.name}
                onChange={e => patch('name', e.target.value)}
                placeholder="e.g. Planet Fitness, Home Gym"
                className="w-full bg-surface-2 rounded-xl px-4 py-3 text-white placeholder-muted/50 border border-white/10 focus:border-accent/50 outline-none"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 mb-3">
              {[['general', 'Equipment Types'], ['specific', 'Specific Machines']].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    tab === id ? 'bg-accent/20 text-accent' : 'text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {tab === 'general' ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted">Select the general types of equipment available at this gym. The workout generator uses these to filter exercises.</p>
                  <EquipmentPicker
                    selected={editingGym.equipment}
                    onChange={handleEquipmentChange}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted">Select the specific machines available. Add unlisted or custom equipment below.</p>
                  <SpecificEquipmentPicker
                    selected={editingGym.specificEquipment}
                    onChange={v => patch('specificEquipment', v)}
                  />
                </div>
              )}
            </div>

            <div className="px-5 pb-6 pt-2 border-t border-white/10">
              <Button onClick={handleSave} fullWidth disabled={!editingGym.name.trim()}>
                {isNew ? 'Save Gym' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Gym?">
        <div className="px-5 pb-6 space-y-3">
          <p className="text-sm text-muted">This gym will be removed. Your workout history is not affected.</p>
          <Button variant="danger" fullWidth onClick={handleDeleteConfirm}>Delete Gym</Button>
          <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

function GymRow({ gym, selected, onSelect, onEdit, onDelete }) {
  const specificCount = gym.specificEquipment?.length ?? 0

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
        selected
          ? 'bg-accent/15 border-accent/40'
          : 'bg-surface-2 border-white/5 active:bg-white/5'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{gym.name}</div>
        <div className="text-xs text-muted mt-0.5 truncate">
          {gym.equipment?.length ? gym.equipment.join(', ') : 'No equipment listed'}
          {specificCount > 0 && (
            <span className="text-accent/70"> · {specificCount} machine{specificCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {selected && <div className="w-2 h-2 rounded-full bg-accent" />}

        {/* Edit button */}
        <button
          onClick={onEdit}
          className="p-2 text-muted/50 hover:text-white transition-colors"
          title="Edit gym"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="p-2 text-muted/50 hover:text-danger transition-colors"
          title="Delete gym"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
