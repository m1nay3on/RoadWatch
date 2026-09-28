import logo from "../../assets/roadwatch-logo.png";


export default function Login({
  email,
  password,
  setEmail,
  setPassword,
  onLogin,
  setAuthPage,
}) {
  return (
    <main className="auth-page">
      <div className="auth-card login-card">
        <img
          src={logo}
          alt="RoadWatch Logo"
          className="auth-logo"
        />

        <h1>RoadWatch</h1>

        <p className="auth-subtitle">
          Public Infrastructure Monitoring
          System
        </p>

        <div className="form">
          <label>
            Email Address

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </label>

          <label>
            Password

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </label>

          <button
            className="gold auth-submit"
            onClick={onLogin}
          >
            Log In
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account?

          <button
            className="link-btn"
            onClick={() =>
              setAuthPage("register")
            }
          >
            Create Account
          </button>
        </p>
      </div>
    </main>
  );
}

/* =========================================================
   REGISTER / CREATE ACCOUNT
========================================================= */


