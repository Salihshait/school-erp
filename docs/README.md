# School ERP Phase 2 Architecture

This repository contains a Vite/React client and a Node/Express backend for the School ERP product.

## Project layout

- `.github/workflows/` — GitHub Actions CI workflow definitions.
- `docs/` — project documentation, architecture notes, operation guides.
- `infrastructure/vercel/` — Vercel deployment and configuration files.
- `infrastructure/ci/` — shared CI scripts, templates, helper utilities.
- `school-erp.client/` — React application source code and client-side assets.
- `server/` — backend API server and export endpoints.

## Phase 2 focus

- Add auth libraries and protected routes.
- Separate dashboard, export, and settings components.
- Add deployment config for Vercel / GitHub Actions.
- Keep backend and frontend code organized for fast iteration.
