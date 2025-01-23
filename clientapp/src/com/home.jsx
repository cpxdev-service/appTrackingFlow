import React, { useState } from "react";
import reactLogo from "../assets/react.svg";
// import viteLogo from "../vite.svg";

const Home = () => {
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
    setTimeout(() => {
      window.location.href = '/chat'
    }, 10000);
  }, []);

  return (
    <div className="roothome">
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AI Chat is ready</h1>
      <div className="col-12 cardcustom">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p className="mt-5">
          The first Monolithics Project of React JS (Vite) + Express JS. See
          source code{" "}
          <a target="_blank" href="https://github.com/cpxdevth/ReactExpress">
            here
          </a>
          <br />
          or copy this link{" "}
          <code>https://github.com/cpxdevth/ReactExpress.git</code>.
        </p>
      </div>
      <p className="read-the-docs">
        {status == 2
          ? "Server is full loaded"
          : status == 1
          ? "API Server is down, please check backend code in 'api' folder then restart instance again."
          : "Checking status..."}
      </p>
    </div>
  );
};

export default Home;
