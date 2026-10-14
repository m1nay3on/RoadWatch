import { useState } from "react";
import ModalDialog from "../../components/ModalDialog";

export default function MyReports({
  setActive,
  reports,
  user,
  onDeleteReport,
}) {
  const [activeTab, setActiveTab] = useState("new");
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
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
        ["Ongoing", "Endorsed to Engineering Office"].includes(report.status)
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
  const tabs = [
    { id: "new", label: "New", reports: newReports },
    { id: "ongoing", label: "Ongoing", reports: ongoingReports },
    { id: "verified", label: "Verified", reports: verifiedReports },
    { id: "information", label: "Needs Information", reports: needsInformationReports },
    { id: "closed", label: "Closed", reports: closedReports },
  ];

  function handleTabKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
    setActiveTab(nextTab.id);
    document.getElementById(`citizen-${nextTab.id}-reports-tab`)?.focus();
  }

  const selectedTab = tabs.find((tab) => tab.id === activeTab);

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

      <div className="completion-tabs" role="tablist" aria-label="My report sections">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "completion-tab active" : "completion-tab"}
            id={`citizen-${tab.id}-reports-tab`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`citizen-${tab.id}-reports-panel`}
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
        id={`citizen-${activeTab}-reports-panel`}
        role="tabpanel"
        aria-labelledby={`citizen-${activeTab}-reports-tab`}
      >
        <div className="section-heading">
          <div>
            <h2>{selectedTab.label} Reports</h2>
            {activeTab === "ongoing" && (
              <p>Includes reports being resolved and endorsed to the Engineering Office.</p>
            )}
          </div>
          <span className="section-count">{selectedTab.reports.length}</span>
        </div>

        {selectedTab.reports.length === 0 ? (
          <div className="empty-state">
            <p>No reports in this section.</p>
          </div>
        ) : (
          <div className="table-container completion-table-container">
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
                {selectedTab.reports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
                    <td>{report.issue}</td>
                    <td>{report.location}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`status status-${report.status.toLowerCase().replaceAll(" ", "-")}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="outline-btn small-btn"
                          onClick={() => setActive(`Report Details:${report.id}`)}
                        >
                          View Details
                        </button>
                        {["New", "Needs Information"].includes(report.status) && (
                          <button
                            className="danger-btn small-btn"
                            onClick={() => setReportToDelete(report)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {reportToDelete && (
        <ModalDialog
          className="confirmation-modal"
          role="alertdialog"
          labelledBy="delete-report-title"
          onClose={() => {
            if (!deleting) setReportToDelete(null);
          }}
        >
          <div className="warning-icon">!</div>
          <h2 id="delete-report-title">Delete Report?</h2>
          <p>
            Permanently delete report <strong>{reportToDelete.id}</strong>?
            This removes its report history and evidence and cannot be undone.
          </p>
          <div className="action-buttons">
            <button
              className="outline-btn"
              type="button"
              disabled={deleting}
              onClick={() => setReportToDelete(null)}
            >
              Cancel
            </button>
            <button
              className="danger-btn"
              type="button"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                try {
                  const deleted = await onDeleteReport(reportToDelete.id);
                  if (deleted) setReportToDelete(null);
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting..." : "Delete Report"}
            </button>
          </div>
        </ModalDialog>
      )}

    </main>
  );
}

/* =========================================================
   CITIZEN REPORT DETAILS
========================================================= */
