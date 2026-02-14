# ELD Trip Planner — Frontend

A Next.js frontend for the ELD Trip Planner. Drivers enter current location, pickup, dropoff, and cycle hours — the app calculates the route, generates HOS-compliant log sheets, and displays a trip summary with timeline.

## Tech Stack

- **Next.js 16** — React framework (App Router)
- **React 19** — UI library
- **Redux Toolkit** — State management
- **Tailwind CSS 4** — Styling
- **shadcn/ui** — UI components (Card, Badge, Button, Input, Progress, etc.)
- **Leaflet / React-Leaflet** — Interactive route map
- **Axios** — HTTP client

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

1. **Clone the repo**

```bash
git clone <your-repo-url>
cd react
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_URL=https://danjo-trip-planner.onrender.com
```

4. **Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**

3. Import your GitHub repository

4. In the project settings, add the environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://danjo-trip-planner.onrender.com`

5. Click **Deploy** — Vercel auto-detects Next.js, no extra config needed

6. After deploy, Vercel gives you a live URL (e.g. `your-app.vercel.app`)
