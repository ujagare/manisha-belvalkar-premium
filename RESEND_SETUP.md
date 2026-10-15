# 📧 Resend Email Setup — Contact & Order Emails

Is guide se aapke website par **email bhejna** on hoga. Koi coding nahi —
sirf Resend account banakar 2 keys chahiye, bas!

Website ab automatically email bhejegi:

| Kahan se | Kisko email jaati | Kyun |
|---|---|---|
| **Contact / enquiry form** | Aapko (studio admin) | Kisi ne website par message bheja → turant aapko email |
| **Session booking request** | Aapko (studio admin) | Kisi ne session book kiya → turant aapko email |
| **Order / booking confirmed (payment ke baad)** | Customer ko | Payment hone par customer ko confirmation email |

**Note:** Email sirf tab chalti hai jab `RESEND_API_KEY` set ho. Agar key nahi
hai to form/order kaam karta rahega, bas email nahi jayegi (kuch tootega nahi).

---

## 1. Resend account banaayein (2 minute)

1. [resend.com](https://resend.com) kholen → **Sign up** (free tier kaafi hai — roj
   100 emails free).
2. Login hone ke baad left menu mein **Domains** par jaayein.
3. **Add Domain** → apna domain daalein (jaise `manishabelvalkar.com` ya
   `gmail` use kar rahe hain to ek domain le kar verify karein — Resend
   free/test mode mein sirf `onboarding@resend.dev` se bhejti hai).
4. Resend **2 DNS records** dikhayega (DKIM + SPF) — ye aapke domain provider
   (GoDaddy, Namecheap, Hostinger…) ke DNS settings mein add kar dein.
5. Verify hone ke baad domain ka **status: Verified** dikhega ✅
   (verification mein 5-30 minute lag sakte hain).

## 2. API key copy karein

1. Resend → **API Keys** → **Create API Key**.
2. Naam rakhein (jaise `manisha-website`) → **Create**.
3. `re_...` se shuru hone wali key copy karein (key sirf ek baar dikhti hai!).

## 3. Keys `.env.local` mein daalein

VS Code mein project root ki file **`.env.local`** kholen aur ye 2 cheezein
daalein (upar se `RESEND_API_KEY=` aur `RESEND_FROM_EMAIL=` already hai):

```
RESEND_API_KEY=re_YEH_APKI_KEY_PASTE_KAREIN
RESEND_FROM_EMAIL=no-reply@manishabelvalkar.com   ← apna VERIFIED domain wala address
```

- `RESEND_FROM_EMAIL` mein wahi address use karein jiska domain Resend mein
  **verified** hai (badalne par email fail hoti hai).
- Agar abhi testing karna hai, to `onboarding@resend.dev` use karsakte hain —
  lekin test emails sirf aapke khud ke email par jayengi.

## 4. Restart & test karein

1. Dev server restart karein: `Ctrl+C` phir `npm run dev`.
2. **Contact form test:** `/contact` par message bhejein → aapke email par
   turant enquiry wali email aani chahiye.
3. **Order test:** koi order pay karein (ya test mode mein) → customer ki email par
   confirmation aani chahiye.

---

## Need help?

- Resend official docs: [resend.com/docs](https://resend.com/docs)
- DNS settings kaise change karein: apne domain provider (GoDaddy/Hostinger/Namecheap)
  ke help center mein "how to add DNS records" search karein.
