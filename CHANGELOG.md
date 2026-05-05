# Changelog

## 2026-05-05

- Prepared the Vite app for Vercel with explicit routing and build configuration.
- Added browser-persisted demo mode with reset controls for portfolio review.
- Refreshed mock data so the current-month dashboard, expense distribution, and recent ledger render on Vercel.
- Added an Error Boundary with reload and demo-reset recovery actions.
- Added Playwright E2E coverage for dashboard rendering, transaction creation/reset, chart-to-ledger navigation, the technical case route, accessibility checks, and desktop/mobile visual snapshots.
- Added a technical case route documenting product goals, architecture decisions, tradeoffs, and backend roadmap.
- Added bundle analysis through `npm run analyze`.
- Improved export UX with empty-state guards, loading labels, and success/error toasts.
- Hardened Open Graph/Twitter metadata for link sharing.
- Fixed the npm audit finding by updating Axios.
