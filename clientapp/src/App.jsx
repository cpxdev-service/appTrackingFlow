import { useState } from "react";
import React from "react";
import "./App.css";
import {
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { connect } from "react-redux";

import MainLayout from "./layout/main.jsx";
import AdminLayout from "./layout/admin.jsx";

import Home from "./com/home.jsx";
import Login from "./com/login.jsx";
import Regis from "./com/register.jsx";
import Reset from "./com/resetpass.jsx";

import HomeAdmin from "./com/admin/home.jsx";

const adminBase = import.meta.env.VITE_ADMIN_BASE;

function App({ login }) {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home data-aos="fade-in" />} />
        <Route index path="/login" element={<Login data-aos="fade-in" />} />
        <Route index path="/register" element={<Regis data-aos="fade-in" />} />
        <Route index path="/reset" element={<Reset data-aos="fade-in" />} />
        <Route index path="*" element={<Home data-aos="fade-in" />} />
      </Route>
      {login && (
        <Route path={`${adminBase}`} element={<AdminLayout />}>
          <Route index element={<HomeAdmin data-aos="fade-in" />} />
          {/* Add more admin routes here */}
        </Route>
      )}
    </Routes>
  );
}

const mapStateToProps = (state) => ({
  login: state.login,
});
export default connect(mapStateToProps, null)(App);
