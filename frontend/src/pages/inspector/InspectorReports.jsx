import { useState } from "react";

export default function InspectorReports({
  setActive,
  reports,
}) {
  const [showClosedReports, setShowClosedReports] =
    useState(false);

  const verified = reports.filter(
    (report) =>
      report.status === "Verified"
  );

  const closed = reports.filter(
    (report) =>
      report.status === "Closed"
  );

  return (
    <main className="main">

      <p className="eyebrow">
        FIELD INSPECTOR
      </p>

      <h1>Inspector Reports</h1>

      <p className="subtitle">
        Review verified reports and completed
        infrastructure repairs.
      </p>

      <section className="panel verified-panel">

        <div className="section-heading">
          <div>
            <p className="eyebrow">
              INSPECTION RESULTS
            </p>

            <h2>Verified Reports</h2>

            <p>
              Reports confirmed by an inspector
              and ready for assignment.
            </p>
          </div>

          <span className="section-count">
            {verified.length} Verified
          </span>
        </div>

        {verified.length === 0 ? (
          <div className="empty-state">
            <h3>No verified reports yet</h3>
            <p>
              Reports will appear here after
              an inspector verifies them.
            </p>
          </div>
        ) : (
          <ReportTable
            reports={verified}
            setActive={setActive}
            dateLabel="Verified Date"
            showInspector
          />
        )}

      </section>

      <section className="panel closed-panel">

        <div className="section-heading">
          <div>
            <p className="eyebrow">
              REPORT HISTORY
            </p>

            <h2>Closed Reports</h2>

            <p>
              View reports that have been
              completed and closed.
            </p>
          </div>

          <button
            className="outline-btn"
            onClick={() =>
              setShowClosedReports(
                (visible) => !visible
              )
            }
          >
            {showClosedReports
              ? "Hide Closed Reports"
              : `View Closed Reports (${closed.length})`}
          </button>
        </div>

        {showClosedReports &&
          (closed.length === 0 ? (
            <div className="empty-state">
              <p>No closed reports yet.</p>
            </div>
          ) : (
            <ReportTable
              reports={closed}
              setActive={setActive}
              dateLabel="Date Closed"
            />
          ))}

      </section>

    </main>
  );
}

function ReportTable({
  reports,
  setActive,
  dateLabel,
  showInspector = false,
}) {
  return (
    <div className="table-container">

      <table className="table inspector-table">

        <thead>
          <tr>
            <th>Report ID</th>
            <th>Issue Type</th>
            <th>Location</th>
            {showInspector && (
              <th>Verified By</th>
            )}
            <th>{dateLabel}</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>
                <strong>{report.id}</strong>
              </td>

              <td>{report.issue}</td>

              <td>{report.location}</td>

              {showInspector && (
                <td>
                  {report.verifiedBy ||
                    report.inspectedBy ||
                    "Field Inspector"}
                </td>
              )}

              <td>
                {showInspector && report.verifiedAt
                  ? new Date(
                      report.verifiedAt
                    ).toLocaleDateString()
                  : report.date}
              </td>

              <td>
                <span
                  className={`priority priority-${report.priority.toLowerCase()}`}
                >
                  {report.priority}
                </span>
              </td>

              <td>
                <button
                  className="outline-btn small-btn"
                  onClick={() =>
                    setActive(
                      `Inspector Details:${report.id}`
                    )
                  }
                >
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
