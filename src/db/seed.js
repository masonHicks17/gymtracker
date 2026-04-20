/**
 * Seed data for development / testing.
 * Creates multiple gyms with varying equipment and a realistic
 * workout history across several session types.
 *
 * Call seedAll() from the Settings modal (dev only).
 * Re-running is safe — it skips gyms that already exist by name.
 */
import { db } from './schema'

// ── Sample Gyms ────────────────────────────────────────────────────
const SAMPLE_GYMS = [
  {
    name: 'Gold\'s Gym',
    location: 'Main St',
    equipment: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'],
  },
  {
    name: 'Planet Fitness',
    location: 'Downtown',
    equipment: ['dumbbell', 'cable', 'machine', 'bodyweight'],
    // No barbells — good for testing machine/cable fallbacks
  },
  {
    name: 'Home Gym',
    location: 'Home',
    equipment: ['barbell', 'dumbbell', 'bodyweight'],
  },
  {
    name: 'Hotel Gym',
    location: 'Travel',
    equipment: ['dumbbell', 'machine', 'bodyweight'],
  },
  {
    name: 'CrossFit Box',
    location: 'East Side',
    equipment: ['barbell', 'dumbbell', 'bodyweight', 'other'],
  },
]

// ── Sample workout history ─────────────────────────────────────────
// Each entry: { type, daysAgo, exercises: [{ id, sets: [{w, reps, ease}] }] }
const SAMPLE_HISTORY = [
  {
    type: 'push',
    daysAgo: 1,
    exercises: [
      { id: 'barbell-bench-press',    sets: [{ w: 135, reps: 8, ease: 'just-right' }, { w: 145, reps: 7, ease: 'just-right' }, { w: 145, reps: 6, ease: 'too-hard'   }, { w: 135, reps: 8, ease: 'just-right' }] },
      { id: 'incline-dumbbell-press', sets: [{ w: 45,  reps: 10, ease: 'just-right' }, { w: 45, reps: 9, ease: 'just-right' }, { w: 45, reps: 8, ease: 'just-right'  }] },
      { id: 'cable-chest-fly-high-low', sets: [{ w: 25, reps: 12, ease: 'too-easy' }, { w: 30, reps: 12, ease: 'just-right' }, { w: 30, reps: 10, ease: 'just-right' }] },
      { id: 'dumbbell-lateral-raise', sets: [{ w: 20,  reps: 15, ease: 'too-easy'  }, { w: 25, reps: 12, ease: 'just-right' }, { w: 25, reps: 10, ease: 'too-hard'   }] },
      { id: 'tricep-pushdown-rope',   sets: [{ w: 45,  reps: 12, ease: 'just-right' }, { w: 45, reps: 11, ease: 'just-right' }, { w: 45, reps: 10, ease: 'just-right' }] },
    ],
  },
  {
    type: 'pull',
    daysAgo: 3,
    exercises: [
      { id: 'barbell-deadlift',       sets: [{ w: 185, reps: 5, ease: 'just-right' }, { w: 205, reps: 5, ease: 'just-right' }, { w: 225, reps: 4, ease: 'too-hard'   }, { w: 205, reps: 5, ease: 'just-right' }] },
      { id: 'barbell-row',            sets: [{ w: 135, reps: 8, ease: 'just-right' }, { w: 135, reps: 8, ease: 'just-right' }, { w: 145, reps: 6, ease: 'too-hard'   }, { w: 135, reps: 8, ease: 'just-right' }] },
      { id: 'cable-lat-pulldown-wide',sets: [{ w: 120, reps: 10, ease: 'too-easy'  }, { w: 130, reps: 10, ease: 'just-right' }, { w: 130, reps: 9, ease: 'just-right' }] },
      { id: 'seated-cable-row',       sets: [{ w: 100, reps: 12, ease: 'just-right' }, { w: 100, reps: 12, ease: 'just-right' }, { w: 110, reps: 10, ease: 'too-hard'  }] },
      { id: 'dumbbell-curl',          sets: [{ w: 30,  reps: 12, ease: 'just-right' }, { w: 30, reps: 12, ease: 'just-right' }, { w: 35, reps: 10, ease: 'just-right' }] },
    ],
  },
  {
    type: 'legs',
    daysAgo: 5,
    exercises: [
      { id: 'barbell-back-squat',     sets: [{ w: 185, reps: 6, ease: 'just-right' }, { w: 205, reps: 5, ease: 'just-right' }, { w: 215, reps: 4, ease: 'too-hard'   }, { w: 185, reps: 6, ease: 'just-right' }] },
      { id: 'leg-press-machine',      sets: [{ w: 270, reps: 10, ease: 'too-easy'  }, { w: 315, reps: 10, ease: 'just-right' }, { w: 315, reps: 9, ease: 'just-right' }, { w: 315, reps: 8, ease: 'too-hard'  }] },
      { id: 'romanian-deadlift',      sets: [{ w: 135, reps: 10, ease: 'just-right' }, { w: 145, reps: 10, ease: 'just-right' }, { w: 145, reps: 9, ease: 'just-right' }] },
      { id: 'leg-extension-machine',  sets: [{ w: 100, reps: 12, ease: 'just-right' }, { w: 100, reps: 12, ease: 'just-right' }, { w: 110, reps: 10, ease: 'too-hard'  }] },
      { id: 'seated-calf-raise-machine', sets: [{ w: 90, reps: 15, ease: 'too-easy' }, { w: 110, reps: 15, ease: 'just-right' }, { w: 110, reps: 12, ease: 'just-right' }, { w: 110, reps: 12, ease: 'just-right' }] },
    ],
  },
  {
    type: 'push',
    daysAgo: 8,
    exercises: [
      { id: 'barbell-bench-press',    sets: [{ w: 135, reps: 8, ease: 'just-right' }, { w: 135, reps: 7, ease: 'just-right' }, { w: 135, reps: 7, ease: 'just-right' }, { w: 135, reps: 6, ease: 'too-hard'   }] },
      { id: 'incline-barbell-bench-press', sets: [{ w: 115, reps: 8, ease: 'just-right' }, { w: 115, reps: 7, ease: 'just-right' }, { w: 115, reps: 6, ease: 'too-hard' }] },
      { id: 'pec-deck',               sets: [{ w: 80,  reps: 12, ease: 'too-easy'  }, { w: 90, reps: 12, ease: 'just-right' }, { w: 90, reps: 10, ease: 'just-right' }] },
      { id: 'dumbbell-shoulder-press',sets: [{ w: 35,  reps: 10, ease: 'just-right' }, { w: 35, reps: 9, ease: 'just-right'  }, { w: 35, reps: 8, ease: 'too-hard'   }] },
      { id: 'tricep-pushdown-bar',    sets: [{ w: 50,  reps: 12, ease: 'just-right' }, { w: 50, reps: 12, ease: 'just-right' }, { w: 55, reps: 10, ease: 'too-hard'   }] },
    ],
  },
  {
    type: 'pull',
    daysAgo: 10,
    exercises: [
      { id: 'barbell-deadlift',       sets: [{ w: 185, reps: 5, ease: 'just-right' }, { w: 185, reps: 5, ease: 'just-right' }, { w: 205, reps: 4, ease: 'too-hard'   }, { w: 185, reps: 5, ease: 'just-right' }] },
      { id: 'pull-up',                sets: [{ w: 0,   reps: 8, ease: 'just-right' }, { w: 0,   reps: 7, ease: 'just-right' }, { w: 0,   reps: 6, ease: 'too-hard'   }] },
      { id: 'dumbbell-row',           sets: [{ w: 65,  reps: 10, ease: 'just-right' }, { w: 65, reps: 10, ease: 'just-right' }, { w: 70, reps: 8, ease: 'just-right'  }] },
      { id: 'cable-face-pull',        sets: [{ w: 40,  reps: 15, ease: 'just-right' }, { w: 40, reps: 15, ease: 'just-right' }, { w: 45, reps: 12, ease: 'just-right' }] },
      { id: 'hammer-curl',            sets: [{ w: 30,  reps: 12, ease: 'just-right' }, { w: 30, reps: 12, ease: 'just-right' }, { w: 35, reps: 10, ease: 'just-right' }] },
    ],
  },
  {
    type: 'legs',
    daysAgo: 12,
    exercises: [
      { id: 'barbell-back-squat',     sets: [{ w: 175, reps: 6, ease: 'just-right' }, { w: 185, reps: 5, ease: 'just-right' }, { w: 185, reps: 5, ease: 'just-right' }, { w: 185, reps: 4, ease: 'too-hard'   }] },
      { id: 'goblet-squat',           sets: [{ w: 50,  reps: 12, ease: 'too-easy'  }, { w: 55, reps: 12, ease: 'just-right' }, { w: 55, reps: 10, ease: 'just-right' }] },
      { id: 'walking-lunges',         sets: [{ w: 40,  reps: 12, ease: 'just-right' }, { w: 40, reps: 12, ease: 'just-right' }, { w: 40, reps: 10, ease: 'too-hard'   }] },
      { id: 'seated-leg-curl-machine',sets: [{ w: 100, reps: 12, ease: 'just-right' }, { w: 100, reps: 11, ease: 'just-right' }, { w: 100, reps: 10, ease: 'just-right' }] },
      { id: 'standing-calf-raise-machine', sets: [{ w: 180, reps: 15, ease: 'too-easy' }, { w: 200, reps: 15, ease: 'just-right' }, { w: 200, reps: 12, ease: 'just-right' }, { w: 200, reps: 12, ease: 'just-right' }] },
    ],
  },
]

// ── Seed function ──────────────────────────────────────────────────
export async function seedAll() {
  const results = { gyms: 0, workouts: 0, sets: 0, skipped: 0 }

  // 1. Gyms — skip if name already exists
  const existingGyms = await db.gyms.toArray()
  const existingNames = new Set(existingGyms.map(g => g.name))

  for (const gym of SAMPLE_GYMS) {
    if (existingNames.has(gym.name)) {
      results.skipped++
      continue
    }
    await db.gyms.add({ ...gym, createdAt: Date.now() })
    results.gyms++
  }

  // 2. Workout history
  const MS = 86400000
  const now = Date.now()

  for (const session of SAMPLE_HISTORY) {
    const sessionDate = now - session.daysAgo * MS

    // Skip if a workout of the same type on the same day already exists
    const dayStart = sessionDate - (sessionDate % MS)
    const dayEnd = dayStart + MS
    const existing = await db.workouts
      .where('date').between(dayStart, dayEnd)
      .filter(w => w.type === session.type)
      .first()
    if (existing) {
      results.skipped++
      continue
    }

    const workoutId = await db.workouts.add({
      gymId: null,
      date: sessionDate,
      type: session.type,
      exercises: session.exercises.map(e => ({ id: e.id })),
      status: 'complete',
      duration: 3600000 + Math.random() * 1800000, // 60–90 min
    })

    for (const ex of session.exercises) {
      for (let i = 0; i < ex.sets.length; i++) {
        const s = ex.sets[i]
        await db.sets.add({
          workoutId,
          exerciseId: ex.id,
          setNumber: i + 1,
          actualWeight: s.w,
          reps: s.reps,
          targetWeight: s.w,
          ease: s.ease,
          completedAt: sessionDate + i * 120000, // 2 min apart
        })
        results.sets++
      }
    }
    results.workouts++
  }

  // 3. Ensure userStats row exists
  const statsExist = await db.userStats.get(1)
  if (!statsExist) {
    await db.userStats.add({
      id: 1,
      totalXP: 2400,
      streak: 4,
      lastWorkoutDate: now - MS,
      goalType: 'strength',
      accentColor: '#3b82f6',
      apiKey: '',
    })
  } else {
    // Give some XP/streak if currently at zero
    if ((statsExist.totalXP ?? 0) === 0) {
      await db.userStats.update(1, {
        totalXP: 2400,
        streak: 4,
        lastWorkoutDate: now - MS,
      })
    }
  }

  return results
}

export async function clearAll() {
  await db.gyms.clear()
  await db.workouts.clear()
  await db.sets.clear()
  await db.userStats.clear()
}
