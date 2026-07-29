---
title: "Top-up MVP: Add migrations + API + Checkout"
labels:
  - enhancement
assignees:
  - LUKZConnectz
---

This PR adds a minimal top-up MVP flow (Supabase + Stripe) including:

- SQL migrations (migrations/schema.sql)
- RLS policies (migrations/policies.sql)
- Supabase client helpers (lib/supabase.ts)
- Stripe helper (lib/stripe.ts)
- API routes to create transactions and handle webhooks
- Checkout UI (Stripe Elements) and transactions page
- README_topup.md with setup and testing instructions

What to test

1. Apply SQL migrations to your Supabase project (SQL Editor) and ensure tables are created.
2. Populate env vars in .env.local and run the Next dev server.
3. Use Stripe CLI to test payment_intent.succeeded forwarding to /api/webhooks/stripe.

Notes

- This PR uses Stripe as an example payment provider. If you prefer Xendit or other local providers, I can adapt the API.
- Do not forget to set SUPABASE_SERVICE_ROLE and STRIPE_WEBHOOK_SECRET as secrets in production.
