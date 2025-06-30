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

  const [payment, setPayment] = useState({ phone: "", amount: "" });
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

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    return (
      phone.startsWith("254") && phone.length === 12 && /^\d+$/.test(phone)
    );
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(payment.phone)) {
      setError("Phone number must start with 254 and be 12 digits.");
      return;
    }

    if (!payment.amount || isNaN(payment.amount)) {
      setError("Enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      // 1. Initiate STK Push
      const res = await fetch("http://localhost:8080/api/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const data = await res.json();

      const checkoutRequestId = data.CheckoutRequestID;

      if (!checkoutRequestId) {
        throw new Error("Failed to initiate STK Push");
      }

      // 2. Poll payment status (wait for Safaricom callback to backend)
      let resultCode = null;
      for (let i = 0; i < 12; i++) {
        const statusRes = await fetch(
          `http://localhost:8080/api/payment/status/${checkoutRequestId}`
        );
        const statusData = await statusRes.json();
        if (statusData.resultCode !== undefined) {
          resultCode = statusData.resultCode;
          break;
        }
        await delay(2500); // wait 2.5 seconds before checking again
      }

      if (resultCode !== 0) {
        setError("M-Pesa payment failed or timed out. Please try again.");
        setLoading(false);
        return;
      }

      // 3. Proceed with reservation
      const reservationPayload = {
        flightId: id,
        passengerFirstName: passenger.firstName,
        passengerLastName: passenger.lastName,
        passengerEmail: passenger.email,
        passengerPhone: passenger.phone,
      };

      const reservationRes = await fetch(
        "http://localhost:8080/api/reservations/complete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationPayload),
        }
      );

      if (!reservationRes.ok) throw new Error("Reservation failed");

      const reservationData = await reservationRes.json();
      navigate(`/confirmation/${reservationData.id}`);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
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
          <p className="mt-3">Processing payment and reservation...</p>
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

        <form onSubmit={handleSubmit} className="row g-3">
          <h5 className="mb-3">Passenger Details</h5>
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

          <h5 className="mt-4 mb-3">M-Pesa Payment</h5>
          <div className="col-md-6">
            <input
              name="phone"
              className="form-control"
              placeholder="2547XXXXXXXX"
              value={payment.phone}
              onChange={handlePaymentChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <input
              name="amount"
              className="form-control"
              placeholder="Amount"
              value={payment.amount}
              onChange={handlePaymentChange}
              required
              disabled={loading}
            />
          </div>

          <div className="col-12 d-grid mt-3">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              Pay & Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteReservation;
