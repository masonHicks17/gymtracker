import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'
import { addGym, updateGym, deleteGym } from '../db/queries'

export function useGyms() {
  const gyms = useLiveQuery(() => db.gyms.toArray(), []) ?? []

  return {
    gyms,
    addGym: (gym) => addGym(gym),
    updateGym: (id, changes) => updateGym(id, changes),
    deleteGym: (id) => deleteGym(id),
  }
}
