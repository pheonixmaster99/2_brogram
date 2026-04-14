const goalMeta = {
    muscle: {
        title: "Build muscle",
        focus: "prioritize hypertrophy volume, steady progression, and enough recovery between hard sessions",
        cardio: "Keep cardio light to moderate 1-3 times per week so it supports recovery instead of stealing energy from lifting.",
    },
    fat_loss: {
        title: "Lose fat",
        focus: "keep resistance training consistent so you maintain muscle while increasing weekly activity",
        cardio: "Add 2-4 cardio sessions or extra walking during the week to help create a sustainable calorie deficit.",
    },
    strength: {
        title: "Get stronger",
        focus: "emphasize compound lifts, low-to-moderate rep ranges, and repeat the same movement patterns often enough to improve skill",
        cardio: "Use easy cardio on recovery days so it helps work capacity without making your heavy sessions feel flat.",
    },
    fitness: {
        title: "Improve general fitness",
        focus: "balance strength, muscle, conditioning, and recovery so training stays practical long term",
        cardio: "Mix in 1-3 short conditioning sessions to support heart health and day-to-day energy.",
    },
}

const experienceMeta = {
    beginner: "Keep 1-2 reps in reserve on most sets and focus on learning clean movement patterns before chasing heavy weights.",
    intermediate: "Progress either reps or load each week, but keep your best sets technically consistent.",
    advanced: "Use harder top sets strategically and plan lighter weeks before fatigue catches up with you.",
}

function getDaysLabel(days) {
    return `${days} day${days === 1 ? "" : "s"} per week`
}

export function buildRecommendation({ goal, experience, days }) {
    const parsedDays = Number(days)
    const safeGoal = goalMeta[goal] ? goal : "fitness"
    const safeExperience = experienceMeta[experience] ? experience : "beginner"

    let split = ""
    let headline = ""
    let schedule = []
    let brogramFit = ""

    if (parsedDays <= 2) {
        split = "Full body"
        headline = "Train your whole body each session and focus on the basics."
        schedule = ["Day 1: Full body", "Day 2: Full body", "Rest on the other days"]
        brogramFit = "The built-in Brogram tracker is more volume than most 2-day lifters need, so use it later if your schedule expands."
    } else if (parsedDays === 3) {
        if (safeGoal === "strength" || safeGoal === "fitness" || safeExperience === "beginner") {
            split = "Full body"
            headline = "A 3-day full body split gives you the best mix of repetition, recovery, and simplicity."
            schedule = ["Day 1: Squat + push + pull", "Day 2: Hinge + vertical push + vertical pull", "Day 3: Full body repeat with variations"]
        } else {
            split = "Push / Pull / Legs"
            headline = "A classic 3-day split works well when your main goal is muscle and you like focused sessions."
            schedule = ["Day 1: Push", "Day 2: Pull", "Day 3: Legs"]
        }
        brogramFit = "The 30-workout Brogram tracker can still work here, but you would usually run it as one push, one pull, and one leg workout each week."
    } else if (parsedDays === 4) {
        split = "Upper / Lower"
        headline = "A 4-day upper/lower split is the best all-round recommendation for most people."
        schedule = ["Day 1: Upper", "Day 2: Lower", "Day 3: Rest", "Day 4: Upper", "Day 5: Lower"]
        brogramFit = "Brogram is a 6-day bro split, so a 4-day lifter will usually do better on an upper/lower plan than on the tracker below."
    } else if (parsedDays === 5) {
        if (safeGoal === "fat_loss" || safeGoal === "fitness") {
            split = "Upper / Lower + conditioning"
            headline = "Use four lifting sessions and one conditioning day so training stays balanced."
            schedule = ["Day 1: Upper", "Day 2: Lower", "Day 3: Conditioning or sports", "Day 4: Upper", "Day 5: Lower"]
            brogramFit = "You could still use the Brogram tracker selectively, but it is more specialized than this recommendation."
        } else {
            split = "Push / Pull / Legs + upper/lower bias"
            headline = "Five days is enough for a muscle-focused split with extra volume on your priorities."
            schedule = ["Day 1: Push", "Day 2: Pull", "Day 3: Legs", "Day 4: Upper or Push", "Day 5: Lower or Pull"]
            brogramFit = "If you enjoy bro splits, the tracker below is close to this style and can be adapted by taking two rest days each week."
        }
    } else {
        split = "Push / Pull / Legs x2"
        headline = "A 6-day push/pull/legs split fits best when training is a major priority and recovery is solid."
        schedule = ["Day 1: Push", "Day 2: Pull", "Day 3: Legs", "Day 4: Push", "Day 5: Pull", "Day 6: Legs"]
        brogramFit = "This is the closest match to the 30-workout Brogram tracker below, so the app’s main program fits your schedule well."
    }

    return {
        goalLabel: goalMeta[safeGoal].title,
        availability: getDaysLabel(parsedDays),
        split,
        headline,
        schedule,
        notes: [
            `For ${goalMeta[safeGoal].title.toLowerCase()}, ${goalMeta[safeGoal].focus}.`,
            experienceMeta[safeExperience],
            goalMeta[safeGoal].cardio,
        ],
        brogramFit,
    }
}
