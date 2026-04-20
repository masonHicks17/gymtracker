import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'
import { initStats, updateStats } from '../db/queries'
import { useEffect } from 'react'

export function useSettings() {
  const stats = useLiveQuery(() => db.userStats.get(1), [])

  useEffect(() => {
    initStats()
  }, [])

  useEffect(() => {
    if (stats?.accentColor) {
      document.documentElement.style.setProperty('--accent', stats.accentColor)
    }
  }, [stats?.accentColor])

  const setSetting = (key, value) => updateStats({ [key]: value })

  return {
    stats: stats ?? {},
    apiKey: stats?.apiKey ?? '',
    accentColor: stats?.accentColor ?? '#3b82f6',
    goalType: stats?.goalType ?? 'strength',
    setSetting,
    hasApiKey: !!(stats?.apiKey),
  }
}
