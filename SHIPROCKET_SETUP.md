# Shiprocket E-Commerce Shipping & Courier Tracking Setup

Industry-standard Shiprocket API v2 integration for physical product orders (`products`, `/checkout`, `/track-order`, `/account/orders/[id]`, `/admin/shipments`).

## 1. Run the Supabase Migration

Apply the Shiprocket schema migration:

```bash
npx supabase db push
```

Migration file: `supabase/migrations/20261119150000_shiprocket_shipping.sql`
- Extends `public.shipments` with Shiprocket IDs, AWB, courier details, pickup schedule, parcel dimensions, ETD, label/manifest/invoice URLs, and scan history JSONB.
- Creates `public.shipment_events` (webhook idempotency & audit log) and `public.shiprocket_tokens` (server-only 10-day JWT cache).
- Adds default physical parcel dimensions (`weight_kg`, `length_cm`, `breadth_cm`, `height_cm`) on `public.products`.

## 2. Create a Dedicated Shiprocket API User

1. Log in to [app.shiprocket.in](https://app.shiprocket.in).
2. Go to **Settings → API → Configure → Add New API User**.
3. Use a dedicated email (different from your main Shiprocket owner login) and strong password.
4. Confirm your pickup warehouse nickname under **Settings → Pickup Addresses** (default nickname is usually `Primary`) and note its 6-digit PIN code.

## 3. Configure Environment Variables

Add the following **server-only** variables in `.env.local` and your Vercel project settings:

```env
SHIPROCKET_EMAIL=api-user@manishabelvalkar.com
SHIPROCKET_PASSWORD=your-strong-api-password
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_PICKUP_PINCODE=411001
SHIPROCKET_WEBHOOK_TOKEN=generate-a-long-random-hex-secret
SHIPROCKET_CHANNEL_ID=
SHIPROCKET_AUTO_PUSH=true
```

Generate a strong `SHIPROCKET_WEBHOOK_TOKEN`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Configure Real-Time Shiprocket Webhooks

1. In Shiprocket Panel, open **Settings → API → Webhooks**.
2. Set **Webhook URL** to:
   ```text
   https://www.manishabelvalkar.com/api/webhooks/shiprocket
   ```
3. Paste your exact `SHIPROCKET_WEBHOOK_TOKEN` into the **Security Token** field (Shiprocket sends it as the `x-api-key` HTTP header, verified in constant time).
4. Enable webhook events and click **Save & Test**.

## 5. End-to-End E-Commerce Flow

1. **Product Page & Checkout (`/products/[slug]`, `/checkout/product/[slug]`, `/checkout/cart`)**:
   - Customers enter/select a 6-digit Indian PIN code → `GET /api/shipping/serviceability` returns live Shiprocket courier availability, best partner, and estimated delivery date.
2. **Payment Capture (`activateOrderFulfilment`)**:
   - On Razorpay capture, a `public.shipments` row is automatically created with calculated parcel weight/dimensions.
   - When `SHIPROCKET_AUTO_PUSH=true`, the paid order is automatically pushed to Shiprocket (`POST /orders/create/adhoc`).
3. **Operations Dispatch Desk (`/admin/shipments`)**:
   - Staff review orders, adjust parcel weight/dimensions if needed, inspect live courier rates, assign AWB, schedule courier pickup, print PDF shipping labels, pickup manifests, and invoices, or cancel shipments.
4. **Live Courier Tracking (`/track-order` & `/account/orders/[id]`)**:
   - Customers track parcels live by **AWB number** or **Order Reference + Email** with a 6-stage progress bar, ETD, courier info, and full hub scan timeline.
   - Webhooks automatically send branded Resend emails on **Shipped**, **Out for Delivery**, and **Delivered** milestones.
