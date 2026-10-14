# RoadWatch System Development

This document describes the development approach and architecture reflected in
the current RoadWatch codebase. It is an implementation overview, not a
commit-by-commit history.

## 1. Problem and user roles

RoadWatch was developed to help communities report infrastructure issues and
follow them through review and resolution. Its workflows are organized around
three roles:

- **Citizens** create accounts, submit reports with a category, location,
  description, and optional photo evidence, and track their own reports.
- **Field Inspectors** review reports, add findings and a priority, and record
  verification decisions.
- **Administrators** manage accounts, review inspected reports, endorse
  verified cases to the Engineering Office, and close endorsed cases after
  completion is confirmed.

Separating these roles shaped both the user interface and the server
authorization rules. The Engineering Office is an external recipient of
endorsements, not a RoadWatch login role.

## 2. Architecture and technology choices

The application uses a browser-based React frontend, a JSON REST API, and
MongoDB persistence:

```text
Browser (React 19 + Vite)
        │ JSON requests; bearer token for protected routes
        ▼
Express API (Node.js)
        │ Mongoose models map to existing collections
        ▼
MongoDB database: softeng1
```

The frontend is under `frontend/`. React page components provide the role-based
screens; shared components provide navigation, report timelines, evidence
photos, feedback, and accessible dialogs. The API client centralizes HTTP
requests and adds the saved bearer token to protected requests. In development,
Vite proxies `/api` to the Express server.

The backend is under `backend/`. Express hosts the API, authentication
middleware, workflow and input validators, list-query helpers, and Mongoose
collection adapters. The Mongoose schemas are intentionally permissive
(`strict: false`) and bind to named existing collections. This allows RoadWatch
to work with the project's established MongoDB data while the API normalizes
legacy field spellings when it reads and returns records.

The backend uses the `softeng1` database by default and works with these
collections:

| Collection | Purpose |
| --- | --- |
| `users` | Accounts, roles, and contact information |
| `categories` | Active report categories |
| `reports` | Issue details and current workflow state |
| `report_photos` | Photo filenames, metadata, and image data |
| `status_logs` | Append-only report status history |
| `verifications` | Inspector decision records |
| `assignments` | Assignments used when repair work is started |

## 3. Development approach

The implementation brings the work together in these stages:

1. **Translate the domain into role workflows.** Define what each actor can do
   and the status transitions that represent review, verification, repair,
   endorsement, and completion.
2. **Establish the data and API contract.** Map users, reports, categories,
   evidence, assignments, verifications, and status history to MongoDB
   collections. Expose JSON endpoints for authentication, report operations,
   users, categories, assignments, status history, and evidence photos.
3. **Enforce rules on the server.** Validate request bodies and status
   transitions in the backend rather than relying on the browser. Require
   authentication for protected endpoints, apply role checks, and restrict
   citizens to their own reports and related records.
4. **Build screens around the workflows.** Implement citizen submission and
   tracking, inspector queues and review decisions, and administrator
   management, inspection, endorsement, and completion screens.
5. **Connect and verify the layers.** Use the shared frontend API client to
   submit JSON requests, display server errors as accessible feedback, and
   refresh local application state from API responses. Test workflow rules and
   validate the frontend build and lint through local scripts and CI.

This describes the structure and development approach evidenced by the
repository; it does not claim a particular date or order of past commits.

### Transaction 1: Citizen registration

The registration form asks for:

- First name and last name
- Birthday
- Mobile number
- House number, street, barangay, and city
- Email address
- Password and confirm password

The browser requires these fields, restricts the birthday to today or earlier,
checks the mobile number format, requires the registrant to be at least 18,
requires a password of at least six characters, and checks that the two
password entries match. The confirm-password value is only used for this
browser-side match check; it is not sent to the API or stored.

On submission, the frontend sends the name, birthday, mobile number, address,
email, and password to `POST /api/auth/register`. The backend validates the
email, password, age, mobile number, and all four address fields again, hashes
the password with `scrypt`, and creates a Citizen record in `users`. Public
registration cannot choose an elevated role.

### Transaction 3: Citizen report submission and initial status log

The report form asks for a category, description, and exact location, with
optional PNG/JPEG photo evidence. The backend verifies that the category is
active and validates the report text and evidence before creating a report
with status `New` and Medium priority in `reports`.

Immediately after creating the report, the API creates an initial record in
`status_logs` with the report ID, status `New`, the submitting citizen as the
actor, the change time, and the citizen's email. Therefore, the first status
log entry is created when a report is submitted; it does not wait for the first
inspector decision. Uploaded photo records are written to `report_photos`
after this initial log operation.

These writes are separate MongoDB operations, not a multi-document MongoDB
transaction. If a later photo write fails, the report and its initial status
log may already have been saved.

## 4. Report lifecycle

The backend is the authority for status transitions. The principal paths are:

```text
Citizen submits
       │
       ▼
      New ──► Under Review ──► Verified ──► Ongoing ──► Closed
       │            │              │
       ├────────────┴──► Needs Information
       └────────────────► Rejected

Verified ──► Endorsed to Engineering Office ──► Closed
             (Administrator)                    (Administrator)
```

An Inspector can review and decide New, Under Review, and Needs Information
reports. Verification decisions require notes and a supported priority
(`Low`, `Medium`, or `High`). Starting `Ongoing` requires an active assignment;
an Inspector may only start work on their own assignment. An Administrator can
endorse a Verified report after generating its inspection report. The
endorsement records the actor, recipient, date, optional reference, and status
history. The administrator closes the endorsed case after completion is
confirmed.

The workflow validator rejects transitions that do not match the caller's role
and the report's current state. The UI guides users through allowed actions,
but server-side checks remain authoritative.

## 5. Evidence and generated documents

Report submissions can include up to five PNG or JPEG photos, each up to 5 MB.
The frontend validates the selected files and reads them for submission. The
backend independently validates the payload, declared content type, encoded
image, signature, file size, and count before storing the photo data in
`report_photos`. The report keeps a readable evidence label; authorized photo
requests retrieve image data for display.

Administrators generate inspection and endorsement documents with the browser
print dialog and can choose the browser's **Save as PDF** destination. The
endorsement workflow presents a confirmation before printing and a separate
confirmation after the print dialog closes before updating report status. A
browser cannot prove that a print job was saved, so the final step relies on the
administrator's confirmation.

## 6. Authentication and error handling

Registration and administrative account creation validate required fields.
Passwords are hashed with Node.js `scrypt` before storage; login issues a
signed bearer token that expires after eight hours. API middleware verifies the
token and checks the required role before performing protected operations.
User responses omit password fields.

The Express server assigns request IDs, logs request method, path, status, and
duration, and returns structured error responses. The frontend's API client
surfaces API messages in accessible status or alert regions instead of relying
on native browser alerts.

## 7. Validation and testing

Backend tests use Node's built-in test runner and cover authentication,
validation, list-query behavior, and workflow rules. The frontend uses Oxlint
and Vite's production build. GitHub Actions runs backend tests and frontend
lint/build on pushes and pull requests.

Run the checks from their respective directories:

```powershell
cd backend
npm test

cd ..\frontend
npm run lint
npm run build
```

For local setup, environment configuration, and application startup, see
[How to Run](how-to-run.md). For endpoint details, see the
[Backend API reference](api/endpoints.md).

## 8. Current scope

The API currently provides creation and retrieval flows and report status
updates; general edit/delete endpoints are not implemented. Authentication
tokens are discarded by the browser on logout and expire after eight hours;
there is no refresh-token or server-side token-revocation endpoint. Browser
print-to-PDF is not a server-side document archival service. MongoDB indexes,
backup policy, and production deployment settings remain operational concerns.
