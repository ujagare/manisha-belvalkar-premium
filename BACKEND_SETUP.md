# Production backend setup

The repository contains the backend schema and application integration, but production credentials must be supplied by the owner. Never commit real values.

## Required environment variables

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are accepted for compatibility. Prefer Supabase publishable/secret keys for a new project. Only variables starting with `NEXT_PUBLIC_` are safe to expose to the browser.

## Database

1. Link the Supabase CLI to the staging project.
2. Review `supabase/migrations/20261007083529_backend_foundation.sql`.
3. Run `npx supabase db push` against staging.
4. Regenerate types: `npx supabase gen types typescript --project-id <project-ref> --schema public > src/lib/supabase/database.types.ts`.
5. Run database advisors and RLS allow/deny tests before production.

The migration is additive. Existing `profiles`, `orders`, and `products` rows are retained. Rollback should be a separate forward migration; do not edit an applied migration.

## Razorpay

1. Start with Test Mode keys only.
2. Configure webhook URL: `https://<staging-domain>/api/webhooks/razorpay`.
3. Subscribe to payment captured/failed and refund processed events.
4. Store a unique webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
5. Complete successful, failed, cancelled, duplicate, delayed-webhook and refund tests.
6. Replace test keys with live keys only after the staging checklist passes.

The server creates the Razorpay order from the trusted catalogue price. Checkout signatures, fetched payment amount/order/currency, and webhook signatures are verified before database status changes.

## Staff access

Insert the first owner role through the Supabase SQL editor while authenticated as the project owner:

```sql
insert into public.staff_roles (user_id, role) values ('<auth-user-uuid>', 'owner');
```

Never derive staff authorization from `user_metadata`.

## Verification commands

```powershell
npm run lint
npx tsc --noEmit
npm run build
npx supabase db lint
npx supabase test db
```

Live payment verification remains blocked until Supabase and Razorpay staging credentials are configured.
