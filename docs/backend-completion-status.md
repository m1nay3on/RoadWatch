# Backend Completion Status

## Scope

The API and MongoDB behavior below are implemented in the backend. The frontend
was not changed. The database uses the existing `softeng1` collections:
`users`, `categories`, `reports`, `assignments`, `report_photos`, `status_logs`,
and `verifications`.

## Implemented

- Login and registration use MongoDB users. Passwords are stored with scrypt
  hashes, registration validates email, age, mobile number, address, and
  password, and new public registrations always receive the Citizen role.
- Signed bearer tokens expire after eight hours. API routes enforce Citizen,
  Field Inspector, and Administrator roles.
- Report creation requires an active database category, a location, and a
  description. Text lengths are bounded, and client-provided report IDs,
  statuses, and priorities are not trusted.
- New reports start at Medium priority. Inspectors can set Low, Medium, or High
  when making a verification decision. The backend does not infer severity
  automatically; priority is the inspector's assessment.
- Verification, rejection, and requests for information require inspector
  notes. The server records inspector identity and timestamps in the report,
  `verifications`, and `status_logs`.
- Admins can assign verified reports to field inspectors. Repair work cannot
  move to Ongoing without an active assignment; only the assigned inspector or
  an Administrator can start it.
- Only Administrators can close a Verified or Ongoing report. The server sets
  the close timestamp and actor, records the transition, and marks any active
  assignment Completed.
- Status history is stored in `status_logs`; verification decisions are stored
  in `verifications`; assignment and completion details are stored in
  `assignments`.

## Workflow Rules

| Actor | Current status | Allowed next status |
|---|---|---|
| Field Inspector | New | Under Review, Verified, Needs Information, Rejected |
| Field Inspector | Under Review | Verified, Needs Information, Rejected |
| Field Inspector | Needs Information | Under Review, Verified, Needs Information, Rejected |
| Field Inspector | Verified | Ongoing, with an active assignment to that inspector |
| Administrator | Verified | Ongoing, with an active assignment, or Closed |
| Administrator | Ongoing | Closed |

Other status changes are rejected by the API. Inspection decisions require
notes and a supported priority. A report can be closed directly from Verified,
as the current completion screen permits, or after Ongoing repair work.

## API Surface

- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- `GET /api/users`, `POST /api/users` (Administrator)
- `GET /api/categories`
- `GET /api/reports`, `GET /api/reports/:id`, `POST /api/reports`
- `PATCH /api/reports/:id/status`
- `GET /api/reports/:id/status-logs`
- `GET /api/reports/:id/verification`
- `GET /api/reports/:id/photos`
- `GET /api/assignments`, `POST /api/assignments` (Administrator)

`GET /api/health` is public. All other protected routes require a bearer token.

## Frontend Follow-Up

These items require frontend work and were intentionally left untouched:

- Add an Administrator screen/control that calls `POST /api/assignments`, then
  give the assigned inspector a control to start repair work by changing the
  status to Ongoing.
- The current report form sends only the selected photo's filename. The backend
  stores filename metadata in `report_photos`; actual image bytes are not
  uploaded or stored.
- The current UI has no report-edit/delete flow. Add one only if those actions
  are required; the current backend workflow supports report creation,
  inspection, assignment, status history, and closure.

## Verification

Backend rule tests run with `cd backend; npm test`. Live MongoDB smoke checks
should use a temporary report and remove it afterward. Sample MongoDB data is
documented in [database/sample-data.md](database/sample-data.md).