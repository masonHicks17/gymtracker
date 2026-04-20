import React, { useState } from 'react'
import Header from '../components/layout/Header'
import WorkoutSetup from '../components/workout/WorkoutSetup'
import SynthesisActiveSession from '../components/workout/SynthesisActiveSession'
import PostSession from '../components/workout/PostSession'
import ExerciseSwap from '../components/workout/ExerciseSwap'
import { useWorkout } from '../hooks/useWorkout'
import { useSettings } from '../hooks/useSettings'
import Button from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import { XPBadge } from '../components/shared/Badge'
import { sessionTypeLabel } from '../utils/formatters'
import { EXERCISES } from '../data/exercises'

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

  // ── Post-complete summary ──────────────────────────────────────
  if (workout.status === 'complete') {
    return (
      <div className="flex flex-col full-height items-center justify-center px-6 gap-6 text-center pb-safe">
        <div className="text-6xl">🏆</div>
        <div>
          <h2 className="text-3xl font-black mb-1">Session Saved!</h2>
          {workout.xpEarned > 0 && <XPBadge xp={workout.xpEarned} className="text-base px-4 py-1" />}
        </div>
        <Button onClick={workout.reset} size="lg" fullWidth>
          Start New Workout
        </Button>
      </div>
    )
  }

  // ── Post-session ease rating ───────────────────────────────────
  if (workout.status === 'post-session') {
    return (
      <div className="flex flex-col full-height overflow-y-auto">
        <Header title="How'd it go?" />
        <PostSession
          exercises={workout.workout?.exercises ?? []}
          prs={workout.prs}
          xpEarned={0}
          onSubmit={workout.submitEaseRatings}
        />
      </div>
    )
  }

  // ── Active session ─────────────────────────────────────────────
  if (workout.status === 'active') {
    // Map app accent color to Synthesis theme color
    const mapAccentColor = (accentColor) => {
      if (!accentColor) return 'orange'
      const lower = accentColor.toLowerCase()
      if (lower.includes('lime') || lower === '#c8f751') return 'lime'
      if (lower.includes('violet') || lower === '#b79bff') return 'violet'
      if (lower.includes('coral') || lower === '#ff7a6b') return 'coral'
      if (lower.includes('cyan') || lower === '#6bd5f0') return 'cyan'
      return 'orange'
    }

    return (
      <div className="flex flex-col full-height overflow-y-auto">
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

        {/* Cancel confirmation */}
        <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel Workout?">
          <div className="px-5 pb-6 space-y-3">
            <p className="text-sm text-muted">This will delete the current session and all logged sets. This cannot be undone.</p>
            <Button variant="danger" fullWidth onClick={handleCancelConfirmed}>
              Yes, Cancel Workout
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setConfirmCancel(false)}>
              Keep Going
            </Button>
          </div>
        </Modal>
      </div>
    )
  }

  // ── Ready: workout preview before starting ────────────────────
  if (workout.status === 'ready') {
    return <WorkoutPreview workout={workout} />
  }

  // ── Setup / Generating ─────────────────────────────────────────
  return (
    <div className="flex flex-col full-height overflow-y-auto">
      <Header title="Workout" />
      <WorkoutSetup
        onGenerate={handleGenerate}
        isGenerating={workout.status === 'generating'}
      />
    </div>
  )
}

// ── Workout Preview (ready state) — supports per-exercise swap, add, remove, sets ──
function WorkoutPreview({ workout }) {
  const [swapTarget, setSwapTarget] = useState(null) // { index, exercise }
  const [showAddModal, setShowAddModal] = useState(false)

  const exercises = workout.workout?.exercises ?? []
  const gym = workout.workout?.gym
  const gymEquipment = gym?.equipment ?? []

  // Infer sets/reps/rest from first exercise for newly added ones
  const templateEx = exercises[0]

  return (
    <div className="flex flex-col full-height overflow-y-auto">
      <Header
        title="Your Workout"
        right={
          <button onClick={workout.reset} className="text-muted text-sm">Change</button>
        }
      />
      <div className="flex-1 px-4 pb-safe pt-2 space-y-3">
        {/* Summary bar */}
        <div className="flex items-center gap-3 text-xs text-muted bg-surface-2 rounded-xl px-4 py-2.5">
          <span className="font-semibold text-white capitalize">{sessionTypeLabel(workout.workout?.sessionType)}</span>
          <span>·</span>
          <span>{exercises.length} exercises</span>
          <span>·</span>
          <span>Tap ⇄ to swap</span>
        </div>

        {/* Exercise list */}
        <div className="bg-surface-2 rounded-2xl overflow-hidden divide-y divide-white/5">
          {exercises.map((ex, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-3">
              {/* Index */}
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-muted flex-shrink-0">
                {i + 1}
              </div>

              {/* Name + weight */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{ex.name}</div>
                <div className="text-xs text-muted mt-0.5">
                  <span className="text-accent font-semibold">
                    {ex.targetWeight > 0 ? `${ex.targetWeight} lbs` : 'BW'}
                  </span>
                  <span className="text-muted/60"> · </span>
                  {ex.reps} reps
                </div>
              </div>

              {/* Sets counter */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => workout.updateExerciseSets(i, ex.sets - 1)}
                  className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm text-muted hover:bg-white/20 transition-colors"
                >−</button>
                <span className="w-8 text-center text-sm font-bold">{ex.sets}×</span>
                <button
                  onClick={() => workout.updateExerciseSets(i, ex.sets + 1)}
                  className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm text-muted hover:bg-white/20 transition-colors"
                >+</button>
              </div>

              {/* Swap button */}
              <button
                onClick={() => setSwapTarget({ index: i, exercise: ex })}
                className="flex-shrink-0 p-1.5 text-muted hover:text-white transition-colors"
                title="Swap this exercise"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </button>

              {/* Remove button */}
              <button
                onClick={() => workout.removeExercise(i)}
                className="flex-shrink-0 p-1.5 text-danger/60 hover:text-danger transition-colors"
                title="Remove this exercise"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add exercise button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 text-muted hover:text-white hover:border-white/40 transition-colors text-sm font-semibold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Exercise
        </button>

        <Button onClick={workout.startSession} fullWidth size="xl">
          Start Workout 🏋️
        </Button>
      </div>

      {/* Per-exercise swap modal */}
      {swapTarget && (
        <ExerciseSwap
          open={!!swapTarget}
          exercise={swapTarget.exercise}
          gym={gym}
          onSwap={(newEx) => {
            workout.swapExercise(swapTarget.index, newEx)
            setSwapTarget(null)
          }}
          onClose={() => setSwapTarget(null)}
        />
      )}

      {/* Add exercise modal */}
      <AddExerciseModal
        open={showAddModal}
        gymEquipment={gymEquipment}
        existingIds={exercises.map(e => e.id)}
        templateEx={templateEx}
        onAdd={(ex) => {
          workout.addExercise(ex)
          setShowAddModal(false)
        }}
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

  // Reset search on open
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
          className="w-full bg-surface-2 rounded-xl px-4 py-3 text-sm text-white placeholder-muted/50 border border-white/10 focus:border-accent/50 outline-none mb-3"
        />
        <div className="overflow-y-auto flex-1 space-y-2">
          {candidates.length === 0 ? (
            <p className="text-center text-muted text-sm py-8">No exercises match</p>
          ) : (
            candidates.map(ex => (
              <button
                key={ex.id}
                onClick={() => handleAdd(ex)}
                className="w-full text-left bg-surface-2 rounded-2xl px-4 py-3 border border-white/5 active:bg-white/5 transition-colors flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{ex.name}</div>
                  <div className="text-xs text-muted mt-0.5 capitalize">
                    {ex.muscleGroups?.join(' · ')}
                    <span className="text-muted/60"> · </span>
                    {ex.equipmentType}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-bold text-accent">
                    {ex.defaultWeight > 0 ? `${ex.defaultWeight} lbs` : 'BW'}
                  </div>
                  <div className="text-xs text-muted">{ex.defaultSets}×{ex.defaultReps}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
