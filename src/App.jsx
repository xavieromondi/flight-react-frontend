import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import FindFlights from "./FindFlights";
import CompleteReservation from "./CompleteReservation";
import ReservationConfirmation from "./ReservationConfirmation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const fromFormatted =
        from.trim().toLowerCase().replace(/\s+/g, "-") || "nairobi-kenya";
      const toFormatted =
        to.trim().toLowerCase().replace(/\s+/g, "-") || "mombasa-kenya";

      const today = new Date(date);
      if (isNaN(today)) throw new Error("Invalid date");

      const returnDate = new Date(today);
      returnDate.setDate(today.getDate() + 30);

      const formatDate = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;

      const dateRange = `${formatDate(today)}_${formatDate(returnDate)}`;

      const query = new URLSearchParams({
        from: fromFormatted,
        to: toFormatted,
        date: dateRange,
      });

      const res = await fetch(
        `https://puppeteer-flight-scraper-2.onrender.com/scrape?${query}`
      );
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  const cityImages = {
    Nairobi:
      "https://media.istockphoto.com/id/2195460420/photo/wild-african-giraffe-stands-tall-against-urban-nairobi-dawn-view.jpg?s=1024x1024&w=is&k=20&c=9NkMIljL1pASCYw0Pxr0lxqU49rTE2OGY5Lj2U7Aoq0=",
    Mombasa:
      "https://images.unsplash.com/flagged/photo-1557828823-b5bb7f45d726?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Diani:
      "https://images.unsplash.com/photo-1708119063168-4785d1359824?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Naivasha:
      "https://media.istockphoto.com/id/1011528350/photo/hippo-mouth-open-in-water-africa.jpg?s=1024x1024&w=is&k=20&c=YYnTdvzlNWuMdLcZ_-q-orLw1b3sskoZOCOBA1oYeEg=",
    Kisumu:
      "https://images.unsplash.com/photo-1691515380604-aa4717b4964f?q=80&w=1459&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <>
      <div className="bg-primary text-white pb-5">
        <header className="d-flex justify-content-between align-items-center p-4">
          <h2 className="fw-bold ms-5 mb-0">tyson.com</h2>
          <div className="me-5">
            <Link
              to="/login"
              className="btn btn-light me-2"
              style={{ color: "rgb(37, 150, 190)" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-light"
              style={{ color: "rgb(37, 150, 190)" }}
            >
              Register
            </Link>
          </div>
        </header>

        <div className="container pt-5">
          <h1 className="display-4 fw-bold">Find your next destination</h1>
          <p className="fs-5 text-white-50">
            Search deals on flights, routes, and more...
          </p>

          <div
            className="bg-white p-3 rounded d-flex flex-wrap align-items-center shadow mt-4"
            style={{ gap: "10px" }}
          >
            <div className="d-flex align-items-center border rounded px-3 py-2 flex-grow-1">
              <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
              <input
                type="text"
                placeholder="From"
                className="form-control border-0"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center border rounded px-3 py-2 flex-grow-1">
              <i className="bi bi-geo-fill me-2 text-primary"></i>
              <input
                type="text"
                placeholder="To"
                className="form-control border-0"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center border rounded px-3 py-2 flex-grow-1">
              <i className="bi bi-calendar-date me-2 text-primary"></i>
              <input
                type="date"
                className="form-control border-0"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button
              className="btn btn-light px-4 py-2"
              onClick={handleSearch}
              style={{ whiteSpace: "nowrap", color: "rgb(37, 150, 190)" }}
            >
              Search
            </button>
          </div>

          {loading && <p className="mt-4 text-white">⏳ Fetching flights...</p>}
          {error && <p className="mt-4 text-danger">{error}</p>}
          {results.length > 0 && (
            <div className="bg-white p-4 mt-4 rounded shadow">
              <h4 className="mb-3">Top Flight Results</h4>
              <ul className="list-group">
                {results.map((flight, i) => (
                  <li key={i} className="list-group-item">
                    <strong>{flight.airline}</strong> – {flight.from.airport} (
                    {flight.from.time}, {flight.from.date}) ➡{" "}
                    {flight.to.airport} ({flight.to.time}, {flight.to.date}) –{" "}
                    <strong>{flight.price}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white text-dark py-5">
        <div className="container">
          <h2 className="mb-4 fw-bold">Trending Destinations</h2>
          <div className="row g-4">
            {["Nairobi", "Mombasa", "Diani", "Naivasha", "Kisumu"].map(
              (city) => (
                <div className="col-md-3" key={city}>
                  <div className="card shadow-sm h-100">
                    <img
                      src={cityImages[city]}
                      className="card-img-top"
                      alt={city}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{city}</h5>
                      <p className="card-text text-muted">
                        Explore flights and getaways to {city}.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className="bg-light text-dark pt-5 border-top">
        <div className="container">
          <div className="row">
            {/* Company */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold">Company</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold">Platform</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Company Info
                  </a>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold">Features</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Sign In / Register
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Mobile App
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Disruption Protection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Discover */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold">Discover</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Cheap Flights
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Airlines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Countries
                  </a>
                </li>
                <li>
                  <a href="#" className="text-dark text-decoration-none">
                    Airports
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Social Icons */}
          <div className="d-flex gap-3 justify-content-center mb-4">
            <i className="bi bi-facebook fs-5"></i>
            <i className="bi bi-instagram fs-5"></i>
            <i className="bi bi-twitter fs-5"></i>
            <i className="bi bi-linkedin fs-5"></i>
          </div>
          {/* Bottom Banner */}

          <div className="text-center border-top py-3 mt-4">
            <small className="text-muted">
              WE HACK THE SYSTEM, YOU FLY FOR LESS © {new Date().getFullYear()}
            </small>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/find-flights" element={<FindFlights />} />
        <Route
          path="/complete-reservation/:id"
          element={<CompleteReservation />}
        />
        <Route path="/confirmation/:id" element={<ReservationConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
