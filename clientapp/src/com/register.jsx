import React from "react";
import { connect } from "react-redux";
import { setMainLoad } from "../redux/action";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Turnstile, { useTurnstile } from "react-turnstile";

const Register = ({ setMainLoad }) => {
  const turnstile = useTurnstile();
  const [token, setCfToken] = React.useState("");
  const his = useNavigate();

  React.useEffect(() => {}, []);

  const onRegister = (e) => {
    e.preventDefault();
    setMainLoad(true);
    axios
      .post("/service/auth/register", {
        u: e.target[0].value,
        p: btoa(e.target[1].value),
        t: token,
      })
      .then(function (response) {
        setMainLoad(false);
        Swal.fire({
          title: "Register Complete!",
          text:
            "Please check your email '" +
            e.target[0].value +
            "' to verify your account.",
          icon: "success",
        }).then(() => {
          his("/login");
        });
        console.log(response);
      })
      .catch(function (error) {
        setMainLoad(false);
        console.log(error);
        turnstile.reset();
        Swal.fire({
          title: "Something went wrong",
          text: error.response.data.msg,
          icon: "error",
        });
        setCfToken("");
      });
  };

  return (
    <>
      <div className="container card">
        <div className="card-body">
          <h3 className="card-title">
            Get Started to App Tracking Flow Dashboard
          </h3>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/login">Login</Link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Register
              </li>
            </ol>
          </nav>

          <hr />
          <form onSubmit={(e) => onRegister(e)} autoComplete="off">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Email address
              </label>
              <input
                required
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Password
              </label>
              <input
                minlength="10"
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                required
              />
            </div>
            <Turnstile
              sitekey={import.meta.env.VITE_CF_PUB}
              onVerify={(token) => {
                setCfToken(token);
              }}
              onExpire={() => setCfToken("")}
            />
            <button
              type="submit"
              class="btn btn-primary"
              disabled={token === ""}>
              Register Account
            </button>
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
  setMainLoad: (val) => dispatch(setMainLoad(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
