/**
 * Master exercise library
 *
 * category:       'push' | 'pull' | 'legs' | 'core'
 * muscleGroups:   primary muscles targeted
 * equipmentType:  'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'other'
 * sessionTypes:   which session types this exercise appears in
 * defaultSets/Reps/Weight: sensible starting point for a beginner-intermediate
 *                          weight is in lbs; 0 = bodyweight
 */
export const EXERCISES = [

  // ──────────────────────────────────────────────────────────────────
  // PUSH — Chest, Shoulders, Triceps
  // ──────────────────────────────────────────────────────────────────

  // Barbell
  { id: 'barbell-bench-press',         name: 'Barbell Bench Press',          category: 'push', muscleGroups: ['chest','triceps','shoulders'], equipmentType: 'barbell',    sessionTypes: ['push','full-body'], defaultSets: 4, defaultReps: 8,  defaultWeight: 135 },
  { id: 'incline-barbell-bench-press', name: 'Incline Barbell Bench Press',   category: 'push', muscleGroups: ['chest','shoulders'],          equipmentType: 'barbell',    sessionTypes: ['push'],            defaultSets: 4, defaultReps: 8,  defaultWeight: 115 },
  { id: 'decline-barbell-bench-press', name: 'Decline Barbell Bench Press',   category: 'push', muscleGroups: ['chest','triceps'],            equipmentType: 'barbell',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 10, defaultWeight: 125 },
  { id: 'barbell-overhead-press',      name: 'Barbell Overhead Press',        category: 'push', muscleGroups: ['shoulders','triceps'],         equipmentType: 'barbell',    sessionTypes: ['push','full-body'], defaultSets: 4, defaultReps: 6,  defaultWeight: 95  },
  { id: 'close-grip-bench-press',      name: 'Close-Grip Bench Press',        category: 'push', muscleGroups: ['triceps','chest'],             equipmentType: 'barbell',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 10, defaultWeight: 95  },

  // Dumbbell
  { id: 'dumbbell-bench-press',        name: 'Dumbbell Bench Press',          category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'dumbbell',   sessionTypes: ['push','full-body'], defaultSets: 3, defaultReps: 10, defaultWeight: 50  },
  { id: 'incline-dumbbell-press',      name: 'Incline Dumbbell Press',        category: 'push', muscleGroups: ['chest','shoulders'],          equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 10, defaultWeight: 40  },
  { id: 'decline-dumbbell-press',      name: 'Decline Dumbbell Press',        category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 10, defaultWeight: 45  },
  { id: 'dumbbell-fly',                name: 'Dumbbell Fly',                  category: 'push', muscleGroups: ['chest'],                       equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 25  },
  { id: 'incline-dumbbell-fly',        name: 'Incline Dumbbell Fly',          category: 'push', muscleGroups: ['chest','shoulders'],          equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 20  },
  { id: 'dumbbell-shoulder-press',     name: 'Dumbbell Shoulder Press',       category: 'push', muscleGroups: ['shoulders','triceps'],         equipmentType: 'dumbbell',   sessionTypes: ['push','full-body'], defaultSets: 3, defaultReps: 10, defaultWeight: 35  },
  { id: 'arnold-press',                name: 'Arnold Press',                  category: 'push', muscleGroups: ['shoulders','triceps'],         equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 10, defaultWeight: 30  },
  { id: 'dumbbell-front-raise',        name: 'Dumbbell Front Raise',          category: 'push', muscleGroups: ['shoulders'],                   equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 15, defaultWeight: 20  },
  { id: 'dumbbell-lateral-raise',      name: 'Dumbbell Lateral Raise',        category: 'push', muscleGroups: ['shoulders'],                   equipmentType: 'dumbbell',   sessionTypes: ['push'],            defaultSets: 3, defaultReps: 15, defaultWeight: 20  },
  { id: 'plate-front-raise',           name: 'Plate Front Raise',             category: 'push', muscleGroups: ['shoulders'],                   equipmentType: 'other',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 15, defaultWeight: 25  },

  // Machines
  { id: 'chest-press-machine',         name: 'Chest Press Machine',           category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'machine',    sessionTypes: ['push','full-body'], defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'incline-chest-press-machine', name: 'Incline Chest Press Machine',   category: 'push', muscleGroups: ['chest','shoulders'],          equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 80  },
  { id: 'decline-chest-press-machine', name: 'Decline Chest Press Machine',   category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 90  },
  { id: 'pec-deck',                    name: 'Pec Deck (Chest Fly Machine)',   category: 'push', muscleGroups: ['chest'],                       equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 80  },
  { id: 'shoulder-press-machine',      name: 'Shoulder Press Machine',        category: 'push', muscleGroups: ['shoulders','triceps'],         equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 80  },
  { id: 'lateral-raise-machine',       name: 'Lateral Raise Machine',         category: 'push', muscleGroups: ['shoulders'],                   equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 15, defaultWeight: 50  },
  { id: 'seated-dip-machine',          name: 'Seated Dip Machine',            category: 'push', muscleGroups: ['triceps','chest'],             equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 80  },
  { id: 'assisted-dip-machine',        name: 'Assisted Dip Machine',          category: 'push', muscleGroups: ['triceps','chest','shoulders'], equipmentType: 'machine',    sessionTypes: ['push'],            defaultSets: 3, defaultReps: 10, defaultWeight: 70  },

  // Cable
  { id: 'cable-chest-fly-high-low',    name: 'Cable Chest Fly (High to Low)', category: 'push', muscleGroups: ['chest'],                       equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 30  },
  { id: 'cable-chest-fly-low-high',    name: 'Cable Chest Fly (Low to High)', category: 'push', muscleGroups: ['chest'],                       equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 25  },
  { id: 'cable-chest-press',           name: 'Cable Chest Press',             category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 50  },
  { id: 'single-arm-cable-press',      name: 'Single Arm Cable Press',        category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 30  },
  { id: 'cable-lateral-raise',         name: 'Cable Lateral Raise',           category: 'push', muscleGroups: ['shoulders'],                   equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 15, defaultWeight: 15  },
  { id: 'cable-front-raise',           name: 'Cable Front Raise',             category: 'push', muscleGroups: ['shoulders'],                   equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 15, defaultWeight: 20  },
  { id: 'tricep-pushdown-bar',         name: 'Tricep Pushdown (Bar)',          category: 'push', muscleGroups: ['triceps'],                     equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 50  },
  { id: 'tricep-pushdown-rope',        name: 'Tricep Pushdown (Rope)',         category: 'push', muscleGroups: ['triceps'],                     equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 40  },
  { id: 'overhead-cable-tricep-ext',   name: 'Overhead Cable Tricep Extension',category: 'push', muscleGroups: ['triceps'],                    equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 30  },
  { id: 'single-arm-cable-tricep',     name: 'Single Arm Cable Tricep Extension',category:'push',muscleGroups: ['triceps'],                    equipmentType: 'cable',      sessionTypes: ['push'],            defaultSets: 3, defaultReps: 12, defaultWeight: 20  },

  // Bodyweight
  { id: 'push-up',                     name: 'Push-Ups',                      category: 'push', muscleGroups: ['chest','triceps','shoulders'], equipmentType: 'bodyweight', sessionTypes: ['push','full-body','calisthenics'], defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'decline-push-up',             name: 'Decline Push-Ups',              category: 'push', muscleGroups: ['chest','shoulders'],          equipmentType: 'bodyweight', sessionTypes: ['push','calisthenics'], defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'incline-push-up',             name: 'Incline Push-Ups',              category: 'push', muscleGroups: ['chest','triceps'],             equipmentType: 'bodyweight', sessionTypes: ['push','calisthenics'], defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'dips',                        name: 'Dips',                          category: 'push', muscleGroups: ['triceps','chest','shoulders'], equipmentType: 'bodyweight', sessionTypes: ['push','calisthenics'], defaultSets: 3, defaultReps: 10, defaultWeight: 0 },
  { id: 'bench-dips',                  name: 'Bench Dips',                    category: 'push', muscleGroups: ['triceps'],                     equipmentType: 'bodyweight', sessionTypes: ['push','calisthenics'], defaultSets: 3, defaultReps: 12, defaultWeight: 0 },

  // ──────────────────────────────────────────────────────────────────
  // PULL — Back, Biceps, Rear Delts
  // ──────────────────────────────────────────────────────────────────

  // Barbell
  { id: 'barbell-deadlift',            name: 'Barbell Deadlift',              category: 'pull', muscleGroups: ['back','glutes','hamstrings'],  equipmentType: 'barbell',    sessionTypes: ['pull','full-body'], defaultSets: 4, defaultReps: 5,  defaultWeight: 185 },
  { id: 'romanian-deadlift',           name: 'Romanian Deadlift',             category: 'pull', muscleGroups: ['hamstrings','glutes','back'],   equipmentType: 'barbell',    sessionTypes: ['pull','legs'],      defaultSets: 3, defaultReps: 10, defaultWeight: 135 },
  { id: 'barbell-row',                 name: 'Barbell Row',                   category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'barbell',    sessionTypes: ['pull','full-body'], defaultSets: 4, defaultReps: 8,  defaultWeight: 135 },
  { id: 'pendlay-row',                 name: 'Pendlay Row',                   category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'barbell',    sessionTypes: ['pull'],            defaultSets: 4, defaultReps: 6,  defaultWeight: 135 },
  { id: 'barbell-shrugs',              name: 'Barbell Shrugs',                category: 'pull', muscleGroups: ['traps'],                       equipmentType: 'barbell',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 135 },
  { id: 'ez-bar-curl',                 name: 'EZ Bar Curl',                   category: 'pull', muscleGroups: ['biceps'],                      equipmentType: 'barbell',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 65  },
  { id: 'barbell-curl',                name: 'Barbell Curl',                  category: 'pull', muscleGroups: ['biceps'],                      equipmentType: 'barbell',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 65  },

  // Dumbbell
  { id: 'dumbbell-deadlift',           name: 'Dumbbell Deadlift',             category: 'pull', muscleGroups: ['back','glutes','hamstrings'],  equipmentType: 'dumbbell',   sessionTypes: ['pull','full-body'], defaultSets: 3, defaultReps: 10, defaultWeight: 60  },
  { id: 'dumbbell-row',                name: 'Dumbbell Row (Single Arm)',     category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'dumbbell',   sessionTypes: ['pull','full-body'], defaultSets: 3, defaultReps: 10, defaultWeight: 65  },
  { id: 'chest-supported-db-row',      name: 'Chest Supported Dumbbell Row', category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'dumbbell',   sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 50  },
  { id: 'dumbbell-shrugs',             name: 'Dumbbell Shrugs',               category: 'pull', muscleGroups: ['traps'],                       equipmentType: 'dumbbell',   sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 60  },
  { id: 'dumbbell-curl',               name: 'Dumbbell Curl',                 category: 'pull', muscleGroups: ['biceps'],                      equipmentType: 'dumbbell',   sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 30  },
  { id: 'hammer-curl',                 name: 'Hammer Curl',                   category: 'pull', muscleGroups: ['biceps','forearms'],           equipmentType: 'dumbbell',   sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 30  },
  { id: 'incline-dumbbell-curl',       name: 'Incline Dumbbell Curl',         category: 'pull', muscleGroups: ['biceps'],                      equipmentType: 'dumbbell',   sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 25  },
  { id: 'concentration-curl',          name: 'Concentration Curl',            category: 'pull', muscleGroups: ['biceps'],                      equipmentType: 'dumbbell',   sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 25  },

  // Machines
  { id: 'lat-pulldown-machine',        name: 'Lat Pulldown Machine',          category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'machine',    sessionTypes: ['pull','full-body'], defaultSets: 4, defaultReps: 10, defaultWeight: 120 },
  { id: 'assisted-pull-up-machine',    name: 'Assisted Pull-Up Machine',      category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'machine',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 10, defaultWeight: 90  },
  { id: 'seated-row-machine',          name: 'Seated Row Machine',            category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'machine',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'chest-supported-row-machine', name: 'Chest Supported Row Machine',   category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'machine',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 90  },
  { id: 'machine-shrugs',              name: 'Machine Shrugs',                category: 'pull', muscleGroups: ['traps'],                       equipmentType: 'machine',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'reverse-pec-deck',            name: 'Reverse Pec Deck (Rear Delt)',  category: 'pull', muscleGroups: ['shoulders','back'],            equipmentType: 'machine',    sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 15, defaultWeight: 60  },

  // Cable
  { id: 'cable-lat-pulldown-wide',     name: 'Cable Lat Pulldown (Wide Grip)',category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 4, defaultReps: 10, defaultWeight: 120 },
  { id: 'cable-lat-pulldown-close',    name: 'Cable Lat Pulldown (Close Grip)',category:'pull', muscleGroups: ['back','biceps'],               equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 110 },
  { id: 'seated-cable-row',            name: 'Seated Cable Row',              category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'single-arm-cable-row',        name: 'Single Arm Cable Row',          category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 60  },
  { id: 'cable-face-pull',             name: 'Cable Face Pull',               category: 'pull', muscleGroups: ['shoulders','back'],            equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 15, defaultWeight: 40  },
  { id: 'straight-arm-pulldown',       name: 'Straight Arm Pulldown',         category: 'pull', muscleGroups: ['back'],                        equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 50  },
  { id: 'cable-rear-delt-fly',         name: 'Cable Rear Delt Fly',           category: 'pull', muscleGroups: ['shoulders','back'],            equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 15, defaultWeight: 20  },
  { id: 'cable-bicep-curl',            name: 'Cable Bicep Curl',              category: 'pull', muscleGroups: ['biceps'],                      equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 40  },
  { id: 'cable-hammer-curl',           name: 'Cable Hammer Curl',             category: 'pull', muscleGroups: ['biceps','forearms'],           equipmentType: 'cable',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 12, defaultWeight: 35  },

  // Bodyweight
  { id: 'pull-up',                     name: 'Pull-Ups',                      category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'bodyweight', sessionTypes: ['pull','calisthenics','full-body'], defaultSets: 4, defaultReps: 8, defaultWeight: 0 },
  { id: 'chin-up',                     name: 'Chin-Ups',                      category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'bodyweight', sessionTypes: ['pull','calisthenics'], defaultSets: 4, defaultReps: 8, defaultWeight: 0 },
  { id: 'inverted-rows',               name: 'Inverted Rows',                 category: 'pull', muscleGroups: ['back','biceps'],               equipmentType: 'bodyweight', sessionTypes: ['pull','calisthenics'], defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'band-pull-aparts',            name: 'Resistance Band Pull-Aparts',   category: 'pull', muscleGroups: ['shoulders','back'],            equipmentType: 'other',      sessionTypes: ['pull'],            defaultSets: 3, defaultReps: 20, defaultWeight: 0 },

  // ──────────────────────────────────────────────────────────────────
  // LEGS — Quads, Hamstrings, Glutes, Calves
  // ──────────────────────────────────────────────────────────────────

  // Barbell
  { id: 'barbell-back-squat',          name: 'Barbell Back Squat',            category: 'legs', muscleGroups: ['quads','glutes','hamstrings'], equipmentType: 'barbell',    sessionTypes: ['legs','full-body'], defaultSets: 4, defaultReps: 6,  defaultWeight: 185 },
  { id: 'front-squat',                 name: 'Front Squat',                   category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'barbell',    sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 6,  defaultWeight: 135 },
  { id: 'barbell-hip-thrust',          name: 'Barbell Hip Thrust',            category: 'legs', muscleGroups: ['glutes','hamstrings'],         equipmentType: 'barbell',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 135 },
  { id: 'stiff-leg-deadlift',          name: 'Stiff-Leg Deadlift',            category: 'legs', muscleGroups: ['hamstrings','glutes','back'],   equipmentType: 'barbell',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 10, defaultWeight: 135 },
  { id: 'sumo-deadlift',               name: 'Sumo Deadlift',                 category: 'legs', muscleGroups: ['glutes','quads','hamstrings'], equipmentType: 'barbell',    sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 5,  defaultWeight: 185 },

  // Dumbbell
  { id: 'goblet-squat',                name: 'Goblet Squat',                  category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'dumbbell',   sessionTypes: ['legs','full-body'], defaultSets: 3, defaultReps: 12, defaultWeight: 50  },
  { id: 'bulgarian-split-squat',       name: 'Bulgarian Split Squat',         category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'dumbbell',   sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 10, defaultWeight: 40  },
  { id: 'walking-lunges',              name: 'Walking Lunges',                category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'dumbbell',   sessionTypes: ['legs','full-body'], defaultSets: 3, defaultReps: 12, defaultWeight: 40  },
  { id: 'reverse-lunges',              name: 'Reverse Lunges',                category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'dumbbell',   sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 35  },
  { id: 'dumbbell-step-ups',           name: 'Dumbbell Step-Ups',             category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'dumbbell',   sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 35  },
  { id: 'dumbbell-calf-raises',        name: 'Dumbbell Calf Raises',          category: 'legs', muscleGroups: ['calves'],                      equipmentType: 'dumbbell',   sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 15, defaultWeight: 50  },

  // Machines
  { id: 'leg-press-machine',           name: 'Leg Press Machine',             category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'machine',    sessionTypes: ['legs','full-body'], defaultSets: 4, defaultReps: 10, defaultWeight: 270 },
  { id: 'hack-squat-machine',          name: 'Hack Squat Machine',            category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 8,  defaultWeight: 180 },
  { id: 'smith-machine-squat',         name: 'Smith Machine Squat',           category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 8,  defaultWeight: 135 },
  { id: 'leg-extension-machine',       name: 'Leg Extension Machine',         category: 'legs', muscleGroups: ['quads'],                       equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'seated-leg-curl-machine',     name: 'Seated Leg Curl Machine',       category: 'legs', muscleGroups: ['hamstrings'],                  equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'lying-leg-curl-machine',      name: 'Lying Leg Curl Machine',        category: 'legs', muscleGroups: ['hamstrings'],                  equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 90  },
  { id: 'standing-leg-curl-machine',   name: 'Standing Leg Curl Machine',     category: 'legs', muscleGroups: ['hamstrings'],                  equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 70  },
  { id: 'glute-kickback-machine',      name: 'Glute Kickback Machine',        category: 'legs', muscleGroups: ['glutes'],                      equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 15, defaultWeight: 60  },
  { id: 'hip-abduction-machine',       name: 'Hip Abduction Machine',         category: 'legs', muscleGroups: ['glutes'],                      equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 15, defaultWeight: 80  },
  { id: 'hip-adduction-machine',       name: 'Hip Adduction Machine',         category: 'legs', muscleGroups: ['quads'],                       equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 15, defaultWeight: 80  },
  { id: 'seated-calf-raise-machine',   name: 'Seated Calf Raise Machine',     category: 'legs', muscleGroups: ['calves'],                      equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 15, defaultWeight: 90  },
  { id: 'standing-calf-raise-machine', name: 'Standing Calf Raise Machine',   category: 'legs', muscleGroups: ['calves'],                      equipmentType: 'machine',    sessionTypes: ['legs'],            defaultSets: 4, defaultReps: 15, defaultWeight: 180 },

  // Cable
  { id: 'cable-kickbacks',             name: 'Cable Kickbacks',               category: 'legs', muscleGroups: ['glutes'],                      equipmentType: 'cable',      sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 15, defaultWeight: 20  },
  { id: 'cable-pull-through',          name: 'Cable Pull-Through',            category: 'legs', muscleGroups: ['glutes','hamstrings'],         equipmentType: 'cable',      sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 50  },
  { id: 'cable-squat',                 name: 'Cable Squat',                   category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'cable',      sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 60  },
  { id: 'cable-reverse-lunge',         name: 'Cable Reverse Lunge',           category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'cable',      sessionTypes: ['legs'],            defaultSets: 3, defaultReps: 12, defaultWeight: 30  },

  // Bodyweight
  { id: 'bodyweight-squat',            name: 'Bodyweight Squats',             category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'bodyweight', sessionTypes: ['legs','full-body','calisthenics'], defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
  { id: 'jump-squat',                  name: 'Jump Squats',                   category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'bodyweight', sessionTypes: ['legs','calisthenics'],             defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'bw-walking-lunges',           name: 'Walking Lunges (Bodyweight)',   category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'bodyweight', sessionTypes: ['legs','calisthenics'],             defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
  { id: 'step-ups',                    name: 'Step-Ups',                      category: 'legs', muscleGroups: ['quads','glutes'],              equipmentType: 'bodyweight', sessionTypes: ['legs','calisthenics'],             defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'wall-sit',                    name: 'Wall Sit',                      category: 'legs', muscleGroups: ['quads'],                       equipmentType: 'bodyweight', sessionTypes: ['legs','calisthenics'],             defaultSets: 3, defaultReps: 1,  defaultWeight: 0 },
  { id: 'glute-bridges',               name: 'Glute Bridges',                 category: 'legs', muscleGroups: ['glutes','hamstrings'],         equipmentType: 'bodyweight', sessionTypes: ['legs','calisthenics','full-body'], defaultSets: 3, defaultReps: 20, defaultWeight: 0 },

  // ──────────────────────────────────────────────────────────────────
  // CORE
  // ──────────────────────────────────────────────────────────────────
  { id: 'hanging-leg-raises',          name: 'Hanging Leg Raises',            category: 'core', muscleGroups: ['core','hip-flexors'],          equipmentType: 'bodyweight', sessionTypes: ['full-body','calisthenics'], defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'cable-crunch',                name: 'Cable Crunch',                  category: 'core', muscleGroups: ['core'],                        equipmentType: 'cable',      sessionTypes: ['full-body'],       defaultSets: 3, defaultReps: 15, defaultWeight: 50  },
  { id: 'ab-crunch-machine',           name: 'Ab Crunch Machine',             category: 'core', muscleGroups: ['core'],                        equipmentType: 'machine',    sessionTypes: ['full-body'],       defaultSets: 3, defaultReps: 15, defaultWeight: 60  },
  { id: 'russian-twists',              name: 'Russian Twists',                category: 'core', muscleGroups: ['core'],                        equipmentType: 'bodyweight', sessionTypes: ['full-body','calisthenics'], defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
  { id: 'plank',                       name: 'Plank',                         category: 'core', muscleGroups: ['core'],                        equipmentType: 'bodyweight', sessionTypes: ['full-body','calisthenics'], defaultSets: 3, defaultReps: 1,  defaultWeight: 0 },
  { id: 'decline-sit-ups',             name: 'Decline Sit-Ups',               category: 'core', muscleGroups: ['core'],                        equipmentType: 'machine',    sessionTypes: ['full-body'],       defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
]

// ──────────────────────────────────────────────────────────────────
// Equipment types (used for gym setup UI)
// ──────────────────────────────────────────────────────────────────
export const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'bodyweight',
  'other',
]

// ──────────────────────────────────────────────────────────────────
// Session types (workout categories)
// ──────────────────────────────────────────────────────────────────
export const SESSION_TYPES = [
  { id: 'push',         label: 'Push',         emoji: '💪', description: 'Chest, shoulders, triceps' },
  { id: 'pull',         label: 'Pull',         emoji: '🦾', description: 'Back, biceps, rear delts' },
  { id: 'legs',         label: 'Legs',         emoji: '🦵', description: 'Quads, hamstrings, glutes, calves' },
  { id: 'full-body',    label: 'Full Body',    emoji: '🏋️', description: 'All muscle groups' },
  { id: 'deload',       label: 'Deload',       emoji: '🧘', description: 'Light day, recovery focus' },
  { id: 'calisthenics', label: 'Calisthenics', emoji: '🤸', description: 'Bodyweight only' },
]

// ──────────────────────────────────────────────────────────────────
// Lookup helpers
// ──────────────────────────────────────────────────────────────────

export function getExerciseById(id) {
  return EXERCISES.find(e => e.id === id)
}

/**
 * Returns exercises for a given session type, filtered to available equipment.
 * Bodyweight exercises are included only when:
 *   - no equipment filter is set (any gym / null gym), OR
 *   - 'bodyweight' is explicitly in equipmentTypes, OR
 *   - as calisthenics fallback (sessionType === 'calisthenics')
 *
 * This prevents cable-only gyms from being flooded with bodyweight suggestions.
 * The workout generator's selection logic then further de-prioritises BW
 * when non-BW equipment is available.
 */
export function getExercisesForSession(sessionType, equipmentTypes = []) {
  const noFilter = equipmentTypes.length === 0
  const bwAllowed = noFilter ||
    equipmentTypes.includes('bodyweight') ||
    sessionType === 'calisthenics'

  return EXERCISES.filter(e => {
    if (!e.sessionTypes.includes(sessionType)) return false
    if (noFilter) return true
    if (e.equipmentType === 'bodyweight') return bwAllowed
    return equipmentTypes.includes(e.equipmentType)
  })
}

/**
 * Returns exercises that target the same primary muscle group as the given exercise,
 * filtered to available equipment. Used for the swap modal.
 */
export function getSwapCandidates(exercise, equipmentTypes = []) {
  const primaryMuscle = exercise.muscleGroups?.[0]
  return EXERCISES.filter(e => {
    if (e.id === exercise.id) return false
    if (!e.muscleGroups.includes(primaryMuscle)) return false
    if (e.equipmentType === 'bodyweight') return true
    if (equipmentTypes.length === 0) return true
    return equipmentTypes.includes(e.equipmentType)
  })
}

/**
 * Strategic selection for free-tier workout builder.
 * Picks exercises that cover distinct muscle groups and prioritise:
 * 1. Exercises with logged history (continuity)
 * 2. One compound movement per major muscle group
 * 3. 1–2 isolation exercises after
 */
export function selectWorkoutExercises(candidates, historyMap = {}, count = 5, preferredEquipment = []) {
  const hasNonBW = preferredEquipment.length > 0 &&
    preferredEquipment.some(t => t !== 'bodyweight')

  const sorted = [...candidates].sort((a, b) => {
    // 1. History first (continuity matters)
    const aHas = historyMap[a.id] != null ? 1 : 0
    const bHas = historyMap[b.id] != null ? 1 : 0
    if (bHas !== aHas) return bHas - aHas
    // 2. When gym has non-bodyweight equipment, prefer it over BW
    if (hasNonBW) {
      const bwA = a.equipmentType === 'bodyweight' ? 0 : 1
      const bwB = b.equipmentType === 'bodyweight' ? 0 : 1
      if (bwB !== bwA) return bwB - bwA
    }
    // 3. Heavier default = more compound = higher priority
    return b.defaultWeight - a.defaultWeight
  })

  // Pick exercises ensuring muscle group variety
  const selected = []
  const coveredMuscles = new Set()

  for (const ex of sorted) {
    if (selected.length >= count) break
    const primary = ex.muscleGroups[0]
    // Allow at most 2 exercises per primary muscle group
    const already = selected.filter(s => s.muscleGroups[0] === primary).length
    if (already >= 2) continue
    selected.push(ex)
    coveredMuscles.add(primary)
  }

  return selected
}

// ──────────────────────────────────────────────────────────────────
// Known specific machines (used for per-gym machine inventory)
// ──────────────────────────────────────────────────────────────────
export const KNOWN_MACHINES = [
  // Barbell / Free-weight stations
  { id: 'sm-smith-machine',   name: 'Smith Machine',          type: 'barbell',    category: 'Barbell / Free Weights' },
  { id: 'sm-power-rack',      name: 'Power Rack / Squat Rack',type: 'barbell',    category: 'Barbell / Free Weights' },
  { id: 'sm-ez-bar',          name: 'EZ-Bar / Curl Bar',      type: 'barbell',    category: 'Barbell / Free Weights' },
  // Cable
  { id: 'sm-lat-pulldown',       name: 'Lat Pulldown',            type: 'cable', category: 'Cable' },
  { id: 'sm-cable-row',          name: 'Seated Cable Row',        type: 'cable', category: 'Cable' },
  { id: 'sm-cable-crossover',    name: 'Cable Crossover',         type: 'cable', category: 'Cable' },
  { id: 'sm-functional-trainer', name: 'Functional Trainer',      type: 'cable', category: 'Cable' },
  { id: 'sm-tricep-cable',       name: 'Tricep Cable Station',    type: 'cable', category: 'Cable' },
  // Plate-loaded machines
  { id: 'sm-leg-press',       name: 'Leg Press',              type: 'machine', category: 'Plate-Loaded' },
  { id: 'sm-hack-squat',      name: 'Hack Squat Machine',     type: 'machine', category: 'Plate-Loaded' },
  { id: 'sm-chest-press-pl',  name: 'Chest Press Machine',    type: 'machine', category: 'Plate-Loaded' },
  { id: 'sm-shoulder-press-pl', name: 'Shoulder Press Machine', type: 'machine', category: 'Plate-Loaded' },
  // Selectorized machines
  { id: 'sm-leg-extension',   name: 'Leg Extension',          type: 'machine', category: 'Selectorized' },
  { id: 'sm-leg-curl',        name: 'Leg Curl',               type: 'machine', category: 'Selectorized' },
  { id: 'sm-calf-raise',      name: 'Calf Raise Machine',     type: 'machine', category: 'Selectorized' },
  { id: 'sm-hip-abductor',    name: 'Hip Abductor / Adductor',type: 'machine', category: 'Selectorized' },
  { id: 'sm-pec-deck',        name: 'Pec Deck / Chest Fly',   type: 'machine', category: 'Selectorized' },
  { id: 'sm-row-machine',     name: 'Row Machine',            type: 'machine', category: 'Selectorized' },
  { id: 'sm-assisted-pullup', name: 'Assisted Pull-up Machine',type: 'machine',category: 'Selectorized' },
  { id: 'sm-preacher-curl',   name: 'Preacher Curl',          type: 'machine', category: 'Selectorized' },
  { id: 'sm-back-extension',  name: 'Back Extension',         type: 'machine', category: 'Selectorized' },
  { id: 'sm-ab-crunch',       name: 'Ab Crunch Machine',      type: 'machine', category: 'Selectorized' },
  { id: 'sm-glute-kickback',  name: 'Glute Kickback Machine', type: 'machine', category: 'Selectorized' },
  // Calisthenics stations
  { id: 'sm-pull-up-bar',     name: 'Pull-up Bar',            type: 'bodyweight', category: 'Calisthenics' },
  { id: 'sm-dip-station',     name: 'Dip Station',            type: 'bodyweight', category: 'Calisthenics' },
  { id: 'sm-rings',           name: 'Gymnastics Rings',       type: 'bodyweight', category: 'Calisthenics' },
  { id: 'sm-trx',             name: 'TRX / Suspension Trainer',type: 'bodyweight',category: 'Calisthenics' },
  // Free weights / accessories
  { id: 'sm-kettlebell',      name: 'Kettlebells',            type: 'dumbbell', category: 'Free Weights' },
  { id: 'sm-resistance-bands',name: 'Resistance Bands',       type: 'other',    category: 'Accessories' },
]
