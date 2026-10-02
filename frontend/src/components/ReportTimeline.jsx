export default function ReportTimeline({
  report,
  title = "Report Timeline",
}) {
  const verifiedStatuses = [
    "Verified",
    "Ongoing",
    "Endorsed to Engineering Office",
    "Closed",
  ];
  const isVerified = verifiedStatuses.includes(report.status);
  const isEndorsed = Boolean(report.endorsedAt) &&
    ["Endorsed to Engineering Office", "Closed"].includes(report.status);
  const items = [
    {
      title: "Reported",
      active: true,
      details: [{ text: `${report.date} ${report.time}`.trim() }],
    },
    {
      title: "Inspection Review",
      active: Boolean(report.inspectedAt) || report.status !== "New",
      details: [
        { text: `Inspector: ${report.inspectedBy || "Not assigned"}` },
        {
          text: report.inspectedAt
            ? new Date(report.inspectedAt).toLocaleString()
            : "Review date: Pending",
        },
        {
          text: report.verificationNotes || "Inspector notes: Pending review",
          className: "timeline-note",
        },
        ...(report.status === "Rejected"
          ? [{ text: "Decision: Rejected" }]
          : report.status === "Needs Information"
            ? [{ text: "Decision: More information requested" }]
            : []),
      ],
    },
    {
      title: "Verified",
      active: isVerified,
      details: [
        { text: `By: ${report.verifiedBy || "Pending"}` },
        {
          text: report.verifiedAt
            ? new Date(report.verifiedAt).toLocaleString()
            : "Verification date: Pending",
        },
        ...(!isVerified
          ? [{ text: "Verification details will appear after inspector review." }]
          : []),
      ],
    },
    {
      title: "Engineering Office Endorsement",
      active: isEndorsed,
      details: [
        {
          text: isEndorsed
            ? `Endorsed to: ${report.endorsedTo || "Engineering Office"}`
            : "Endorsement: Pending",
        },
        ...(isEndorsed && report.endorsedBy
          ? [{ text: `Endorsed by: ${report.endorsedBy}` }]
          : []),
        ...(isEndorsed && report.endorsedAt
          ? [{ text: new Date(report.endorsedAt).toLocaleString() }]
          : []),
      ],
    },
    {
      title: "Completed",
      active: report.status === "Closed",
      details: report.closedAt
        ? [{ text: new Date(report.closedAt).toLocaleString() }]
        : [],
    },
  ];

  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="timeline">
        {items.map((item, index) => (
          <div
            className={item.active ? "timeline-item active" : "timeline-item"}
            key={`${item.title}-${index}`}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            {item.details.map((detail, detailIndex) => (
              <small
                className={detail.className}
                key={`${detail.text}-${detailIndex}`}
              >
                {detail.text}
              </small>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
