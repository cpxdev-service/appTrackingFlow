import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setMainLoad } from "../../redux/action";
import axios from "axios";
// import viteLogo from "../vite.svg";

const Home = ({ setMainLoad }) => {
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
            console.log(response);
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
});
export default connect(null, mapDispatchToProps)(Home);
