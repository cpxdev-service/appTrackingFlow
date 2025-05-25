import { Outlet } from "react-router-dom";
import React from "react";

const MainLayout = () => {
  const [status, setStatus] = React.useState(0);
  const sendPostRequest = async () => {
    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // ตรวจสอบสถานะ HTTP
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // แปลง response เป็น JSON

      // ตรวจสอบว่า response status เป็น true หรือไม่
      if (data.status === true) {
        setStatus(2);
      } else {
        setStatus(1);
      }
    } catch (error) {
      setStatus(0);
    }
  };

  React.useEffect(() => {
    sendPostRequest();
    setInterval(() => {
      sendPostRequest();
    }, 600000);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">App Tracking Flow</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pricing
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  More
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      About
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Contact
                    </a>
                  </li>
                  <hr />
                  <li
                    className={
                      status === 2
                        ? "dropdown-item text-success"
                        : status === 1
                        ? "dropdown-item text-info"
                        : "dropdown-item text-danger"
                    }
                  >
                    Status:{" "}
                    {status === 2
                      ? "Operational"
                      : status === 1
                      ? "Partial Outage"
                      : "Major Outage"}
                  </li>
                </ul>
              </li>
            </ul>
            <button
              className="mt-2 d-lg-none d-block btn btn-outline-primary"
              type="button"
            >
              Login
            </button>
          </div>
          <form className="d-lg-flex d-none" role="search">
            <button className="btn btn-outline-primary" type="button">
              Login
            </button>
          </form>
        </div>
      </nav>
      <main style={{ marginTop: 80 }}>
        <Outlet />
      </main>
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} CPXDev Studio</p>
      </footer>
    </div>
  );
};

export default MainLayout;
