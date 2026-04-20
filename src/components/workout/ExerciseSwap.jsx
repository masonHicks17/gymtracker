import React, { useState, useEffect, useMemo } from 'react'
import { suggestSwap } from '../../ai/suggestSwap'
import { useSettings } from '../../hooks/useSettings'
import { getSwapCandidates, EXERCISES } from '../../data/exercises'
import Modal from '../shared/Modal'
import Spinner from '../shared/Spinner'
import { formatWeight } from '../../utils/formatters'

export default function ExerciseSwap({ open, exercise, gym, onSwap, onClose }) {
  const { apiKey } = useSettings()
  const [tab, setTab] = useState('suggested') // 'suggested' | 'browse'
  const [aiAlts, setAiAlts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const gymEquipment = gym?.equipment ?? []

  // Suggested: same primary muscle, filtered by gym equipment
  const staticCandidates = useMemo(() =>
    getSwapCandidates(exercise ?? {}, gymEquipment).slice(0, 6),
    [exercise?.id, gymEquipment.join(',')]
  )

  // Browse: all exercises filtered by gym equipment + search
  const browseCandidates = useMemo(() => {
    let list = EXERCISES.filter(e => {
      if (e.id === exercise?.id) return false
      if (gymEquipment.length > 0 && e.equipmentType !== 'bodyweight' && !gymEquipment.includes(e.equipmentType)) return false
      return true
    })
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.muscleGroups.some(m => m.includes(q)) ||
        e.category.includes(q)
      )
    }
    return list
  }, [exercise?.id, gymEquipment.join(','), search])

  useEffect(() => {
    if (!open || !exercise || !apiKey) return
    setLoading(true)
    suggestSwap({ exercise, gym, apiKey })
      .then(setAiAlts)
      .catch(() => setAiAlts([]))
      .finally(() => setLoading(false))
  }, [open, exercise?.id])

  // Reset on open
  useEffect(() => {
    if (open) { setTab('suggested'); setSearch('') }
  }, [open])

  const displayedSuggested = aiAlts.length > 0 ? aiAlts : staticCandidates

  const handleSwap = (alt) => {
    // Preserve sets/reps/rest from the original exercise
    onSwap({
      ...alt,
      sets: exercise?.sets ?? alt.defaultSets ?? 3,
      reps: exercise?.reps ?? alt.defaultReps ?? 10,
      targetWeight: alt.defaultWeight ?? 0,
      restSeconds: exercise?.restSeconds ?? 90,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={`Swap: ${exercise?.name ?? ''}`} fullScreen>
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex gap-1 px-5 mb-3">
          {['suggested', 'browse'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${
                tab === t ? 'bg-accent/20 text-accent' : 'text-muted'
              }`}
            >
              {t === 'suggested' ? '✨ Suggested' : '🔍 Browse All'}
            </button>
          ))}
        </div>

        {/* Suggested tab */}
        {tab === 'suggested' && (
          <div className="overflow-y-auto px-5 pb-6 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center py-10 gap-3 text-muted">
                <Spinner size={32} className="text-accent" />
                <p className="text-sm">Finding alternatives…</p>
              </div>
            ) : displayedSuggested.length === 0 ? (
              <div className="text-center py-10 text-muted">
                <p className="text-sm">No alternatives found for your gym's equipment.</p>
                <button onClick={() => setTab('browse')} className="text-accent text-sm mt-3 font-semibold">
                  Browse all exercises →
                </button>
              </div>
            ) : (
              <>
                {aiAlts.length > 0 && (
                  <p className="text-xs text-muted pb-1 flex items-center gap-1">
                    <span className="text-accent">✨</span> AI recommendations for {exercise?.muscleGroups?.[0]}
                  </p>
                )}
                {displayedSuggested.map((alt, i) => (
                  <ExerciseRow key={alt.id ?? i} exercise={alt} onSelect={() => handleSwap(alt)} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Browse tab */}
        {tab === 'browse' && (
          <div className="flex flex-col flex-1 overflow-hidden px-5 pb-6">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises, muscles…"
              className="w-full bg-surface-2 rounded-xl px-4 py-3 text-sm text-white placeholder-muted/50 border border-white/10 focus:border-accent/50 outline-none mb-3"
            />
            <div className="overflow-y-auto flex-1 space-y-2">
              {browseCandidates.length === 0 ? (
                <p className="text-center text-muted text-sm py-8">No exercises match</p>
              ) : (
                browseCandidates.map(alt => (
                  <ExerciseRow key={alt.id} exercise={alt} onSelect={() => handleSwap(alt)} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

function ExerciseRow({ exercise, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-surface-2 rounded-2xl px-4 py-3 border border-white/5 active:bg-white/5 transition-colors flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{exercise.name}</div>
        <div className="text-xs text-muted mt-0.5 capitalize">
          {exercise.muscleGroups?.join(' · ')}
          <span className="text-muted/60"> · </span>
          {exercise.equipmentType}
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="text-sm font-bold text-accent">
          {exercise.defaultWeight > 0 ? `${exercise.defaultWeight} lbs` : 'BW'}
        </div>
        <div className="text-xs text-muted">
          {exercise.defaultSets}×{exercise.defaultReps}
        </div>
      </div>
    </button>
  )
}
