# Setup Guide — Accounts, History & One-Time Payment

The app ships in **Local mode**: no accounts, data lives in the browser, every
feature unlocked. To enable Google/email login, per-user month history, and the
paid unlock, follow the steps below to switch it into **Cloud mode**.

You only edit ONE file in the app itself: `js/config.js`. Everything else is
account setup on Supabase, Google, and Stripe (all have free tiers).

```
Browser (GitHub Pages)  ──auth + data──▶  Supabase (Postgres + Auth)
        │                                        ▲
        └──"Upgrade"──▶ Edge Function ──▶ Stripe ─┘ (webhook flips plan → pro)
```

---

## Part A — Supabase project + database

1. Go to https://supabase.com → **New project**. Pick a name and a strong
   database password. Wait ~2 min for it to provision.
2. Left sidebar → **SQL Editor** → **New query**. Open the file
   `supabase/schema.sql` from this folder, paste its contents, click **Run**.
   This creates the `profiles` and `budgets` tables, the security rules
   (so each user only sees their own data), and a trigger that creates a
   profile row on sign-up.
3. Left sidebar → **Project Settings → API**. Copy two values for later:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon / public** key (safe to put in the browser)
   - Also note the **service_role** key (SECRET — used only by the webhook).

## Part B — Enable login methods

1. Left sidebar → **Authentication → Providers**.
2. **Email**: make sure it's enabled. (For easiest testing you can turn OFF
   "Confirm email" so new sign-ups work immediately.)
3. **Google**:
   - In https://console.cloud.google.com create an **OAuth client ID**
     (type: Web application).
   - Under "Authorized redirect URIs" add the callback Supabase shows you on
     the Google provider page — it looks like
     `https://abcd1234.supabase.co/auth/v1/callback`.
   - Copy the Google **Client ID** and **Client secret** back into Supabase's
     Google provider settings and **Save**.
4. Left sidebar → **Authentication → URL Configuration**: set **Site URL** to
   your GitHub Pages URL (e.g. `https://USERNAME.github.io/REPO/`) and add it to
   **Redirect URLs** too, so Google login returns to your app.

## Part C — Create the Stripe product (one-time price)

1. Go to https://dashboard.stripe.com → **Products → Add product**.
2. Name it (e.g. "ميزانيتي Pro"), set a **one-time** price, **Save**.
3. Open the price and copy its **Price ID** (`price_...`).
4. Developers → **API keys**: copy your **Secret key** (`sk_...`).
   (Use **test mode** keys first to try it safely.)

## Part D — Deploy the Edge Functions

These two small functions live in `supabase/functions/`. Deploy with the
Supabase CLI (https://supabase.com/docs/guides/cli):

```bash
# one-time
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>   # the abcd1234 part of the URL

# set secrets the functions need
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
supabase secrets set STRIPE_PRICE_ID=price_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx   # from Part E
# SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are provided
# automatically to functions, but if asked, set them from Part A.

# deploy
supabase functions deploy create-checkout --no-verify-jwt
supabase functions deploy stripe-webhook  --no-verify-jwt
```

Your checkout function URL will be:
`https://abcd1234.supabase.co/functions/v1/create-checkout`

## Part E — Connect the Stripe webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL:
   `https://abcd1234.supabase.co/functions/v1/stripe-webhook`
3. Select event **`checkout.session.completed`**, then **Add endpoint**.
4. Copy the endpoint's **Signing secret** (`whsec_...`) and set it as
   `STRIPE_WEBHOOK_SECRET` (see Part D), then re-deploy `stripe-webhook`.

## Part F — Turn on Cloud mode in the app

1. Open `js/config.js` and fill in:
   ```js
   supabaseUrl:        "https://abcd1234.supabase.co",
   supabaseAnonKey:    "eyJhbGci...the anon key...",
   checkoutFunctionUrl:"https://abcd1234.supabase.co/functions/v1/create-checkout",
   proPriceLabel:      "٤٩ ر.س مرة واحدة",
   ```
2. Re-upload the folder to your GitHub repo (or push the change).
3. **Bump the cache** so phones get the new version: in `sw.js` change
   `budget-pwa-v2` → `budget-pwa-v3`.
4. Open your site. You should now see the **login screen**.

---

## Test checklist

- [ ] Sign up with email → you land in the app, "Free account" shown.
- [ ] Add some amounts → reload → data is still there (saved to Supabase).
- [ ] Try the month arrows or the Annual/Debt tabs → upgrade prompt appears.
- [ ] Click **Upgrade** → Stripe Checkout opens → pay with test card
      `4242 4242 4242 4242` (any future date / any CVC).
- [ ] After payment you return to the app; within a moment the gated features
      unlock and the account shows **Pro**. (If not instant, reload — the
      webhook may take a second.)
- [ ] Log in on another device with the same account → your months are there.

## Changing what's free vs paid

Edit `proFeatures` in `js/config.js`. Set any of `history`, `export`, `annual`,
`debt` to `false` to make that feature free. Setting all to `false` makes the
whole app free even in cloud mode.

## Security notes

- The **anon key** is meant to be public; row-level security keeps each user's
  data private. Never put the **service_role** key in `config.js` — it lives
  only in the webhook function's secrets.
- Pro status is granted server-side by the Stripe webhook, so a user can't
  unlock Pro by editing the browser.
