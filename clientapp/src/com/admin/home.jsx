import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setLoginSession } from "../../redux/action";
// import viteLogo from "../vite.svg";

const Home = ({ setLoginSession }) => {
  const his = useNavigate();
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(0);

  const sendPostRequest = async () => {
    try {
      const response = await fetch("/api", {
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
      setStatus(1);
    }
  };

  React.useEffect(() => {
    sendPostRequest();
  }, []);

  return <div>Admin is OK</div>;
};

const mapStateToProps = (state) => ({
  mainload: state.mainload,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
