import { useState } from "react";
import logo from "../../assets/roadwatch-logo.png";
import { DEFAULT_USERS, calculateAge } from "../../data/defaultData";
export default function Register({
  setAuthPage,
  onRegister,
  setShowMinorModal,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    mobile: "",
    houseNumber: "",
    street: "",
    barangay: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function updateField(field, value) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  function handleRegister() {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.birthday ||
      !form.mobile ||
      !form.houseNumber ||
      !form.street ||
      !form.barangay ||
      !form.city ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert(
        "Please complete all required fields."
      );
      return;
    }

    const age = calculateAge(
      form.birthday
    );

    if (age < 18) {
      setShowMinorModal(true);
      return;
    }

    if (form.password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(
      localStorage.getItem("users") ||
        JSON.stringify(DEFAULT_USERS)
    );

    const emailExists =
      existingUsers.some(
        (user) =>
          user.email.toLowerCase() ===
          form.email.toLowerCase()
      );

    if (emailExists) {
      alert(
        "An account with this email already exists."
      );
      return;
    }

    const newUser = {
      firstName: form.firstName,
      lastName: form.lastName,
      birthday: form.birthday,
      mobile: form.mobile,

      address: {
        houseNumber:
          form.houseNumber,
        street: form.street,
        barangay: form.barangay,
        city: form.city,
      },

      email: form.email,
      password: form.password,
      role: "Citizen",
    };

    localStorage.setItem(
      "users",
      JSON.stringify([
        ...existingUsers,
        newUser,
      ])
    );

    onRegister();
  }

  return (
    <main className="auth-page">
      <div className="auth-card register-card">

        <div className="register-header">
          <img
            src={logo}
            alt="RoadWatch Logo"
            className="auth-logo"
          />

          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Join RoadWatch and help monitor
            your community.
          </p>
        </div>

        {/* PERSONAL INFORMATION */}

        <div className="register-section">
          <h3>
            Personal Information
          </h3>

          <div className="two-column">
            <label>
              First Name

              <input
                type="text"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={(e) =>
                  updateField(
                    "firstName",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Last Name

              <input
                type="text"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={(e) =>
                  updateField(
                    "lastName",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Birthday

              <input
                type="date"
                value={form.birthday}
                onChange={(e) =>
                  updateField(
                    "birthday",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Mobile Number

              <input
                type="tel"
                placeholder="09XXXXXXXXX"
                value={form.mobile}
                onChange={(e) =>
                  updateField(
                    "mobile",
                    e.target.value
                  )
                }
              />
            </label>
          </div>
        </div>

        {/* ADDRESS */}

        <div className="register-section">
          <h3>Address</h3>

          <div className="address-grid">
            <label>
              House No.

              <input
                type="text"
                placeholder="House no."
                value={
                  form.houseNumber
                }
                onChange={(e) =>
                  updateField(
                    "houseNumber",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Street

              <input
                type="text"
                placeholder="Street"
                value={form.street}
                onChange={(e) =>
                  updateField(
                    "street",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Barangay

              <input
                type="text"
                placeholder="Barangay"
                value={form.barangay}
                onChange={(e) =>
                  updateField(
                    "barangay",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              City

              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  updateField(
                    "city",
                    e.target.value
                  )
                }
              />
            </label>
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}

        <div className="register-section">
          <h3>
            Account Information
          </h3>

          <div className="two-column">
            <label>
              Email Address

              <input
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Password

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) =>
                  updateField(
                    "password",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Confirm Password

              <input
                type="password"
                placeholder="Confirm password"
                value={
                  form.confirmPassword
                }
                onChange={(e) =>
                  updateField(
                    "confirmPassword",
                    e.target.value
                  )
                }
              />
            </label>
          </div>
        </div>

        {/* CREATE ACCOUNT */}

        <button
          className="gold auth-submit"
          onClick={handleRegister}
        >
          Create Account
        </button>

        {/* BACK TO LOGIN */}

        <button
          className="link-btn register-back"
          onClick={() =>
            setAuthPage("login")
          }
        >
          ← Back to Login
        </button>

      </div>
    </main>
  );
}

/* =========================================================
   CITIZEN DASHBOARD
========================================================= */



