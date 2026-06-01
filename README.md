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
  <p>
    <strong>Live demo:</strong>
    <a href="https://tessera-ai-calendar.vercel.app">tessera-ai-calendar.vercel.app</a>
  </p>
</div>

# Project Story

## Inspiration

Tessera was inspired by the way real workdays rarely behave like the tidy plans we make in the morning. A single late meeting, urgent message, or underestimated task can break an entire calendar, leaving people to spend even more energy rebuilding the day by hand. We wanted to turn that moment of stress into something calmer: a productivity manager that treats the schedule like a living mosaic, where each task is a tile that can shift into a better place when the picture changes.

The name **Tessera** comes from the small pieces used to build mosaics. That idea shaped the product: instead of a static to-do list, Tessera helps arrange many small blocks of time into a day that still makes sense after interruptions.

## What it does

Tessera is an AI-driven productivity manager with a dynamic, self-healing calendar. Users can keep unscheduled work in a **Smart Inbox**, categorize tasks by type and priority, and drag them directly onto a visual timeline. Tasks snap into optimized time blocks, making it easier to build a realistic schedule instead of a hopeful one.

When conflicts happen, the **Trigger Tessera Shift** action reorganizes the rest of the day. Tessera resolves overlapping events, shifts flexible work into open spaces, and moves low-priority items into a tomorrow overflow bucket so deep work windows stay protected.

At a high level, Tessera is trying to optimize a day around time, priority, and focus:

$$
\text{Best Schedule} = \arg\max_S \left(\text{Focus}(S) + \text{Priority}(S) - \text{ConflictPenalty}(S)\right)
$$

The app also includes analytics for focus score and time saved, so users can see the value of automated rescheduling instead of only feeling the friction of planning.

## How we built it

We built Tessera as a modern web MVP using **React**, **TypeScript**, and **Vite**. The interface is styled with **Tailwind CSS**, with a dark dashboard layout designed around a timeline, a Smart Inbox, and an analytics view.

The drag-and-drop workflow is powered by **dnd-kit**, which lets users move tasks between the inbox and the timeline. The timeline logic snaps dropped tasks to 15-minute intervals, while the schedule mend engine recalculates task placement when conflicts need to be repaired. We used **Framer Motion** for animated state changes so the schedule feels like it is reorganizing itself rather than abruptly redrawing. For productivity insights, we used **Recharts** to visualize focus score and time saved.

## Challenges we ran into

The hardest part was making calendar repair feel understandable. It is not enough for the app to move tasks around; users need to trust why the schedule changed. That meant designing the mend behavior around clear priorities: preserve deep work when possible, resolve collisions, and only push lower-priority work to tomorrow when the day no longer has enough room.

Another challenge was drag-and-drop scheduling. Converting a visual drop position into an accurate start time required careful mapping between pixels, minutes, and the beginning of the workday. We also had to keep the interface responsive and readable while showing scheduled tasks, pending tasks, completed items, conflict warnings, and overflow work in one cohesive experience.

## Accomplishments that we're proud of

We are proud that Tessera feels like more than a task board. The self-healing calendar gives the product a clear personality: it responds to disruption instead of making the user clean up everything manually.

We are also proud of the interaction design. Dragging tasks from the Smart Inbox into the timeline, seeing them snap into place, and watching the schedule reorganize after a Tessera Shift makes the MVP feel tangible and demo-ready. The analytics panel adds another layer by showing that better scheduling is not only about neat calendars, but also about protecting attention.

## What we learned

We learned that productivity tools are really about reducing cognitive load. A calendar can look organized and still create stress if it does not adapt when reality changes. Building Tessera taught us to think less about storing tasks and more about helping people recover momentum after interruptions.

On the technical side, we learned how important it is to model scheduling data cleanly. Task status, duration, priority, type, start time, and overflow state all need to work together for the UI and the mend engine to stay predictable. We also learned that small interaction details, like snapping to 15-minute intervals and animating schedule changes, make a big difference in whether the product feels trustworthy.

## What's next for Tessera

Next, we want Tessera to become more context-aware. That means connecting it to real calendars, email, and task sources so it can understand commitments automatically instead of relying only on mock data. We also want to improve the scheduling engine with user preferences, energy patterns, deadlines, and smarter tradeoffs between urgent work and deep focus.

Longer term, Tessera could become a personal planning assistant that learns when someone does their best work, protects those windows, and continuously reshapes the day as conditions change.

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
