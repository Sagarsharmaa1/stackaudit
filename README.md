# StackAudit

A production-ready React web app where developers drop their `package.json` and instantly get a beautiful visual audit report of their dependencies.

## Features
- **Client-Side Processing**: No backend required. All npm data is fetched directly from public APIs.
- **Visual Audits**: Generates a dependency health score based on outdated packages, vulnerabilities, and bundle sizes.
- **Bundle Breakdown**: Integrates with BundlePhobia to highlight heavy packages and suggest lighter alternatives.
- **Shareable Reports**: Encodes reports into the URL hash, allowing instant sharing without a database.
- **PDF Export**: Generate clean, print-friendly reports instantly.

## Tech Stack
- React 19 (Vite)
- Tailwind CSS v4
- shadcn/ui & RSuite
- GSAP for Animations
- Recharts
- Vercel for deployment

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.