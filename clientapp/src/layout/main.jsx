import { Outlet, useNavigate, Link } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";
import { setMainLoad } from "../redux/action";

const MainLayout = ({ mainload }) => {
  const [status, setStatus] = React.useState(0);
  const [menuTog, setMenu] = React.useState(false);
  const his = useNavigate();
  const sendPostRequest = async () => {
    try {
      const response = await fetch("/service/status", {
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
          <Link className="navbar-brand" to="/">
            App Tracking Flow
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenu(!menuTog)}
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation">
            {menuTog ? (
              <i class="bi bi-x" style={{ fontSize: 30 }}></i>
            ) : (
              <span className="navbar-toggler-icon"></span>
            )}
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/feature">
                  Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/plan">
                  Pricing
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  More
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/about">
                      Contact
                    </Link>
                  </li>
                  <hr />
                  <li
                    className={
                      status === 2
                        ? "dropdown-item text-success"
                        : status === 1
                        ? "dropdown-item text-info"
                        : "dropdown-item text-danger"
                    }>
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
            {localStorage.getItem("isAdmin") !== null ? (
              <button
                onClick={() => his(import.meta.env.VITE_ADMIN_BASE)}
                className="mt-2 d-lg-none d-block btn btn-outline-primary"
                type="button">
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => his("/login")}
                className="mt-2 d-lg-none d-block btn btn-outline-primary"
                type="button">
                Login
              </button>
            )}
          </div>
          <form className="d-lg-flex d-none" role="search">
            {localStorage.getItem("isAdmin") !== null ? (
              <button
                className="btn btn-outline-primary"
                onClick={() => his(import.meta.env.VITE_ADMIN_BASE)}
                type="button">
                Go to Dashboard
              </button>
            ) : (
              <button
                className="btn btn-outline-primary"
                onClick={() => his("/login")}
                type="button">
                Login
              </button>
            )}
          </form>
        </div>
      </nav>
      <main style={{ marginTop: 80 }}>
        <Outlet />
      </main>
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} CPXDev Studio</p>
      </footer>
      <div
        className="spin"
        data-aos="fade-in"
        data-aos-once="false"
        style={{ display: mainload ? "flex" : "none" }}>
        <span class="loader"></span>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  mainload: state.mainload,
});
const mapDispatchToProps = (dispatch) => ({
  setMainLoad: (val) => dispatch(setMainLoad(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
