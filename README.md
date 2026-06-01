<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg" width="60" alt="Tessera Logo" />
  <h1>Tessera</h1>
  <p><strong>A context-aware, AI-driven productivity manager featuring a dynamic, self-healing calendar.</strong></p>

  <p>
    <a href="https://react.dev/">React</a> •
    <a href="https://vitejs.dev/">Vite</a> •
    <a href="https://tailwindcss.com/">Tailwind CSS</a> •
    <a href="https://dndkit.com/">dnd-kit</a> •
    <a href="https://www.framer.com/motion/">Framer Motion</a>
  </p>
</div>

---

## 🧩 The Pitch

**Tessera** replaces static, guilt-inducing "To-Do" lists with a dynamic, self-healing calendar. Inspired by the concept of shifting mosaic tiles to create a perfect image, Tessera learns your working habits and **automatically restructures your day when unexpected disruptions happen.**

## 🚨 The Problem

Traditional calendars and task boards (like Trello) are completely passive. When a task runs 30 minutes over, or an urgent fire-drill meeting pops up, the entire day's schedule shatters. This leads to broken time-blocks, "productivity guilt," and massive cognitive overload as you try to manually repair your schedule.

## ✨ How it Works

Tessera flips the concept of time management from static tracking to active, fluid automation.

1. **Smart Inbox Integration:** Input your tasks categorized by energy level requirements (e.g., Deep Work, Admin, Meetings). 
2. **Interactive Drag-and-Drop:** Seamlessly drag tasks from your Smart Inbox onto your Timeline. The timeline automatically calculates durations and snaps tasks into optimized 15-minute intervals.
3. **The "Self-Healing" Panic Button:** Did a meeting run late? Click the **"Trigger Tessera Shift"** button. The AI instantly reshuffles the remaining tasks for the day, resolves timeline collisions, and gracefully deprioritizes low-impact items into a "Tomorrow" overflow bucket—protecting your deep work time.

## 🚀 Features (Web MVP)

* **Visually Stunning Interface:** A premium, dark-mode-first aesthetic (slate/zinc palette) featuring glassmorphism, crisp typography, and smooth micro-interactions.
* **Fluid Drag-and-Drop:** Powered by `@dnd-kit`, allowing intuitive reordering in the Smart Inbox and precision scheduling directly on the Timeline.
* **Animated State Transitions:** Uses `framer-motion` so that when the AI self-heals your calendar, the schedule blocks organically glide into their new optimal positions.
* **Productivity Analytics:** Built-in dashboard powered by `recharts` to track Focus Scores and visualize the total time the AI saved you from manual rescheduling.

## 💻 Tech Stack

* **Frontend Framework:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS (v4)
* **Animations:** Framer Motion
* **Drag and Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
* **Data Visualization:** Recharts
* **Icons:** Lucide React

## 🛠️ Local Development

Clone the repository and install the dependencies to run the app locally:

```bash
# Clone the repository
git clone https://github.com/fardinfaruqi/tessera.git
cd tessera

# Install dependencies
npm install

# Start the development server
npm run dev
```
Navigate to `http://localhost:5173` in your browser to see the live app.

## 👨‍💻 Author

**Fardin Faruqi**
- GitHub: [@fardinfaruqi](https://github.com/fardinfaruqi)

---

*Built with ❤️ for the ultimate hackathon pitch.*
