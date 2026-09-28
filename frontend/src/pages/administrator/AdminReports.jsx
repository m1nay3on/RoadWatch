import { useState } from "react";

export default function AdminReports({
  reports,
  users,
}) {
  const [selectedReport, setSelectedReport] =
    useState(null);
  const [startDate, setStartDate] =
    useState("");
  const [endDate, setEndDate] =
    useState("");
  const [rangeReports, setRangeReports] =
    useState(null);

  const inspectedReports = reports.filter(
    (report) =>
      report.inspectedAt ||
      report.status === "Verified" ||
      report.status === "Rejected" ||
      report.status === "Needs Information" ||
      report.status === "Ongoing" ||
      report.status === "Closed"
  );

  const inspectors = users.filter(
    (user) =>
      user.role === "Field Inspector"
  );

  const filteredInspectedReports =
    inspectedReports.filter((report) => {
      if (!report.inspectedAt) {
        return false;
      }

      const inspectedDate = new Date(
        report.inspectedAt
      );
      const start = startDate
        ? new Date(`${startDate}T00:00:00`)
        : null;
      const end = endDate
        ? new Date(`${endDate}T23:59:59.999`)
        : null;

      return (
        (!start || inspectedDate >= start) &&
        (!end || inspectedDate <= end)
      );
    });

  function generatePdf(report) {
    setRangeReports(null);
    setSelectedReport(report);

    setTimeout(() => {
      window.print();
    }, 100);
  }

  function generateDateRangePdf() {
    if (!startDate && !endDate) {
      alert(
        "Please choose a start date or end date."
      );
      return;
    }

    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      alert(
        "The start date cannot be after the end date."
      );
      return;
    }

    setSelectedReport(null);
    setRangeReports(filteredInspectedReports);

    setTimeout(() => {
      window.print();
    }, 100);
  }

  return (
    <main className="main">

      <div className="admin-page no-print">
        <p className="eyebrow">
          ADMINISTRATION
        </p>

        <h1>Administrator Dashboard</h1>

        <p className="subtitle">
          Manage users, inspected reports, and
          system activity.
        </p>

        <section className="stats">
          <div>
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
          </div>

          <div>
            <span>Users</span>
            <strong>{users.length}</strong>
          </div>

          <div>
            <span>Inspectors</span>
            <strong>{inspectors.length}</strong>
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "New" ||
                    report.status ===
                      "Needs Information"
                ).length
              }
            </strong>
          </div>
        </section>

        <section className="panel report-generator-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                REPORT GENERATOR
              </p>

              <h2>
                Generate Inspection Report
              </h2>

              <p>
                Select an inspection date range
                and export the matching reports
                as a PDF.
              </p>
            </div>

            <span className="section-count">
              {filteredInspectedReports.length} Matching
            </span>
          </div>

          <div className="report-filter-form">
            <label>
              From
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />
            </label>

            <label>
              To
              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              />
            </label>

            <button
              className="gold"
              onClick={generateDateRangePdf}
            >
              Generate Range PDF
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                INSPECTION RECORDS
              </p>

              <h2>Inspected Reports</h2>

              <p>
                Review inspector decisions and
                generate printable PDF reports.
              </p>
            </div>

            <span className="section-count">
              {inspectedReports.length} Inspected
            </span>
          </div>

          {inspectedReports.length === 0 ? (
            <div className="empty-state">
              <p>No inspected reports yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table admin-report-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Issue</th>
                    <th>Location</th>
                    <th>Inspector</th>
                    <th>Status</th>
                    <th>Reviewed</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {inspectedReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <strong>{report.id}</strong>
                      </td>

                      <td>{report.issue}</td>
                      <td>{report.location}</td>

                      <td>
                        {report.inspectedBy ||
                          report.verifiedBy ||
                          "Not assigned"}
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
                        {report.inspectedAt
                          ? new Date(
                              report.inspectedAt
                            ).toLocaleDateString()
                          : "Not available"}
                      </td>

                      <td>
                        <button
                          className="outline-btn small-btn"
                          onClick={() => {
                            setRangeReports(null);
                            setSelectedReport(report);
                          }}
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedReport && (
          <section className="panel report-preview no-print">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  INSPECTION REPORT
                </p>

                <h2>
                  {selectedReport.id} â€”{" "}
                  {selectedReport.issue}
                </h2>
              </div>

              <button
                className="gold"
                onClick={() =>
                  generatePdf(selectedReport)
                }
              >
                Generate PDF
              </button>
            </div>

            <div className="detail-list">
              <p>
                <strong>Reporter:</strong>
                {selectedReport.reporter}
              </p>

              <p>
                <strong>Location:</strong>
                {selectedReport.location}
              </p>

              <p>
                <strong>Inspector:</strong>
                {selectedReport.inspectedBy ||
                  selectedReport.verifiedBy ||
                  "Not assigned"}
              </p>

              <p>
                <strong>Status:</strong>
                {selectedReport.status}
              </p>

              <p>
                <strong>Priority:</strong>
                {selectedReport.priority}
              </p>

              <p>
                <strong>Notes:</strong>
                {selectedReport.verificationNotes ||
                  "No inspection notes provided."}
              </p>
            </div>
          </section>
        )}

        {rangeReports && (
          <section className="printable-report range-printable-report">
            <p className="eyebrow">
              ROADWATCH INSPECTION REPORT
            </p>

            <h1>
              Inspection Reports by Date Range
            </h1>

            <p>
              Range: {startDate || "Any date"} to{" "}
              {endDate || "Any date"}
            </p>

            <p>
              Matching reports: {rangeReports.length}
            </p>

            {rangeReports.length === 0 ? (
              <p>
                No inspected reports were found
                for this date range.
              </p>
            ) : (
              <table className="print-report-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Issue</th>
                    <th>Location</th>
                    <th>Inspector</th>
                    <th>Status</th>
                    <th>Reviewed</th>
                  </tr>
                </thead>

                <tbody>
                  {rangeReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.issue}</td>
                      <td>{report.location}</td>
                      <td>
                        {report.inspectedBy ||
                          report.verifiedBy ||
                          "Not assigned"}
                      </td>
                      <td>{report.status}</td>
                      <td>
                        {new Date(
                          report.inspectedAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

      </div>

      {selectedReport && (
        <section className="printable-report">
          <p className="eyebrow">
            ROADWATCH INSPECTION REPORT
          </p>

          <h1>
            {selectedReport.issue}
          </h1>

          <p>Report ID: {selectedReport.id}</p>

          <div className="print-report-grid">
            <p>
              <strong>Reporter:</strong>{" "}
              {selectedReport.reporter}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {selectedReport.location}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedReport.status}
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              {selectedReport.priority}
            </p>
            <p>
              <strong>Inspector:</strong>{" "}
              {selectedReport.inspectedBy ||
                selectedReport.verifiedBy ||
                "Not assigned"}
            </p>
            <p>
              <strong>Reviewed:</strong>{" "}
              {selectedReport.inspectedAt
                ? new Date(
                    selectedReport.inspectedAt
                  ).toLocaleString()
                : "Not available"}
            </p>
          </div>

          <h2>Description</h2>
          <p>{selectedReport.description}</p>

          <h2>Inspection Notes</h2>
          <p>
            {selectedReport.verificationNotes ||
              "No inspection notes provided."}
          </p>
        </section>
      )}

    </main>
  );
}
