# BSPED Paediatric DKA Calculator

A clinical decision-support tool implementing the BSPED Paediatric DKA guidelines. Generates a patient-specific care pathway PDF and supports retrospective audit data entry.

Full clinical and user documentation: https://github.com/dan-leach/dka-calculator/wiki

---

## Tech stack

- **Vue 3** (Composition API) + **Vite 5**
- **Bootstrap 5** for layout and form controls
- **pdfmake** for PDF generation (runs in a Web Worker)
- **vue-router 4** for client-side routing
- **FontAwesome** for icons

---

## Local development

### Prerequisites

- Node.js ≥ 18
- npm

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

### API proxy and config fallback

In production the app fetches its configuration from `https://api.dka-calculator.co.uk/config`.

In development (`localhost` or a URL containing `dev.`), requests are proxied through `/api-proxy/config` (configured in `vite.config.js`) to avoid CORS issues. If the API is unreachable, the app automatically falls back to `public/localConfig.json`. Update that file to change validation limits, weight tables, or other config values locally without needing the live API.

### Version constants

Two version strings are maintained client-side in `src/assets/fetchConfig.js` (they are not served by the API):

| Constant | Meaning |
|---|---|
| `clientVersion` | SemVer version of this client application |
| `clientLastUpdated` | ISO date of the last client release |
| `icpVersion` | Version of the Integrated Care Pathway document embedded in the PDF |
| `icpLastUpdated` | ISO date of the last ICP update |
| `icpIsDraft` | Boolean — set `true` to show a DRAFT watermark on the ICP |

---

## Build

```bash
npm run build
```

Output goes to `dist/`. The build produces a fully static SPA — copy the contents of `dist/` to any static host or web root.

```bash
npm run preview   # locally preview the production build
```

---

## Project structure

```
src/
  assets/
    inputs/         # Input definitions and validators for each form section
    docDef.js       # pdfmake document definition (care pathway PDF)
    fetchConfig.js  # Remote config fetching with local fallback
    data.js         # Shared reactive state (all form inputs live here)
    api.js          # API calls (submit episode, retrospective lookup)
    webWorker.js    # PDF generation web worker
  components/
    FormField.vue   # Reusable labelled input wrapper
  composables/
    useFormGuard.js # Navigation guard — ensures earlier forms are valid
  router/
    index.js        # Route definitions and form-index mapping
  views/            # One Vue SPA view per route
public/
  localConfig.json  # Dev fallback config (mirrors the live API response shape)
```

---

## Clinical note

This tool is intended for use by trained clinicians. It does not replace clinical judgement. All calculations must be verified against the current BSPED guidelines before use.
