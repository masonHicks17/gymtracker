import React, { useState, useCallback } from 'react'
import ExerciseCard from './ExerciseCard'
import SetLogger from './SetLogger'
import RestTimer from './RestTimer'
import ExerciseSwap from './ExerciseSwap'
import PRCelebration from '../shared/PRCelebration'
import Button from '../shared/Button'

export default function ActiveSession({ workout, currentIndex, completedSets, onLogSet, onNext, onPrev, onFinish, onSwap, workoutGym }) {
  const [showTimer, setShowTimer] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [prExercise, setPRExercise] = useState(null)

  const exercises = workout?.exercises ?? []
  const exercise = exercises[currentIndex]
  const isLast = currentIndex === exercises.length - 1
  const doneSets = completedSets[exercise?.id] ?? []
  const allSetsLogged = exercise && doneSets.length >= exercise.sets

  const handleLog = useCallback(async (setData) => {
    const isPR = await onLogSet({ exerciseId: exercise.id, ...setData })
    if (isPR) setPRExercise(exercise.name)
    if (doneSets.length + 1 >= exercise.sets) {
      setShowTimer(true)
    }
    return isPR
  }, [exercise, doneSets.length, onLogSet])

  if (!exercise) return null

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-safe">
      {/* Progress bar */}
      <div className="flex gap-1">
        {exercises.map((_, i) => (
          <button
            key={i}
            onClick={() => i < currentIndex && onPrev?.(i)}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < currentIndex ? 'bg-success' :
              i === currentIndex ? 'bg-accent' : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      {/* Exercise card */}
      <ExerciseCard
        exercise={exercise}
        sessionType={workout?.sessionType}
        index={currentIndex}
        total={exercises.length}
        onSwap={() => setShowSwap(true)}
      />

      {/* Sets */}
      <div className="space-y-2">
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <SetLogger
            key={i}
            exercise={exercise}
            setNumber={i + 1}
            targetWeight={exercise.targetWeight}
            onLog={handleLog}
            disabled={i > doneSets.length}
          />
        ))}
      </div>

      {/* Rest timer */}
      {showTimer && (
        <div className="bg-surface-2 rounded-2xl p-5 flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Rest</h3>
          <RestTimer
            seconds={exercise.restSeconds ?? 90}
            onComplete={() => setShowTimer(false)}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        {currentIndex > 0 && (
          <Button variant="secondary" onClick={() => onPrev(currentIndex - 1)} className="flex-1">
            ← Back
          </Button>
        )}
        {isLast ? (
          <Button
            onClick={onFinish}
            fullWidth={currentIndex === 0}
            className="flex-1"
            variant={allSetsLogged ? 'primary' : 'secondary'}
          >
            Finish Workout 🏁
          </Button>
        ) : (
          <Button onClick={onNext} fullWidth={currentIndex === 0} className="flex-1">
            Next Exercise →
          </Button>
        )}
      </div>

      {/* Exercise swap modal */}
      <ExerciseSwap
        open={showSwap}
        exercise={exercise}
        gym={workoutGym}
        onSwap={(newEx) => onSwap(currentIndex, newEx)}
        onClose={() => setShowSwap(false)}
      />

      {/* PR celebration overlay */}
      {prExercise && (
        <PRCelebration exerciseName={prExercise} onDone={() => setPRExercise(null)} />
      )}
    </div>
  )
}
