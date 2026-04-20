import Dexie from 'dexie'

export const db = new Dexie('HeavyLiftingDB')

db.version(1).stores({
  gyms:            '++id, name, createdAt',
  exercises:       '++id, name, equipmentType, *muscleGroups',
  workouts:        '++id, gymId, date, type, status',
  sets:            '++id, workoutId, exerciseId, completedAt',
  progressPhotos:  '++id, date',
  userStats:       '++id',
})

// Open with error handling for private browsing
let dbReady = false
let dbError = null

db.open().then(() => {
  dbReady = true
}).catch(err => {
  dbError = err.message
  console.warn('IndexedDB unavailable:', err.message)
})

export { dbReady, dbError }
