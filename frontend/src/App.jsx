import { useState } from "react";
import "./App.css";
import { DEFAULT_USERS, DEFAULT_REPORTS } from "./data/defaultData";
import SuccessModal, { MinorModal } from "./components/Modals";
import Sidebar from "./components/Sidebar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/citizen/Dashboard";
import SubmitReport from "./pages/citizen/SubmitReport";
import MyReports from "./pages/citizen/MyReports";
import ReportDetails from "./pages/citizen/ReportDetails";
import InspectorDashboard from "./pages/inspector/InspectorDashboard";
import InspectorReports from "./pages/inspector/InspectorReports";
import InspectorReportDetails from "./pages/inspector/InspectorReportDetails";
import AdminDashboard from "./pages/administrator/AdminDashboard";
import AdminReports from "./pages/administrator/AdminReports";
import AdminManagement from "./pages/administrator/AdminManagement";
import AdminCompletion from "./pages/administrator/AdminCompletion";
import Profile from "./pages/Profile";

export default function App() {

  const [active, setActive] =
    useState("Dashboard");

  const [users, setUsers] =
    useState(() =>
      JSON.parse(
        localStorage.getItem(
          "users"
        ) ||
          JSON.stringify(
            DEFAULT_USERS
          )
      )
    );

  const [reports, setReports] =
    useState(DEFAULT_REPORTS);

  const [role, setRole] =
    useState(
      localStorage.getItem(
        "role"
      ) || ""
    );

  const [email, setEmail] =
    useState(
      localStorage.getItem(
        "email"
      ) || ""
    );

  const [password, setPassword] =
    useState("");

  const [
    authenticated,
    setAuthenticated,
  ] = useState(
    localStorage.getItem(
      "authenticated"
    ) === "true"
  );

  const [authPage, setAuthPage] =
    useState("login");

  const [modal, setModal] =
    useState("");

  const [
    showMinorModal,
    setShowMinorModal,
  ] = useState(false);

  const currentUser =
    users.find(
      (user) =>
        user.email === email
    );

  /* =====================================================
     LOGIN
  ===================================================== */

  function handleLogin() {
    const user =
      users.find(
        (item) =>
          item.email.toLowerCase() ===
            email.toLowerCase() &&
          item.password ===
            password
      );

    if (!user) {
      alert(
        "Invalid email or password."
      );

      return;
    }

    setRole(user.role);

    setEmail(user.email);

    localStorage.setItem(
      "role",
      user.role
    );

    localStorage.setItem(
      "email",
      user.email
    );

    localStorage.setItem(
      "authenticated",
      "true"
    );

    setPassword("");

    setAuthenticated(true);

    setActive("Dashboard");

    setModal(
      "Login successful."
    );
  }

  /* =====================================================
     REGISTRATION
  ===================================================== */

  function handleRegistrationSuccess() {
    const storedUsers =
      JSON.parse(
        localStorage.getItem(
          "users"
        ) ||
          JSON.stringify(
            DEFAULT_USERS
          )
      );

    setUsers(storedUsers);

    setAuthPage("login");

    setModal(
      "Your account has been created successfully."
    );
  }

  /* =====================================================
     SUBMIT REPORT
  ===================================================== */

  function handleSubmitReport(
    report
  ) {
    setReports(
      (previousReports) => [
        report,
        ...previousReports,
      ]
    );

    setActive("My Reports");

    setModal(
      "Your report has been submitted successfully."
    );
  }

  /* =====================================================
     UPDATE REPORT
  ===================================================== */

  function updateReportStatus(
    reportId,
    status,
    inspection = {}
  ) {
    setReports(
      (previousReports) =>
        previousReports.map(
          (report) =>
            report.id === reportId
              ? {
                  ...report,
                    status,
                    ...inspection,
                  }
              : report
        )
    );
  }

  function createAdminUser(user) {
    const exists = users.some(
      (item) =>
        item.email.toLowerCase() ===
        user.email.toLowerCase()
    );

    if (exists) {
      alert(
        "An account with this email already exists."
      );
      return false;
    }

    setUsers((previousUsers) => {
      const nextUsers = [
        ...previousUsers,
        user,
      ];
      localStorage.setItem(
        "users",
        JSON.stringify(nextUsers)
      );
      return nextUsers;
    });
    return true;
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  function handleLogout() {
    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "email"
    );

    localStorage.removeItem(
      "authenticated"
    );

    setRole("");
    setEmail("");
    setPassword("");

    setAuthenticated(false);

    setAuthPage("login");

    setActive("Dashboard");
  }

  /* =====================================================
     AUTHENTICATION SCREEN
  ===================================================== */

  if (!authenticated) {

    if (authPage === "login") {
      return (
        <>
          <Login
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={
              setPassword
            }
            onLogin={
              handleLogin
            }
            setAuthPage={
              setAuthPage
            }
          />

          {modal && (
            <SuccessModal
              message={modal}
              onClose={() =>
                setModal("")
              }
            />
          )}
        </>
      );
    }

    return (
      <>
        <Register
          setAuthPage={
            setAuthPage
          }
          onRegister={
            handleRegistrationSuccess
          }
          setShowMinorModal={
            setShowMinorModal
          }
        />

        {modal && (
          <SuccessModal
            message={modal}
            onClose={() =>
              setModal("")
            }
          />
        )}

        {showMinorModal && (
          <MinorModal
            onClose={() =>
              setShowMinorModal(
                false
              )
            }
          />
        )}
      </>
    );
  }

  /* =====================================================
     SELECTED REPORT
  ===================================================== */

  const selectedReportId =
    active.includes(":")
      ? active.split(":")[1]
      : null;

  const selectedReport =
    reports.find(
      (report) =>
        report.id ===
        selectedReportId
    );

  /* =====================================================
     AUTHENTICATED APPLICATION
  ===================================================== */

  return (
    <div className="app">

      <Sidebar
        role={role}
        active={
          active.includes(":")
            ? active.split(":")[0]
            : active
        }
        setActive={
          setActive
        }
        user={
          currentUser
        }
      />

      {/* CITIZEN DASHBOARD */}

      {active ===
        "Dashboard" &&
        role === "Citizen" && (
          <Dashboard
            setActive={
              setActive
            }
            reports={
              reports
            }
            user={
              currentUser
            }
          />
        )}

      {/* INSPECTOR DASHBOARD */}

      {active ===
        "Dashboard" &&
        role ===
          "Field Inspector" && (
          <InspectorDashboard
            setActive={
              setActive
            }
            reports={
              reports
            }
          />
        )}

      {/* ADMIN DASHBOARD */}

      {active ===
        "Dashboard" &&
        role ===
          "Administrator" && (
          <AdminDashboard
            reports={reports}
            users={users}
          />
        )}

      {/* SUBMIT REPORT */}

      {active ===
        "Submit Report" &&
        role === "Citizen" && (
          <SubmitReport
            setActive={
              setActive
            }
            user={
              currentUser
            }
            onSubmit={
              handleSubmitReport
            }
          />
        )}

      {/* MY REPORTS */}

      {active ===
        "My Reports" &&
        role === "Citizen" && (
          <MyReports
            setActive={
              setActive
            }
            reports={
              reports
            }
            user={
              currentUser
            }
          />
        )}

      {/* CITIZEN REPORT DETAILS */}

      {active.startsWith(
        "Report Details:"
      ) &&
        role === "Citizen" && (
          <ReportDetails
            setActive={
              setActive
            }
            report={
              selectedReport
            }
          />
        )}

      {/* VERIFICATION QUEUE */}

      {active ===
        "Verification Queue" &&
        role ===
          "Field Inspector" && (
          <InspectorDashboard
            setActive={
              setActive
            }
            reports={
              reports
            }
          />
        )}

      {/* INSPECTOR REPORTS */}

      {active ===
        "Inspector Reports" &&
        role ===
          "Field Inspector" && (
          <InspectorReports
            setActive={
              setActive
            }
            reports={
              reports
            }
          />
        )}

      {/* INSPECTOR DETAILS */}

      {active.startsWith(
        "Inspector Details:"
      ) &&
        role ===
          "Field Inspector" && (
          <InspectorReportDetails
            setActive={
              setActive
            }
            report={
              selectedReport
            }
            inspector={currentUser}
            onUpdateReport={
              updateReportStatus
            }
          />
        )}

      {/* ADMINISTRATOR */}

      {active ===
        "Administrator" &&
        role ===
          "Administrator" && (
          <AdminManagement
            reports={reports}
            users={users}
            onCreateUser={createAdminUser}
          />
        )}

      {/* ADMIN INSPECTED REPORTS */}

      {active ===
        "Inspected Reports" &&
        role ===
          "Administrator" && (
          <AdminReports
            reports={
              reports
            }
            users={
              users
            }
          />
        )}

      {/* ADMIN REPORT COMPLETION */}

      {active ===
        "Report Completion" &&
        role ===
          "Administrator" && (
          <AdminCompletion
            reports={reports}
            onUpdateReport={
              updateReportStatus
            }
          />
        )}

      {/* PROFILE */}

      {active === "Profile" && (
        <Profile
          user={
            currentUser
          }
          role={role}
          onLogout={
            handleLogout
          }
        />
      )}

      {/* SUCCESS MODAL */}

      {modal && (
        <SuccessModal
          message={modal}
          onClose={() =>
            setModal("")
          }
        />
      )}

    </div>
  );
}
