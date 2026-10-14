import { useState } from "react";

export default function InspectorReports({
  setActive,
  reports,
}) {
  const [activeTab, setActiveTab] = useState("verified");

  const verified = reports.filter(
    (report) =>
      report.status === "Verified"
  );

  const ongoing = reports.filter(
    (report) =>
      ["Ongoing", "Endorsed to Engineering Office"].includes(report.status)
  );

  const closed = reports.filter(
    (report) =>
      report.status === "Closed"
  );
  const tabs = [
    { id: "verified", label: "Verified", reports: verified },
    { id: "ongoing", label: "Ongoing", reports: ongoing },
    { id: "closed", label: "Closed", reports: closed },
  ];

  function handleTabKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
    setActiveTab(nextTab.id);
    document.getElementById(`inspector-${nextTab.id}-reports-tab`)?.focus();
  }

  const selectedTab = tabs.find((tab) => tab.id === activeTab);

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

      <div className="completion-tabs" role="tablist" aria-label="Inspector report sections">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "completion-tab active" : "completion-tab"}
            id={`inspector-${tab.id}-reports-tab`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`inspector-${tab.id}-reports-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onKeyDown={handleTabKeyDown}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span>{tab.reports.length}</span>
          </button>
        ))}
      </div>

      <section
        className="panel"
        id={`inspector-${activeTab}-reports-panel`}
        role="tabpanel"
        aria-labelledby={`inspector-${activeTab}-reports-tab`}
      >
        <div className="section-heading">
          <div>
            <h2>{selectedTab.label} Reports</h2>
            {activeTab === "verified" && (
              <p>Reports confirmed by an inspector and ready for assignment.</p>
            )}
            {activeTab === "ongoing" && (
              <p>View reports being resolved, including those endorsed to the Engineering Office.</p>
            )}
            {activeTab === "closed" && (
              <p>View reports that have been completed and closed.</p>
            )}
          </div>
          <span className="section-count">{selectedTab.reports.length}</span>
        </div>

        {selectedTab.reports.length === 0 ? (
          <div className="empty-state">
            <p>No {selectedTab.label.toLowerCase()} reports yet.</p>
          </div>
        ) : (
          <ReportTable
            reports={selectedTab.reports}
            setActive={setActive}
            dateLabel={activeTab === "verified"
              ? "Verified Date"
              : activeTab === "closed"
                ? "Date Closed"
                : "Date Submitted"}
            showInspector={activeTab === "verified"}
            readOnly={activeTab === "ongoing"}
          />
        )}
      </section>

    </main>
  );
}

function ReportTable({
  reports,
  setActive,
  dateLabel,
  showInspector = false,
  readOnly = false,
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
            {!readOnly && <th>Priority</th>}
            <th>Status</th>
            {!readOnly && <th>Action</th>}
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
                {dateLabel === "Date Closed" && report.closedAt
                  ? new Date(report.closedAt).toLocaleDateString()
                  : showInspector && report.verifiedAt
                  ? new Date(
                      report.verifiedAt
                    ).toLocaleDateString()
                  : report.date}
              </td>

              {!readOnly && <td>
                <span
                  className={`priority priority-${report.priority.toLowerCase()}`}
                >
                  {report.priority}
                </span>
              </td>}

              <td>
                <span
                  className={`status status-${report.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {report.status}
                </span>
              </td>

              {!readOnly && <td>
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
              </td>}
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
