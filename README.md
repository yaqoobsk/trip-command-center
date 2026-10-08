# Trip Command Center

A lightweight React/Vite personal travel portal. The first version is intentionally backend-free: trip data, checklist state and expenses persist in browser localStorage.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The `dist/` folder can be deployed as a static site. It is suitable for GitHub Pages.

## GitHub Pages

1. Create a GitHub repository, e.g. `trip-command-center`.
2. Push this project.
3. In GitHub: **Settings → Pages → Build and deployment → GitHub Actions**.
4. Add a Vite/GitHub Pages workflow, or deploy `dist` using your preferred Pages action.
5. The app uses client-side localStorage and needs no server/database for this MVP.

## Included current trip

Mahabaleshwar + Panchgani, 17–20 Oct 2026:
- Hotel Pratham, Solapur — 17 Oct
- Terra on a Hill, Panchgani — 18–19 Oct
- 19 Oct loop: Terra → Table Land → Parsi Point → Strawberry Farm → Mapro → lunch → Venna Lake → Terra
- Direct Panchgani → Hyderabad return on 20 Oct

## Next upgrades

- Multiple trips
- Add/edit trips from UI
- Weather API
- Google Maps route links and live distances
- Booking/document attachments
- Cloud sync with Supabase
- PWA/offline install
- Shared family trip access
