import React from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { CheckCircleFill } from "react-bootstrap-icons";

function ReservationConfirmation() {
  const { id } = useParams();

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-5 text-center">
        <CheckCircleFill size={48} className="text-success mb-3" />
        <h2 className="text-success mb-3">Reservation Confirmed</h2>
        <p className="lead">
          Your reservation has been successfully completed.
        </p>
        <p className="fw-bold">
          Reservation ID: <span className="text-primary">{id}</span>
        </p>
        <Link to="/" className="btn btn-outline-primary mt-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ReservationConfirmation;
