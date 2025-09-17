import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import crossTabLogout from "../../utils/crossTabLogout";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import "./Navbar.css";

export default function ButtonAppBar() {
  const [session, setSession] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/API/query/getSessionName")
      .then((res) => res.json())
      .then((json) => setSession(json.sessionName))
      .catch((err) => console.log(err));
  }, []);

  const toggleDrawer = () => setDrawerOpen((open) => !open);

  const logout = () => {
    crossTabLogout.initiateLogout();
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/session", label: "Session" },
    { to: "/admin/departments", label: "Department" },
    { to: "/admin/programs", label: "Program" },
    { to: "/admin/subjects", label: "Subject" },
    { to: "/admin/exams", label: "Exam" },
    { to: "/admin/packages", label: "Package" },
    { to: "/admin/Person", label: "Expert" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ minHeight: "150px", display: "flex", justifyContent: "center" }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          {/* Left: Logo + Title */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <IconButton size="large" edge="start" color="inherit">
              <Link to="/admin">
                <img alt="TU logo" src="/images/logo.png" width="55" />
              </Link>
            </IconButton>
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <Typography variant="h5" sx={{ color: "white" }}>
                Exam Package Management System
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", fontWeight: 400 }}
              >
                {session || "no-session-exists"}
              </Typography>
            </Link>
          </Box>

          {/* Middle: Horizontal nav (desktop only) */}
          <Stack
            direction="row"
            spacing={2}
            className="nav-links"
            sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
          >
            {navLinks.map((n) => (
              <Link key={n.to} to={n.to} style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "white" }}>{n.label}</Typography>
              </Link>
            ))}
            <Button
              color="inherit"
              sx={{ color: "white", padding: 0 }}
              onClick={logout}
            >
              Logout
            </Button>
          </Stack>

          {/* Right: Hamburger icon (mobile only) */}
          <IconButton
            edge="end"
            className="menu-btn"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ ml: "auto", display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer menu for small screens */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 220 }}>
          {navLinks.map((n) => (
            <ListItem key={n.to}>
              <Link to={n.to} style={{ textDecoration: "none" }} onClick={toggleDrawer}>
                {n.label}
              </Link>
            </ListItem>
          ))}
          <ListItem button onClick={logout} sx={{ color: '#1976d2', fontWeight: 600 }}>Logout</ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
