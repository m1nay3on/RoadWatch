import logo from "../../assets/roadwatch-logo.png";


export default function InspectorDashboard({
  setActive,
  reports,
  view = "recent",
}) {
  const pending = reports.filter((report) =>
    ["New", "Under Review", "Needs Information"].includes(
      report.status
    )
  );
  const recentReports = reports.slice(0, 5);
  const verified = reports.filter(
    (report) => report.status === "Verified"
  );
  const ongoing = reports.filter(
    (report) => report.status === "Ongoing"
  );
  const rejected = reports.filter(
    (report) => report.status === "Rejected"
  );
  const needsInformation = reports.filter(
    (report) => report.status === "Needs Information"
  );
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const verifiedThisWeek = verified.filter(
    (report) =>
      report.verifiedAt &&
      new Date(report.verifiedAt) >= weekStart
  );

  if (view === "recent") {
    return (
      <main className="main">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">FIELD INSPECTOR</p>
            <h1>Recent Reports</h1>
            <p className="subtitle">
              Monitor the latest infrastructure reports.
            </p>
          </div>

          <img
            src={logo}
            alt="RoadWatch Logo"
            className="dashboard-logo"
          />
        </div>

        <section className="stats metric-dashboard-stats inspector-stats">
          <div>
            <span>Pending Verification</span>
            <strong>{pending.length}</strong>
            <small>Requires review</small>
          </div>
          <div>
            <span>Needs Information</span>
            <strong>{needsInformation.length}</strong>
            <small>Waiting for citizen response</small>
          </div>
          <div>
            <span>Verified This Week</span>
            <strong>{verifiedThisWeek.length}</strong>
            <small>Successfully reviewed this week</small>
          </div>
          <div>
            <span>Rejected</span>
            <strong>{rejected.length}</strong>
            <small>Reports rejected</small>
          </div>
        </section>

        <section className="stats metric-dashboard-stats inspector-stats secondary-stats">
          <div>
            <span>Verified Reports</span>
            <strong>{verified.length}</strong>
            <small>Ready for assignment</small>
          </div>
          <div>
            <span>Ongoing Repairs</span>
            <strong>{ongoing.length}</strong>
            <small>Currently being resolved</small>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">REPORT ACTIVITY</p>
              <h2>Recent Reports</h2>
              <p>View the latest reports and their current status.</p>
            </div>
          </div>

          <div className="table-container">
            <table className="table inspector-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Issue Type</th>
                  <th>Location</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
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
                {recentReports.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No reports have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">FIELD INSPECTOR</p>
          <h1>Verification Queue</h1>
          <p className="subtitle">
            Review submitted reports and take appropriate action.
          </p>
        </div>
        <img src={logo} alt="RoadWatch Logo" className="dashboard-logo" />
      </div>

      <section className="panel queue-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MAIN WORK AREA</p>
            <h2>Verification Queue</h2>
            <p>Review reports that require verification.</p>
          </div>
          <span className="section-count">{pending.length} Pending</span>
        </div>
        <div className="table-container">
          <table className="table inspector-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Issue Type</th>
                <th>Location</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((report) => (
                <tr key={report.id}>
                  <td><strong>{report.id}</strong></td>
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
                  <td>
                    <button
                      className="gold small-btn"
                      onClick={() =>
                        setActive(
                          `Inspector Details:${report.id}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    No reports currently require verification.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   INSPECTOR REPORT DETAILS
========================================================= */
