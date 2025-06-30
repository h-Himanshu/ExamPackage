import { useEffect, useState } from "react";
// import "./header.css";
import {
  faBars,
  // faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
// import SideNav from "./SideNav/sidenav.js";
import { toast } from "react-toastify";

const Header = (props) => {
  const navigate = useNavigate();
  const [session, setSession] = useState("");
  useEffect(() => {
    fetch("/API/query/getSessionName")
      .then((res) => res.json())
      .then((json) => setSession(json.sessionName))
      .catch((err) => console.log(err));
  }, []);

  const NavBar = () => {
    return (
      <div onClick={props.onOpenNav} className="bars">
        <FontAwesomeIcon icon={faBars} className="bars-icon" />
      </div>
    );
  };
  return (
    <div className="header">
      {/* <SideNav {...props} /> */}
      <div className="main-header">
        {/* {NavBar()} */}
        <div className="logo">
          <Link to="/admin">
            <img alt="TU logo" src="/images/logo.png" height="64" width="55" />
          </Link>
        </div>
        <div className="text-area">
          <div className="main-title row">
            <Link
              to="/admin"
              style={{ textDecoration: "none", color: "white" }}
            >
              Exam Package Management System
            </Link>
            <h6 className=" text-secondary w-100 text-center">{session}</h6>
          </div>
        </div>
        {/* {authenticated ? ( */}
        <div className="user-logo">
          <button
            onClick={() => {
              fetch(`/API/logout`).then((res) => {
                if (res.ok) {
                  navigate("/login");
                } else toast("Coundn't Logout");
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
        {/* // ) : (
        //   <div className="user-logo">
        //     <Link
        //       to="/login"
        //       style={{ textDecoration: "none", color: "white" }}
        //     >
        //       <FontAwesomeIcon icon={faUser} className="user-icon" />
        //     </Link>
        //   </div>
        // )} */}
      </div>
    </div>
  );
};

// export default Header;
