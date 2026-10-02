import { useState } from "react";


export default function InspectorReportDetails({
  setActive,
  report,
  inspector,
  onUpdateReport,
}) {
  const [notes, setNotes] =
    useState(
      report?.verificationNotes || ""
    );
  const [priority, setPriority] =
    useState(
      report?.priority || "Medium"
    );

  if (!report) {
    return (
      <main className="main">

        <button
          className="back-btn"
          onClick={() =>
            setActive(
              "Verification Queue"
            )
          }
        >
          ← Back to Verification Queue
        </button>

        <section className="panel">

          <h2>
            Report Not Found
          </h2>

        </section>

      </main>
    );
  }

  function updateStatus(status) {
    if (
      (status === "Rejected" ||
        status === "Verified" ||
        status === "Needs Information") &&
      !notes.trim()
    ) {
      alert(
        "Please add inspector notes before saving this decision."
      );
      return;
    }

    const inspection = {
      verificationNotes:
        notes.trim(),
      priority,
      inspectedBy: inspector
        ? `${inspector.firstName} ${inspector.lastName}`
        : "Field Inspector",
      inspectedByEmail:
        inspector?.email || "",
      inspectedAt:
        new Date().toISOString(),
    };

    if (status === "Verified") {
      inspection.verifiedBy =
        inspection.inspectedBy;
      inspection.verifiedAt =
        inspection.inspectedAt;
    }

    onUpdateReport(
      report.id,
      status,
      inspection
    );

    setActive(
      "Verification Queue"
    );
  }

  return (
    <main className="main">

      <button
        className="back-btn"
        onClick={() =>
          setActive(
            "Verification Queue"
          )
        }
      >
        ← Back to Verification Queue
      </button>

      <div className="detail-page-header">

        <div>

          <p className="eyebrow">
            REVIEW REPORT
          </p>

          <h1>
            {report.issue}
          </h1>

          <p className="subtitle">
            Report ID: {report.id}
          </p>

        </div>

        <span
          className={`status status-${report.status
            .toLowerCase()
            .replaceAll(" ", "-")}`}
        >
          {report.status}
        </span>

      </div>

      <section className="inspector-detail-grid">

        <section className="panel evidence-panel">

          <h2>
            Evidence Photo
          </h2>

          <div className="large-evidence">

            {report.evidence ? (
              <p>
                Uploaded evidence:{" "}
                {report.evidence}
              </p>
            ) : (
              <div>

                <span className="evidence-icon">
                  📷
                </span>

                <p>
                  Evidence photo
                  placeholder
                </p>

              </div>
            )}

          </div>

        </section>

        <section className="panel">

          <h2>
            Report Description
          </h2>

          <p className="description-text">
            {report.description}
          </p>

          <div className="detail-list">

            <p>
              <strong>
                Issue Type:
              </strong>

              {report.category}
            </p>

            <p>
              <strong>
                Priority:
              </strong>

              {report.priority}
            </p>

            <p>
              <strong>
                Date:
              </strong>

              {report.date}
            </p>

            <p>
              <strong>
                Time:
              </strong>

              {report.time}
            </p>

          </div>

        </section>

      </section>

      <section className="panel">

        <h2>
          Exact Location
        </h2>

        <p>
          <strong>
            Location:
          </strong>{" "}
          {report.location}
        </p>

        <div className="map-placeholder">

          <span>📍</span>

          <p>
            Map location will appear
            here
          </p>

          <small>
            {report.location}
          </small>

        </div>

      </section>

      <section className="panel">

        <h2>
          Citizen Information
        </h2>

        <div className="citizen-info-grid">

          <div>
            <span>Name</span>

            <strong>
              {report.reporter}
            </strong>
          </div>

          <div>
            <span>Email</span>

            <strong>
              {report.reporterEmail}
            </strong>
          </div>

        </div>

      </section>

      {report.status === "Verified" ? (
        <section className="panel inspection-summary">

          <div className="section-heading">
            <div>
              <p className="eyebrow">
                INSPECTION COMPLETE
              </p>

              <h2>
                Verification Summary
              </h2>
            </div>

            <span className="status status-verified">
              Verified
            </span>
          </div>

          <div className="detail-list">

            <p>
              <strong>
                Verified By:
              </strong>

              {report.verifiedBy ||
                report.inspectedBy ||
                "Field Inspector"}
            </p>

            <p>
              <strong>
                Verified On:
              </strong>

              {report.verifiedAt
                ? new Date(
                    report.verifiedAt
                  ).toLocaleString()
                : "Not available"}
            </p>

            <p>
              <strong>
                Priority:
              </strong>

              {report.priority}
            </p>

            <p>
              <strong>
                Notes:
              </strong>

              {report.verificationNotes ||
                "No notes provided."}
            </p>

          </div>

          <p className="inspection-readonly-note">
            This report has already been verified.
            Verification actions are no longer available.
          </p>

        </section>
      ) : (
        <>
          <section className="panel">

            <h2>
              Inspection Decision
            </h2>

            <p className="subtitle">
              Record your findings before
              submitting a verification decision.
            </p>

            <label>
              Recommended Priority

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Inspector Notes

              <textarea
                className="notes-area"
                placeholder="Describe what you found and the recommended action..."
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
              />
            </label>

          </section>

          <section className="panel action-panel">

            <div>
              <h2>
                Review Decision
              </h2>

              <p>
                Choose an action based on
                your verification.
              </p>
            </div>

            <div className="action-buttons">

              <button
                className="gold"
                onClick={() =>
                  updateStatus("Verified")
                }
              >
                ✓ Verify Report
              </button>

              <button
                className="danger-btn"
                onClick={() =>
                  updateStatus("Rejected")
                }
              >
                Reject Report
              </button>

              <button
                className="outline-btn"
                onClick={() =>
                  updateStatus(
                    "Needs Information"
                  )
                }
              >
                Request More Information
              </button>

            </div>

          </section>
        </>
      )}

    </main>
  );
}

/* =========================================================
   ADMIN
========================================================= */
