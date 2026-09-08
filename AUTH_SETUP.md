# 🔐 Auth Setup — Supabase (Login / Signup / Google)

Hamare website ka login system **Supabase Auth** par chalta hai — email/password
aur **Google Sign-In** dono. Order/booking system bhi Supabase database (`orders`
table) mein store hota hai. Neche steps follow karein — koi coding nahi, sab
Supabase dashboard mein click-click hai.

---

## 1. Supabase project banaayein (2 minute)

1. [supabase.com](https://supabase.com) kholen → **Start your project** (free tier kaafi hai).
2. Org choose karein, project ka naam rakhein (e.g. `manisha-belvalkar`) aur
   database password set karein → **Create new project**.
3. Project bante hi **Project Settings → API** mein jaayein.

## 2. Keys copy karke `.env.local` mein daalein

`Project Settings → API` se do values copy karein:

| Setting | Kahan milegi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `Project URL` (e.g. `https://abcdefgh.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon public` key (long string) |

Phir project root ka file **`.env.local`** kholen (VS Code mein) aur placeholders
replace karein:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Note:** `.env.local` change karne ke baad dev server restart karna padta hai
(`Ctrl+C` phir `npm run dev`).

## 3. Database tables banaayein (1 minute)

Supabase dashboard → **SQL Editor → New query** → `supabase/schema.sql` ka poora
content paste karein → **Run**.

Isse 3 tables banengi:
- `profiles` — har user ka public profile (auto-create hota hai signup par)
- `orders` — saare purchases/bookings (login ke baad checkout se bante hain)
- `products` — storefront catalog (books, tarot/oracle decks, salt frames…)
  - Public read-only hai — koi bhi visitor dekh sakta hai
  - Sirf Supabase dashboard se edit hota hai (anon key se koi change nahi kar sakta)
  - Schema run karte hi aapke 5 products seed ho jayenge
  - **Naya product add karna?** Dashboard → Table Editor → `products` →
    Insert row: slug, title, description, category (`book` / `oracle` / `ritual`),
    price, image (jaise `/images/tarot.jpg`), details (JSON array). Site par
    ~60 second mein apne aap dikh jayega — code change ki zaroorat nahi!

## 4. Email auth enable karein

Supabase dashboard → **Authentication → Sign In / Up → Providers**:
- **Email** provider **on** hona chahiye (default on hai).
- **Confirm email** — on rakhna best hai (signup par user email verify karta hai).

## 5. Google Sign-In enable karein (Google OAuth) 🤖

Google login ke liye 3 cheezein chahiye: Google Cloud Console se 2 keys, aur
Supabase mein unhe daalna.

### Step 5a — Google Cloud project & OAuth Client
1. [console.cloud.google.com](https://console.cloud.google.com) kholen.
2. Naya project banayein (ya existing use karein) → **APIs & Services →
   Credentials → Create Credentials → OAuth client ID**.
3. **Application type: Web application** select karein.
4. **Authorized redirect URIs** mein ye daalein (YOUR-PROJECT-REF ko apne URL se
   badle):
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
5. **Create** → **Client ID** aur **Client Secret** copy karein.

> Local testing ke liye bhi ek local redirect chahiye hoga:
> `http://localhost:3000/auth/callback` — ise bhi Authorized redirect URIs mein
> add kar sakte hain (pehle hi `localhost:3000` par dev chal raha hai).

### Step 5b — Supabase mein Google provider on karein
1. Supabase → **Authentication → Sign In / Up → Providers → Google**.
2. **Enable** toggle on karein.
3. **Client ID** aur **Client Secret** paste karein (Step 5a se) → **Save**.
4. **(Optional)** Site URL set karein: **Authentication → URL Configuration →
   Site URL** = `http://localhost:3000` (dev ke liye) ya production domain.

Bas! Ab Google button kaam karega. 🎉

## 6. Test karein

1. `npm run dev` → `http://localhost:3000`
2. `/signup` — email/password se account banaayein (confirm email link check karein)
3. `/login` — email ya Google se sign-in karein
4. `/services` ya `/courses` ya `/books` — kisi bhi **Book / Enroll / Buy** button
   par click karein → login ke baad `/checkout/...` khulega
5. Checkout confirm karein → `/account` mein order dikhega

## 7. Production ke liye (baad mein)

- **Site URL / redirects**: Authentication → URL Configuration mein production
  domain (e.g. `https://manishabelvalkar.com`) daalein.
- `emailRedirectTo` aur Google redirect URIs production domain par update karein.
- **Security tip**: `anon` key public hoti hai — ye normal hai. Sensitive queries
  ke liye hamesha **Row Level Security** par rely karein (schema.sql mein already
  policies hain).

---

## Structure (devs ke liye)

```
src/lib/supabase/
  client.ts          # Browser client (forms mein use hota hai)
  server.ts          # Server client (pages/routes mein use hota hai)
  config.ts          # isSupabaseConfigured() helper
  database.types.ts  # Typed schema (profiles, orders) — SQL ke saath sync
  models.ts          # Domain models (SessionUser, Order, …)
  session.ts         # Typed helpers: getCurrentUser / requireUser / getMyOrders
src/proxy.ts         # Session refresh + protected-route redirects
src/app/
  login/ signup/     # Auth pages (premium design)
  auth/callback      # Google/email-link redirect
  auth/confirm       # Email verification
  auth/signout       # POST sign-out
  account/           # Protected dashboard (profile + orders)
  checkout/[type]/[slug]  # Login-gated buy flow
  api/orders         # POST — order create (auth required)
supabase/schema.sql  # Tables + RLS policies (SQL editor mein run karein)
```

> **Koi bhi data shape change karne se pehle** `database.types.ts` aur
> `schema.sql` dono update karein — compiler hi bata dega ki kahin mismatch hai.
