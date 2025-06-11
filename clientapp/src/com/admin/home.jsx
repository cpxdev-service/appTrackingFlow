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
        setMainLoad(false);
        console.log(error);
        setCfToken("");
        turnstile.reset();
        Swal.fire({
          title: "Something went wrong",
          text: error.response.data.msg,
          icon: "error",
        });
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
