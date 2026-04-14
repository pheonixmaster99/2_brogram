const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

export const foodDatabase = {
    "apple": { calories: 95, protein: 0.5, carbs: 25, fats: 0.3, serving: "1 medium apple" },
    "banana": { calories: 105, protein: 1.3, carbs: 27, fats: 0.4, serving: "1 medium banana" },
    "eggs": { calories: 140, protein: 12, carbs: 1, fats: 10, serving: "2 large eggs" },
    "chicken breast": { calories: 165, protein: 31, carbs: 0, fats: 3.6, serving: "100 g cooked" },
    "salmon": { calories: 206, protein: 22, carbs: 0, fats: 12, serving: "100 g cooked" },
    "rice": { calories: 206, protein: 4.3, carbs: 45, fats: 0.4, serving: "1 cup cooked" },
    "oats": { calories: 150, protein: 5, carbs: 27, fats: 3, serving: "40 g dry" },
    "greek yogurt": { calories: 120, protein: 17, carbs: 6, fats: 0, serving: "170 g" },
    "milk": { calories: 120, protein: 8, carbs: 12, fats: 5, serving: "1 cup" },
    "protein shake": { calories: 130, protein: 24, carbs: 3, fats: 2, serving: "1 scoop mixed with water" },
    "peanut butter": { calories: 190, protein: 7, carbs: 8, fats: 16, serving: "2 tbsp" },
    "bread": { calories: 80, protein: 3, carbs: 15, fats: 1, serving: "1 slice" },
    "avocado": { calories: 240, protein: 3, carbs: 12, fats: 22, serving: "1 whole avocado" },
    "broccoli": { calories: 55, protein: 3.7, carbs: 11, fats: 0.6, serving: "1 cup cooked" },
    "potato": { calories: 160, protein: 4, carbs: 37, fats: 0.2, serving: "1 medium potato" },
    "pasta": { calories: 220, protein: 8, carbs: 43, fats: 1.3, serving: "1 cup cooked" },
    "beef": { calories: 250, protein: 26, carbs: 0, fats: 15, serving: "100 g cooked" },
    "tofu": { calories: 144, protein: 17, carbs: 3, fats: 9, serving: "100 g" },
    "almonds": { calories: 164, protein: 6, carbs: 6, fats: 14, serving: "28 g" },
    "pizza": { calories: 285, protein: 12, carbs: 36, fats: 10, serving: "1 slice" },
    "burger": { calories: 354, protein: 17, carbs: 29, fats: 18, serving: "1 burger" },
    "fries": { calories: 365, protein: 4, carbs: 48, fats: 17, serving: "1 medium serving" },
    "ice cream": { calories: 207, protein: 3.5, carbs: 24, fats: 11, serving: "1 cup" },
}

function normalizeFoodName(foodName) {
    return foodName.trim().toLowerCase()
}

function buildFoodEntry(match, data, source = "local") {
    return {
        match,
        source,
        calories: data.calories ?? 0,
        protein: data.protein ?? 0,
        carbs: data.carbs ?? 0,
        fats: data.fats ?? 0,
        serving: data.serving ?? "1 serving",
    }
}

function getNutrientValue(nutrients, nutrientName) {
    const nutrient = nutrients.find((item) => item.nutrientName === nutrientName)
    return nutrient?.value ?? 0
}

export function getFoodOptions(customFoods = {}) {
    return [...new Set([...Object.keys(foodDatabase), ...Object.keys(customFoods)])].sort()
}

export function estimateFoodCalories(foodName, customFoods = {}) {
    const normalized = normalizeFoodName(foodName)

    if (!normalized) {
        return null
    }

    if (customFoods[normalized]) {
        return buildFoodEntry(normalized, customFoods[normalized], "custom")
    }

    if (foodDatabase[normalized]) {
        return buildFoodEntry(normalized, foodDatabase[normalized], "local")
    }

    const combinedFoods = {
        ...foodDatabase,
        ...customFoods,
    }

    const partialMatch = Object.entries(combinedFoods).find(([name]) => {
        return name.includes(normalized) || normalized.includes(name)
    })

    if (!partialMatch) {
        return null
    }

    const [match, data] = partialMatch
    const source = customFoods[match] ? "custom" : "local"
    return buildFoodEntry(match, data, source)
}

export function hasUsdaApiKey() {
    return Boolean(import.meta.env.VITE_USDA_API_KEY)
}

export async function searchUsdaFood(foodName) {
    const apiKey = import.meta.env.VITE_USDA_API_KEY
    const query = foodName.trim()

    if (!apiKey || !query) {
        return null
    }

    const response = await fetch(`${USDA_API_URL}?api_key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            pageSize: 1,
        }),
    })

    if (!response.ok) {
        throw new Error("Unable to fetch USDA food data right now.")
    }

    const data = await response.json()
    const [food] = data.foods || []

    if (!food) {
        return null
    }

    return {
        match: food.description?.toLowerCase() || query.toLowerCase(),
        source: "usda",
        serving: food.householdServingFullText || food.servingSizeUnit || "100 g",
        calories: getNutrientValue(food.foodNutrients || [], "Energy"),
        protein: getNutrientValue(food.foodNutrients || [], "Protein"),
        carbs: getNutrientValue(food.foodNutrients || [], "Carbohydrate, by difference"),
        fats: getNutrientValue(food.foodNutrients || [], "Total lipid (fat)"),
    }
}
