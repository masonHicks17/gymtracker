import React, { useState } from 'react'
import { SESSION_TYPES } from '../../data/exercises'
import { useGyms } from '../../hooks/useGym'
import { useSettings } from '../../hooks/useSettings'
import GymManager from '../gym/GymManager'
import Button from '../shared/Button'
import Spinner from '../shared/Spinner'
import Modal from '../shared/Modal'

export default function WorkoutSetup({ onGenerate, isGenerating }) {
  const { gyms } = useGyms()
  const { hasApiKey } = useSettings()
  const [selectedGym, setSelectedGym] = useState(null)
  const [sessionType, setSessionType] = useState(null)
  const [showGymModal, setShowGymModal] = useState(false)

  const handleGenerate = () => {
    if (!sessionType) return
    onGenerate({ gym: selectedGym, sessionType })
  }

  return (
    <div className="flex flex-col gap-6 pb-safe px-4 pt-4">
      {/* Gym selector */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Gym</h2>
          <button onClick={() => setShowGymModal(true)} className="text-accent text-sm font-semibold">
            {gyms.length === 0 ? '+ Add Gym' : 'Manage'}
          </button>
        </div>

        {gyms.length === 0 ? (
          <div
            onClick={() => setShowGymModal(true)}
            className="p-4 rounded-2xl border border-dashed border-white/20 text-center text-muted text-sm cursor-pointer active:bg-white/5"
          >
            <div className="text-2xl mb-1">🏋️</div>
            Tap to add your gym
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            <button
              onClick={() => setSelectedGym(null)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                selectedGym === null
                  ? 'bg-accent/15 border-accent/40 text-white'
                  : 'bg-surface-2 border-white/5 text-muted'
              }`}
            >
              Any Gym
            </button>
            {gyms.map(gym => (
              <button
                key={gym.id}
                onClick={() => setSelectedGym(gym)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  selectedGym?.id === gym.id
                    ? 'bg-accent/15 border-accent/40 text-white'
                    : 'bg-surface-2 border-white/5 text-muted'
                }`}
              >
                {gym.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Session type */}
      <section>
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Session Type</h2>
        <div className="grid grid-cols-2 gap-2">
          {SESSION_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSessionType(type.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                sessionType === type.id
                  ? 'bg-accent/15 border-accent/40'
                  : 'bg-surface-2 border-white/5'
              }`}
            >
              <div className="text-2xl mb-1">{type.emoji}</div>
              <div className="font-semibold text-sm">{type.label}</div>
              <div className="text-xs text-muted mt-0.5">{type.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Mode indicator */}
      {!hasApiKey && (
        <div className="flex items-center gap-2 bg-surface-2 rounded-xl px-4 py-3 text-sm text-muted">
          <span>⚡</span>
          <span>Free mode — add API key in Settings for AI generation</span>
        </div>
      )}

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={!sessionType || isGenerating}
        fullWidth
        size="lg"
      >
        {isGenerating ? (
          <>
            <Spinner size={20} className="text-white" />
            {hasApiKey ? 'Generating with AI...' : 'Building workout...'}
          </>
        ) : (
          hasApiKey ? '✨ Generate Workout' : '🏋️ Build Workout'
        )}
      </Button>

      {/* Gym modal */}
      <Modal open={showGymModal} onClose={() => setShowGymModal(false)} title="Gyms" fullScreen>
        <div className="px-5 pb-6">
          <GymManager onSelect={(gym) => { setSelectedGym(gym); setShowGymModal(false) }} selectedGymId={selectedGym?.id} />
        </div>
      </Modal>
    </div>
  )
}
