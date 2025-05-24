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

import MainLayout from "./layout/main.jsx";
import AdminLayout from "./layout/admin.jsx";

import Home from "./com/home.jsx";
import Login from "./com/login.jsx";

const adminBase = "/management";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route exact path="/" render={() => <Home data-aos="fade-in" />} />
        <Route
          exact
          path="/login"
          render={() => <Login data-aos="fade-in" />}
        />
      </Route>
      {
        localStorage.getItem("isAdmin") !== null && (
          <Route element={<AdminLayout />}>
            <Route
              exact
              path={`${adminBase}`}
              render={() => <div>Admin Dashboard</div>}
            />
            {/* Add more admin routes here */}
          </Route>
        )
      }
    </Routes>
  );
}

export default App;
