import { useState } from "react";


export default function SubmitReport({
  setActive,
  user,
  onSubmit,
}) {
  const [form, setForm] =
    useState({
      category: "Road Damage",
      description: "",
      location: "",
      evidence: "",
    });

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.description ||
      !form.location
    ) {
      alert(
        "Please complete the description and location."
      );

      return;
    }

    const report = {
      id: `PF-${String(
        Date.now()
      ).slice(-4)}`,

      issue: form.category,

      category:
        form.category,

      location:
        form.location,

      date:
        new Date().toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        ),

      time:
        new Date().toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        ),

      priority: "Medium",

      status: "New",

      description:
        form.description,

      reporter:
        `${user.firstName} ${user.lastName}`,

      reporterEmail:
        user.email,

      evidence:
        form.evidence,
    };

    onSubmit(report);
  }

  return (
    <main className="main">

      <button
        className="back-btn"
        onClick={() =>
          setActive("Dashboard")
        }
      >
        ← Back to Dashboard
      </button>

      <p className="eyebrow">
        REPORT AN ISSUE
      </p>

      <h1>Submit Damage Report</h1>

      <p className="subtitle">
        Provide accurate details so the
        issue can be verified and
        assigned.
      </p>

      <section className="form-grid">

        <form
          className="panel form"
          onSubmit={handleSubmit}
        >

          <label>
            Reporter Name

            <input
              className="readonly-input"
              value={`${user.firstName} ${user.lastName}`}
              disabled
              readOnly
            />

            <small>
              Automatically filled from
              your account.
            </small>
          </label>

          <label>
            Category

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
            >
              <option>
                Road Damage
              </option>

              <option>
                Streetlight
              </option>

              <option>
                Drainage
              </option>

              <option>
                Public Facility
              </option>
            </select>
          </label>

          <label>
            Description

            <textarea
              placeholder="Describe the damage or issue..."
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            Exact Location

            <input
              placeholder="Street / Barangay / Landmark"
              value={
                form.location
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  location:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            Photo Evidence

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) =>
                setForm({
                  ...form,
                  evidence:
                    e.target.files?.[0]
                      ?.name || "",
                })
              }
            />
          </label>

          <button
            className="gold"
            type="submit"
          >
            Submit Report
          </button>

        </form>

        <aside className="panel information-panel">

          <p className="eyebrow">
            HOW IT WORKS
          </p>

          <h2>
            Submission Process
          </h2>

          <div className="process-step">
            <span>01</span>

            <div>
              <strong>
                Submit
              </strong>

              <p>
                Send your infrastructure
                concern.
              </p>
            </div>
          </div>

          <div className="process-step">
            <span>02</span>

            <div>
              <strong>
                Verify
              </strong>

              <p>
                An inspector reviews
                your report.
              </p>
            </div>
          </div>

          <div className="process-step">
            <span>03</span>

            <div>
              <strong>
                Assign
              </strong>

              <p>
                The issue is assigned
                for action.
              </p>
            </div>
          </div>

          <div className="process-step">
            <span>04</span>

            <div>
              <strong>
                Track
              </strong>

              <p>
                Follow the repair
                progress.
              </p>
            </div>
          </div>

        </aside>

      </section>

    </main>
  );
}

/* =========================================================
   MY REPORTS
========================================================= */


