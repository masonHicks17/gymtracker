import React, { useState } from 'react'
import Button from '../shared/Button'
import { XPBadge, PRBadge } from '../shared/Badge'

const EASE_OPTIONS = [
  { id: 'too-easy',   label: 'Too Easy',   emoji: '😤', color: 'border-green-500/40 bg-green-500/10 text-green-400' },
  { id: 'just-right', label: 'Just Right', emoji: '💪', color: 'border-accent/40 bg-accent/10 text-accent' },
  { id: 'too-hard',   label: 'Too Hard',   emoji: '😰', color: 'border-red-500/40 bg-red-500/10 text-red-400' },
]

export default function PostSession({ exercises, prs, xpEarned, onSubmit }) {
  const [ratings, setRatings] = useState({})

  const setRating = (exerciseId, ease) => {
    setRatings(prev => ({ ...prev, [exerciseId]: ease }))
  }

  const allRated = exercises?.every(e => ratings[e.id])

  return (
    <div className="flex flex-col gap-5 px-4 pb-safe pt-4">
      {/* Summary header */}
      <div className="bg-surface-2 rounded-2xl p-5 text-center space-y-2">
        <div className="text-4xl">🎉</div>
        <h2 className="text-2xl font-black">Workout Done!</h2>
        <div className="flex justify-center gap-3 flex-wrap">
          {xpEarned > 0 && <XPBadge xp={xpEarned} />}
          {prs?.length > 0 && <PRBadge />}
        </div>
        {prs?.length > 0 && (
          <p className="text-sm text-pr font-semibold">
            🏆 {prs.length} new PR{prs.length > 1 ? 's' : ''}!
          </p>
        )}
      </div>

      {/* Ease ratings */}
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
          How did each exercise feel?
        </h3>
        <div className="space-y-3">
          {exercises?.map(ex => (
            <div key={ex.id} className="bg-surface-2 rounded-2xl p-4">
              <div className="font-semibold mb-3">{ex.name}</div>
              <div className="flex gap-2">
                {EASE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRating(ex.id, opt.id)}
                    className={`flex-1 flex flex-col items-center py-2 rounded-xl border text-xs font-semibold transition-all ${
                      ratings[ex.id] === opt.id
                        ? opt.color
                        : 'border-white/10 text-muted'
                    }`}
                  >
                    <span className="text-lg mb-0.5">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: skip rating */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => onSubmit(ratings)}
          disabled={!allRated}
          fullWidth
          size="lg"
        >
          Save Session
        </Button>
        <button
          onClick={() => onSubmit({})}
          className="text-muted text-sm text-center py-2"
        >
          Skip ratings
        </button>
      </div>
    </div>
  )
}
