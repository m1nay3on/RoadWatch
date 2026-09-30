# RoadWatch

RoadWatch is a public infrastructure monitoring system for reporting,
reviewing, verifying, and tracking community infrastructure issues such as
potholes, damaged streetlights, drainage problems, and public facility damage.

The project contains:

- A React and Vite frontend
- An Express backend prepared for MongoDB
- Role-based workflows for citizens, field inspectors, and administrators
- Inspection timelines and report status tracking
- Browser print-to-PDF report generation

## Features

### Citizens

- Create an account and log in
- Submit infrastructure damage reports
- Add issue descriptions, locations, and photo evidence filenames
- View submitted reports and their current statuses
- Follow the report timeline
- View inspector names, review dates, notes, and verification details
- Expand closed reports when needed

### Field inspectors

- Review the verification queue
- View report evidence, locations, reporter details, and descriptions
- Add inspection notes and recommended priority
- Verify reports
- Reject reports
- Request more information from citizens
- View verified and closed reports in a separate tab
- See read-only verification summaries after a report is verified

### Administrators

- View dashboard statistics and recent reports
- Create Citizen, Field Inspector, and Administrator accounts
- Manage user account information
- View inspected reports
- Generate an individual inspection report as a PDF
- Generate a date-range inspection report as a PDF
- Mark verified or ongoing reports as closed
- Track report completion status

## Report workflow

Reports generally follow this workflow:

```text
New
  ↓
Under Review
  ↓
Verified
  ↓
Ongoing
  ↓
Closed
```

Alternative outcomes include:

```text
New → Rejected
New → Needs Information → Under Review
```

## Technology stack

### Frontend

- React 19
- React DOM
- Vite
- Oxlint
- CSS

### Backend

- Node.js
- Express
- MongoDB and Mongoose
- CORS
- dotenv
- Nodemon for development


## Prerequisites

Install the following:

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB connection string

## Installation

Clone the repository and open a terminal in the project directory:

```powershell
git clone https://github.com/paulccampos/SOFTENG1_Project.git
cd SOFTENG1_Project
```

Install frontend dependencies:

```powershell
cd frontend
npm install
```

Install backend dependencies:

```powershell
cd ..\backend
npm install
```

## Backend configuration

Create a local environment file:

```powershell
cd backend
Copy-Item .env.example .env
```

The default values are:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/softeng1
AUTH_TOKEN_SECRET=replace-this-with-a-long-random-secret
```

Keep `.env` private and do not commit credentials or secrets.

## Running the project

### Start the backend

From the `backend` directory:

```powershell
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

The health endpoint returns:

```json
{
  "status": "ok",
  "database": "connected"
}
```

The API uses the existing `users`, `reports`, `categories`, `assignments`,
`report_photos`, `status_logs`, and `verifications` collections. MongoDB must be
available before the backend starts. Development demo accounts are seeded only
when the `users` collection is empty; they are never seeded in production.

### Start the frontend

Open a second terminal:

```powershell
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## Demo accounts

Development demo accounts (seeded only into an empty local `users` collection):

| Role | Email | Password |
|---|---|---|
| Citizen | `citizen@roadwatch.com` | `123456` |
| Field Inspector | `inspector@roadwatch.com` | `123456` |
| Administrator | `admin@roadwatch.com` | `123456` |

These are development accounts only. Do not use these credentials in
production.

## Frontend commands

Run the development server:

```powershell
npm run dev
```

Build the frontend:

```powershell
npm run build
```

Run the linter:

```powershell
npm run lint
```

Preview the production build:

```powershell
npm run preview
```

## PDF report generation

Administrators can generate:

- Individual inspection reports
- Inspection reports for a selected date range

The application uses the browser print dialog. To save a report:

1. Open an inspected report or select a date range.
2. Click the PDF generation button.
3. Select **Save as PDF** in the browser print dialog.

## Current data storage

The current frontend prototype stores users in browser `localStorage` and
keeps report state in the running application. The backend currently provides
the Express server and health endpoint and is prepared for MongoDB
integration.

Refreshing the application may reset in-memory report changes. Persistent
production storage should be connected through backend API routes and
MongoDB models.

## Validation

Before opening a pull request, run:

```powershell
cd frontend
npm run lint
npm run build
```

## Security notes

- Do not commit `.env` files.
- Do not commit passwords, API keys, tokens, or private keys.
- Replace demo credentials before deploying.
- Validate and authorize all report and user-management operations on the
  backend before production use.

## Additional documentation

See [`docs/how-to-run.md`](docs/how-to-run.md) for the existing detailed

