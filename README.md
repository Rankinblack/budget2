# ميزانيتي — My Budget (PWA)

A self-contained, installable Progressive Web App version of the Arabic monthly
budget app: Dashboard, Income, Expenses, Debt Snowball, Goals, Annual tracker,
and Settings. Works fully offline and stores your data locally in the browser.

## Run it locally

A PWA must be served over http(s) (not opened as a `file://` double-click),
because service workers and the install prompt require a real origin.

From inside this folder, start any static server, e.g.:

    # Python (no install needed)
    python3 -m http.server 8080

    # or Node
    npx serve .

Then open http://localhost:8080 in your browser.

## Install on a phone

1. Host the folder somewhere with HTTPS (GitHub Pages, Netlify, Vercel, any web
   host), or reach your computer's local server from the phone over Wi-Fi.
2. Open the URL in mobile Safari (iOS) or Chrome (Android).
3. Use "Add to Home Screen" — it installs with the ميزانيتي icon and launches
   full-screen, offline-capable.

## What's inside

    index.html              App shell (HTML, inlined Tailwind + styles, PWA meta)
    manifest.webmanifest    PWA manifest (name, icons, theme, RTL)
    sw.js                   Service worker (offline cache of the whole app)
    fonts.css + fonts/      Self-hosted IBM Plex fonts (offline, no Google CDN)
    js/                     React 18 (production) + the 5 app modules
    icons/                  App / maskable / Apple touch icons

## Your data

Budget data is saved in your browser's localStorage on the device. Use the gear
button (bottom-left) → "البيانات" to Backup (JSON), Import, Reset, or Clear.

## Notes / known limitations

- The "إضافة بند" (add item) and header search controls are not yet wired up —
  you can edit any amount inline, but adding/removing rows isn't implemented in
  the original design. Happy to add this if you want it.
