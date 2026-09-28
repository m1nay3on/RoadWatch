import logo from "../assets/roadwatch-logo.png";


export default function Sidebar({
  role,
  active,
  setActive,
  user,
  collapsed,
  onToggle,
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
          "Inspected Reports",
          "Report Completion",
          "Administrator Tools"
        ]
      : []),

    "Profile",
  ];

  return (
    <aside
      className={
        collapsed
          ? "sidebar collapsed"
          : "sidebar"
      }
    >
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={
          collapsed
            ? "Open sidebar"
            : "Close sidebar"
        }
        title={
          collapsed
            ? "Open sidebar"
            : "Close sidebar"
        }
      >
        {collapsed ? "☰" : "×"}
      </button>

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
            data-short={item.charAt(0)}
            title={item}
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

