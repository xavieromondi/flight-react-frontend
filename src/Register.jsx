import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.text();
    setMessage(data);
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          Create an Account
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              name="firstName"
              type="text"
              className="form-control"
              placeholder="Enter your first name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              name="lastName"
              type="text"
              className="form-control"
              placeholder="Enter your last name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <div className="mt-3 text-center">
          <span className="text-muted">Already have an account? </span>
          <Link
            to="/login"
            className="text-decoration-none fw-semibold text-primary"
          >
            Login
          </Link>
        </div>
        {message && (
          <div className="mt-3 text-center text-success fw-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
