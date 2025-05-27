import React from "react";
import { connect } from "react-redux";
import { setMainLoad, setLoginSession } from "../redux/action";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Turnstile, { useTurnstile } from "react-turnstile";

const Login = ({ setMainLoad, setLoginSession }) => {
  const turnstile = useTurnstile();
  const [token, setCfToken] = React.useState("");
  const his = useNavigate();
  React.useEffect(() => {}, []);

  const onLogin = (e) => {
    e.preventDefault();
    setMainLoad(true);
    axios
      .post("/service/auth/login", {
        u: e.target[0].value,
        p: btoa(e.target[1].value),
        r: e.target[2].checked,
        t: token,
      })
      .then(function (response) {
        localStorage.setItem("isAdmin", response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setLoginSession(true);
        setMainLoad(false);
        his(import.meta.env.VITE_ADMIN_BASE);
        console.log(response);
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

  return (
    <>
      <div className="container card">
        <div className="card-body">
          <h3 className="card-title">Login to App Tracking Flow Dashboard</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                Login
              </li>
              <li className="breadcrumb-item">
                <Link to="/register">Register</Link>
              </li>
            </ol>
          </nav>

          <hr />
          <form onSubmit={(e) => onLogin(e)} autoComplete="off">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                required
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                minlength="10"
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" for="exampleCheck1">
                Remember Login session
              </label>
            </div>
            <Turnstile
              sitekey={import.meta.env.VITE_CF_PUB}
              onVerify={(token) => {
                setCfToken(token);
              }}
              onExpire={() => setCfToken("")}
            />
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={token === ""}>
                Login
              </button>
              <button
                type="button"
                onClick={() => his("/reset")}
                className="btn btn-info">
                Reset Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  mainload: state.mainload,
});
const mapDispatchToProps = (dispatch) => ({
  setLoginSession: (val) => dispatch(setLoginSession(val)),
  setMainLoad: (val) => dispatch(setMainLoad(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
