# README_admin.md

Admin backend (MVP) — feature/admin-backend

This branch provides a minimal admin backend scaffold using Supabase and server-side API routes.

What is included
- lib/supabaseClient.js — helpers to create Supabase client on client and server
- migrations/schema.sql — SQL to create tables: users, products, orders, order_items, topups
- pages/api/admin/* — server-side API endpoints for products, orders, metrics
- admin/index.html — simple static admin UI that talks to the server APIs

Quickstart
1. Create a Supabase project at https://supabase.com
2. Run the SQL in migrations/schema.sql in the Supabase SQL editor (or run via psql)
3. Set environment variables for your app (locally use a .env file):
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # keep private
4. Install dependencies (on your project root):
   npm install @supabase/supabase-js
5. Run your app (if Next.js: npm run dev). The admin UI is available at /admin/index.html (or adapt to Next.js routing)

Security notes
- SUPABASE_SERVICE_ROLE_KEY must be kept secret (do NOT commit it). Use hosting/CI secrets.
- The provided admin UI is a simple scaffold for manual testing. For production, protect routes using proper Supabase Auth and server-side session checks.

Next steps / improvements
- Add server-side auth checks (verify session + admin role) in each API route
- Improve UI: product CRUD forms, pagination, search
- Add seed script to migrate localStorage data into Supabase
- Add unit/integration tests

If you want, I can now create a Pull Request for feature/admin-backend and continue adding server-side role checks and a products CRUD UI — tell me to `create PR` and I will open the compare link for you to review.