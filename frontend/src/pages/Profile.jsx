import logo from "../assets/roadwatch-logo.png";


export default function Profile({
  user,
  role,
  onLogout,
}) {
  return (
    <main className="main">

      <p className="eyebrow">
        ACCOUNT
      </p>

      <h1>Profile</h1>

      <p className="subtitle">
        View your RoadWatch account
        information.
      </p>

      <section className="panel profile-card">

        <div className="profile-header">

          <img
            src={logo}
            alt="RoadWatch Logo"
          />

          <div>

            <h2>
              {user.firstName}{" "}
              {user.lastName}
            </h2>

            <span>
              {role}
            </span>

          </div>

        </div>

        <div className="profile-info">

          <p>
            <strong>
              Email
            </strong>

            {user.email}
          </p>

          <p>
            <strong>
              Mobile
            </strong>

            {user.mobile}
          </p>

          <p>
            <strong>
              Address
            </strong>

            {user.address.houseNumber}{" "}
            {user.address.street},{" "}
            {user.address.barangay},{" "}
            {user.address.city}
          </p>

        </div>

        <button
          className="danger-btn"
          onClick={onLogout}
        >
          Log Out
        </button>

      </section>

    </main>
  );
}

/* =========================================================
   MAIN APP
========================================================= */


