import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardHeader,
  Button,
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
  Typography,
  Drawer,
} from "@mui/material";
import { connect } from "react-redux";
import { setMainLoad, setLoginSession } from "../../redux/action";
import axios from "axios";

const AppList = ({ mainload, setMainLoad, setLoginSession }) => {
  const his = useNavigate();
  const [data, setData] = useState([]);
  const [addModal, setModal] = useState(false);

  const sendPostRequest = async () => {
    setMainLoad(true);
    axios
      .get("/service/app/all", {})
      .then(function (response) {
        if (response.data.auth == true && response.data.status === true) {
          setData(response.data.response);
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
          setMainLoad(false);
          alert('Unexpected error. Please try again.')
      });
  };

  React.useEffect(() => {
    sendPostRequest();
  }, []);

  return (
    <div>
      <CardHeader
        title="App Flow Instance Management"
        action={!mainload && <Button variant="outlined">Create new App Flow</Button>}
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

      <Drawer open={addModal} onClose={() => {}}>
  
</Drawer>
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
