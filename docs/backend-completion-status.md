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

## Additional Software Testing Needed

The current backend tests cover validation and workflow rules, but the system still needs additional testing to verify end-to-end reliability, security, and usability before production release.

| Testing type | Purpose | Main areas to test |
|---|---|---|
| Integration testing | Validate that frontend, backend, and MongoDB work together correctly across real workflows | login/register flow, report creation, status transitions, assignment creation, photo uploads, verification lifecycle |
| End-to-end (E2E) testing | Confirm user journeys work from the browser across multiple pages and roles | Citizen submit report, Field Inspector review, Administrator assignment, close report, photo evidence display |
| Security testing | Check for authentication, authorization, and data-protection weaknesses | JWT handling, role-based access control, admin-only routes, password hashing, input sanitization, file upload validation |
| Performance testing | Ensure the API remains responsive under realistic load | report listing, search/filter queries, concurrent login requests, MongoDB query performance, large photo uploads |
| Usability testing | Validate whether users can complete tasks without confusion | citizen report form, inspector dashboard, admin assignment screens, error messages, mobile responsiveness |
| Regression testing | Ensure new fixes do not break existing functionality | report workflow rules, assignment logic, approval/rejection decisions, status history logs |
| Edge-case testing | Look for boundary and failure conditions not covered by unit tests | very long descriptions, invalid coordinates, duplicate case IDs, empty database collections, expired tokens, malformed evidence files |
| Accessibility testing | Ensure the system is usable by different users and devices | keyboard navigation, color contrast, form labels, screen-reader compatibility |
| Database/data integrity testing | Verify MongoDB records align with business workflow and are not corrupted | user roles, status_logs, verifications, assignments, report_photos deletion/updates, report closure timestamps |
| Deployment/compatibility testing | Confirm the application works in the target runtime environment | Node version compatibility, environment variables, CORS configuration, production build and startup behavior |

## Backend Test Cases Executed

| Test case | Expected result | Actual result | Status |
|---|---|---|---|
| Mongo _id remains distinct from the public report id | Public report output excludes `_id` and exposes `id`/`createdAt` instead | Report object returned the public `id` and `createdAt` while removing `_id` | Pass |
| legacy snake_case fields normalize to frontend camelCase | Snake_case fields are converted to camelCase | `report_id` became `reportId` and `changed_at` became `changedAt` | Pass |
| signed tokens validate until their expiry | Valid signed token is accepted before expiry | Token verified successfully with the expected email claim | Pass |
| expired and modified tokens are rejected | Expired token and tampered token are rejected | `verifyToken` returned `null` for both invalid tokens | Pass |
| list query preserves the legacy array response when no options are supplied | No-option query returns the raw array result and `requested: false` | Returned original report list with the legacy format intact | Pass |
| list query filters, searches, sorts, and paginates | Query applies status filter, text search, `createdAt` sort, and pagination correctly | Only the matching report remained and pagination metadata was correct | Pass |
| list query rejects invalid pagination and unsupported sort fields | Invalid page value and unsupported sort field trigger validation errors | Validation error messages matched the expected patterns | Pass |
| registration validates adulthood, contact, and address fields | Valid user passes; invalid email, age, address, and phone fail | Validation accepted the valid user and rejected invalid inputs with matching error text | Pass |
| report input trims text and rejects non-text fields | Text fields are trimmed and invalid non-string values are rejected | Category, location, and description were normalized while invalid `category` failed | Pass |
| report input accepts validated image data and rejects mismatched image types | Valid PNG evidence passes; mismatched content type is rejected | Accepted valid PNG evidence and rejected mismatched image metadata | Pass |
| report input accepts up to five evidence photos and rejects more | Up to five photos are accepted; extra photos are rejected | Exactly five photos passed through, and a sixth was blocked | Pass |
| priority and status transitions follow the workflow rules | Allowed workflow transitions pass and disallowed ones fail | Workflow logic matched the expected Field Inspector and Administrator rules | Pass |
| assignments require a report id and valid inspector email | Valid assignment input is sanitized and invalid email is rejected | `reportId` and assigned email were normalized and invalid value was rejected | Pass |

All 13 backend tests currently pass (`npm test` in `backend` completed successfully with 13 passing, 0 failing).