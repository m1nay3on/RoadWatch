# Frontend UI Test Checklist

Use this checklist for manual testing of the RoadWatch frontend. Run the app
locally with a test backend and test data; do not use production accounts or
records. Mark each item when it passes and note the browser, screen size, and
any issue for failures.

## Test details

- Date:
- Tester:
- Browser and version:
- Screen sizes tested:
- Backend/test data version:

## Before testing

- [ ] Start the backend and frontend using the instructions in
  [how-to-run.md](how-to-run.md).
- [ ] Confirm the backend is connected to the intended test database.
- [ ] Prepare test accounts for Citizen, Field Inspector, and Administrator.
- [ ] Prepare reports in relevant statuses: New, Verified, Assigned, Ongoing,
  and Closed.
- [ ] Open the frontend and confirm it loads without a blank screen or
  unexpected console errors.

## Authentication and registration

- [ ] Login screen shows the RoadWatch branding, email and password fields,
  Log In button, and Create Account link.
- [ ] Create Account and Back to Login navigate between the authentication
  screens.
- [ ] Attempt login with incorrect credentials; confirm an understandable
  error is shown and the user is not logged in.
- [ ] Log in with each test role; confirm the correct dashboard and role
  navigation appear.
- [ ] Register with all required fields and matching valid passwords; confirm
  successful registration feedback and return to Login.
- [ ] Submit registration with required fields missing; confirm it is rejected
  with understandable feedback.
- [ ] Register with a date of birth showing an age under 18; confirm
  registration is blocked and the warning can be closed.
- [ ] Register with a password shorter than six characters; confirm it is
  rejected.
- [ ] Register with non-matching passwords; confirm it is rejected.
- [ ] Reload while signed in; confirm the session is restored and the
  appropriate dashboard is shown.
- [ ] Log out; confirm the login screen is shown and protected application
  content is no longer visible.

## Citizen

- [ ] Sidebar shows Dashboard, Submit Report, My Reports, and Profile.
- [ ] Dashboard shows the citizen's report information and dashboard controls.
- [ ] Submit a report with a category, description, and location; confirm
  success feedback and that the new report appears in My Reports.
- [ ] Submit with the description or location empty; confirm submission is
  blocked with understandable feedback.
- [ ] Confirm the reporter name is filled from the signed-in account and cannot
  be edited in the form.
- [ ] Select each available category and confirm the selected category is
  submitted.
- [ ] Select an accepted image file and confirm the form accepts it.
- [ ] Try a file type other than PNG or JPEG; confirm the browser does not
  accept it through the file picker.
- [ ] Open a report from My Reports; confirm its details and status are
  readable.
- [ ] Confirm report actions and data are limited to the signed-in citizen's
  access.

## Field Inspector

- [ ] Sidebar shows Dashboard, Verification Queue, Inspector Reports, and
  Profile, without citizen or administrator navigation.
- [ ] Dashboard and report lists show the expected reports and useful empty
  states when there are none.
- [ ] Open a report and confirm its ID, issue, location, status, and relevant
  reporter or inspection details are readable.
- [ ] Verify a New report using the available inspection controls; confirm
  success and the updated status/details.
- [ ] Try to make an invalid or unavailable status transition; confirm it is
  not presented as an allowed action or is rejected with clear feedback.
- [ ] Confirm the inspector cannot access administrator-only actions through
  the visible UI.

## Administrator

- [ ] Sidebar shows Dashboard, Inspected Reports, Report Completion,
  Administrator Tools, and Profile.
- [ ] Report lists display the expected information and provide clear empty
  states.
- [ ] Search and sorting controls update the visible report list correctly.
- [ ] Open a report and confirm its details are readable; close the details
  view and return to the list.
- [ ] Complete an Ongoing report using the close action; confirm it is no
  longer listed as awaiting completion and its status is Closed.
- [ ] Open Administrator Tools and verify the user-management interface is
  usable.
- [ ] Create a valid test user if user creation is available; confirm success
  feedback and that the user appears in the list.
- [ ] Submit invalid user details; confirm creation is rejected with clear
  feedback.
- [ ] Confirm administrator-only actions are not visible in Citizen or Field
  Inspector navigation.

## Profile and navigation

- [ ] Profile shows the signed-in user's name, role, email, mobile number, and
  address.
- [ ] Sidebar navigation opens the selected screen and indicates the active
  section.
- [ ] Collapse and reopen the sidebar; confirm navigation remains operable and
  the toggle's accessible label describes its action.
- [ ] Use Back to Dashboard where available and confirm it returns to the
  correct dashboard.
- [ ] Confirm success and warning modals display the expected message and
  their buttons dismiss them.
- [ ] Simulate a failed API request where practical; confirm the UI reports
  the failure rather than showing false success.

## Responsive layout and accessibility

- [ ] Check the login and registration screens at desktop, tablet, and narrow
  mobile widths; fields and buttons remain visible and usable.
- [ ] Check the authenticated screens at desktop, tablet, and narrow mobile
  widths; content does not overlap or require unintended horizontal scrolling.
- [ ] Check report tables and forms at narrow widths; important content and
  actions remain reachable.
- [ ] Use keyboard Tab and Shift+Tab to reach links, fields, navigation
  controls, and buttons in a sensible order.
- [ ] Activate buttons and links using Enter or Space as appropriate.
- [ ] Confirm visible labels identify form controls and focus is visible.
- [ ] Confirm text, status labels, and controls remain understandable without
  relying on color alone.
- [ ] Confirm dialogs and modals can be operated with a keyboard and have a
  clear close/continue action.

## Results

- Passed:
- Failed:
- Blocked:
- Issues or notes:
