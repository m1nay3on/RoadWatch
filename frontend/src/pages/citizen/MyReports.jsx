import { useState } from "react";

function ReportSection({
  title,
  data,
  setActive,
  collapsible = false,
}) {
  const [isVisible, setIsVisible] =
    useState(!collapsible);

  return (
    <section className="panel report-section">

      <div className="section-heading">

        <div>
          <h2>{title}</h2>

          {collapsible && (
            <p>
              View reports that have been
              completed and closed.
            </p>
          )}
        </div>

        {collapsible ? (
          <button
            className="outline-btn"
            onClick={() =>
              setIsVisible(
                (visible) => !visible
              )
            }
          >
            {isVisible
              ? "Hide Closed Reports"
              : `View Closed Reports (${data.length})`}
          </button>
        ) : (
          <span className="section-count">
            {data.length}
          </span>
        )}

      </div>

      {isVisible && data.length === 0 ? (
        <div className="empty-state">
          <p>
            No reports in this
            section.
          </p>
        </div>
      ) : isVisible ? (
        <div className="table-container">

          <table className="table">

            <thead>
              <tr>
                <th>Report ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {data.map((report) => (
                <tr key={report.id}>

                  <td>
                    <strong>
                      {report.id}
                    </strong>
                  </td>

                  <td>
                    {report.issue}
                  </td>

                  <td>
                    {report.location}
                  </td>

                  <td>
                    {report.date}
                  </td>

                  <td>
                    <span
                      className={`status status-${report.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="outline-btn small-btn"
                      onClick={() =>
                        setActive(
                          `Report Details:${report.id}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      ) : null}

    </section>
  );
}

export default function MyReports({
  setActive,
  reports,
  user,
}) {
  const citizenReports =
    reports.filter(
      (report) =>
        report.reporterEmail ===
        user.email
    );

  const newReports =
    citizenReports.filter(
      (report) =>
        report.status === "New"
    );

  const ongoingReports =
    citizenReports.filter(
      (report) =>
        report.status === "Ongoing"
    );

  const verifiedReports =
    citizenReports.filter(
      (report) =>
        report.status === "Verified"
    );

  const needsInformationReports =
    citizenReports.filter(
      (report) =>
        report.status ===
        "Needs Information"
    );

  const closedReports =
    citizenReports.filter(
      (report) =>
        report.status === "Closed"
    );

  return (
    <main className="main">

      <button
        className="back-btn"
        onClick={() =>
          setActive("Dashboard")
        }
      >
        ← Back to Dashboard
      </button>

      <p className="eyebrow">
        REPORT HISTORY
      </p>

      <h1>My Reports</h1>

      <p className="subtitle">
        Track all infrastructure reports
        you have submitted.
      </p>

      <ReportSection
        title="New Reports"
        data={newReports}
        setActive={setActive}
      />

      <ReportSection
        title="Ongoing Reports"
        data={ongoingReports}
        setActive={setActive}
      />

      <ReportSection
        title="Verified Reports"
        data={verifiedReports}
        setActive={setActive}
      />

      <ReportSection
        title="Needs Information"
        data={needsInformationReports}
        setActive={setActive}
      />

      <ReportSection
        title="Closed Reports"
        data={closedReports}
        setActive={setActive}
        collapsible
      />

    </main>
  );
}

/* =========================================================
   CITIZEN REPORT DETAILS
========================================================= */
