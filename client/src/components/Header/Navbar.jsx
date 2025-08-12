import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ButtonAppBar() {
  // const authenticated = useContext(AuthenticatedContext);

  const [session, setSession] = useState("");
  useEffect(() => {
    fetch("/API/query/getSessionName")
      .then((res) => res.json())
      .then((json) => setSession(json.sessionName))
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    fetch("/API/logout").then((res) => {
      if (res.ok) {
        navigate("/login");
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ minHeight: "150px", display: "flex", justifyContent: "center" }}
      >
        <Toolbar>
          <div className="logo" style={{ display: "flex" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <Link to="/admin">
                <img alt="TU logo" src="/images/logo.png" width="55" />
              </Link>
            </IconButton>
            <Link to="/admin">
              <Typography variant="h5" sx={{ color: "white" }}>
                Exam Package Management System
              </Typography>
              <Typography
                variant="h7"
                sx={{ color: "white", textAlign: "center", fontWeight: "400" }}
              >
                {session || "no-session-exists"}
              </Typography>
            </Link>
          </div>

          <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
            <Link to="/admin/session">
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 0.5, color: "white" }}
              >
                Session
              </Typography>
            </Link>
            <Link to="/admin/departments">
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 1, color: "white" }}
              >
                Department
              </Typography>
            </Link>
            <Link to="/admin/programs">
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 0.5, color: "white" }}
              >
                Program
              </Typography>
            </Link>
            <Link to="/admin/subjects">
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 0.5, color: "white" }}
              >
                Subject
              </Typography>
            </Link>
            <Link to="/admin/exams">
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 0.5, color: "white" }}
              >
                Exam
              </Typography>
            </Link>
            <Link to="/admin/packages">
              {" "}
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 0.5, color: "white" }}
              >
                Package
              </Typography>
            </Link>
            <Link to="/admin/Person">
              {" "}
              <Typography
                variant="h8"
                component="div"
                sx={{ flexGrow: 0.5, color: "white" }}
              >
                Person
              </Typography>
            </Link>
            <Button
              color="inherit"
              sx={{ color: "white", padding: "0" }}
              onClick={() => logout()}
            >
              Logout
            </Button>
          </Stack>
          {/* {authenticated ? (
          <div className="user-logo">
            <button
              onClick={() => {
                fetch("/API/logout").then(() => {
                  window.location.href = "/";
                  window.location.reload();
                });
              }}
              className="btn btn-link"
              style={{
                fontSize: "1em",
              }}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{ color: "white" }}
                className="user-icon"
              />
            </button>
          </div>
        ) : (
          <div className="user-logo">
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "white" }}
            >
              <FontAwesomeIcon icon={faUser} className="user-icon" />
            </Link>
          </div>
        )} */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
