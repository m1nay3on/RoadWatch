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

## Administrator Workflow

- The Administrator can generate the inspection report for a Verified case,
  endorse it to the Engineering Office, and record the endorsement date and
  optional reference. The Administrator closes the case after completion is
  confirmed. The Engineering Office is an external recipient, not an additional
  RoadWatch actor.
- Photo evidence now uploads up to five PNG/JPEG images (up to 5 MB each) to `report_photos`.
  Report details load and display stored evidence for citizens and inspectors;
  older filename-only uploads remain visible as metadata.
- The current UI has no report-edit/delete flow. Add one only if those actions
  are required; the current backend workflow supports report creation,
  inspection, assignment, status history, and closure.

## Verification

Backend rule tests run with `cd backend; npm test`. Live MongoDB smoke checks
should use a temporary report and remove it afterward. Sample MongoDB data is
documented in [database/sample-data.md](database/sample-data.md).