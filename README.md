# GATI — Class 9 Physics: Motion AI Teaching System

**GATI** (*Goal-oriented Adaptive Teaching Interface*) is an enterprise-grade, multi-modal AI educational platform built for **Class 9 NCERT / CBSE Physics Chapter: Motion**.

The system moves beyond generic chatbots by integrating **VARK learning modalities**, an **interactive vector AI teacher face** with real-time speech synthesis, **dynamic kinematic simulation sandboxes**, and **automated physics schematic generation** powered by **OpenAI API** and **Gemini API**.

---

## 1. Project Overview & Core Idea

Secondary school physics concepts such as the difference between scalar and vector quantities (*Distance vs. Displacement*), instantaneous vs. average velocity, non-zero distance with zero displacement, and circular acceleration are notoriously challenging when taught through static textbooks alone.

**GATI** addresses this pedagogical gap through an adaptive multi-modal pipeline:

1. **Diagnostic Intellectual Assessment:** A 5-question cognitive evaluation tests how a student naturally processes abstract kinematics (geometric shapes, verbal dialogue, interactive parameter adjustment, or formal algebraic formulas).
2. **Four Unified Learning Modalities:**
   - **Picture-Based (Visual):** High-precision vector SVG schematics (Distance vs. Displacement vector arrows, Velocity-Time graph area integration, Circular Motion centripetal acceleration vectors).
   - **Auditory:** Real-time synchronized vector AI Teacher Face with continuous verbal explanations using the browser Web Speech API.
   - **Kinesthetic (Simulation):** Real-time linear motion simulator where students adjust initial velocity ($u$), acceleration ($a$), and duration ($t$) to watch position and velocity curves plot dynamically.
   - **Structured Notes (Reading):** NCERT-compliant revision notes, formula cheat sheets ($v = u + at$, $s = ut + \frac{1}{2}at^2$, $v^2 - u^2 = 2as$, $v = \frac{2\pi r}{t}$), and step-by-step solved numericals.
3. **Doubt Resolution & Schematic Generation:** Students can submit conceptual questions in natural language. GATI breaks down the question with definitions, SI units, and automatically renders scientific SVG diagrams.
4. **Dual Role Access Control:**
   - **Student Portal:** Personalized curriculum tracking, diagnostic profiling, doubt solving, and simulator experimentation.
   - **Admin Management Console:** Real-time student roster analytics, cognitive modality breakdown, live doubt audit trail, and AI engine model selection (OpenAI `gpt-4o-mini` / `gpt-4o` vs. Gemini `gemini-3.8-flash`).

---

## 2. Tech Stack & Tools Used

### Frontend Architecture
- **Framework:** React 19 (Functional components, custom hooks, deterministic UI state)
- **Language:** TypeScript 5+ (Strict typing across domain models, curriculum structures, and telemetry)
- **Styling & Design System:** Tailwind CSS (Hardcoded, high-contrast engineering dark palette: slate/charcoal `#090d16` with cyan `#0284c7` / `#38bdf8` and emerald `#10b981` indicators; no ephemeral vibe-coding)
- **Icons:** Lucide React (Minimalist functional icons)
- **Speech Synthesis:** Web Speech API (`window.speechSynthesis`) with real-time mouth viseme oscillation and audio rate control
- **Vector Graphics:** Custom inline SVG rendering for scientific diagrams and dynamic $s-t$ / $v-t$ graph curves

### Backend Architecture
- **Runtime:** Node.js + Express
- **TypeScript Runner:** TSX (`tsx server.ts`)
- **Server-Side Integration:** Express middleware integrated with Vite for full-stack SPA development and production static asset serving

### AI & LLM Engine
- **OpenAI API Integration:** Server-side proxy for OpenAI Chat Completions (`gpt-4o-mini`, `gpt-4o`) with structured JSON schema outputs
- **Google GenAI Integration:** `@google/genai` TypeScript SDK using `gemini-3.8-flash` with mandatory `User-Agent: aistudio-build` header
- **Deterministic Core Fallback:** Comprehensive local physics knowledge base ensuring 100% platform uptime even without external API credentials

---

## 3. Role-Based Access Control (RBAC)

GATI features separate authentication workflows for Students and Institutional Administrators:

| Feature / Permission | Student Portal | Admin Console |
| :--- | :---: | :---: |
| NCERT Class 9 Motion Curriculum Modules | Yes | Yes |
| Diagnostic Intellectual Assessment | Yes | View Aggregated Roster |
| Live Kinematic Physics Simulator | Yes | Yes |
| Interactive Doubt Solver | Yes | View Audit Trail & Queries |
| Notes & Formula Directory | Yes | Yes |
| OpenAI / Gemini Model & Temp Config | No | Yes |
| Student Enrolment Telemetry | No | Yes |

### Default Credentials:
- **Student Login:** Enter Name (e.g. `Aarav Sharma`) and Roll ID (`9A-04`).
- **Admin Login:**
  - Username / Email: `admin` or `admin@gati.edu`
  - Password: `admin` or `admin123`

---

## 4. API Endpoints Specification

All external AI requests are processed **server-side** to ensure API keys are never exposed to client bundles:

- `POST /api/auth/login`
  - Validates role credentials (student or admin) and returns session state.
- `POST /api/gemini/chat`
  - Routes doubts and lesson inquiries through OpenAI API (`gpt-4o-mini`) or Gemini API (`gemini-3.8-flash`) with structured output (`speechSummary`, `explanation`, `keyTakeaways`, `diagramSvg`).
- `POST /api/gemini/notes`
  - Compiles NCERT-compliant revision notes and solved numericals tailored to selected learning styles.
- `POST /api/gemini/intellectual-exam`
  - Evaluates answers to the cognitive diagnostic assessment and returns modality percentages.
- `GET /api/admin/metrics`
  - Returns student enrollment roster, recent doubts log, and AI gateway status.
- `POST /api/admin/config`
  - Allows administrators to dynamically switch AI providers, models (`gpt-4o-mini` vs. `gpt-4o`), and sampling temperature.

---

## 5. Getting Started & Development

### Prerequisites
- Node.js >= 18.0.0
- npm or bun

### Environment Variables
Copy `.env.example` to `.env`:
```bash
# Optional OpenAI API Key (used when OpenAI provider is selected)
OPENAI_API_KEY="your-openai-api-key"

# Optional Gemini API Key (used when Gemini provider is selected)
GEMINI_API_KEY="your-gemini-api-key"

# Port (default 3000)
PORT=3000
```

### Installation & Execution
```bash
# Install dependencies
npm install

# Start development server (Full-stack with Vite + Express)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
The application will be accessible at `http://localhost:3000`.

---

## 6. License & NCERT Curriculum Alignment
GATI is aligned with the Class 9 CBSE/NCERT Science curriculum (Chapter 8: Motion), covering rectilinear motion, acceleration, graphical slope derivations, the three equations of motion ($v=u+at$, $s=ut+\frac{1}{2}at^2$, $v^2-u^2=2as$), and uniform circular motion.
