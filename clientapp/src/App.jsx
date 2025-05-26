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

import MainLayout from "./layout/main.jsx";
import AdminLayout from "./layout/admin.jsx";

import Home from "./com/home.jsx";
import Login from "./com/login.jsx";

const adminBase = "/management";

function App() {
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
      </Route>
      {localStorage.getItem("isAdmin") !== null && (
        <Route path={`${adminBase}`} element={<AdminLayout />}>
          <Route index element={<div>Admin Dashboard</div>} />
          {/* Add more admin routes here */}
        </Route>
      )}
    </Routes>
  );
}

export default App;
