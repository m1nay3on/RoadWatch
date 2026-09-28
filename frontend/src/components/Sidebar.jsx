import logo from "../assets/roadwatch-logo.png";


export default function Sidebar({
  role,
  active,
  setActive,
  user,
}) {
  const navigation = [
    "Dashboard",

    ...(role === "Citizen"
      ? ["Submit Report", "My Reports"]
      : []),

    ...(role === "Field Inspector"
      ? [
          "Verification Queue",
          "Inspector Reports",
        ]
      : []),

    ...(role === "Administrator"
      ? [
          "Administrator",
          "Inspected Reports",
          "Report Completion",
        ]
      : []),

    "Profile",
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          src={logo}
          alt="RoadWatch Logo"
          className="sidebar-logo"
        />

        <div>
          <strong>ROADWATCH</strong>

          <span>
            PUBLIC INFRASTRUCTURE MONITOR
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <button
            key={item}
            className={
              active === item
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setActive(item)
            }
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="account">
        <b>
          {user?.firstName}{" "}
          {user?.lastName}
        </b>

        <span>{role}</span>

        <span>{user?.email}</span>
      </div>
    </aside>
  );
}

/* =========================================================
   LOGIN
========================================================= */
