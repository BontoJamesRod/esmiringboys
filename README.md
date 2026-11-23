# Kaligtasan ID

A household QR ID system for evacuation centers in Albay, Philippines. It has two parts in one responsive app:

- a **web dashboard** for barangay and municipal DRRM staff
- a **scanner app** for volunteers that works with no signal

All names, numbers and records are **sample placeholders**.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173, reloads on save
```

Use one of the demo account buttons on the login screen.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Builds both outputs below |
| `npm run build:web` | `dist/`: hosted version, installable as an app (PWA), works offline after the first visit |
| `npm run build:single` | `dist-single/index.html`: one self-contained file you can open from disk with no server |
| `npm run preview` | Serves `dist/` locally |
| `npm test` | Playwright tests (uses the installed Microsoft Edge; `PW_CHANNEL=chrome npm test` for Chrome) |
| `npm run icons` | Regenerates the PNG app icons from `assets/kaligtasan-id-logo.svg` |

To host it, upload `dist/` to any static host (Netlify, Vercel, GitHub Pages, an LGU server). It uses relative paths, so a sub-folder works.

## Stack

- **Vite 6**: build and dev server
- **Tailwind CSS 4**: design tokens in `@theme`, utilities for layout, component classes in `@layer components`
- **vite-plugin-pwa (Workbox)**: service worker and manifest, so the scanner opens with no signal
- **IndexedDB (idb-keyval)**: local registry storage, with batched writes
- **qrcode-generator** and **jsQR**: QR cards and camera scanning, bundled so they work offline
- **@fontsource** Inter: bundled font, with no Google Fonts request
- **SheetJS 0.20.3**: loaded only when someone imports an Excel file
- **Playwright**: end-to-end tests

## Project layout

```text
index.html            page shell + boot splash
src/
  main.js             entry: fonts, styles, app, service worker
  styles/app.css      Tailwind entry, theme tokens, new components (tabs, palette, popovers)
  styles/components.css  design tokens (light + dark), base components, print rules
  app/
    core.js           icons, logo, i18n (EN / Filipino / Bikol draft), utils, sample-data generator
    data.js           storage, state helpers, roles, QR card renderers, toasts, tabs, charts
    web.js            dashboard views, drawers, modals, command palette
    scan.js           scanner screens, camera scanning, sync engine
    tour.js           first-time guided tour (spotlight steps, skip, replay)
    app.js            actions (A.*), render, routing, keyboard shortcuts, boot
public/               favicon, app icons
assets/               logo source (SVG) and PNG
tests/app.spec.js     end-to-end tests
vite.config.js        joins src/app/*.js into one module (see the comment there)
```

## How it works

- **Data:** `seed()` in `core.js` creates a fixed sample registry: 1,248 households, 5 centers, 7 relief items, rounds, users, devices and an audit log. It is saved in IndexedDB. Timestamps shift on load so the demo always looks current. Settings → Backup and reset restores it.
- **Rendering:** plain JS template strings. `render()` rebuilds the screen from `DB` (data) and `S` (UI state). Views are in `VIEWS.*`, actions in `A.*`. Derived lookups are cached per render (`memoize`).
- **Routing:** hash routes (`#dashboard`, `#households`, `#scanner`, …). The Settings route is `#config`.
- **Server vs phone view:** records with `synced:false` exist only on a phone. The web dashboard hides them; the scanner shows its own (`SCN-03`). `vis()` decides this.
- **Offline sync:** scanner actions go into `DB.queue` with a `record_uuid`. `syncNow()` uploads them. `accept()` allows one claim per household per round and flags conflicts.
- **Roles:** `ROLE` in `data.js` lists which views each role can open. Medical notes are only shown to Admin and Officer.

## Using the dashboard

- **First login** starts a short guided tour (one for the dashboard, one for the phone setup, one for the scanner home). **Skip tour** ends it; the **?** button in the top bar, **Take the tour** in the account menu, or **How to use this app** on the scanner plays it again. Which tours were seen is kept in `localStorage` (`kid-tour`).
- **Ctrl K** (or **/**) opens search: households by name or ID, pages and common actions.
- The **bell** lists capacity, stock and sync warnings.
- Household, center and round details open in a side panel with tabs.
- The **account menu** has the theme (Auto / Light / Dark) and language.

## Ideas for next steps

- A real backend: PostgreSQL schema (on the "How it works" page), REST or sync API, auth
- Encrypt the phone copy of the registry (WebCrypto, key from the volunteer's PIN)
- Bluetooth thermal printing of cards and receipts
- SMS alerts to registered households
- Peer-to-peer sync between offline phones
- Native-speaker review of Bikol strings
