# Top-up MVP integration (Next.js + Supabase + Stripe)

This branch adds a minimal end-to-end top-up flow: DB migrations, RLS policies, server API endpoints to create transactions and handle Stripe webhooks, a simple checkout form using Stripe Elements, and a user transactions page.

Environment variables (add to your hosting / .env.local):

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

How to run locally

1. Apply migrations to your Supabase project (you can paste migrations/schema.sql and migrations/policies.sql into Supabase SQL editor).
2. Add env vars to .env.local
3. Install dependencies:
   - @supabase/supabase-js
   - @supabase/auth-helpers-nextjs
   - stripe
   - @stripe/stripe-js
   - @stripe/react-stripe-js
4. Run dev server: npm run dev

Testing webhooks (Stripe CLI)

1. Start the Stripe CLI forwarder:
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
2. Make a test payment in the checkout flow (or create a test payment_intent and simulate succeeded event):
   stripe trigger payment_intent.succeeded

Notes & next steps

- This is a minimal MVP. Important items to add:
  - Background worker to call game API for fulfillment and more robust retry handling
  - Better error handling and idempotency for creating transactions/payment intents
  - Admin UI to manage products/games and refund flows
  - Tests and CI checks

If you want, I can open a PR from branch `feature/topup-mvp` into your default branch; tell me if you want changes before I do.