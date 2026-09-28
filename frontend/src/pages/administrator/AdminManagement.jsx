import { useState } from "react";

export default function AdminManagement({
  users,
  onCreateUser,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Citizen",
  });

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function createAccount(event) {
    event.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password
    ) {
      alert("Please complete all account fields.");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    const created = onCreateUser({
      ...form,
      birthday: "",
      mobile: "",
      address: {
        houseNumber: "",
        street: "",
        barangay: "",
        city: "",
      },
    });

    if (created) {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "Citizen",
      });
      alert("Account created successfully.");
    }
  }

  return (
    <main className="main">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Administrator</h1>
      <p className="subtitle">
        Manage user accounts and create new
        RoadWatch accounts.
      </p>

      <section className="panel">
        <h2>Create Account</h2>

        <form className="form admin-account-form" onSubmit={createAccount}>
          <div className="two-column">
            <label>
              First Name
              <input
                value={form.firstName}
                onChange={(e) =>
                  updateField("firstName", e.target.value)
                }
              />
            </label>

            <label>
              Last Name
              <input
                value={form.lastName}
                onChange={(e) =>
                  updateField("lastName", e.target.value)
                }
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
              />
            </label>

            <label>
              Role
              <select
                value={form.role}
                onChange={(e) =>
                  updateField("role", e.target.value)
                }
              >
                <option>Citizen</option>
                <option>Field Inspector</option>
                <option>Administrator</option>
              </select>
            </label>
          </div>

          <button className="gold" type="submit">
            Create Account
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>User Management</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
