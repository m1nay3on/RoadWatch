import { useState } from "react";
import EvidencePhoto from "../../components/EvidencePhoto";
import ReportConversation from "../../components/ReportConversation";
import ReportTimeline from "../../components/ReportTimeline";

export default function ReportDetails({
  setActive,
  report,
  onResubmitReport,
}) {
  const [responseText, setResponseText] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

      <section className="panel">

        <h2>Evidence</h2>

        <div className="evidence-placeholder">
          <EvidencePhoto report={report} />
        </div>

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

      {(report.conversation?.length || report.status === "Needs Information" || report.citizenResponse) && (
        <section className="panel conversation-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">REPORT FOLLOW-UP</p>
              <h2>Conversation with Inspector</h2>
            </div>
            <span className={`status status-${report.status.toLowerCase().replaceAll(" ", "-")}`}>
              {report.status}
            </span>
          </div>

          <ReportConversation
            messages={report.conversation || []}
            legacyInspectorNote={report.status === "Needs Information" ? report.verificationNotes : ""}
            legacyCitizenResponse={report.citizenResponse}
          />

          {report.status === "Needs Information" ? (
            <div className="form conversation-reply">
              <label>
                Your response
                <textarea
                  maxLength={2000}
                  value={responseText}
                  onChange={(event) => {
                    setResponseText(event.target.value);
                    setLocalMessage("");
                  }}
                  placeholder="Reply to the inspector's request..."
                />
              </label>

              {localMessage && (
                <p className="feedback-message" aria-live="polite">
                  {localMessage}
                </p>
              )}

              <button
                className="gold"
                type="button"
                disabled={submitting}
                onClick={async () => {
                  if (!responseText.trim()) {
                    setLocalMessage("Please enter the information the inspector requested.");
                    return;
                  }

                  setSubmitting(true);
                  try {
                    const submitted = await onResubmitReport(report.id, responseText);
                    if (submitted) {
                      setResponseText("");
                      setLocalMessage("Your response was sent to the inspector.");
                    } else {
                      setLocalMessage("Your response could not be submitted. Please try again.");
                    }
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {submitting ? "Sending..." : "Send Response"}
              </button>
            </div>
          ) : (
            <p className="subtitle conversation-awaiting">
              Your response has been sent. The inspector will review it and update the report.
            </p>
          )}
        </section>
      )}

      <ReportTimeline report={report} />

    </main>
  );
}

/* =========================================================
   FIELD INSPECTOR DASHBOARD
========================================================= */
