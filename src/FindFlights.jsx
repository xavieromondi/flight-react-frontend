import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function FindFlights() {
  const [form, setForm] = useState({ from: "", to: "", departureDate: "" });
  const [flights, setFlights] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false); // NEW

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(false);
    setLoading(true); // Start loading

    const params = new URLSearchParams();
    params.append("from", form.from);
    params.append("to", form.to);
    params.append("departureDate", form.departureDate);

    fetch("http://localhost:8080/api/flights/search", {
      method: "POST",
      body: params,
    })
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);
        setSearched(true);
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Flight search failed", err);
        setSearched(true);
        setLoading(false); // Stop loading
      });
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mb-4">
        <h3 className="text-center text-primary mb-4">Find Your Flight</h3>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <input
              name="from"
              className="form-control"
              placeholder="From"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              name="to"
              className="form-control"
              placeholder="To"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="departureDate"
              type="date"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Searching for flights...</p>
          </div>
        )}

        {!loading && searched && flights.length === 0 && (
          <p className="text-center text-muted mt-4">
            No flights found for the selected route and date.
          </p>
        )}
      </div>

      {flights.length > 0 && !loading && (
        <div className="card shadow p-4">
          <h4 className="mb-4 text-success">Available Flights</h4>
          <table className="table table-hover table-striped">
            <thead className="table-primary">
              <tr>
                <th>Airlines</th>
                <th>From</th>
                <th>To</th>
                <th>Departure Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id}>
                  <td>{f.operatingAirlines}</td>
                  <td>{f.departureCity}</td>
                  <td>{f.arrivalCity}</td>
                  <td>{f.dateOfDeparture}</td>
                  <td>{f.estimatedDepartureTime}</td>
                  <td>
                    <Link
                      to={`/complete-reservation/${f.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Select
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FindFlights;
