import { buildRecommendation } from "../utils/planner.js"

const goals = [
    { value: "muscle", label: "Build muscle" },
    { value: "fat_loss", label: "Lose fat" },
    { value: "strength", label: "Get stronger" },
    { value: "fitness", label: "General fitness" },
]

const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
]

const trainingDays = [2, 3, 4, 5, 6]
const equipmentOptions = [
    { value: "full_gym", label: "Full gym" },
    { value: "dumbbells", label: "Dumbbells and bench" },
    { value: "bodyweight", label: "Bodyweight / home" },
]

export default function Planner(props) {
    const { profile, onProfileChange } = props
    const { goal, experience, days } = profile
    const recommendation = buildRecommendation(profile)

    function updateProfile(changes) {
        onProfileChange({
            ...profile,
            ...changes,
        })
    }

    return (
        <section className="planner-section card" id="planner">
            <div className="planner-copy">
                <p className="planner-eyebrow">Personalized plan</p>
                <h3>Find the best weekly exercise regime for your goal</h3>
                <p>
                    Choose your goal, training experience, and weekly availability to get a practical split you can actually follow.
                </p>
            </div>

            <div className="planner-controls">
                <fieldset className="planner-fieldset">
                    <legend>What is your main goal?</legend>
                    <div className="planner-option-grid">
                        {goals.map((option) => (
                            <label className="planner-option" key={option.value}>
                                <input
                                    checked={goal === option.value}
                                    name="goal"
                                    onChange={() => updateProfile({ goal: option.value })}
                                    type="radio"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="planner-fieldset">
                    <legend>What is your experience level?</legend>
                    <div className="planner-option-grid">
                        {experienceLevels.map((option) => (
                            <label className="planner-option" key={option.value}>
                                <input
                                    checked={experience === option.value}
                                    name="experience"
                                    onChange={() => updateProfile({ experience: option.value })}
                                    type="radio"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="planner-fieldset">
                    <legend>How many days can you train per week?</legend>
                    <div className="planner-days">
                        {trainingDays.map((value) => (
                            <button
                                className={days === value ? "card-button planner-day-button is-active" : "card-button planner-day-button"}
                                key={value}
                                onClick={() => updateProfile({ days: value })}
                                type="button"
                            >
                                {value} days
                            </button>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="planner-fieldset">
                    <legend>What equipment do you have access to?</legend>
                    <div className="planner-option-grid">
                        {equipmentOptions.map((option) => (
                            <label className="planner-option" key={option.value}>
                                <input
                                    checked={profile.equipment === option.value}
                                    name="equipment"
                                    onChange={() => updateProfile({ equipment: option.value })}
                                    type="radio"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </div>

            <div className="planner-results">
                <div className="planner-result-header">
                    <p className="planner-eyebrow">Recommended split</p>
                    <h4>{recommendation.split}</h4>
                    <p>{recommendation.goalLabel} | {recommendation.availability}</p>
                </div>

                <p>{recommendation.headline}</p>

                <div className="planner-columns">
                    <div className="planner-panel">
                        <h5>Weekly schedule</h5>
                        <ul>
                            {recommendation.schedule.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="planner-panel">
                        <h5>Coaching notes</h5>
                        <ul>
                            {recommendation.notes.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="planner-tip">
                    <p><b>How this fits Brogram:</b> {recommendation.brogramFit}</p>
                </div>
            </div>
        </section>
    )
}
