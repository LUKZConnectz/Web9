Update README_admin.md: mention Next.js admin page and how to access it.

Added a Next.js page at pages/admin/index.tsx which fetches from the server API endpoints under /api/admin/*.

To test locally:
1. Ensure migrations/schema.sql has been applied to your Supabase project.
2. Set environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY).
3. Install dependencies: npm install @supabase/supabase-js
4. Run dev server: npm run dev
5. Open http://localhost:3000/admin
