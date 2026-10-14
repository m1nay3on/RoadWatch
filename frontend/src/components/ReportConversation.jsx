export default function ReportConversation({
  messages = [],
  legacyInspectorNote,
  legacyCitizenResponse,
}) {
  const conversation = messages.length
    ? messages
    : [
        ...(legacyInspectorNote
          ? [{
              senderRole: "Field Inspector",
              senderName: "Field Inspector",
              message: legacyInspectorNote,
            }]
          : []),
        ...(legacyCitizenResponse
          ? [{
              senderRole: "Citizen",
              senderName: "Citizen",
              message: legacyCitizenResponse,
            }]
          : []),
      ];

  return (
    <div className="conversation-thread" aria-live="polite">
      {conversation.length ? conversation.map((entry, index) => (
        <article
          className={`conversation-message conversation-${entry.senderRole === "Citizen" ? "citizen" : "inspector"}`}
          key={`${entry.createdAt || "legacy"}-${index}`}
        >
          <div className="conversation-message-heading">
            <strong>{entry.senderName || entry.senderRole}</strong>
            <span>{entry.senderRole === "Citizen" ? "Citizen" : "Inspector"}</span>
          </div>
          <p>{entry.message}</p>
          {entry.createdAt && (
            <time dateTime={entry.createdAt}>
              {new Date(entry.createdAt).toLocaleString()}
            </time>
          )}
        </article>
      )) : (
        <p className="subtitle">No messages have been exchanged yet.</p>
      )}
    </div>
  );
}
