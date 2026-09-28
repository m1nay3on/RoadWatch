import logo from "../assets/roadwatch-logo.png";


export default function SuccessModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal success-modal">
        <img
          src={logo}
          alt="RoadWatch Logo"
          className="modal-logo"
        />

        <div className="success-icon">
          ✓
        </div>

        <h2>Success</h2>

        <p>{message}</p>

        <button
          className="gold small-btn"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MINOR MODAL
========================================================= */



export function MinorModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal warning-modal">
        <div className="warning-icon">
          !
        </div>

        <h2>Registration Blocked</h2>

        <p>
          You must be at least 18 years old
          to create a RoadWatch account.
        </p>

        <button
          className="gold small-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */



