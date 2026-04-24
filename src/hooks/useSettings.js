import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'
import { initStats, updateStats } from '../db/queries'
import { useEffect } from 'react'

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return null
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

export function useSettings() {
  const stats = useLiveQuery(() => db.userStats.get(1), [])

  useEffect(() => {
    initStats()
  }, [])

  useEffect(() => {
    const color = stats?.accentColor
    if (color) {
      document.documentElement.style.setProperty('--accent', color)
      const rgb = hexToRgb(color)
      if (rgb) {
        document.documentElement.style.setProperty('--accent-rgb', `${rgb.r},${rgb.g},${rgb.b}`)
      }
    }
  }, [stats?.accentColor])

  const setSetting = (key, value) => updateStats({ [key]: value })

  return {
    stats: stats ?? {},
    apiKey: stats?.apiKey ?? '',
    accentColor: stats?.accentColor ?? '#FF9E5E',
    goalType: stats?.goalType ?? 'strength',
    setSetting,
    hasApiKey: !!(stats?.apiKey),
  }
}
