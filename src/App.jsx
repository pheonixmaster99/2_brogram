import { useEffect, useState } from "react"
import Layout from "./components/Layout"
import Grid from "./components/Grid"
import Hero from "./components/Hero"
import NutritionTracker from "./components/NutritionTracker"
import Planner from "./components/Planner"

const defaultProfile = {
  goal: "fitness",
  experience: "beginner",
  days: 3,
  equipment: "full_gym",
}

function App() {
  // Load the last-selected planner profile so the app reopens in the same mode the user left it.
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("brogram-profile")

    if (!savedProfile) {
      return defaultProfile
    }

    try {
      return {
        ...defaultProfile,
        ...JSON.parse(savedProfile),
      }
    } catch {
      return defaultProfile
    }
  })

  useEffect(() => {
    // Persisting the profile lets the planner, workout generator, and tracker stay in sync across refreshes.
    localStorage.setItem("brogram-profile", JSON.stringify(profile))
  }, [profile])

  return (
    <Layout>
      <main>
        <Hero/>
        <Planner profile={profile} onProfileChange={setProfile} />
        <Grid profile={profile} />
        <NutritionTracker />
      </main>
    </Layout>
  )
}

export default App
