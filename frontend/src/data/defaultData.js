export const DEFAULT_USERS = [
  {
    firstName: "Juan",
    lastName: "Dela Cruz",
    birthday: "2000-05-15",
    mobile: "09171234567",
    address: {
      houseNumber: "123",
      street: "Main Street",
      barangay: "Commonwealth",
      city: "Quezon City",
    },
    email: "citizen@roadwatch.com",
    password: "123456",
    role: "Citizen",
  },
  {
    firstName: "Maria",
    lastName: "Santos",
    birthday: "1995-03-10",
    mobile: "09181234567",
    address: {
      houseNumber: "456",
      street: "Malaya Street",
      barangay: "Malaya",
      city: "Quezon City",
    },
    email: "inspector@roadwatch.com",
    password: "123456",
    role: "Field Inspector",
  },
  {
    firstName: "Admin",
    lastName: "User",
    birthday: "1990-01-01",
    mobile: "09191234567",
    address: {
      houseNumber: "789",
      street: "Central Street",
      barangay: "Central",
      city: "Quezon City",
    },
    email: "admin@roadwatch.com",
    password: "123456",
    role: "Administrator",
  },
];

/* =========================================================
   DEFAULT REPORTS
========================================================= */

export const DEFAULT_REPORTS = [
  {
    id: "PF-0012",
    issue: "Large Pothole",
    category: "Road Damage",
    location: "Barangay Commonwealth, Quezon City",
    date: "September 25, 2026",
    time: "9:30 AM",
    priority: "High",
    status: "Ongoing",
    description:
      "Large pothole near the school zone creating traffic delays and safety concerns.",
    reporter: "Juan Dela Cruz",
    reporterEmail: "citizen@roadwatch.com",
    evidence: "",
  },
  {
    id: "PF-0013",
    issue: "Broken Streetlight",
    category: "Streetlight",
    location: "Barangay Malaya, Quezon City",
    date: "September 24, 2026",
    time: "7:15 PM",
    priority: "Medium",
    status: "New",
    description:
      "Streetlight is no longer functioning and the area becomes very dark at night.",
    reporter: "Juan Dela Cruz",
    reporterEmail: "citizen@roadwatch.com",
    evidence: "",
  },
  {
    id: "PF-0015",
    issue: "Drainage Problem",
    category: "Drainage",
    location: "Barangay Central, Quezon City",
    date: "September 20, 2026",
    time: "2:20 PM",
    priority: "High",
    status: "Ongoing",
    description:
      "Drainage is blocked and water accumulates along the road during rainfall.",
    reporter: "Juan Dela Cruz",
    reporterEmail: "citizen@roadwatch.com",
    evidence: "",
  },
  {
    id: "PF-0018",
    issue: "Flooded Drainage",
    category: "Drainage",
    location: "Barangay Central, Quezon City",
    date: "September 15, 2026",
    time: "4:45 PM",
    priority: "Medium",
    status: "Closed",
    description:
      "Flooding caused by a blocked drainage system.",
    reporter: "Juan Dela Cruz",
    reporterEmail: "citizen@roadwatch.com",
    evidence: "",
  },
];

export function calculateAge(birthday) {
  if (!birthday) return 0;

  const birthDate = new Date(birthday);
  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}



