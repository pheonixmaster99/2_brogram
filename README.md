The 30 Simple Workouts Training Plan | Built with ReactJS & FantaCSS
# 💪 Brogram

**Brogram** is a stylish, interactive workout planning app built with **ReactJS** and **FantaCSS**, designed to help users follow a structured training program with a “bro-positive” vibe. With day-by-day progressive unlocking, local data persistence, and responsive UI, Brogram makes it fun and efficient to stay on track with your Push-Pull-Legs routine.

---

## 🎯 Features

- 🧱 **Grid-Based UI** – Displays a week’s worth of workouts, progressively unlocking each new day.
- 🧠 **Smart State Management** – Saves workout progress and max weights using React state + `localStorage`.
- 📈 **Custom Workout Tracking** – Log max weights, track warmups, and complete workouts.
- 📋 **WorkoutCard Component** – Renders each day’s warm-up and workout exercises.
- 🧰 **Modal Support** – View exercise descriptions on demand with helpful popups.
- 🔒 **Unlock System** – Only allows progression once the previous workout is marked complete.
- 🧠 **Local Persistence** – Data remains available even after page reloads.

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| [ReactJS](https://react.dev) | UI library used to build reusable components |
| [FantaCSS](https://fantacss.com/) | Lightweight, expressive CSS framework |
| FontAwesome | For lock, dumbbell, bolt, and help icons |
| LocalStorage | Client-side data persistence |

---

## 📁 File Structure (Partial)

```bash
src/
├── components/
│   ├── Grid.jsx             # Renders all training day cards
│   ├── WorkoutCard.jsx      # Handles workout UI, input, and logic
│   ├── Modal.jsx            # Popup for exercise descriptions
├── utils/
│   └── index.js             # Contains `workoutProgram` and `exerciseDescriptions`
├── assets/                  # Icons, custom styles, etc.
