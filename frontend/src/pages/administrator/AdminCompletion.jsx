export default function AdminCompletion({
  reports,
  onUpdateReport,
}) {
  const activeReports = reports.filter(
    (report) =>
      report.status === "Verified" ||
      report.status === "Ongoing"
  );

  function closeReport(report) {
    onUpdateReport(report.id, "Closed", {
      closedAt: new Date().toISOString(),
    });
  }

  return (
    <main className="main">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Report Completion</h1>
      <p className="subtitle">
        Track verified reports and close them
        when the repair or action is complete.
      </p>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Reports Awaiting Completion</h2>
            <p>
              Close a report only after the
              assigned work has been completed.
            </p>
          </div>
          <span className="section-count">
            {activeReports.length} Active
          </span>
        </div>

        {activeReports.length === 0 ? (
          <div className="empty-state">
            <p>No reports are awaiting completion.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Issue</th>
                  <th>Location</th>
                  <th>Inspector</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeReports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
                    <td>{report.issue}</td>
                    <td>{report.location}</td>
                    <td>
                      {report.inspectedBy ||
                        report.verifiedBy ||
                        "Not assigned"}
                    </td>
                    <td>{report.status}</td>
                    <td>
                      <button
                        className="gold small-btn"
                        onClick={() => closeReport(report)}
                      >
                        Mark Closed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
