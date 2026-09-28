export default function AdminDashboard({
  reports,
  users,
}) {
  const inspectors = users.filter(
    (user) =>
      user.role === "Field Inspector"
  );

  const pending = reports.filter(
    (report) =>
      report.status === "New" ||
      report.status === "Needs Information"
  );

  return (
    <main className="main">

      <p className="eyebrow">
        ADMINISTRATION
      </p>

      <h1>Administrator Dashboard</h1>

      <p className="subtitle">
        Monitor users, report activity, and
        system operations.
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
          <strong>{pending.length}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              ACTIVITY
            </p>
            <h2>Recent Reports</h2>
            <p>
              The latest reports submitted to
              RoadWatch.
            </p>
          </div>
          <span className="section-count">
            {reports.length} Total
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.id}</strong>
                  </td>
                  <td>{report.issue}</td>
                  <td>{report.location}</td>
                  <td>{report.date}</td>
                  <td>
                    <span
                      className={`status status-${report.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
