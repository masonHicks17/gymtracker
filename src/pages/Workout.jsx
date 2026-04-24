import React, { useState } from 'react'
import Header from '../components/layout/Header'
import WorkoutSetup from '../components/workout/WorkoutSetup'
import SynthesisActiveSession from '../components/workout/SynthesisActiveSession'
import PostSession from '../components/workout/PostSession'
import ExerciseSwap from '../components/workout/ExerciseSwap'
import { useWorkout } from '../hooks/useWorkout'
import { useSettings } from '../hooks/useSettings'
import Modal from '../components/shared/Modal'
import Button from '../components/shared/Button'
import { sessionTypeLabel } from '../utils/formatters'
import { EXERCISES } from '../data/exercises'

const DISPLAY = `'Fraunces', 'Times New Roman', Georgia, serif`
const MONO    = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
const LINE    = 'rgba(255,255,255,0.07)'

export default function Workout() {
  const workout = useWorkout()
  const { apiKey, goalType, accentColor } = useSettings()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const handleGenerate = ({ gym, sessionType }) => {
    workout.startGeneration({ gym, sessionType, apiKey, goalType })
  }

  const handleCancelConfirmed = async () => {
    setConfirmCancel(false)
    await workout.cancelWorkout()
  }

  // ── Complete ───────────────────────────────────────────────
  if (workout.status === 'complete') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
        {/* Accent glow */}
        <div style={{
          position: 'absolute', top: -80, left: -40, right: -40, height: 400,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(var(--accent-rgb),0.13), transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 26px', paddingTop: 'calc(env(safe-area-inset-top,0px) + 32px)' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Session saved</div>

          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 76, fontWeight: 400, color: '#F4F2EE', letterSpacing: -3.2, lineHeight: 0.92, fontStyle: 'italic' }}>
              Well<br/>played.
            </div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(244,242,238,0.58)', marginTop: 18, lineHeight: 1.5, maxWidth: 260 }}>
              Session complete. Rest up and come back strong.
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 32px)' }}>
            <button
              onClick={workout.reset}
              style={{
                width: '100%', height: 54, borderRadius: 27,
                background: 'var(--accent)', color: '#0A0A0A', border: 'none',
                fontFamily: DISPLAY, fontSize: 19, letterSpacing: -0.3, cursor: 'pointer',
              }}
            >
              Start Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Post-session ease rating ───────────────────────────────
  if (workout.status === 'post-session') {
    return (
      <div className="flex flex-col full-height" style={{ background: '#0A0A0A' }}>
        <Header title="How'd it feel?" eyebrow="Session complete" />
        <PostSession
          exercises={workout.workout?.exercises ?? []}
          prs={workout.prs}
          xpEarned={workout.xpEarned ?? 0}
          onSubmit={workout.submitEaseRatings}
        />
      </div>
    )
  }

  // ── Active session ─────────────────────────────────────────
  if (workout.status === 'active') {
    const mapAccentColor = (color) => {
      if (!color) return 'orange'
      const lower = color.toLowerCase()
      if (lower === '#c8f751') return 'lime'
      if (lower === '#b79bff') return 'violet'
      if (lower === '#ff7a6b') return 'coral'
      if (lower === '#6bd5f0') return 'cyan'
      return 'orange'
    }

    return (
      <div className="flex flex-col full-height">
        <SynthesisActiveSession
          workout={workout.workout}
          currentIndex={workout.currentIndex}
          completedSets={workout.completedSets}
          onLogSet={workout.logSet}
          onNext={workout.nextExercise}
          onPrev={() => setConfirmCancel(true)}
          onFinish={workout.finishWorkout}
          theme="dark"
          accent={mapAccentColor(accentColor)}
        />
        <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel Workout?">
          <div className="px-5 pb-6 space-y-3">
            <p className="text-sm text-muted">This will delete the current session and all logged sets.</p>
            <Button variant="danger" fullWidth onClick={handleCancelConfirmed}>Yes, Cancel Workout</Button>
            <Button variant="secondary" fullWidth onClick={() => setConfirmCancel(false)}>Keep Going</Button>
          </div>
        </Modal>
      </div>
    )
  }

  // ── Ready: workout preview ─────────────────────────────────
  if (workout.status === 'ready') {
    return <WorkoutPreview workout={workout} />
  }

  // ── Setup / Generating ─────────────────────────────────────
  return (
    <div className="flex flex-col full-height" style={{ background: '#0A0A0A' }}>
      <Header title="New Workout" eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} />
      <WorkoutSetup
        onGenerate={handleGenerate}
        isGenerating={workout.status === 'generating'}
      />
    </div>
  )
}

// ── Workout Preview ────────────────────────────────────────────────────────────
function WorkoutPreview({ workout }) {
  const [swapTarget, setSwapTarget] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const exercises = workout.workout?.exercises ?? []
  const gym = workout.workout?.gym
  const gymEquipment = gym?.equipment ?? []
  const templateEx = exercises[0]

  const totalSets = exercises.reduce((s, e) => s + (e.sets || 0), 0)

  return (
    <div className="flex flex-col full-height" style={{ background: '#0A0A0A' }}>
      <Header
        title={sessionTypeLabel(workout.workout?.sessionType)}
        eyebrow="Ready to lift"
        right={
          <button
            onClick={workout.reset}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}
          >
            Change
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Meta strip */}
        <div style={{ padding: '0 22px 14px', borderBottom: `1px solid ${LINE}`, marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              ['Exercises', exercises.length.toString()],
              ['Sets', totalSets.toString()],
              ['Target', exercises.length > 0 ? `~${exercises.reduce((s,e) => s + (e.targetWeight||0)*(e.reps||0)*(e.sets||0),0) >= 1000 ? Math.round(exercises.reduce((s,e) => s + (e.targetWeight||0)*(e.reps||0)*(e.sets||0),0)/1000) + 'K' : exercises.reduce((s,e) => s + (e.targetWeight||0)*(e.reps||0)*(e.sets||0),0)}` : '—'],
            ].map(([l, v], i) => (
              <div key={l} style={{ borderLeft: i > 0 ? `1px solid ${LINE}` : 'none', paddingLeft: i > 0 ? 10 : 0 }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.8, textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 20, color: '#F4F2EE', letterSpacing: -0.4, marginTop: 2, fontFeatureSettings: '"tnum"' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{
              background: '#161616', border: `1px solid ${LINE}`, borderRadius: 18,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.6, width: 22, textAlign: 'center' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 15, color: '#F4F2EE', letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ex.name}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', letterSpacing: 0.4, marginTop: 3 }}>
                  <span style={{ color: 'var(--accent)' }}>{ex.targetWeight > 0 ? `${ex.targetWeight} lb` : 'BW'}</span> · {ex.reps} reps
                </div>
              </div>
              {/* Sets counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => workout.updateExerciseSets(i, ex.sets - 1)}
                  style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: '#1E1E1E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7h8" stroke="rgba(244,242,238,0.58)" strokeWidth="1.75" strokeLinecap="round"/></svg>
                </button>
                <div style={{ fontFamily: DISPLAY, fontSize: 18, color: '#F4F2EE', minWidth: 24, textAlign: 'center', fontFeatureSettings: '"tnum"' }}>
                  {ex.sets}<span style={{ fontSize: 11, color: 'rgba(244,242,238,0.32)' }}>×</span>
                </div>
                <button
                  onClick={() => workout.updateExerciseSets(i, ex.sets + 1)}
                  style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: '#1E1E1E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="rgba(244,242,238,0.58)" strokeWidth="1.75" strokeLinecap="round"/></svg>
                </button>
              </div>
              {/* Swap */}
              <button
                onClick={() => setSwapTarget({ index: i, exercise: ex })}
                style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h9l-2-2M12 10H3l2 2" stroke="rgba(244,242,238,0.32)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {/* Remove */}
              <button
                onClick={() => workout.removeExercise(i)}
                style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="rgba(239,68,68,0.6)" strokeWidth="1.75" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}

          {/* Add exercise */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'transparent', border: `1px dashed ${LINE}`,
              borderRadius: 18, padding: '14px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: 'rgba(244,242,238,0.32)', fontFamily: MONO, fontSize: 11, letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="rgba(244,242,238,0.32)" strokeWidth="1.75" strokeLinecap="round"/></svg>
            Add exercise
          </button>

          {/* Start button */}
          <button
            onClick={workout.startSession}
            style={{
              marginTop: 8, width: '100%', height: 54, borderRadius: 27,
              background: 'var(--accent)', color: '#0A0A0A', border: 'none',
              fontFamily: DISPLAY, fontSize: 19, fontWeight: 400, letterSpacing: -0.3,
              cursor: 'pointer',
            }}
          >
            Start Workout
          </button>
          <div style={{ height: 20 }} />
        </div>
      </div>

      {swapTarget && (
        <ExerciseSwap
          open={!!swapTarget}
          exercise={swapTarget.exercise}
          gym={gym}
          onSwap={(newEx) => { workout.swapExercise(swapTarget.index, newEx); setSwapTarget(null) }}
          onClose={() => setSwapTarget(null)}
        />
      )}

      <AddExerciseModal
        open={showAddModal}
        gymEquipment={gymEquipment}
        existingIds={exercises.map(e => e.id)}
        templateEx={templateEx}
        onAdd={(ex) => { workout.addExercise(ex); setShowAddModal(false) }}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}

// ── Add Exercise Modal ─────────────────────────────────────────────────────────
function AddExerciseModal({ open, gymEquipment, existingIds, templateEx, onAdd, onClose }) {
  const [search, setSearch] = useState('')

  const candidates = React.useMemo(() => {
    let list = EXERCISES.filter(e => {
      if (existingIds.includes(e.id)) return false
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
  }, [existingIds.join(','), gymEquipment.join(','), search])

  React.useEffect(() => { if (open) setSearch('') }, [open])

  const handleAdd = (ex) => {
    onAdd({
      ...ex,
      sets: templateEx?.sets ?? ex.defaultSets ?? 3,
      reps: templateEx?.reps ?? ex.defaultReps ?? 10,
      targetWeight: ex.defaultWeight ?? 0,
      restSeconds: templateEx?.restSeconds ?? 90,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Exercise" fullScreen>
      <div className="flex flex-col h-full px-5 pb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises, muscles…"
          style={{
            width: '100%', background: '#1E1E1E', borderRadius: 12, padding: '12px 16px',
            fontSize: 14, color: '#F4F2EE', border: `1px solid ${LINE}`, outline: 'none',
            marginBottom: 12, fontFamily: `'Inter', -apple-system, sans-serif`,
          }}
        />
        <div className="overflow-y-auto flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {candidates.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(244,242,238,0.32)', padding: '32px 0', fontFamily: MONO, fontSize: 11 }}>No exercises match</p>
          ) : (
            candidates.map(ex => (
              <button
                key={ex.id}
                onClick={() => handleAdd(ex)}
                style={{
                  background: '#161616', borderRadius: 16, padding: '12px 16px',
                  border: `1px solid ${LINE}`, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 15, color: '#F4F2EE', letterSpacing: -0.2 }}>{ex.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', marginTop: 3, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                    {ex.muscleGroups?.join(' · ')} · {ex.equipmentType}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 15, color: 'var(--accent)', letterSpacing: -0.2 }}>
                    {ex.defaultWeight > 0 ? `${ex.defaultWeight} lb` : 'BW'}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(244,242,238,0.32)', marginTop: 2 }}>
                    {ex.defaultSets}×{ex.defaultReps}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
