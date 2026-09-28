import { useState } from "react";

export default function AdminCompletion({
  reports,
  onUpdateReport,
}) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const activeReports = reports.filter(
    (report) => report.status === "Ongoing"
  );
  const visibleReports = activeReports
    .filter((report) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        [
          report.id,
          report.issue,
          report.location,
          report.inspectedBy,
          report.priority,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        )
      );
    })
    .sort((left, right) => {
      const leftValue =
        sortBy === "priority"
          ? left.priority
          : sortBy === "issue"
            ? left.issue
            : left.date || "";
      const rightValue =
        sortBy === "priority"
          ? right.priority
          : sortBy === "issue"
            ? right.issue
            : right.date || "";
      const comparison = String(leftValue).localeCompare(
        String(rightValue),
        undefined,
        { numeric: true }
      );
      return sortDirection === "asc" ? comparison : -comparison;
    });

  function closeReport(report) {
    onUpdateReport(report.id, "Closed", {
      closedAt: new Date().toISOString(),
    });
    setSelectedReport(null);
  }

  return (
    <main className="main">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Report Completion</h1>
      <p className="subtitle">
        Track ongoing reports and close them
        when the repair or action is complete.
      </p>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Reports Awaiting Completion</h2>
            <p>
              Close an ongoing report only after
              the assigned work is complete.
            </p>
          </div>
          <span className="section-count">
            {visibleReports.length} Ongoing
          </span>
        </div>

        <div className="report-filter-form">
          <label>
            Search
            <input
              type="search"
              placeholder="ID, issue, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label>
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date submitted</option>
              <option value="priority">Priority</option>
              <option value="issue">Issue</option>
            </select>
          </label>
          <button
            className="outline-btn"
            onClick={() =>
              setSortDirection((direction) =>
                direction === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        {visibleReports.length === 0 ? (
          <div className="empty-state">
            <p>
              {activeReports.length === 0
                ? "No reports are awaiting completion."
                : "No reports match your search."}
            </p>
          </div>
        ) : (
          <div className="table-container completion-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Issue</th>
                  <th>Location</th>
                  <th>Inspector</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleReports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
                    <td>{report.issue}</td>
                    <td>{report.location}</td>
                    <td>
                      {report.inspectedBy ||
                        report.verifiedBy ||
                        "Not assigned"}
                    </td>
                    <td>
                      <span
                        className={`priority priority-${report.priority.toLowerCase()}`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status status-${report.status.toLowerCase()}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="outline-btn small-btn"
                        onClick={() => setSelectedReport(report)}
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

      {selectedReport && (
        <div className="modal-overlay">
          <section className="modal report-preview">
            <div className="section-heading">
              <div>
                <p className="eyebrow">ONGOING REPORT</p>
                <h2>{selectedReport.id} - {selectedReport.issue}</h2>
              </div>
              <button
                className="outline-btn"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>

            <div className="detail-list">
              <p><strong>Location:</strong> {selectedReport.location}</p>
              <p><strong>Inspector:</strong> {selectedReport.inspectedBy || selectedReport.verifiedBy || "Not assigned"}</p>
              <p><strong>Priority:</strong> {selectedReport.priority}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Notes:</strong> {selectedReport.verificationNotes || "No inspection notes provided."}</p>
            </div>

            <button
              className="gold"
              onClick={() => closeReport(selectedReport)}
            >
              Mark Report Closed
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
