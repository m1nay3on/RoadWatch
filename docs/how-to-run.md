# How to Run

## Prerequisites

Install the following before running the project:

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB connection string

## First-time setup

Open PowerShell in the repository root, then install both applications:

```powershell
npm --prefix backend install
npm --prefix frontend install
```

## Configure MongoDB

The backend uses the `softeng1` database and these defaults:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/softeng1
AUTH_TOKEN_SECRET=replace-this-with-a-long-random-secret
```

Create the local environment file from the example:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` if MongoDB uses another URI. Set `AUTH_TOKEN_SECRET` to a
long random value when running outside local development. Do not commit `.env`.

MongoDB must be running before the API starts. The backend connects to the
existing collections and does not drop data. In development, demo users are
created only when `users` is empty; categories are added if missing.

## Start the applications

Start the backend in one terminal:

```powershell
cd backend
npm run dev
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm run dev
```

Open the Vite URL printed in the terminal, normally:

```text
http://localhost:5173
```

Vite proxies `/api` requests to the backend. The API is available at
`http://localhost:5000`; verify its MongoDB connection at:

```text
http://localhost:5000/api/health
```

The health response should include `"database": "connected"`.

## Demo Login

On an empty development `users` collection, the backend creates these accounts:

| Role | Email | Password |
|---|---|---|
| Citizen | `citizen@roadwatch.com` | `123456` |
| Field Inspector | `inspector@roadwatch.com` | `123456` |
| Administrator | `admin@roadwatch.com` | `123456` |

They are for local development only. Do not use these credentials in production.

## Load Sample Reports

After starting the backend once so development users exist, follow the MongoDB
sample-data instructions in [database/sample-data.md](database/sample-data.md).
That script adds sample categories and reports without deleting existing data.

## Verify

Run backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

Run the frontend linter:

```powershell
npm run lint
```

GitHub Actions runs the backend tests and frontend lint/build checks on each
push and pull request.

## Stop the applications

Press `Ctrl+C` in each terminal running the backend or frontend.

## Security reminder

Do not commit `.env`, API keys, passwords, tokens, private keys, or uploaded
photos. Use `.env.example` only for safe placeholder configuration.
