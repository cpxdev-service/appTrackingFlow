import { useState } from "react";
import React from "react";
import "./App.css";
import {
  Route,
  Link,
  Switch as BasicSwitch,
  useHistory,
  useLocation,
} from "react-router-dom";

import Home from "./com/home.jsx";
import Chat from "./com/chat.jsx";

function App() {
  return (
    <BasicSwitch>
      <Route exact path="/" render={() => <Home data-aos="fade-in" />} />
      <Route exact path="/chat" render={() => <Chat data-aos="fade-in" />} />
    </BasicSwitch>
  );
}

export default App;
