import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardHeader,
  Button,
  Card,
  CardContent,
  CardActions,
  FormControlLabel,
  Switch,
  TextField,
  ButtonGroup,
  Typography,
  Drawer,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { connect } from "react-redux";
import Turnstile, { useTurnstile } from "react-turnstile";
import { setMainLoad, setLoginSession } from "../../redux/action";
import axios from "axios";

const AppList = ({ mainload, setMainLoad, setLoginSession }) => {
  const his = useNavigate();
  const turnstile = useTurnstile();
  const [data, setData] = useState([]);
  const [edit, setCreateNow] = useState(false);
  const [addModal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [token, setCfToken] = React.useState("");
  const [appquota, setQuo] = useState(0);

  const sendPostRequest = async () => {
    setMainLoad(true);
    axios
      .get("/service/app/all", {})
      .then(function (response) {
        if (response.data.auth == true && response.data.status === true) {
          setData(response.data.response);
          setCreateNow(true);
          setTimeout(() => {
            setMainLoad(false);
          }, 1000);
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

  const checkAppInstance = async () => {
    setMainLoad(true);
    axios
      .post("/service/app/checkquota", {})
      .then(function (response) {
        if (response.data.auth == true && response.data.status === true) {
          setTimeout(() => {
            setMainLoad(false);
          }, 500);
          if (response.data.response.length == 0) {
            alert("User not found");
            return;
          }
          if (response.data.response[0].appQuota <= data.length) {
            alert(
              "You have reached the maximum number of App Flow Instances. Please buy more slots."
            );
            return;
          }
          setCfToken("");
          setQuo(response.data.response[0].appQuota);
          setTimeout(() => {
            setModal(true);
            turnstile.reset();
          }, 400);
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

  const CreateAppInstance = async (e) => {
    e.preventDefault();
    console.log(e.target[5].checked);
    setMainLoad(true);
    axios
      .post("/service/app/flow/create", {
        title: e.target[0].value,
        desc: e.target[2].value,
        t: token,
      })
      .then(function (response) {
        if (response.data.auth == true && response.data.status === true) {
          setTimeout(() => {
            setModal(false);
          }, 500);
          if (e.target[5].checked) {
            his("/appflow/" + response.data.appId);
          } else {
            sendPostRequest();
          }
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

  const DeleteAppInstance = async (appId) => {
    setMainLoad(true);
    axios
      .delete("/service/app/flow/delete", {
        data: {
          appId: appId,
          t: token,
        },
      })
      .then(function (response) {
        if (response.data.auth == true && response.data.status === true) {
          setDeleteModal(null);
          setTimeout(() => {
            sendPostRequest();
          }, 2000);
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

  return (
    <div>
      <CardHeader
        title="App Flow Instance Management"
        action={
          !mainload && (
            <Button
              variant="outlined"
              onClick={() => checkAppInstance()}
              disabled={!edit}
            >
              Create new App Flow
            </Button>
          )
        }
      />
      {/* <Card className="mt-2">
        <CardContent>
          <CardHeader
            title={"ชื่อแอป"}
            subheader={"Status: Activated"}
            action={
              <ButtonGroup
                variant="contained"
                sx={{ borderRadius: 30 }}
                aria-label="Basic button group">
                <Button
                  sx={{
                    borderTopRightRadius: "0px !important",
                    borderBottomRightRadius: "0px !important",
                  }}>
                  Edit
                </Button>
                <Button
                  sx={{
                    borderTopLeftRadius: "0px !important",
                    borderBottomLeftRadius: "0px !important",
                  }}>
                  Delete
                </Button>
              </ButtonGroup>
            }
          />
          <Typography className="m-3 mt-0">
            5 tracking steps, 237 job process in tracking
          </Typography>
        </CardContent>
      </Card>
      <Card className="mt-2">
        <CardContent>
          <CardHeader
            title={"ชื่อแอป"}
            subheader={"Status: Temporary pause"}
            action={
              <ButtonGroup
                variant="contained"
                sx={{ borderRadius: 30 }}
                aria-label="Basic button group">
                <Button
                  sx={{
                    borderTopRightRadius: "0px !important",
                    borderBottomRightRadius: "0px !important",
                  }}>
                  Edit
                </Button>
                <Button
                  sx={{
                    borderTopLeftRadius: "0px !important",
                    borderBottomLeftRadius: "0px !important",
                  }}>
                  Delete
                </Button>
              </ButtonGroup>
            }
          />
          <Typography className="m-3 mt-0">
            5 tracking steps, 100 job process in tracking
          </Typography>
        </CardContent>
      </Card>
      <Card className="mt-2">
        <CardContent>
          <CardHeader
            title={"ชื่อแอป"}
            subheader={"Status: Not ready"}
            action={
              <ButtonGroup
                variant="contained"
                sx={{ borderRadius: 30 }}
                aria-label="Basic button group">
                <Button
                  sx={{
                    borderTopRightRadius: "0px !important",
                    borderBottomRightRadius: "0px !important",
                  }}>
                  Edit
                </Button>
                <Button
                  sx={{
                    borderTopLeftRadius: "0px !important",
                    borderBottomLeftRadius: "0px !important",
                  }}>
                  Delete
                </Button>
              </ButtonGroup>
            }
          />
          <Typography className="m-3 mt-0">
            5 tracking steps, 0 job process in tracking
          </Typography>
        </CardContent>
      </Card> */}

      {!mainload && data.length > 0 ? (
        data.map((item) => (
          <Card className="mt-2" key={item.id}>
            <CardContent>
              <CardHeader
                title={item.appName}
                subheader={
                  item.active == true && item.pause == false
                    ? "Status: Activated"
                    : item.active == true && item.pause == true
                    ? "Status: Temporary pause"
                    : "Status: Not ready"
                }
                action={
                  <ButtonGroup
                    variant="contained"
                    sx={{ borderRadius: 30 }}
                    aria-label="Basic button group"
                  >
                    <Button
                      disabled={!edit}
                      sx={{
                        borderTopRightRadius: "0px !important",
                        borderBottomRightRadius: "0px !important",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={!edit}
                      onClick={() => {
                        setCfToken("");
                        setDeleteModal(item.appId);
                        turnstile.reset();
                      }}
                      sx={{
                        borderTopLeftRadius: "0px !important",
                        borderBottomLeftRadius: "0px !important",
                      }}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                }
              />
              <Typography className="m-3 mt-0">
                {item.steps} tracking steps, {item.jobs} job process in tracking
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : !mainload && data.length == 0 ? (
        <Card className="mt-2">
          <CardContent className="text-center">
            <CardHeader
              title="Starting is so easy!"
              subheader="Create new App Flow Instance to get started"
            />
          </CardContent>
        </Card>
      ) : null}

      <Drawer open={addModal} anchor="right" onClose={() => {}}>
        <CardContent sx={{ maxWidth: 500 }}>
          <CardHeader
            title="Create App Flow"
            subheader={
              "You have " +
              (appquota - data.length) +
              " App Flow slot(s) quota which can created."
            }
          />
          <form onSubmit={CreateAppInstance} autoComplete="off">
            <TextField
              className="mt-2"
              label="App Name"
              variant="outlined"
              fullWidth
              required
            ></TextField>
            <TextField
              className="mt-3"
              label="App Description"
              variant="outlined"
              maxRows={4}
              multiline
              fullWidth
            ></TextField>
            <FormControlLabel
              control={<Switch name="navigateaftercreate" />}
              label="Go to App Flow management page after created"
            />

            <Turnstile
              sitekey={import.meta.env.VITE_CF_PUB}
              onVerify={(token) => {
                setCfToken(token);
              }}
              className="mt-3"
              onExpire={() => setCfToken("")}
            />

            <CardActionArea className="mt-5">
              <Button type="submit" disabled={token === ""}>
                Create
              </Button>
              <Button onClick={() => setModal(false)}>Close</Button>
            </CardActionArea>
          </form>
        </CardContent>
      </Drawer>

      <Dialog
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {deleteModal != null &&
            data.length > 0 &&
            'Do you want to delete App Flow "' +
              data.filter((x) => x.appId == deleteModal)[0]?.appName +
              '"?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-3" id="alert-dialog-description">
            All{" "}
            {deleteModal != null &&
              data.length > 0 &&
              data.filter((x) => x.appId == deleteModal)[0]?.jobs}{" "}
            job processes in this App Flow will be deleted permanently. Are you
            sure to confirm to delete?
          </DialogContentText>
          <Turnstile
            sitekey={import.meta.env.VITE_CF_PUB}
            onVerify={(token) => {
              setTimeout(() => {
                setCfToken(token);
              }, 5000);
            }}
            onExpire={() => setCfToken("")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button
            disabled={token === ""}
            onClick={() => DeleteAppInstance(deleteModal)}
          >
            Delete this App
          </Button>
        </DialogActions>
      </Dialog>
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
export default connect(mapStateToProps, mapDispatchToProps)(AppList);
