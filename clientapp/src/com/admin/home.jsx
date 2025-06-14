import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setMainLoad, setLoginSession } from "../../redux/action";
import axios from "axios";
// import viteLogo from "../vite.svg";

const Home = ({ setMainLoad, setLoginSession }) => {
  const his = useNavigate();
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(0);

  const sendPostRequest = async () => {
    setMainLoad(true);
    axios
      .get("/service/dash/status", {})
      .then(function (response) {
        if (response.data.status === true) {
          setTimeout(() => {
            setMainLoad(false);
          }, 700);
        }
      })
      .catch(function (error) {
        if (error.response.data.auth == false) {
          alert("Session timeout");
          setMainLoad(true);
          localStorage.removeItem("isAdmin");
          setTimeout(() => {
            setLoginSession(false);
            setMainLoad(false);
            his("/");
          }, 3000);
        } else {
          setMainLoad(false);
          alert("Unexpected error. Please try again.");
        }
      });
  };

  React.useEffect(() => {
    sendPostRequest();
  }, []);

  return <div>Admin is OK</div>;
};

const mapDispatchToProps = (dispatch) => ({
  setMainLoad: (val) => dispatch(setMainLoad(val)),
  setLoginSession: (val) => dispatch(setLoginSession(val)),
});
export default connect(null, mapDispatchToProps)(Home);
