# Dashboard & Auth (feature/dashboard-auth)

This branch adds a minimal Next.js-based login (Supabase OAuth - Google) and a protected dashboard page.

What I added:
- lib/supabaseClient.ts — Supabase client wrapper
- pages/login.tsx — simple Google sign-in button
- pages/dashboard/index.tsx — protected dashboard that shows basic stats
- components/Toast.tsx — small toast provider component
- .env.example — environment variables template

How to test locally:
1. Add environment variables to .env.local (see .env.example)
2. Install dependencies: npm install @supabase/supabase-js next react react-dom
3. Run dev: npm run dev
4. Open /login to sign in (Google OAuth must be configured in Supabase)

Note: I kept alert changes minimal in script.js to move alerts to bottom-right and dedupe messages; the repo still uses classic static pages — migrating fully to Next.js will need more adjustments. This PR focuses on adding the auth/dashboard scaffold.
