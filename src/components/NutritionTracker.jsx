import { useEffect, useMemo, useState } from "react"
import { estimateFoodCalories, getFoodOptions, hasUsdaApiKey, searchUsdaFood } from "../utils/nutrition.js"

const defaultCustomFood = {
    name: "",
    serving: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
}

function roundMacro(value) {
    return Math.round(value * 10) / 10
}

export default function NutritionTracker() {
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem("brogram-nutrition")

        if (!savedEntries) {
            return []
        }

        try {
            return JSON.parse(savedEntries)
        } catch {
            return []
        }
    })
    const [customFoods, setCustomFoods] = useState(() => {
        const savedFoods = localStorage.getItem("brogram-custom-foods")

        if (!savedFoods) {
            return {}
        }

        try {
            return JSON.parse(savedFoods)
        } catch {
            return {}
        }
    })
    const [foodName, setFoodName] = useState("")
    const [servings, setServings] = useState(1)
    const [activeEstimate, setActiveEstimate] = useState(null)
    const [lookupStatus, setLookupStatus] = useState("idle")
    const [lookupMessage, setLookupMessage] = useState("")
    const [customFood, setCustomFood] = useState(defaultCustomFood)

    const localEstimate = useMemo(() => estimateFoodCalories(foodName, customFoods), [customFoods, foodName])
    const estimate = activeEstimate || localEstimate
    const foodOptions = useMemo(() => getFoodOptions(customFoods), [customFoods])

    const totals = entries.reduce((sum, entry) => {
        return {
            calories: sum.calories + entry.totalCalories,
            protein: sum.protein + entry.totalProtein,
            carbs: sum.carbs + entry.totalCarbs,
            fats: sum.fats + entry.totalFats,
        }
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 })

    useEffect(() => {
        localStorage.setItem("brogram-nutrition", JSON.stringify(entries))
    }, [entries])

    useEffect(() => {
        localStorage.setItem("brogram-custom-foods", JSON.stringify(customFoods))
    }, [customFoods])

    useEffect(() => {
        setActiveEstimate(null)
        setLookupStatus("idle")
        setLookupMessage("")
    }, [foodName])

    function handleAddEntry() {
        const numericServings = Number(servings)

        if (!estimate || !foodName.trim() || Number.isNaN(numericServings) || numericServings <= 0) {
            return
        }

        setEntries((currentEntries) => [
            {
                id: `${estimate.match}-${Date.now()}`,
                foodName: foodName.trim(),
                matchedFood: estimate.match,
                serving: estimate.serving,
                servings: numericServings,
                source: estimate.source,
                caloriesPerServing: estimate.calories,
                proteinPerServing: estimate.protein,
                carbsPerServing: estimate.carbs,
                fatsPerServing: estimate.fats,
                totalCalories: Math.round(estimate.calories * numericServings),
                totalProtein: roundMacro(estimate.protein * numericServings),
                totalCarbs: roundMacro(estimate.carbs * numericServings),
                totalFats: roundMacro(estimate.fats * numericServings),
            },
            ...currentEntries,
        ])

        setFoodName("")
        setServings(1)
        setActiveEstimate(null)
        setLookupStatus("idle")
        setLookupMessage("")
    }

    function handleRemoveEntry(id) {
        setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== id))
    }

    function handleCustomFoodChange(field, value) {
        setCustomFood((currentFood) => ({
            ...currentFood,
            [field]: value,
        }))
    }

    function handleAddCustomFood() {
        const normalizedName = customFood.name.trim().toLowerCase()

        if (!normalizedName || !customFood.calories) {
            return
        }

        setCustomFoods((currentFoods) => ({
            ...currentFoods,
            [normalizedName]: {
                serving: customFood.serving || "1 serving",
                calories: Number(customFood.calories) || 0,
                protein: Number(customFood.protein) || 0,
                carbs: Number(customFood.carbs) || 0,
                fats: Number(customFood.fats) || 0,
            },
        }))

        setCustomFood(defaultCustomFood)
    }

    async function handleUsdaLookup() {
        if (!foodName.trim()) {
            return
        }

        setLookupStatus("loading")
        setLookupMessage("")

        try {
            const usdaFood = await searchUsdaFood(foodName)

            if (!usdaFood) {
                setLookupStatus("idle")
                setLookupMessage("No USDA food match found for that search.")
                return
            }

            setActiveEstimate(usdaFood)
            setLookupStatus("success")
            setLookupMessage("Using live USDA nutrition data for this food.")
        } catch (error) {
            setLookupStatus("error")
            setLookupMessage(error.message)
        }
    }

    return (
        <section className="nutrition-section card" id="nutrition">
            <div className="nutrition-header">
                <p className="planner-eyebrow">Nutrition</p>
                <h3>Track calories and macros from the foods you enter</h3>
                <p>
                    Use the built-in food list, add your own custom foods, or optionally search live USDA data when an API key is configured.
                </p>
            </div>

            <div className="nutrition-grid">
                <div className="nutrition-form card">
                    <label htmlFor="food-name">Food</label>
                    <input
                        id="food-name"
                        list="food-options"
                        onChange={(event) => setFoodName(event.target.value)}
                        placeholder="Try chicken breast, rice, banana..."
                        value={foodName}
                    />
                    <datalist id="food-options">
                        {foodOptions.map((option) => (
                            <option key={option} value={option} />
                        ))}
                    </datalist>

                    <label htmlFor="servings">Servings</label>
                    <input
                        id="servings"
                        min="0.5"
                        onChange={(event) => setServings(event.target.value)}
                        step="0.5"
                        type="number"
                        value={servings}
                    />

                    <div className="nutrition-actions">
                        <button onClick={handleAddEntry} type="button" disabled={!estimate || !foodName.trim()}>
                            Add food
                        </button>
                        <button
                            className="card-button"
                            disabled={!hasUsdaApiKey() || lookupStatus === "loading" || !foodName.trim()}
                            onClick={handleUsdaLookup}
                            type="button"
                        >
                            {lookupStatus === "loading" ? "Searching USDA..." : "Search USDA"}
                        </button>
                    </div>

                    <div className="nutrition-estimate">
                        {estimate ? (
                            <>
                                <p><b>Matched food:</b> {estimate.match}</p>
                                <p><b>Serving:</b> {estimate.serving}</p>
                                <p><b>Source:</b> {estimate.source}</p>
                                <p><b>Calories:</b> {Math.round(estimate.calories * Number(servings || 0))}</p>
                                <p><b>Protein:</b> {roundMacro(estimate.protein * Number(servings || 0))} g</p>
                                <p><b>Carbs:</b> {roundMacro(estimate.carbs * Number(servings || 0))} g</p>
                                <p><b>Fats:</b> {roundMacro(estimate.fats * Number(servings || 0))} g</p>
                            </>
                        ) : (
                            <p>Enter a food from the list, add your own, or use USDA search to estimate nutrition.</p>
                        )}
                        {lookupMessage ? <p>{lookupMessage}</p> : null}
                        {!hasUsdaApiKey() ? (
                            <p>Add `VITE_USDA_API_KEY` to use live USDA updates.</p>
                        ) : null}
                    </div>
                </div>

                <div className="nutrition-log card">
                    <div className="nutrition-total">
                        <h4>Daily total</h4>
                        <p>{totals.calories} calories</p>
                        <p>{roundMacro(totals.protein)} g protein</p>
                        <p>{roundMacro(totals.carbs)} g carbs</p>
                        <p>{roundMacro(totals.fats)} g fats</p>
                    </div>

                    <div className="nutrition-entries">
                        {entries.length === 0 ? (
                            <p>No foods logged yet.</p>
                        ) : (
                            entries.map((entry) => (
                                <div className="nutrition-entry" key={entry.id}>
                                    <div>
                                        <p><b>{entry.foodName}</b></p>
                                        <p>{entry.servings} serving(s) of {entry.serving}</p>
                                        <p>{entry.totalProtein}P / {entry.totalCarbs}C / {entry.totalFats}F</p>
                                    </div>
                                    <div className="nutrition-entry-actions">
                                        <p>{entry.totalCalories} cal</p>
                                        <p>{entry.source}</p>
                                        <button onClick={() => handleRemoveEntry(entry.id)} type="button">Remove</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="nutrition-custom card">
                <h4>Add a custom food</h4>
                <div className="nutrition-custom-grid">
                    <input
                        onChange={(event) => handleCustomFoodChange("name", event.target.value)}
                        placeholder="Food name"
                        value={customFood.name}
                    />
                    <input
                        onChange={(event) => handleCustomFoodChange("serving", event.target.value)}
                        placeholder="Serving size"
                        value={customFood.serving}
                    />
                    <input
                        min="0"
                        onChange={(event) => handleCustomFoodChange("calories", event.target.value)}
                        placeholder="Calories"
                        type="number"
                        value={customFood.calories}
                    />
                    <input
                        min="0"
                        onChange={(event) => handleCustomFoodChange("protein", event.target.value)}
                        placeholder="Protein (g)"
                        type="number"
                        value={customFood.protein}
                    />
                    <input
                        min="0"
                        onChange={(event) => handleCustomFoodChange("carbs", event.target.value)}
                        placeholder="Carbs (g)"
                        type="number"
                        value={customFood.carbs}
                    />
                    <input
                        min="0"
                        onChange={(event) => handleCustomFoodChange("fats", event.target.value)}
                        placeholder="Fats (g)"
                        type="number"
                        value={customFood.fats}
                    />
                </div>
                <button onClick={handleAddCustomFood} type="button" disabled={!customFood.name.trim() || !customFood.calories}>
                    Save custom food
                </button>
            </div>
        </section>
    )
}
