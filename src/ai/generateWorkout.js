import { claudeCall } from './client'

const SYSTEM = `You are a strength and conditioning coach. Generate a workout plan as a JSON array.

Each exercise object must follow this exact schema:
{
  "id": "<exercise_id_from_list>",
  "name": "<exercise name>",
  "sets": <number>,
  "reps": <number>,
  "targetWeight": <number in lbs, 0 for bodyweight>,
  "restSeconds": <number, typically 60-180>,
  "muscleGroups": ["<group>"],
  "equipmentType": "<type>"
}

Return ONLY a JSON array, no markdown, no explanation.`

export async function generateWorkout({ gym, sessionType, apiKey, goalType, exercisesWithHistory }) {
  const equipmentList = gym?.equipment?.join(', ') || 'basic gym equipment'

  const historyLines = exercisesWithHistory
    .slice(0, 15)
    .map(e => `  - ${e.name} (id: ${e.id}): last=${e.lastWeight ?? 'none'} lbs, ease=${e.ease ?? 'none'}, recommended=${e.recommended} lbs`)
    .join('\n')

  const userMessage = `Generate a ${sessionType} workout.

Goal: ${goalType} (strength/mass/toning)
Available equipment: ${equipmentList}
Session type: ${sessionType}
Number of exercises: ${sessionType === 'full-body' ? 6 : 5}

Exercise history and recommendations:
${historyLines}

Use the exercise ids from the list above where possible. Adjust sets/reps/weight for the goal.
For ${goalType}: ${goalType === 'strength' ? 'heavy weight, 3-5 reps, 4-5 sets' : goalType === 'mass' ? 'moderate weight, 8-12 reps, 3-4 sets' : 'lighter weight, 12-15 reps, 3 sets'}.`

  return claudeCall(SYSTEM, userMessage, apiKey)
}
