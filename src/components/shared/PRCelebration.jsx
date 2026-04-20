import React, { useEffect, useState } from 'react'

export default function PRCelebration({ exerciseName, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="pr-pop text-center">
        <div className="text-7xl mb-2">🏆</div>
        <div className="text-3xl font-black text-pr mb-1">NEW PR!</div>
        <div className="text-white/80 text-lg font-semibold">{exerciseName}</div>
      </div>
    </div>
  )
}
