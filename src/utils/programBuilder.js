import { workoutProgram } from "./index.js"
import { buildRecommendation } from "./planner.js"

// The original 30-day Brogram data acts as the exercise pool for every personalized split.
const pushDays = Object.values(workoutProgram).filter((_, index) => index % 3 === 0)
const pullDays = Object.values(workoutProgram).filter((_, index) => index % 3 === 1)
const legDays = Object.values(workoutProgram).filter((_, index) => index % 3 === 2)

const equipmentProfiles = {
    full_gym: "Full gym",
    dumbbells: "Dumbbells and bench",
    bodyweight: "Bodyweight / home",
}

const exerciseSubstitutions = {
    "Barbell bench press": {
        dumbbells: "Incline dumbbell press",
        bodyweight: "Pushups",
    },
    "Incline dumbbell press": {
        bodyweight: "Pushups",
    },
    "Dumbbell chest flies": {
        bodyweight: "Pushups",
    },
    "Cable rope pushdown": {
        dumbbells: "Dumbbell skull crushers",
        bodyweight: "Pushups",
    },
    "Unilateral cable pushdown": {
        dumbbells: "Dumbbell skull crushers",
        bodyweight: "Pushups",
    },
    "Cable crossover press": {
        dumbbells: "Dumbbell chest flies",
        bodyweight: "Pushups",
    },
    "Cable chest flies": {
        dumbbells: "Dumbbell chest flies",
        bodyweight: "Pushups",
    },
    "Lat pull down": {
        dumbbells: "Unilateral dumbbell row",
        bodyweight: "Wall bodyweight rows",
    },
    "Cable row": {
        dumbbells: "Chest supported dumbbell row",
        bodyweight: "Wall bodyweight rows",
    },
    "Cable bar shrugs": {
        dumbbells: "Alternating dumbbell curl",
        bodyweight: "leaning rear delt holds",
    },
    "Overhand cable curl": {
        dumbbells: "Hammer grip dumbbell curl",
        bodyweight: "Bodyweight step ups",
    },
    "Barbell squat": {
        dumbbells: "Goblet squat",
        bodyweight: "Bodyweight squats",
    },
    "Leg press": {
        dumbbells: "Goblet squat",
        bodyweight: "Bodyweight squats",
    },
    "Hip thrust": {
        bodyweight: "Glute bridges",
    },
    "Hamstring curl": {
        dumbbells: "Romanian deadlifts",
        bodyweight: "Bodyweight RDLs",
    },
    "Leg press calf raises": {
        dumbbells: "Calf raises",
        bodyweight: "Bodyweight step ups",
    },
    "Walking lunges": {
        bodyweight: "Bodyweight step ups",
    },
    "Leg extension": {
        dumbbells: "Goblet squat",
        bodyweight: "Bodyweight squats",
    },
    "Good girls / bad girls": {
        dumbbells: "Bulgarian split squat",
        bodyweight: "Bodyweight step ups",
    },
    "Brisk treadmill walk": {
        bodyweight: "March in place",
    },
    "Bike intervals": {
        bodyweight: "High knees",
    },
}

const substitutionMetadata = {
    "March in place": { sets: 1, reps: "20 min", tracksWeight: false },
    "High knees": { sets: 6, reps: "30 sec hard / 60 sec easy", tracksWeight: false },
    "Pushups": { tracksWeight: false },
    "Wall bodyweight rows": { tracksWeight: false },
    "Bodyweight squats": { tracksWeight: false },
    "Bodyweight RDLs": { tracksWeight: false },
    "Glute bridges": { tracksWeight: false },
    "Bodyweight step ups": { sets: 3, reps: 15, tracksWeight: false },
    "Dead bug": { tracksWeight: false },
    "leaning rear delt holds": { tracksWeight: false },
}

const conditioningWorkout = {
    label: "Conditioning",
    warmup: [
        { name: "Around the worlds", sets: 2, reps: 15, tracksWeight: false },
        { name: "Glute bridges", sets: 2, reps: 20, tracksWeight: false },
    ],
    workout: [
        { name: "Brisk treadmill walk", sets: 1, reps: "20 min", tracksWeight: false },
        { name: "Bike intervals", sets: 6, reps: "30 sec hard / 60 sec easy", tracksWeight: false },
        { name: "Bodyweight step ups", sets: 3, reps: 15, tracksWeight: false },
        { name: "Dead bug", sets: 3, reps: 12, tracksWeight: false },
    ],
}

function pickDay(days, index) {
    return days[index % days.length]
}

function mergeUniqueExercises(exercises) {
    const seen = new Set()

    return exercises.filter((exercise) => {
        if (seen.has(exercise.name)) {
            return false
        }

        seen.add(exercise.name)
        return true
    })
}

function resolveExercise(exercise, equipment) {
    if (equipment === "full_gym") {
        return exercise
    }

    const replacementName = exerciseSubstitutions[exercise.name]?.[equipment]

    if (!replacementName) {
        return {
            ...exercise,
            ...substitutionMetadata[exercise.name],
        }
    }

    return {
        ...exercise,
        name: replacementName,
        substitutionNote: `${exercise.name} was swapped to ${replacementName} for ${getEquipmentLabel(equipment).toLowerCase()}.`,
        ...substitutionMetadata[replacementName],
    }
}

function adaptWorkout(workout, equipment) {
    // We resolve swaps first, then remove duplicates in case two exercises collapse into the same fallback move.
    return {
        ...workout,
        warmup: mergeUniqueExercises(workout.warmup.map((exercise) => resolveExercise(exercise, equipment))),
        workout: mergeUniqueExercises(workout.workout.map((exercise) => resolveExercise(exercise, equipment))),
    }
}

function buildUpperWorkout(index) {
    const pushDay = pickDay(pushDays, index)
    const pullDay = pickDay(pullDays, index)

    return {
        label: "Upper",
        warmup: mergeUniqueExercises([
            pushDay.warmup[0],
            pullDay.warmup[0],
        ]),
        workout: mergeUniqueExercises([
            pushDay.workout[0],
            pullDay.workout[0],
            pushDay.workout[1],
            pullDay.workout[1],
            pullDay.workout[3],
            pushDay.workout[3],
        ]),
    }
}

function buildLowerWorkout(index) {
    const legDay = pickDay(legDays, index)
    const alternateLegDay = pickDay(legDays, index + 1)

    return {
        label: "Lower",
        warmup: mergeUniqueExercises([
            legDay.warmup[0],
            legDay.warmup[1],
        ]),
        workout: mergeUniqueExercises([
            legDay.workout[0],
            legDay.workout[1],
            alternateLegDay.workout[2],
            legDay.workout[3],
            alternateLegDay.workout[4],
        ]),
    }
}

function buildFullBodyWorkout(index) {
    const pushDay = pickDay(pushDays, index)
    const pullDay = pickDay(pullDays, index)
    const legDay = pickDay(legDays, index)

    return {
        label: "Full Body",
        warmup: mergeUniqueExercises([
            pushDay.warmup[0],
            pullDay.warmup[0],
            legDay.warmup[0],
        ]),
        workout: mergeUniqueExercises([
            legDay.workout[0],
            pushDay.workout[0],
            pullDay.workout[0],
            legDay.workout[2],
            pushDay.workout[3],
            pullDay.workout[3],
        ]),
    }
}

function buildPushPullLegsWorkout(sessionLabel, index) {
    const sourceDays = sessionLabel === "Push" ? pushDays : sessionLabel === "Pull" ? pullDays : legDays

    return {
        ...pickDay(sourceDays, index),
        label: sessionLabel,
    }
}

function normalizeSessionLabel(rawLabel, goal) {
    if (rawLabel.includes("Full body")) {
        return "Full Body"
    }

    if (rawLabel.includes("Conditioning")) {
        return goal === "strength" ? "Recovery" : "Conditioning"
    }

    if (rawLabel.includes("Upper")) {
        return "Upper"
    }

    if (rawLabel.includes("Lower")) {
        return "Lower"
    }

    if (rawLabel.includes("Push")) {
        return "Push"
    }

    if (rawLabel.includes("Pull")) {
        return "Pull"
    }

    if (rawLabel.includes("Legs")) {
        return "Legs"
    }

    return "Full Body"
}

function buildWorkoutForLabel(label, index) {
    if (label === "Upper") {
        return buildUpperWorkout(index)
    }

    if (label === "Lower") {
        return buildLowerWorkout(index)
    }

    if (label === "Conditioning" || label === "Recovery") {
        return {
            ...conditioningWorkout,
            label,
        }
    }

    if (label === "Full Body") {
        return buildFullBodyWorkout(index)
    }

    return buildPushPullLegsWorkout(label, index)
}

export function getEquipmentLabel(equipment) {
    return equipmentProfiles[equipment] || equipmentProfiles.full_gym
}

export function buildProfileStorageKey(profile) {
    // Each planner profile gets its own saved-progress bucket so users can switch plans without overwriting history.
    return `brogram:${profile.goal}:${profile.experience}:${profile.days}:${profile.equipment}`
}

export function buildPersonalizedProgram(profile) {
    const recommendation = buildRecommendation(profile)
    const trainingDays = recommendation.schedule
        .filter((item) => item.startsWith("Day "))
        .map((item) => item.split(": ")[1])

    const weeks = 4
    const program = []

    // Repeat the chosen weekly structure across 4 weeks while preserving per-session variation from the source pool.
    for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
        trainingDays.forEach((session, sessionIndex) => {
            const normalizedLabel = normalizeSessionLabel(session, profile.goal)
            const workoutIndex = weekIndex * trainingDays.length + sessionIndex
            const workout = adaptWorkout(buildWorkoutForLabel(normalizedLabel, workoutIndex), profile.equipment)

            program.push({
                ...workout,
                dayNumber: workoutIndex + 1,
                weekNumber: weekIndex + 1,
            })
        })
    }

    return {
        recommendation,
        program,
    }
}
