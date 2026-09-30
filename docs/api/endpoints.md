# Backend API

Base URL: `http://localhost:5000/api`

Protected endpoints require `Authorization: Bearer <token>`. Login tokens expire
after eight hours. The API uses JSON request and response bodies. Error responses
include a top-level `message`; parser and unhandled server errors also include an
`error` object with a stable code and request ID.

## Authentication

| Method | Path | Access | Success |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | `201 { user }` |
| POST | `/auth/login` | Public | `200 { token, user }` |
| GET | `/auth/me` | Authenticated | `200 { user }` |
| GET | `/health` | Public | `200 { status, database }` |

Registration accepts `firstName`, `lastName`, `email`, `password`, `birthday`,
`mobile`, and an `address` with `houseNumber`, `street`, `barangay`, and `city`.
Self-registration always creates a Citizen account. Passwords are hashed before
storage; legacy plaintext passwords are upgraded after successful login.

## Users And Categories

| Method | Path | Access | Success |
| --- | --- | --- | --- |
| GET | `/users` | Administrator | `200 [user, ...]` |
| POST | `/users` | Administrator | `201 user` |
| GET | `/categories` | Authenticated | `200 [category, ...]` |

Administrator user creation accepts `firstName`, `lastName`, `email`,
`password`, `role`, and optional address fields. Password fields are omitted
from user responses. User lists are currently capped at 1,000 records.

## Reports

| Method | Path | Access | Success |
| --- | --- | --- | --- |
| GET | `/reports` | Authenticated | `200 [report, ...]` |
| POST | `/reports` | Citizen | `201 report` |
| GET | `/reports/:id` | Authenticated; Citizens see only their own | `200 report` |
| PATCH | `/reports/:id/status` | Field Inspector or Administrator | `200 report` |
| GET | `/reports/:id/status-logs` | Authenticated; Citizens see only their own | `200 [statusLog, ...]` |
| GET | `/reports/:id/verification` | Authenticated; Citizens see only their own | `200 verification` |
| GET | `/reports/:id/photos` | Authenticated; Citizens see only their own | `200 [photo, ...]` |

Report creation accepts `category`, `location`, `description`, and optional
`evidence`. Status updates accept `status`; inspection statuses also require
`verificationNotes` and may include `priority` (`Low`, `Medium`, or `High`).
Closing a report may include `completionNotes`. Status transitions are enforced
by role.

## Assignments

| Method | Path | Access | Success |
| --- | --- | --- | --- |
| GET | `/assignments` | Field Inspector or Administrator | `200 [assignment, ...]` |
| POST | `/assignments` | Administrator | `201 assignment` |

Assignment creation accepts `reportId` and `assignedToEmail`. Inspectors only
receive their own assignments; Administrators can list all assignments.

## Current API Limits

## List Query Options

`GET /users`, `/categories`, `/reports`, and `/assignments` support the following
query options:

| Parameter | Behavior |
| --- | --- |
| `page` | 1-based page number; defaults to `1` |
| `limit` | Results per page, from 1 to 100; defaults to `50` |
| `sortBy` | Allow-listed field supported by that collection |
| `order` | `asc` or `desc`; defaults to `desc` |
| `search` or `q` | Case-insensitive text search; at most 100 characters |

Collection filters: users support `role`; reports support `status`, `category`,
and `priority`; assignments support `status`. Categories have no filter beyond
search. A request without any list query options keeps the legacy array response.
With a query option, the response is `{ "data": [...], "pagination": { ... } }`.
Pagination metadata includes `page`, `limit`, `totalItems`, `totalPages`,
`hasNextPage`, and `hasPreviousPage`. User and report collections are currently
loaded with caps of 1,000 and 2,000 records, respectively.

## Current API Limits

There are no API refresh-token or server-side logout/revocation endpoints;
clients must discard their token on logout, and it remains valid until expiry.
Update/delete endpoints for users, categories, reports, and assignments are not
implemented. The application uses MongoDB collections directly, so relational
database migration scripts do not apply; indexes and backup policy remain
deployment concerns.