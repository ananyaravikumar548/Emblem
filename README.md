<div align="center">

# ◆ EMBLEM

### AI-Powered Brand Identity Suite

**Describe your business in plain English. Get a complete, consistent brand — in seconds.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## What is EMBLEM?

EMBLEM takes a natural-language business description and converts it into a fully structured **Brand DNA** — colors, typography, tagline, personality, and tone — then deterministically renders that DNA into a complete suite of professional business assets.

> **Core principle:** AI decides *what the brand should look and sound like*. Deterministic code decides *how assets are built*. No LLM is ever asked to generate a complete document or image — AI output is structured JSON only.

### Key differentiator — Consistency Scoring Engine

Every generated asset is audited against the source Brand DNA. A rule-based algorithm produces a **compliance percentage** across three dimensions:

| Dimension | Weight | What it checks |
|---|---|---|
| Color Contrast | 40% | WCAG AA (4.5:1 minimum) for all text/background combos |
| Typography Hierarchy | 35% | Scale ratios, weight contrast, font pairing legibility |
| Logo Safety Zone | 25% | Clear space, minimum size compliance |

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  1. BRAND DNA GENERATOR                                         │
│     Natural language → structured JSON via Gemini API           │
│     Colors · Typography · Tagline · Personality · Rationale     │
│                                                                 │
│  2. VECTOR LOGO ENGINE                                          │
│     40 handcrafted SVG marks across 5 style tokens              │
│     Primary · Stacked · Mark-only · Ink · Reverse variants      │
│                                                                 │
│  3. STATIONERY STUDIO                                           │
│     Business card · Letterhead · Envelope (all SVG)             │
│                                                                 │
│  4. SOCIAL CREATIVE SUITE                                       │
│     Post · Story · Banner formats                               │
│                                                                 │
│  5. CONSISTENCY SCORE                                           │
│     Rule-based audit engine, 0–100 compliance score             │
│                                                                 │
│  6. EXPORT ENGINE                                               │
│     Brand Guidelines PDF · Full ZIP bundle download             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Tailwind CSS | UI, brutalist/editorial aesthetic |
| **State** | React Context API (`BrandContext`) | Single client-side source of truth |
| **Animations** | Framer Motion | Transitions and micro-interactions |
| **Icons** | Lucide React | Open-license icon system |
| **Backend** | Node.js + Express.js | REST API, auth, AI orchestration |
| **Database** | MongoDB + Mongoose | Persistent brand data (Atlas free tier) |
| **Auth** | JWT in `httpOnly` cookie | Secure, XSS-resistant authentication |
| **AI Engine** | Google Gemini API | Structured JSON Brand DNA generation |
| **Logo Engine** | Rule-based SVG composition | 40 vector marks, fully deterministic |
| **PDF Export** | `@react-pdf/renderer` | Client-side Brand Guidelines PDF |
| **ZIP Export** | `JSZip` | All assets bundled in one download |

---

## Architecture

```
REACT FRONTEND (Vercel)
  Landing → Create Form → Generating Screen
        │  POST /api/v1/brand/generate (JWT cookie)
        ▼
NODE.JS / EXPRESS BACKEND (Render / Railway)
  JWT Middleware → Brand Controller → Schema Validator
        │  Prompt                   │  Save record
        ▼                           ▼
  GEMINI API                   MONGODB ATLAS
  Structured JSON ◄────────────── Brand + DNA + Assets
        │
        ▼
FRONTEND STATE (BrandContext)
  Hydrates: colors, fonts, tagline, personality, rationale
  Builds:   SVG logos (rule-based, client-side)
  Runs:     Consistency Audit (client-side, no extra round-trip)
        │
        ▼
WORKSPACE CANVAS
  ├── Logo Suite
  ├── Brand DNA & Score
  ├── Stationery Studio
  └── Brand Guidelines PDF
        │
        ▼
EXPORT ENGINE → .zip / .pdf
```

---

## Project Structure

```
emblem/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, login, logout, me
│   │   └── brandController.js       # Brand CRUD + AI generation
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Brand.js
│   │   ├── BrandDNA.js
│   │   ├── Asset.js
│   │   └── ConsistencyReport.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── brandRoutes.js
│   ├── services/
│   │   ├── geminiService.js         # Gemini API + JSON validation
│   │   ├── vectorLogoService.js     # SVG logo composition engine
│   │   ├── designDirectionService.js # Curated design direction system
│   │   └── consistencyService.js   # Scoring algorithm
│   ├── data/
│   │   └── curatedPalettes.js       # Handcrafted palette library
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/                # AuthModal
│       │   ├── brand/               # ColorSwatch, ConsistencyScore, ExportPanel…
│       │   ├── collateral/          # Preview canvas, filmstrip, toolbar
│       │   ├── export/              # BrandGuidelinesPDF
│       │   └── layout/             # TopNavigation, WorkspaceSidebar, StatusBar
│       ├── context/
│       │   └── BrandContext.jsx     # Global brand state + API calls
│       ├── data/
│       │   └── curatedPalettes.js   # Mirrored palette data for client
│       ├── hooks/
│       │   ├── useBrand.js
│       │   └── useCollateral.js
│       ├── lib/
│       │   ├── vectorEngine.js      # Client-side SVG logo builder
│       │   ├── colorUtils.js        # Contrast ratio, hex utilities
│       │   ├── consistencyAuditor.js # Client-side audit engine
│       │   └── exportEngine.js      # ZIP + SVG download helpers
│       ├── pages/
│       │   ├── Create.jsx           # Brand creation form
│       │   ├── Generating.jsx       # AI generation loading screen
│       │   ├── BrandDNA.jsx         # DNA viewer + design directions
│       │   ├── LogoSuite.jsx        # Logo variants + mark selector
│       │   └── StationerySystem.jsx # Business card, letterhead, envelope
│       └── services/
│           ├── api.js               # Axios instance with credentials
│           ├── authApi.js
│           └── brandApi.js
│
├── .env.example
├── .gitignore
├── Dockerfile
├── DEPLOYMENT.md
└── README.md
```

---

## Data Models

<details>
<summary><strong>User</strong></summary>

```js
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,          // bcrypt, 10 rounds
  createdAt: Date
}
```
</details>

<details>
<summary><strong>Brand</strong></summary>

```js
{
  _id: ObjectId,
  userId: ObjectId,              // ref: 'User'
  companyName: String,
  description: String,           // original free-text input
  industry: String,
  targetAudience: String,
  status: 'draft' | 'generated' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```
</details>

<details>
<summary><strong>BrandDNA</strong></summary>

```js
{
  _id: ObjectId,
  brandId: ObjectId,             // 1:1 with Brand
  personality: [String],         // ["Minimal", "Brutalist", "Modern"]
  coreValues: [{ title, description }],
  voiceTone: [String],
  colors: { primary, secondary, accent, surface },  // hex
  typography: {
    display:  { family, size, weight },
    headline: { family, size, weight },
    body:     { family, size, weight },
    mono:     { family, size, weight }
  },
  tagline: String,
  coreMantra: String,
  visualDirection: String,
  logoStyleToken: 'minimal' | 'tech' | 'luxury' | 'organic' | 'bold',
  logoMarkId: String,
  rationale: { colors, typography, tagline, personality }
}
```
</details>

<details>
<summary><strong>Asset</strong></summary>

```js
{
  _id: ObjectId,
  brandId: ObjectId,
  type: 'logo_primary' | 'logo_mark' | 'logo_mono_light' | 'logo_mono_dark'
      | 'business_card' | 'letterhead' | 'envelope'
      | 'social_post' | 'social_story' | 'social_banner',
  svgOrConfig: Object,
  cloudinaryUrl: String,
  consistencyScore: Number,      // 0–100
  createdAt: Date
}
```
</details>

---

## API Reference

Base path: `/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create account, issue JWT cookie |
| `POST` | `/auth/login` | — | Verify credentials, issue JWT cookie |
| `POST` | `/auth/logout` | ✓ | Clear cookie |
| `GET` | `/auth/me` | ✓ | Return current user |

### Brands

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/brand` | ✓ | Create new brand project |
| `GET` | `/brand` | ✓ | List current user's brands |
| `GET` | `/brand/:id` | ✓ | Get brand + DNA + assets |
| `DELETE` | `/brand/:id` | ✓ | Delete brand (cascades DNA + assets) |
| `POST` | `/brand/:id/generate` | ✓ | Run Gemini generation, store DNA |
| `POST` | `/brand/:id/regenerate` | ✓ | Re-run generation |
| `PATCH` | `/brand/:id/direction` | ✓ | Apply design direction / palette swap |
| `GET` | `/brand/:id/assets` | ✓ | Get all assets for a brand |

---

## Logo Style Tokens

EMBLEM includes **40 handcrafted SVG vector marks** across 5 style categories:

| Token | Style | Example Marks |
|---|---|---|
| `minimal` | Clean, geometric, Bauhaus | `geometric_prism`, `minimal_zen_ring`, `minimal_bauhaus_portal` |
| `tech` | Circuit-inspired, data-driven | `circuit_node`, `quantum_orbit`, `binary_brackets` |
| `luxury` | Refined, high-end editorial | `crown_arch`, `serif_monogram`, `double_ring_crest` |
| `organic` | Nature-inspired, fluid | `spiral_nautilus`, `twin_flora`, `seed_of_life` |
| `bold` | High-impact, dynamic | `lightning_apex`, `chevron_forge`, `vortex_turbine` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier) or local MongoDB
- Google Gemini API key ([get one free](https://ai.google.dev/))

### 1. Clone the repo

```bash
git clone https://github.com/ananyaravikumar548/Emblem.git
cd Emblem
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/emblem_db
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Install dependencies and start:

```bash
npm install
npm run dev       # uses node --watch for hot reload
```

Backend runs on **http://localhost:5001**

### 3. Frontend setup

```bash
cd ../frontend
cp .env.example .env   # if exists, or create manually
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5001/api/v1
```

Install dependencies and start:

```bash
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5001`) |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens (min 32 chars) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | ✅ | Frontend origin for CORS (e.g. `http://localhost:3000`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | ✅ | Backend API base URL |

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions. Quick summary:

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy the /build folder to Vercel
# Set REACT_APP_API_URL to your backend URL
```

### Backend → Render / Railway

1. Connect your GitHub repo
2. Set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all env variables from the table above

### Database → MongoDB Atlas

1. Create a free M0 cluster
2. Create a database user
3. Whitelist `0.0.0.0/0` (or your server IP)
4. Copy the connection string into `MONGODB_URI`

---

## Consistency Score Algorithm

The Consistency Scoring Engine runs **client-side** in `src/lib/consistencyAuditor.js` — no extra API round trip needed since the frontend already holds the Brand DNA in `BrandContext`.

```
overallScore = (colorContrastScore × 0.40)
             + (typographyHierarchyScore × 0.35)
             + (logoSafetyZoneScore × 0.25)
```

Failed checks are returned as human-readable strings, e.g.:
- *"Body text contrast 3.8:1, below 4.5:1 AA minimum"*
- *"Display/body size ratio 1.1:1, below recommended 1.33:1"*

---

## Example Brands to Test

Try these descriptions to see the full system in action:

> **Fintech SaaS** — "We build risk-analysis software for hedge funds. Our clients are institutional investors who value precision, security, and performance above all."

> **Artisan Coffee** — "A specialty roastery sourcing single-origin beans directly from farmers in Ethiopia and Colombia. We sell wholesale to cafés and DTC to enthusiasts."

> **Biotech Startup** — "We're developing CRISPR-based diagnostics for early cancer detection. Our audience is oncologists and hospital procurement teams."

> **Architecture Studio** — "A boutique firm designing sustainable residential spaces in urban environments. We believe good design should be accessible, not just aspirational."

> **Kids EdTech** — "A gamified learning platform teaching coding fundamentals to children aged 8–14 through interactive puzzles and project-based challenges."

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit your changes — `git commit -m "feat: description"`
4. Push to the branch — `git push origin feat/your-feature`
5. Open a Pull Request

Please keep the core architectural principle intact: **AI for strategy (JSON only), deterministic code for rendering**.

---

## License

MIT © 2026 [ananyaravikumar548](https://github.com/ananyaravikumar548)

---

<div align="center">
  <sub>Built with React · Express · MongoDB · Gemini · Tailwind CSS</sub>
</div>
