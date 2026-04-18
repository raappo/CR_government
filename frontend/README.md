# Smart Civic Grievance Management System Frontend

Angular 17 standalone frontend for a Citizen Service Request and Municipal Grievance Resolution platform. The UI is built with Angular Material and Tailwind CSS, with separate experiences for citizens, officers, and administrators.

## Tech Stack

- Angular 17
- Standalone Components
- Angular Material
- Tailwind CSS
- RxJS
- ng2-charts / Chart.js

## Project Structure

```text
src/app
├── admin
├── auth
├── citizen
├── core
│   ├── config
│   ├── guards
│   └── interceptors
├── models
├── officer
├── services
└── shared
    └── components
```

## Key Features

- Responsive homepage with hero, impact metrics, features, testimonials, and footer
- Role-based login redirect for citizen, officer, and admin flows
- Citizen complaint filing with category, priority, geo-location, and image URL
- Complaint listing with filters, tracking timeline, and feedback form
- Officer task queue, task details, and status updates with proof image
- Admin dashboard, complaint registry, officer assignment, and analytics charts
- Global loading overlay, snackbar notifications, role guard, and auth interceptor

## API Integration

The services are wired for backend endpoints such as:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/citizen/complaints`
- `GET /api/citizen/complaints`
- `GET /api/officer/tasks`
- `GET /api/admin/complaints`

If the backend is unavailable, the app falls back to seeded local demo data so the UX remains functional.

## Run Instructions

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Production Build

```bash
npm run build
```

The compiled output is written to `dist/frontend`.

## Demo Accounts

- Citizen: `citizen@civic.local`
- Officer: `officer@civic.local`
- Admin: `admin@civic.local`
- Password: `password123`
