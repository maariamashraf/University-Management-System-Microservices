# UniSystem Frontend

Frontend application for the UniSystem project, built with React, TypeScript, and Vite.

## Stack

- React 19
- TypeScript 5
- Vite 7
- React Router DOM 7
- TanStack Query 5
- Axios
- Chart.js
- TailwindCSS 4
- Framer Motion
- Lucide React

## Features

- Role-based dashboards for Student, Teacher, and Admin
- Protected routes and authentication-aware navigation
- Course browsing, enrollment, and management flows
- Announcement and notification views with real-time updates
- Audit log and admin analytics widgets
- Reusable custom hooks and service-layer API abstraction

## Frontend Architecture

- `src/components`: reusable UI blocks by domain (Dashboard, Courses, Auth, common)
- `src/pages`: route-level screens
- `src/CustomeHooks`: TanStack Query hooks and feature logic
- `src/Services`: Axios-based API clients and auth helpers
- `src/ContextsProviders`: shared app contexts (auth/dashboard)
- `src/Interfaces`: TypeScript contracts for DTOs and view models

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Environment

Configure the frontend API target with Vite env vars:

```bash
VITE_API_URL=http://localhost:8080
```

## Notes

- Data fetching is primarily handled by TanStack Query hooks.
- HTTP communication is centralized through Axios service functions.
- Routing and authorization behavior is handled via React Router and protected route components.
