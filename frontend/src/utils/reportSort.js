function getReportTimestamp(report) {
  const value = report.createdAt || report.created_at ||
    (report.date ? `${report.date} ${report.time || ""}` : "");
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getLatestReports(reports, limit = 5) {
  return [...reports]
    .sort((left, right) => getReportTimestamp(right) - getReportTimestamp(left))
    .slice(0, limit);
}
