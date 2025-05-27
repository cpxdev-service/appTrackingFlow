import { Outlet, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setMainLoad, setLoginSession } from "../redux/action";
import axios from "axios";

const AdminLayout = () => {
  const his = useNavigate();

  const onSignout = () => {
    setMainLoad(true);
    axios
      .delete("/service/auth/signout", {})
      .then(function (response) {
        localStorage.removeItem("isAdmin");
        setLoginSession(false);
        setMainLoad(false);
        his("/");
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
    <div className="main-layout">
      <header>
        <h1>Welcome to the Main Layout</h1>
        <button
          className="btn btn-outline-primary"
          onClick={() => onSignout()}
          type="button">
          Signout
        </button>
      </header>
      <main style={{ marginTop: 80 }}>
        <Outlet />
      </main>
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} CPXDev Studio</p>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  mainload: state.mainload,
});
const mapDispatchToProps = (dispatch) => ({
  setMainLoad: (val) => dispatch(setMainLoad(val)),
  setLoginSession: (val) => dispatch(setLoginSession(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
