# Database Sample Data

This development-only sample adds categories and three reports to the existing
`softeng1` database. It also adds matching status history, verification,
assignment, and photo-metadata documents. The script is safe to rerun and does
not delete existing data.

The backend creates hashed demo users when `users` is empty in development.
Start the backend once before running this script, then open MongoDB Shell:

```powershell
mongosh "mongodb://127.0.0.1:27017/softeng1"
```

Paste the following into `mongosh`:

```javascript
db = db.getSiblingDB("softeng1");

const citizen = db.users.findOne({ email: "citizen@roadwatch.com" });
const inspector = db.users.findOne({ email: "inspector@roadwatch.com" });

if (!citizen || !inspector) {
  throw new Error(
    "Start the backend with an empty development users collection to create demo accounts."
  );
}

const categoryNames = [
  "Road Damage",
  "Streetlight",
  "Drainage",
  "Public Facility",
];

for (const name of categoryNames) {
  const existing = db.categories.findOne({
    $or: [{ category_name: name }, { name }],
  });

  if (existing) {
    db.categories.updateOne(
      { _id: existing._id },
      { $set: { name, category_name: name, active: true } }
    );
  } else {
    db.categories.insertOne({ name, category_name: name, active: true });
  }
}

const categories = Object.fromEntries(
  db.categories.find({}).toArray().map((category) => [
    category.category_name || category.name,
    category._id,
  ])
);

const sampleReports = [
  {
    id: "PF-DEMO-1001",
    category: "Road Damage",
    issue: "Large Pothole",
    location: "Barangay Commonwealth, Quezon City",
    date: "September 25, 2026",
    time: "9:30 AM",
    priority: "High",
    status: "New",
    description: "A large pothole near the school zone.",
    evidence: "pothole-sample.jpg",
  },
  {
    id: "PF-DEMO-1002",
    category: "Streetlight",
    issue: "Broken Streetlight",
    location: "Barangay Malaya, Quezon City",
    date: "September 24, 2026",
    time: "7:15 PM",
    priority: "Medium",
    status: "Verified",
    description: "A streetlight is not working near the main road.",
    evidence: "streetlight-sample.jpg",
    verificationNotes: "The light is not functioning and needs repair.",
    inspectedAt: new Date("2026-09-25T02:00:00Z"),
    inspectedBy: "Maria Santos",
    inspectedByEmail: inspector.email,
    verifiedBy: "Maria Santos",
    verifiedAt: new Date("2026-09-25T02:00:00Z"),
  },
  {
    id: "PF-DEMO-1003",
    category: "Drainage",
    issue: "Blocked Drainage",
    location: "Barangay Central, Quezon City",
    date: "September 20, 2026",
    time: "2:20 PM",
    priority: "High",
    status: "Ongoing",
    description: "A blocked drainage channel causes water to collect during rain.",
    evidence: "drainage-sample.jpg",
    verificationNotes: "The blockage was confirmed during inspection.",
    inspectedAt: new Date("2026-09-21T04:00:00Z"),
    inspectedBy: "Maria Santos",
    inspectedByEmail: inspector.email,
    verifiedBy: "Maria Santos",
    verifiedAt: new Date("2026-09-21T04:00:00Z"),
  },
];

for (const sample of sampleReports) {
  const createdAt = new Date("2026-09-25T01:30:00Z");
  const report = {
    ...sample,
    report_id: sample.id,
    citizen_id: citizen._id,
    category_id: categories[sample.category],
    reporter: `${citizen.firstName} ${citizen.lastName}`,
    reporterEmail: citizen.email,
    createdByEmail: citizen.email,
    createdAt,
    created_at: createdAt,
  };

  db.reports.updateOne(
    { report_id: sample.id },
    { $setOnInsert: report },
    { upsert: true }
  );

  const history = [
    { status: "New", changed_by: citizen._id, changed_at: createdAt },
  ];
  if (sample.status === "Verified" || sample.status === "Ongoing") {
    history.push({
      status: "Verified",
      changed_by: inspector._id,
      changed_at: sample.inspectedAt,
    });
  }
  if (sample.status === "Ongoing") {
    history.push({
      status: "Ongoing",
      changed_by: inspector._id,
      changed_at: new Date("2026-09-22T01:00:00Z"),
    });
  }

  for (const entry of history) {
    db.status_logs.updateOne(
      { report_id: sample.id, status: entry.status },
      {
        $setOnInsert: {
          ...entry,
          report_id: sample.id,
          updatedByEmail: entry.changed_by.equals(citizen._id)
            ? citizen.email
            : inspector.email,
        },
      },
      { upsert: true }
    );
  }

  db.report_photos.updateOne(
    { report_id: sample.id, filename: sample.evidence },
    {
      $setOnInsert: {
        report_id: sample.id,
        filename: sample.evidence,
        uploaded_by_email: citizen.email,
        created_at: createdAt,
      },
    },
    { upsert: true }
  );

  if (sample.inspectedAt) {
    db.verifications.updateOne(
      { report_id: sample.id },
      {
        $setOnInsert: {
          report_id: sample.id,
          status: "Verified",
          inspector_id: inspector._id,
          inspectorEmail: inspector.email,
          inspectedBy: sample.inspectedBy,
          notes: sample.verificationNotes,
          priority: sample.priority,
          inspectedAt: sample.inspectedAt,
        },
      },
      { upsert: true }
    );
  }

  if (sample.status === "Ongoing") {
    db.assignments.updateOne(
      { report_id: sample.id },
      {
        $setOnInsert: {
          report_id: sample.id,
          assigned_to_email: inspector.email,
          crew_supervisor_id: inspector._id,
          assigned_by: inspector._id,
          status: "Active",
          assigned_at: new Date("2026-09-22T01:00:00Z"),
        },
      },
      { upsert: true }
    );
  }
}

print("Sample categories and reports are ready in softeng1.");
```

The image values are filenames only, matching the current frontend. They do not
contain image bytes. Demo users use the local development password `123456`; do
not use these accounts or passwords in production.