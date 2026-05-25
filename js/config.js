/* ====================================================================
   ميزانيتي — App configuration
   --------------------------------------------------------------------
   LEAVE THESE BLANK to run in LOCAL mode (no accounts, data stored in
   this browser only, ALL features unlocked — same as the offline PWA).

   FILL THEM IN to switch the app into CLOUD mode, which enables:
     • Google / email login
     • per-user month history saved in Supabase
     • free vs. paid features (one-time Stripe unlock)

   See SETUP.md for exactly where to find each value.
   ==================================================================== */
window.APP_CONFIG = {
  // --- Supabase (Project Settings → API) ---
  supabaseUrl:      "",   // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey:  "",   // the "anon / public" key (safe to expose)

  // --- Stripe one-time payment ---
  // URL of your deployed Supabase Edge Function that creates the Checkout
  // session, e.g. "https://abcd1234.supabase.co/functions/v1/create-checkout"
  checkoutFunctionUrl: "",

  // --- Pricing copy shown on the upgrade screen (display only) ---
  proPriceLabel: "دفعة واحدة",      // e.g. "‏٤٩ ر.س مرة واحدة"

  // --- Which features require the one-time Pro unlock (cloud mode only) ---
  // Free users always get: dashboard + income + expenses + goals + settings
  // for the CURRENT month. These extras are gated:
  proFeatures: {
    history: true,   // saving & switching between multiple months
    export:  true,   // JSON backup / import
    annual:  true,   // Annual tracker screen
    debt:    true,   // Debt-snowball planner screen
  },
};
