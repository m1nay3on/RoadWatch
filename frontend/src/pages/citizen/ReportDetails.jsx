import EvidencePhoto from "../../components/EvidencePhoto";
import ReportTimeline from "../../components/ReportTimeline";

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
          <EvidencePhoto report={report} />
        </div>

      </section>

      <ReportTimeline report={report} />

    </main>
  );
}

/* =========================================================
   FIELD INSPECTOR DASHBOARD
========================================================= */
