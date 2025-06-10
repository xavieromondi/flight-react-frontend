import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CompleteReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [passenger, setPassenger] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/reservations/flight/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Flight not found");
        return res.json();
      })
      .then((data) => setFlight(data))
      .catch((err) => setError("Error loading flight: " + err.message));
  }, [id]);

  const handleChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const reservationRequest = {
      flightId: id,
      passengerFirstName: passenger.firstName,
      passengerLastName: passenger.lastName,
      passengerEmail: passenger.email,
      passengerPhone: passenger.phone,
    };

    fetch("http://localhost:8080/api/reservations/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationRequest),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to complete reservation");
        return res.json();
      })
      .then((data) => navigate(`/confirmation/${data.id}`))
      .catch((err) => {
        setError("Error: " + err.message);
        setLoading(false);
      });
  };

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading flight details...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 position-relative">
      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex flex-column justify-content-center align-items-center z-3">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Processing your reservation...</p>
        </div>
      )}
      <div className="card shadow p-4">
        <h2 className="text-primary mb-3">Complete Reservation</h2>
        <h5 className="mb-3">
          Flight from <strong>{flight.departureCity}</strong> to{" "}
          <strong>{flight.arrivalCity}</strong>
        </h5>
        <ul className="list-group list-group-flush mb-4">
          <li className="list-group-item">
            <strong>Airlines:</strong> {flight.operatingAirlines}
          </li>
          <li className="list-group-item">
            <strong>Departure Date:</strong> {flight.dateOfDeparture}
          </li>
          <li className="list-group-item">
            <strong>Time:</strong> {flight.estimatedDepartureTime}
          </li>
        </ul>

        <h5 className="mb-3">Passenger Details</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              name="firstName"
              className="form-control"
              placeholder="First Name"
              value={passenger.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <input
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              value={passenger.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={passenger.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <input
              name="phone"
              className="form-control"
              placeholder="Phone"
              value={passenger.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-12 d-grid">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteReservation;
