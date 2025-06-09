import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setMainLoad, setLoginSession } from "../../redux/action";
import axios from "axios";

const AppList = ({ setMainLoad, setLoginSession }) => {
  const his = useNavigate();
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  const sendPostRequest = async () => {
    setMainLoad(true);
    axios
      .get("/service/app/all", {})
      .then(function (response) {
        if (response.data.auth == true && response.data.status === true) {
          setData(response.data.responses);
          setTimeout(() => {
            setMainLoad(false);
          }, 1000);
        } else if (response.data.auth == false) {
          alert("Session timeout");
          setMainLoad(true);
          localStorage.removeItem("isAdmin");
          setTimeout(() => {
            setLoginSession(false);
            setMainLoad(false);
            his("/");
            console.log(response);
          }, 3000);
        }
      })
      .catch(function (error) {
        setMainLoad(true);
        alert('Session timeout')
        localStorage.removeItem("isAdmin");
        setTimeout(() => {
          setLoginSession(false);
          setMainLoad(false);
          his("/");
          console.log(response);
        }, 3000);
      });
  };

  React.useEffect(() => {
    sendPostRequest();
  }, []);

  return <div>Fetch App list</div>;
};

const mapStateToProps = (state) => ({
  mainload: state.mainload,
});
const mapDispatchToProps = (dispatch) => ({
  setMainLoad: (val) => dispatch(setMainLoad(val)),
  setLoginSession: (val) => dispatch(setLoginSession(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppList);
