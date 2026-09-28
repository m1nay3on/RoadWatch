import logo from "../../assets/roadwatch-logo.png";


export default function Dashboard({
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

  const ongoing =
    citizenReports.filter(
      (report) =>
        report.status === "Ongoing"
    ).length;

  const closed =
    citizenReports.filter(
      (report) =>
        report.status === "Closed"
    ).length;

  return (
    <main className="main">

      <div className="dashboard-header">
        <div>
          <p className="eyebrow">
            CITIZEN DASHBOARD
          </p>

          <h1>
            Hello, {user.firstName}!
          </h1>

          <p className="subtitle">
            Track infrastructure issues
            and follow their repair
            progress.
          </p>
        </div>

        <img
          src={logo}
          alt="RoadWatch Logo"
          className="dashboard-logo"
        />
      </div>

      <section className="stats">

        <div>
          <span>My Reports</span>
          <strong>
            {citizenReports.length}
          </strong>
        </div>

        <div>
          <span>New</span>

          <strong>
            {
              citizenReports.filter(
                (r) =>
                  r.status === "New"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Ongoing</span>
          <strong>{ongoing}</strong>
        </div>

        <div>
          <span>Closed</span>
          <strong>{closed}</strong>
        </div>

      </section>

      <section className="submit-highlight">

        <div>
          <p className="eyebrow">
            NEED TO REPORT SOMETHING?
          </p>

          <h2>
            Help improve your community.
          </h2>

          <p>
            Submit a report about potholes,
            damaged streetlights, drainage
            problems, or other public
            infrastructure concerns.
          </p>
        </div>

        <button
          className="gold submit-main-btn"
          onClick={() =>
            setActive(
              "Submit Report"
            )
          }
        >
          + Submit Report
        </button>

      </section>

      <section className="panel">

        <div className="section-heading">

          <div>
            <h2>Recent Reports</h2>

            <p>
              Your latest submitted reports.
            </p>
          </div>

          <button
            className="outline-btn"
            onClick={() =>
              setActive(
                "My Reports"
              )
            }
          >
            View All
          </button>

        </div>

        {citizenReports.length ===
        0 ? (
          <div className="empty-state">
            <p>
              You have not submitted any
              reports yet.
            </p>
          </div>
        ) : (
          <div className="table-container">

            <table className="table">

              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Issue</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {citizenReports
                  .slice(0, 5)
                  .map((report) => (
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
        )}

      </section>

    </main>
  );
}

/* =========================================================
   SUBMIT REPORT
========================================================= */

