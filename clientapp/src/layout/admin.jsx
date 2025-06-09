import { Outlet, useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { setMainLoad, setLoginSession } from "../redux/action";
import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Backdrop, CircularProgress } from "@mui/material";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CodeIcon from "@mui/icons-material/Code";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const drawerWidth = 240;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "isAdmin"
)}`;

const AdminLayout = ({ mainload, login, setMainLoad, setLoginSession }) => {
  const his = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (!login) {
      his("/");
    }
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <List onClick={handleDrawerClose}>
        <ListItem
          component={Link}
          to={import.meta.env.VITE_ADMIN_BASE}
          disablePadding
          color="primary"
          sx={{
            flexGrow: 1,
            backgroundColor: "#1976d2",
            display: { xs: "none", sm: "initial" },
          }}>
          <ListItemButton>
            <ListItemText className="text-center m-2 text-dark">
              <b>App Tracking Flow</b>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem
          disablePadding
          component={Link}
          to={import.meta.env.VITE_ADMIN_BASE}>
          <ListItemButton>
            <ListItemIcon>
              <SpaceDashboardIcon />
            </ListItemIcon>
            <ListItemText className="text-dark" primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          component={Link}
          to={import.meta.env.VITE_ADMIN_BASE + "/app"}>
          <ListItemButton>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText className="text-dark" primary="App Flow" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          component={Link}
          to={import.meta.env.VITE_ADMIN_BASE + "/api"}>
          <ListItemButton>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText className="text-dark" primary="API Access" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          component={Link}
          to={import.meta.env.VITE_ADMIN_BASE + "/support"}>
          <ListItemButton>
            <ListItemIcon>
              <SupportAgentIcon />
            </ListItemIcon>
            <ListItemText className="text-dark" primary="Support" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const onSignout = () => {
    setMainLoad(true);
    axios
      .delete("/service/auth/signout", {})
      .then(function (response) {
        localStorage.removeItem("isAdmin");
        setTimeout(() => {
          setLoginSession(false);
          setMainLoad(false);
          his("/");
          console.log(response);
        }, 3000);
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

  if (!login) return null;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            size="large"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, visibility: { xs: "initial", sm: "hidden" } }}>
            <b>App Tracking Flow</b>
          </Typography>
          <Button
            color="inherit"
            className="mt-1"
            onClick={() => {
              Swal.fire({
                title: "Do you want to Signout",
                showDenyButton: true,
                confirmButtonText: "Confirm",
                denyButtonText: `No`,
              }).then((result) => {
                if (result.isConfirmed) {
                  onSignout();
                }
              });
            }}>
            Signout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        <Toolbar />
        <Outlet />
      </Box>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: 5000 })}
        open={mainload}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  mainload: state.mainload,
  login: state.login,
});
const mapDispatchToProps = (dispatch) => ({
  setMainLoad: (val) => dispatch(setMainLoad(val)),
  setLoginSession: (val) => dispatch(setLoginSession(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
