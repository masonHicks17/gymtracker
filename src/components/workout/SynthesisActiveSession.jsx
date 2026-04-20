import React, { useState, useEffect, useRef } from 'react'

const DISPLAY_FONT = "'Fraunces', 'Times New Roman', serif"
const MONO_FONT = "'JetBrains Mono', 'SF Mono', ui-monospace, monospace"
const SANS_FONT = "'Inter', -apple-system, system-ui, sans-serif"

const ACCENTS = {
  lime: { hue: 'oklch(0.88 0.22 128)', solid: '#C8F751', ink: '#0B1504' },
  orange: { hue: 'oklch(0.78 0.17 55)', solid: '#FF9E5E', ink: '#1A0A00' },
  violet: { hue: 'oklch(0.72 0.18 295)', solid: '#B79BFF', ink: '#0E0521' },
  coral: { hue: 'oklch(0.75 0.18 25)', solid: '#FF7A6B', ink: '#1F0505' },
  cyan: { hue: 'oklch(0.82 0.14 210)', solid: '#6BD5F0', ink: '#002028' },
}

function getTheme(mode) {
  if (mode === 'light') {
    return {
      bg: '#F4F2EE',
      surface: '#FFFFFF',
      surface2: '#EAE7E1',
      ink: '#0C0C0C',
      ink2: '#5A5A5A',
      ink3: '#9A9A9A',
      line: 'rgba(0,0,0,0.08)',
      rowBg: '#FFFFFF',
    }
  }
  return {
    bg: '#0A0A0A',
    surface: '#141414',
    surface2: '#1E1E1E',
    ink: '#F4F2EE',
    ink2: 'rgba(244,242,238,0.58)',
    ink3: 'rgba(244,242,238,0.32)',
    line: 'rgba(255,255,255,0.07)',
    rowBg: '#161616',
  }
}

const Icon = {
  close: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  check: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.5 3.5L13 5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  minus: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  plus: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M7 3v8M3 7h8" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  play: (c) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill={c}>
      <path d="M3 2l9 5-9 5V2z" />
    </svg>
  ),
  pause: (c) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill={c}>
      <rect x="3" y="2" width="3" height="10" rx="0.5" />
      <rect x="8" y="2" width="3" height="10" rx="0.5" />
    </svg>
  ),
  reset: (c) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.5 5A5 5 0 102 7.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 2v3h-3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

function TapeScale({ value, step, range, unit, onChange, theme, accent }) {
  const ticks = []
  for (let i = -range; i <= range; i++) {
    ticks.push(value + i * step)
  }

  return (
    <div
      style={{
        position: 'relative',
        height: 80,
        overflow: 'hidden',
        borderRadius: 14,
        background: theme.surface2,
      }}
    >
      {/* Center indicator */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 2,
          background: accent.solid,
          transform: 'translateX(-50%)',
          zIndex: 3,
          borderRadius: 1,
        }}
      />
      {/* Ticks */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {ticks.map((t, i) => {
          const dist = Math.abs(i - range)
          const isMajor = (t % (step * 5)) === 0
          const h = isMajor ? 28 : 16
          return (
            <div
              key={i}
              style={{
                width: 22,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                paddingBottom: 14,
                opacity: 1 - dist * 0.15,
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 10,
                  color: theme.ink2,
                  marginBottom: 4,
                  visibility: isMajor ? 'visible' : 'hidden',
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {t}
              </div>
              <div
                style={{
                  width: 1.5,
                  height: h,
                  background: isMajor ? theme.ink2 : theme.ink3,
                  borderRadius: 1,
                }}
              />
            </div>
          )
        })}
      </div>
      {/* Drag hitbox */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const center = rect.width / 2
          const delta = Math.round((x - center) / 22) * step
          if (delta !== 0) onChange(Math.max(0, value + delta))
        }}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'ew-resize',
          zIndex: 4,
        }}
      />
      {/* Edge fades */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 40,
          background: `linear-gradient(90deg, ${theme.surface2}, transparent)`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 40,
          background: `linear-gradient(-90deg, ${theme.surface2}, transparent)`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  )
}

function EditorialHistory({ theme, accent, completedSets, exercise }) {
  if (!completedSets || completedSets.length === 0) return null

  const sets = completedSets.slice(-3).map(s => ({
    w: s.actualWeight,
    reps: s.reps,
    vol: s.actualWeight * s.reps,
  }))
  const max = Math.max(...sets.map(s => s.vol), 1)

  return (
    <div
      style={{
        background: theme.rowBg,
        borderRadius: 24,
        padding: 20,
        border: `1px solid ${theme.line}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: `1px solid ${theme.line}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: theme.ink3,
            }}
          >
            This session
          </div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 20,
              color: theme.ink,
              marginTop: 2,
              letterSpacing: -0.4,
            }}
          >
            {sets.length} sets logged
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              letterSpacing: 1,
              color: theme.ink3,
              textTransform: 'uppercase',
            }}
          >
            Total vol
          </div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 22,
              color: accent.solid,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {Math.round(sets.reduce((a, s) => a + s.vol, 0))}
            <span style={{ fontSize: 13, opacity: 0.6, marginLeft: 3 }}>lb</span>
          </div>
        </div>
      </div>
      {sets.map((s, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '20px 1fr 50px 60px',
            alignItems: 'center',
            gap: 12,
            padding: '8px 0',
          }}
        >
          <div style={{ fontFamily: MONO_FONT, fontSize: 10, color: theme.ink3 }}>0{i + 1}</div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 16, color: theme.ink, fontFeatureSettings: '"tnum"' }}>
            {s.w} <span style={{ fontSize: 11, color: theme.ink3 }}>lb</span> × {s.reps}
          </div>
          <div
            style={{
              height: 4,
              background: theme.surface2,
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${(s.vol / max) * 100}%`,
                background: accent.solid,
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 12,
              color: theme.ink2,
              textAlign: 'right',
              fontFeatureSettings: '"tnum"',
            }}
          >
            {s.vol} lb
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SynthesisActiveSession({
  workout,
  currentIndex,
  completedSets,
  onLogSet,
  onNext,
  onPrev,
  onFinish,
  theme = 'dark',
  accent = 'orange',
}) {
  const themeObj = getTheme(theme)
  const accentObj = ACCENTS[accent] || ACCENTS.orange

  const exercises = workout?.exercises ?? []
  const exercise = exercises[currentIndex]
  const exerciseCompletedSets = completedSets[exercise?.id] ?? []
  const targetSets = exercise?.sets ?? 4
  const isLastExercise = currentIndex >= exercises.length - 1
  const recommendedWeight = exercise?.targetWeight ?? exercise?.defaultWeight ?? 0
  const recommendedReps = exercise?.reps ?? exercise?.defaultReps ?? 10
  const recommendedRest = exercise?.restSeconds ?? 60

  // Local state for current set being logged
  const [sets, setSets] = useState(
    Array.from({ length: targetSets }, (_, i) => ({
      weight: exerciseCompletedSets[i]?.actualWeight ?? recommendedWeight,
      reps: exerciseCompletedSets[i]?.reps ?? recommendedReps,
      complete: !!exerciseCompletedSets[i],
    }))
  )

  const [currentSetIdx, setCurrentSetIdx] = useState(
    exerciseCompletedSets.length > 0 ? exerciseCompletedSets.length : 0
  )
  const [activeDim, setActiveDim] = useState('weight')

  // Timer state
  const [preset, setPreset] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(
      () => setRemaining((r) => (r > 0 ? r - 1 : 0)),
      1000
    )
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!exercise) return

    const nextSets = Array.from({ length: targetSets }, (_, i) => ({
      weight: exerciseCompletedSets[i]?.actualWeight ?? recommendedWeight,
      reps: exerciseCompletedSets[i]?.reps ?? recommendedReps,
      complete: !!exerciseCompletedSets[i],
    }))

    setSets(nextSets)
    setCurrentSetIdx(Math.min(exerciseCompletedSets.length, Math.max(targetSets - 1, 0)))
    setActiveDim('weight')
    setPreset(recommendedRest)
    setRemaining(recommendedRest)
    setRunning(false)
  }, [exercise?.id, exerciseCompletedSets, recommendedReps, recommendedRest, recommendedWeight, targetSets])

  const timerProgress = remaining / preset
  const currentSet = sets[currentSetIdx] ?? sets[0] ?? { weight: recommendedWeight, reps: recommendedReps, complete: false }
  const progressDone = sets.filter((s) => s.complete).length
  const progressAll = sets.length
  const circ = 2 * Math.PI * 22
  const dashOff = circ * (1 - progressDone / progressAll)
  const allSetsLogged = progressDone >= progressAll && progressAll > 0

  const bump = (field, delta) => {
    if (!sets[currentSetIdx]) return
    const newSets = [...sets]
    newSets[currentSetIdx] = {
      ...newSets[currentSetIdx],
      [field]: Math.max(0, newSets[currentSetIdx][field] + delta),
    }
    setSets(newSets)
  }

  const toggleCurrent = async () => {
    if (!sets[currentSetIdx]) return
    const newSets = [...sets]
    const newComplete = !newSets[currentSetIdx].complete

    newSets[currentSetIdx] = { ...newSets[currentSetIdx], complete: newComplete }
    setSets(newSets)

    // Log the set
    const s = newSets[currentSetIdx]
    await onLogSet({
      exerciseId: exercise.id,
      setNumber: currentSetIdx + 1,
      actualWeight: s.weight,
      reps: s.reps,
      targetWeight: recommendedWeight,
    })

    // Auto-advance to next set
    if (newComplete && currentSetIdx < targetSets - 1) {
      setTimeout(() => setCurrentSetIdx(currentSetIdx + 1), 250)
    }
  }

  if (!exercise) return null

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        background: themeObj.bg,
        color: themeObj.ink,
        padding: '54px 20px calc(env(safe-area-inset-bottom, 0px) + 120px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Header with progress ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onPrev}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            border: 'none',
            background: themeObj.surface2,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon.close(themeObj.ink2)}
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              letterSpacing: 1.2,
              color: themeObj.ink3,
              textTransform: 'uppercase',
            }}
          >
            Exercise {currentIndex + 1} · {exercises.length}
          </div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 22,
              marginTop: 2,
              letterSpacing: -0.5,
              color: themeObj.ink,
            }}
          >
            {exercise.name}
          </div>
        </div>

        {/* Progress ring */}
        <div style={{ position: 'relative', width: 48, height: 48 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="24" cy="24" r="22" fill="none" stroke={themeObj.line} strokeWidth="3" />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke={accentObj.solid}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOff}
              style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(.2,.9,.3,1)' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: MONO_FONT,
              fontSize: 11,
              color: themeObj.ink,
              fontWeight: 600,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {progressDone}/{progressAll}
          </div>
        </div>
      </div>

      {/* Set deck */}
      <div style={{ display: 'flex', gap: 8, padding: '6px 0', overflowX: 'auto' }}>
        {sets.map((st, i) => (
          <button
            key={i}
            onClick={() => setCurrentSetIdx(i)}
            style={{
              flex: `0 0 calc(25% - 6px)`,
              minWidth: 0,
              padding: '10px 8px',
              borderRadius: 14,
              background: i === currentSetIdx ? themeObj.ink : st.complete ? themeObj.surface2 : themeObj.rowBg,
              color: i === currentSetIdx ? themeObj.bg : themeObj.ink,
              border: `1px solid ${i === currentSetIdx ? themeObj.ink : themeObj.line}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s',
              opacity:
                !st.complete && i !== currentSetIdx ? 1 : st.complete && i !== currentSetIdx ? 0.55 : 1,
            }}
          >
            <div style={{ fontFamily: MONO_FONT, fontSize: 9, letterSpacing: 0.8, opacity: 0.6, textTransform: 'uppercase' }}>
              Set {i + 1}
            </div>
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 18,
                letterSpacing: -0.3,
                fontFeatureSettings: '"tnum"',
                textDecoration: st.complete ? 'line-through' : 'none',
                textDecorationThickness: 1,
              }}
            >
              {st.weight}×{st.reps}
            </div>
            {st.complete && (
              <div style={{ width: 5, height: 5, borderRadius: 3, background: accentObj.solid }} />
            )}
          </button>
        ))}
      </div>

      {/* Hero log card */}
      <div
        style={{
          background: themeObj.rowBg,
          borderRadius: 28,
          padding: '24px 22px',
          border: `1px solid ${themeObj.line}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Dual value display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
            background: themeObj.bg,
            borderRadius: 18,
            padding: 4,
            border: `1px solid ${themeObj.line}`,
          }}
        >
          <button
            onClick={() => setActiveDim('weight')}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              background: activeDim === 'weight' ? themeObj.rowBg : 'transparent',
              boxShadow: activeDim === 'weight' ? `0 1px 2px rgba(0,0,0,0.15)` : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                letterSpacing: 1.2,
                color: activeDim === 'weight' ? accentObj.solid : themeObj.ink3,
                textTransform: 'uppercase',
              }}
            >
              Weight · lb
            </div>
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 56,
                fontWeight: 400,
                color: themeObj.ink,
                letterSpacing: -2,
                lineHeight: 1,
                marginTop: 4,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {currentSet.weight}
            </div>
          </button>
          <div style={{ width: 1, background: themeObj.line, margin: '12px 0' }} />
          <button
            onClick={() => setActiveDim('reps')}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              background: activeDim === 'reps' ? themeObj.rowBg : 'transparent',
              boxShadow: activeDim === 'reps' ? `0 1px 2px rgba(0,0,0,0.15)` : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                letterSpacing: 1.2,
                color: activeDim === 'reps' ? accentObj.solid : themeObj.ink3,
                textTransform: 'uppercase',
              }}
            >
              Reps
            </div>
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 56,
                fontWeight: 400,
                color: themeObj.ink,
                letterSpacing: -2,
                lineHeight: 1,
                marginTop: 4,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {currentSet.reps}
            </div>
          </button>
        </div>

        {/* Tape scrubber */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 9,
                letterSpacing: 1,
                color: themeObj.ink3,
                textTransform: 'uppercase',
              }}
            >
              Slide to adjust · {activeDim === 'weight' ? 'tap ±5 lb' : 'tap ±1 rep'}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => bump(activeDim, activeDim === 'weight' ? -5 : -1)}
                style={{
                  width: 28,
                  height: 22,
                  borderRadius: 7,
                  border: 'none',
                  background: themeObj.surface2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {Icon.minus(themeObj.ink2, 10)}
              </button>
              <button
                onClick={() => bump(activeDim, activeDim === 'weight' ? 5 : 1)}
                style={{
                  width: 28,
                  height: 22,
                  borderRadius: 7,
                  border: 'none',
                  background: themeObj.surface2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {Icon.plus(themeObj.ink2, 10)}
              </button>
            </div>
          </div>
          <TapeScale
            value={activeDim === 'weight' ? currentSet.weight : currentSet.reps}
            step={activeDim === 'weight' ? 5 : 1}
            range={activeDim === 'weight' ? 6 : 6}
            unit={activeDim === 'weight' ? 'lb' : 'reps'}
            onChange={(v) => {
              if (!sets[currentSetIdx]) return
              const newSets = [...sets]
              newSets[currentSetIdx] = { ...newSets[currentSetIdx], [activeDim]: v }
              setSets(newSets)
            }}
            theme={themeObj}
            accent={accentObj}
          />
        </div>

        {/* Log button */}
        <button
          onClick={toggleCurrent}
          style={{
            height: 54,
            borderRadius: 27,
            border: 'none',
            cursor: 'pointer',
            background: currentSet.complete ? themeObj.surface2 : accentObj.solid,
            color: currentSet.complete ? themeObj.ink2 : accentObj.ink,
            fontFamily: SANS_FONT,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: -0.2,
          }}
        >
          {currentSet.complete ? 'Mark incomplete' : `Log set ${currentSetIdx + 1}`}
        </button>
      </div>

      {/* Timer */}
      <div
        style={{
          background: running ? accentObj.solid : themeObj.rowBg,
          color: running ? accentObj.ink : themeObj.ink,
          borderRadius: 24,
          padding: running ? 24 : 20,
          border: `1px solid ${running ? accentObj.solid : themeObj.line}`,
          transition: 'all 0.35s cubic-bezier(.2,.9,.3,1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {running && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, rgba(0,0,0,0.08) ${timerProgress * 100}%, transparent ${timerProgress * 100}%)`,
              pointerEvents: 'none',
            }}
          />
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, position: 'relative' }}>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: running ? accentObj.ink : themeObj.ink3,
            }}
          >
            Rest Timer
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              letterSpacing: 1,
              color: running ? accentObj.ink : themeObj.ink3,
              opacity: 0.6,
            }}
          >
            {running ? 'active' : 'ready'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 16, position: 'relative' }}>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: running ? 88 : 68,
              fontWeight: 400,
              letterSpacing: -3,
              lineHeight: 0.9,
              fontFeatureSettings: '"tnum"',
              transition: 'font-size 0.35s',
            }}
          >
            {remaining}
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 400, paddingBottom: 6, opacity: 0.5 }}>
            s
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
            <button
              onClick={() => setRunning(!running)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                border: 'none',
                background: running ? 'rgba(0,0,0,0.15)' : themeObj.ink,
                color: running ? accentObj.ink : themeObj.bg,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {running ? Icon.pause(accentObj.ink) : Icon.play(themeObj.bg)}
            </button>
            <button
              onClick={() => {
                setRemaining(preset)
                setRunning(false)
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                border: 'none',
                background: running ? 'rgba(0,0,0,0.1)' : themeObj.surface2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icon.reset(running ? accentObj.ink : themeObj.ink2)}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, position: 'relative' }}>
          {[30, 60, 90, 120, 180, 300].map((sec) => {
            const selected = sec === preset
            return (
              <button
                key={sec}
                onClick={() => {
                  setPreset(sec)
                  setRemaining(sec)
                  setRunning(false)
                }}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 17,
                  border: 'none',
                  cursor: 'pointer',
                  background: selected ? (running ? 'rgba(0,0,0,0.2)' : themeObj.ink) : running ? 'rgba(0,0,0,0.06)' : themeObj.surface2,
                  color: selected ? (running ? accentObj.ink : themeObj.bg) : running ? accentObj.ink : themeObj.ink2,
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 0.3,
                }}
              >
                {sec}s
              </button>
            )
          })}
        </div>
      </div>

      {/* History */}
      <EditorialHistory theme={themeObj} accent={accentObj} completedSets={exerciseCompletedSets} exercise={exercise} />

      {/* Session navigation */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          position: 'sticky',
          bottom: 0,
          paddingTop: 4,
          marginTop: 'auto',
          background: `linear-gradient(180deg, rgba(10,10,10,0), ${themeObj.bg} 28%)`,
        }}
      >
        {!isLastExercise && (
          <button
            onClick={onNext}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 28,
              border: `1px solid ${allSetsLogged ? accentObj.solid : themeObj.line}`,
              background: allSetsLogged ? accentObj.solid : themeObj.surface2,
              color: allSetsLogged ? accentObj.ink : themeObj.ink,
              fontFamily: SANS_FONT,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: -0.2,
              cursor: 'pointer',
            }}
          >
            {allSetsLogged ? 'Next Exercise' : 'Next Exercise Anyway'}
          </button>
        )}
        {isLastExercise && (
          <button
            onClick={onFinish}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 28,
              border: `1px solid ${allSetsLogged ? accentObj.solid : themeObj.line}`,
              background: allSetsLogged ? accentObj.solid : themeObj.surface2,
              color: allSetsLogged ? accentObj.ink : themeObj.ink,
              fontFamily: SANS_FONT,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: -0.2,
              cursor: 'pointer',
            }}
          >
            {allSetsLogged ? 'Finish Workout' : 'Finish Workout Anyway'}
          </button>
        )}
      </div>
    </div>
  )
}
