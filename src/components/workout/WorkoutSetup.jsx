import React, { useState } from 'react'
import { SESSION_TYPES } from '../../data/exercises'
import { useGyms } from '../../hooks/useGym'
import { useSettings } from '../../hooks/useSettings'
import GymManager from '../gym/GymManager'
import Spinner from '../shared/Spinner'
import Modal from '../shared/Modal'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const SANS    = `'Inter', -apple-system, system-ui, sans-serif`
const LINE    = 'rgba(255,255,255,0.07)'

const SESSION_DESCS = {
  push:      'Chest · Shoulders · Tri',
  pull:      'Back · Biceps',
  legs:      'Quads · Hams · Glutes',
  upper:     'Full upper body',
  lower:     'Full lower body',
  'full-body':'Everything',
}

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
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingBottom: 32 }}>

        {/* Gym selector */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)' }}>Gym</div>
            <button
              onClick={() => setShowGymModal(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: 10, color: 'var(--accent)', letterSpacing: 0.8, textTransform: 'uppercase' }}
            >
              {gyms.length === 0 ? '+ Add Gym' : 'Manage'}
            </button>
          </div>

          {gyms.length === 0 ? (
            <div
              onClick={() => setShowGymModal(true)}
              style={{
                padding: '18px 16px', borderRadius: 16, border: `1px dashed ${LINE}`,
                textAlign: 'center', cursor: 'pointer',
                fontFamily: DISPLAY, fontSize: 15, color: 'rgba(244,242,238,0.32)',
              }}
            >
              Tap to add your gym
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              <button
                onClick={() => setSelectedGym(null)}
                style={{
                  flexShrink: 0, padding: '12px 16px', borderRadius: 16, cursor: 'pointer',
                  border: `1px solid ${selectedGym === null ? 'rgba(var(--accent-rgb),0.53)' : LINE}`,
                  background: selectedGym === null ? 'rgba(var(--accent-rgb),0.10)' : '#161616',
                  display: 'flex', flexDirection: 'column', gap: 2, minWidth: 96,
                  textAlign: 'left',
                }}
              >
                <div style={{ fontFamily: DISPLAY, fontSize: 15, letterSpacing: -0.2, color: '#F4F2EE' }}>Any Gym</div>
              </button>
              {gyms.map(gym => (
                <button
                  key={gym.id}
                  onClick={() => setSelectedGym(gym)}
                  style={{
                    flexShrink: 0, padding: '12px 16px', borderRadius: 16, cursor: 'pointer',
                    border: `1px solid ${selectedGym?.id === gym.id ? 'rgba(var(--accent-rgb),0.53)' : LINE}`,
                    background: selectedGym?.id === gym.id ? 'rgba(var(--accent-rgb),0.10)' : '#161616',
                    display: 'flex', flexDirection: 'column', gap: 2, minWidth: 96,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontFamily: DISPLAY, fontSize: 15, letterSpacing: -0.2, color: '#F4F2EE' }}>{gym.name}</div>
                  {gym.equipment?.length > 0 && (
                    <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      {gym.equipment.length} eqp
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Session type */}
        <section>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(244,242,238,0.32)', marginBottom: 10 }}>
            Session type
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SESSION_TYPES.map((type, i) => {
              const on = sessionType === type.id
              const desc = SESSION_DESCS[type.id] ?? type.description ?? ''
              return (
                <button
                  key={type.id}
                  onClick={() => setSessionType(type.id)}
                  style={{
                    padding: '16px 14px', borderRadius: 18, cursor: 'pointer',
                    border: `1px solid ${on ? 'rgba(var(--accent-rgb),0.53)' : LINE}`,
                    background: on ? 'rgba(var(--accent-rgb),0.09)' : '#161616',
                    display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontFamily: MONO, fontSize: 9, color: on ? 'var(--accent)' : 'rgba(244,242,238,0.32)', letterSpacing: 1, textTransform: 'uppercase' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 400, color: '#F4F2EE', letterSpacing: -0.6, lineHeight: 1, marginTop: 4 }}>
                    {type.label}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(244,242,238,0.58)', marginTop: 4, lineHeight: 1.3 }}>
                    {desc}
                  </div>
                  {on && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 14, height: 14, borderRadius: 7,
                      background: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5l3.5 3.5L13 5" stroke="#0A0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!sessionType || isGenerating}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: (!sessionType || isGenerating) ? 'rgba(244,242,238,0.1)' : 'var(--accent)',
            color: (!sessionType || isGenerating) ? 'rgba(244,242,238,0.32)' : '#0A0A0A',
            border: 'none', cursor: (!sessionType || isGenerating) ? 'default' : 'pointer',
            fontFamily: DISPLAY, fontSize: 19, fontWeight: 400, letterSpacing: -0.3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {isGenerating ? (
            <>
              <Spinner size={18} className="text-current" />
              {hasApiKey ? 'Generating…' : 'Building workout…'}
            </>
          ) : (
            'Generate Workout'
          )}
        </button>
      </div>

      <Modal open={showGymModal} onClose={() => setShowGymModal(false)} title="Gyms" fullScreen>
        <div className="px-5 pb-6">
          <GymManager onSelect={(gym) => { setSelectedGym(gym); setShowGymModal(false) }} selectedGymId={selectedGym?.id} />
        </div>
      </Modal>
    </div>
  )
}
