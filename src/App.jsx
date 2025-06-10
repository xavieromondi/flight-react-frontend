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
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/find-flights");
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
      {/* Blue top section */}
      <div className="bg-primary text-white pb-5">
        <header className="d-flex justify-content-between align-items-center p-4">
          <h2 className="fw-bold ms-5 mb-0">Junuve.com</h2>
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

          {/* Search Box */}
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
              className="btn btn-primary px-4 py-2"
              onClick={handleSearch}
              style={{ whiteSpace: "nowrap" }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* White bottom section */}
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
