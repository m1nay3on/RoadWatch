export default function ReportDetails({
  setActive,
  report,
}) {
  if (!report) {
    return (
      <main className="main">

        <button
          className="back-btn"
          onClick={() =>
            setActive(
              "My Reports"
            )
          }
        >
          ← Back
        </button>

        <section className="panel empty-state">

          <h2>
            Report Not Found
          </h2>

          <p>
            The selected report could
            not be found.
          </p>

        </section>

      </main>
    );
  }

  return (
    <main className="main">

      <button
        className="back-btn"
        onClick={() =>
          setActive(
            "My Reports"
          )
        }
      >
        ← Back to My Reports
      </button>

      <p className="eyebrow">
        REPORT DETAILS
      </p>

      <h1>{report.issue}</h1>

      <p className="subtitle">
        Report ID: {report.id}
      </p>

      <section className="details-grid">

        <section className="panel">

          <div className="detail-header">

            <h2>
              Report Information
            </h2>

            <span
              className={`status status-${report.status
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              {report.status}
            </span>

          </div>

          <div className="detail-list">

            <p>
              <strong>
                Issue:
              </strong>

              {report.issue}
            </p>

            <p>
              <strong>
                Category:
              </strong>

              {report.category}
            </p>

            <p>
              <strong>
                Location:
              </strong>

              {report.location}
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

            <p>
              <strong>
                Priority:
              </strong>

              {report.priority}
            </p>

          </div>

        </section>

        <section className="panel">

          <h2>
            Description
          </h2>

          <p className="description-text">
            {report.description}
          </p>

        </section>

      </section>

      {report.status !== "New" && (
        <section className="panel">

          <h2>
            Inspection Summary
          </h2>

          <div className="detail-list">

            <p>
              <strong>
                Status:
              </strong>

              {report.status}
            </p>

            {report.inspectedBy && (
              <p>
                <strong>
                  Reviewed By:
                </strong>

                {report.inspectedBy}
              </p>
            )}

            {report.verificationNotes && (
              <p>
                <strong>
                  Inspector Notes:
                </strong>

                {report.verificationNotes}
              </p>
            )}

          </div>

        </section>
      )}

      <section className="panel">

        <h2>Evidence</h2>

        <div className="evidence-placeholder">

          {report.evidence ? (
            <p>
              Uploaded file:{" "}
              {report.evidence}
            </p>
          ) : (
            <p>
              No evidence photo uploaded.
            </p>
          )}

        </div>

      </section>

      <section className="panel">

        <h2>
          Report Timeline
        </h2>

        <div className="timeline">

          <div className="timeline-item active">
            <span>01</span>
            <strong>
              Reported
            </strong>
            <small>
              {report.date} {report.time}
            </small>
          </div>

          <div
            className={
              report.inspectedAt ||
              report.status !== "New"
                ? "timeline-item active"
                : "timeline-item"
            }
          >
            <span>02</span>
            <strong>
              Inspection Review
            </strong>

            {report.inspectedBy && (
              <small>
                Inspector: {report.inspectedBy}
              </small>
            )}

            {!report.inspectedBy && (
              <small>
                Inspector: Not assigned
              </small>
            )}

            {report.inspectedAt && (
              <small>
                {new Date(
                  report.inspectedAt
                ).toLocaleString()}
              </small>
            )}

            {!report.inspectedAt && (
              <small>
                Review date: Pending
              </small>
            )}

            {report.verificationNotes && (
              <small className="timeline-note">
                {report.verificationNotes}
              </small>
            )}

            {!report.verificationNotes && (
              <small className="timeline-note">
                Inspector notes: Pending review
              </small>
            )}

            {report.status === "Rejected" && (
              <small>
                Decision: Rejected
              </small>
            )}

            {report.status ===
              "Needs Information" && (
              <small>
                Decision: More information requested
              </small>
            )}
          </div>

          <div
            className={
              report.status === "Verified" ||
              report.status === "Ongoing" ||
              report.status === "Closed"
                ? "timeline-item active"
                : "timeline-item"
            }
          >
            <span>03</span>
            <strong>
              Verified
            </strong>

            {report.verifiedBy && (
              <small>
                By: {report.verifiedBy}
              </small>
            )}

            {report.verifiedAt && (
              <small>
                {new Date(
                  report.verifiedAt
                ).toLocaleString()}
              </small>
            )}

            {!report.verifiedBy && (
              <small>
                Verified by: Pending
              </small>
            )}

            {!report.verifiedAt && (
              <small>
                Verification date: Pending
              </small>
            )}

            {report.status !== "Verified" &&
              report.status !== "Ongoing" &&
              report.status !== "Closed" && (
              <small>
                Verification details will appear
                after inspector review.
              </small>
            )}
          </div>

          <div
            className={
              report.status === "Ongoing" ||
              report.status === "Closed"
                ? "timeline-item active"
                : "timeline-item"
            }
          >
            <span>04</span>
            <strong>
              Assigned / In Progress
            </strong>

            {report.status === "Ongoing" ||
            report.status === "Closed" ? (
              <small>
                Repair work is in progress.
              </small>
            ) : (
              <small>
                Assignment details: Pending
              </small>
            )}
          </div>

          <div
            className={
              report.status === "Closed"
                ? "timeline-item active"
                : "timeline-item"
            }
          >
            <span>05</span>
            <strong>
              Completed
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   FIELD INSPECTOR DASHBOARD
========================================================= */
