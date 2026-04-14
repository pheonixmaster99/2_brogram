import { useEffect, useMemo, useState } from "react"
import WorkoutCard from "./WorkoutCard.jsx"
import { buildPersonalizedProgram, buildProfileStorageKey, getEquipmentLabel } from "../utils/programBuilder.js"

const iconMap = {
    "Push": "fa-dumbbell",
    "Pull": "fa-weight-hanging",
    "Legs": "fa-bolt",
    "Upper": "fa-dumbbell",
    "Lower": "fa-bolt",
    "Full Body": "fa-fire",
    "Conditioning": "fa-heart-pulse",
    "Recovery": "fa-heart-pulse",
}

export default function Grid(props) {
    const { profile } = props
    const [savedWorkouts, setSavedWorkouts] = useState({})
    const [selectedWorkout, setSelectedWorkout] = useState(null)

    const { recommendation, program } = useMemo(() => buildPersonalizedProgram(profile), [profile])
    const storageKey = useMemo(() => buildProfileStorageKey(profile), [profile])

    const completedWorkouts = Object.keys(savedWorkouts).filter((val) => {
        const entry = savedWorkouts[val]
        return entry?.isComplete
    })

    function handleSave(index, data) {
        const newObj = {
            ...savedWorkouts,
            [index]: {
                ...data,
                isComplete: !!data.isComplete || !!savedWorkouts?.[index]?.isComplete,
            },
        }

        setSavedWorkouts(newObj)
        localStorage.setItem(storageKey, JSON.stringify(newObj))
        setSelectedWorkout(null)
    }

    function handleComplete(index, data) {
        handleSave(index, {
            ...data,
            isComplete: true,
        })
    }

    useEffect(() => {
        const savedData = localStorage.getItem(storageKey)

        if (!savedData) {
            setSavedWorkouts({})
            setSelectedWorkout(null)
            return
        }

        try {
            setSavedWorkouts(JSON.parse(savedData))
        } catch {
            setSavedWorkouts({})
        }

        setSelectedWorkout(null)
    }, [storageKey])

    return (
        <>
            <section className="plan-summary card">
                <p className="planner-eyebrow">Your 4-week plan</p>
                <h3>{recommendation.split}</h3>
                <p>
                    This tracker now follows your selected profile: {recommendation.goalLabel.toLowerCase()}, {profile.experience}, {profile.days} training days per week, using {getEquipmentLabel(profile.equipment).toLowerCase()}.
                </p>
            </section>

            <div className="training-plan-grid">
                {program.map((session, workoutIndex) => {
                    const isLocked = workoutIndex === 0 ? false : !completedWorkouts.includes(`${workoutIndex - 1}`)
                    const dayNum = session.dayNumber < 10 ? `0${session.dayNumber}` : session.dayNumber
                    const iconClass = iconMap[session.label] || "fa-dumbbell"
                    const icon = <i className={`fa-solid ${iconClass}`}></i>

                    if (workoutIndex === selectedWorkout) {
                        return (
                            <WorkoutCard
                                dayNum={dayNum}
                                handleComplete={handleComplete}
                                handleSave={handleSave}
                                icon={icon}
                                key={workoutIndex}
                                savedWeights={savedWorkouts?.[workoutIndex]?.weights}
                                trainingPlan={session}
                                type={session.label}
                                weekNumber={session.weekNumber}
                                workoutIndex={workoutIndex}
                            />
                        )
                    }

                    return (
                        <button
                            className={`card plan-card ${isLocked ? "inactive" : ""}`}
                            key={workoutIndex}
                            onClick={() => {
                                if (isLocked) {
                                    return
                                }

                                setSelectedWorkout(workoutIndex)
                            }}
                            type="button"
                        >
                            <div className="plan-card-header">
                                <p>Day {dayNum}</p>
                                {isLocked ? <i className="fa-solid fa-lock"></i> : icon}
                            </div>

                            <div className="plan-card-body">
                                <h4><b>{session.label}</b></h4>
                                <p>Week {session.weekNumber}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </>
    )
}
