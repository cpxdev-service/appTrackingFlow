import { Outlet } from "react-router-dom";
import React from "react";

const MainLayout = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">App Tracking Flow</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Features
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Pricing
                </a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  More
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      About
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Status: Operational
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <form className="d-flex" role="search">
            <button className="btn btn-outline-success" type="button">
              Login
            </button>
          </form>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} CPXDev Studio</p>
      </footer>
    </div>
  );
};

export default MainLayout;
