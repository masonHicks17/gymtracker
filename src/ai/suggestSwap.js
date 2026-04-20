import { claudeCall } from './client'
import { EXERCISES } from '../data/exercises'

const SYSTEM = `You are a strength coach. Suggest alternative exercises.
Return a JSON array of up to 3 exercise objects with the same schema:
{ "id": "<id>", "name": "<name>", "sets": <n>, "reps": <n>, "targetWeight": <n>, "restSeconds": <n>, "muscleGroups": ["..."], "equipmentType": "<type>" }
Return ONLY the JSON array.`

export async function suggestSwap({ exercise, gym, apiKey }) {
  const availableEquipment = gym?.equipment ?? []
  const alternatives = EXERCISES.filter(e =>
    e.id !== exercise.id &&
    e.muscleGroups.some(m => exercise.muscleGroups?.includes(m)) &&
    (e.equipmentType === 'bodyweight' || availableEquipment.includes(e.equipmentType))
  ).slice(0, 8)

  if (!apiKey || alternatives.length <= 3) {
    return alternatives.slice(0, 3).map(e => ({
      id: e.id, name: e.name, sets: exercise.sets, reps: exercise.reps,
      targetWeight: e.defaultWeight, restSeconds: exercise.restSeconds,
      muscleGroups: e.muscleGroups, equipmentType: e.equipmentType,
    }))
  }

  const userMessage = `Current exercise: ${exercise.name} (targets: ${exercise.muscleGroups?.join(', ')})
Available equipment: ${availableEquipment.join(', ')}
Alternatives from my list: ${alternatives.map(e => `${e.name} (${e.id})`).join(', ')}
Pick 3 best alternatives and set appropriate sets/reps matching the original.`

  try {
    return await claudeCall(SYSTEM, userMessage, apiKey)
  } catch {
    return alternatives.slice(0, 3).map(e => ({
      id: e.id, name: e.name, sets: exercise.sets, reps: exercise.reps,
      targetWeight: e.defaultWeight, restSeconds: exercise.restSeconds,
      muscleGroups: e.muscleGroups, equipmentType: e.equipmentType,
    }))
  }
}
