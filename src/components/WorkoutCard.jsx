import React, { useState } from "react"
import Modal from "./Modal"
import { exerciseDescriptions } from "../utils"

export default function WorkoutCard(props) {
    const {trainingPlan, workoutIndex, type, dayNum, icon, savedWeights, handleSave, handleComplete, weekNumber} = props

    const { warmup, workout } = trainingPlan || {}
    const [showExerciseDescription, setShowExerciseDescription] = useState(null)
    const [ weights, setWeights ] = useState(savedWeights || {})
    // Some exercises like conditioning work or bodyweight drills do not track load, so we exclude them from completion rules.
    const trackedExercises = workout.filter(({ tracksWeight = true }) => tracksWeight)
    const hasCompletedWeights = trackedExercises.every(({ name }) => {
        const value = weights[name]
        return typeof value === 'string' && value.trim().length > 0
    })

    function handleAddWeight(title, weight) {
        // We key weights by exercise name so the saved data mirrors the visible workout table.
        const newObj = {
            ...weights, 
            [title]:weight
        }
        setWeights(newObj)
    }

    return (
        <div className="workout-container">
            {showExerciseDescription && 
            (<Modal showExerciseDescription={showExerciseDescription} handleCloseModal={() => { 
                setShowExerciseDescription(null)
            }}/>)}
            <div className="workout-card card">
                <div className="plan-card-header">
                    <p>Day {dayNum}</p>
                    <p>Week {weekNumber}</p>
                    {icon}
                </div>

                <div className="plan-card-header">
                    <h2><b>{type} Workout</b></h2>
                </div>
            </div>

            <div className="workout-grid">
                <div className="exercise-name">
                    <h4>Warmup</h4>
                </div>
                <h6>Sets</h6>
                <h6>Reps</h6>
                <h6 className="weight-input">Max Weight</h6>
                {warmup.map((warmupExercise, warmupIndex) => {
                    return (
                        <React.Fragment key={warmupIndex}>
                            <div className="exercise-name">
                                <div className="exercise-copy">
                                    <p>{warmupIndex + 1}. {warmupExercise.name}</p>
                                    {warmupExercise.substitutionNote ? (
                                        <small className="exercise-note">{warmupExercise.substitutionNote}</small>
                                    ) : null}
                                </div>
                                <button onClick={() => {
                                    setShowExerciseDescription({
                                       name:warmupExercise.name,
                                       description: exerciseDescriptions[warmupExercise.name] 
                                    })
                                }}className="help-icon">
                                    <i className="fa-regular fa-circle-question" />
                                </button>
                            </div>
                            <p className="exercise-info">{warmupExercise.sets}</p>
                            <p className="exercise-info">{warmupExercise.reps}</p>
                            <input className="weight-input" placeholder="N/A" disabled/>
                        </React.Fragment>
                    )
                })}
            </div>

            <div className="workout-grid">
                <div className="exercise-name">
                    <h4>Workout</h4>
                </div>
                <h6>Sets</h6>
                <h6>Reps</h6>
                <h6 className="weight-input">Max Weight</h6>
                {workout.map((workoutExercise, wIndex) => {
                    return (
                        <React.Fragment key={wIndex}>
                            <div className="exercise-name">
                                <div className="exercise-copy">
                                    <p>{wIndex + 1}. {workoutExercise.name}</p>
                                    {workoutExercise.substitutionNote ? (
                                        <small className="exercise-note">{workoutExercise.substitutionNote}</small>
                                    ) : null}
                                </div>
                                <button onClick={() => {
                                    setShowExerciseDescription({
                                       name:workoutExercise.name,
                                       description: exerciseDescriptions[workoutExercise.name] 
                                    })
                                }} className="help-icon">
                                    <i className="fa-regular fa-circle-question" />
                                </button>
                            </div>
                            <p className="exercise-info">{workoutExercise.sets}</p>
                            <p className="exercise-info">{workoutExercise.reps}</p>
                            {workoutExercise.tracksWeight === false ? (
                                // Substituted bodyweight/cardio movements intentionally skip the load input.
                                <input className="weight-input" disabled placeholder="N/A" />
                            ) : (
                                <input value={weights[workoutExercise.name] || ''} onChange={(e) => {
                                    handleAddWeight(workoutExercise.name, e.target.value)
                                }} 
                                className="weight-input" placeholder="14"/>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>

            <div className="workout-buttons">
                <button onClick={() =>
                    handleSave(workoutIndex, { weights })
                }>Save & Exit</button>
                <button onClick= {() =>
                    handleComplete(workoutIndex, { weights })
                } disabled={!hasCompletedWeights}
                >Complete</button>

            </div>
        </div>
    )
}
