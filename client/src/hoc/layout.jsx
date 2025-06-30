import { Component } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Header/Navbar.jsx";
import "./layout.css";
class Layout extends Component {
  state = {
    showNav: false,
  };
  //This is used to display Sidenav after button is clicked
  toggleSideNav = (action) => {
    this.setState({
      showNav: action,
    });
  };

  render() {
    return (
      <div className="layout">
        <div className="head">
          {/* EVery other component is rendered here as a child of HOC */}
          <Navbar />
        </div>
        <div className="main-content">
          {/* EVery other component is rendered here as a child of HOC */}
          <Outlet />
        </div>
      </div>
    );
  }
}
export default Layout;
