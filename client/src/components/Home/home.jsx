import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import React from "react";
import BreadCrumb from "../Widgets/Breadcrumb/breadcrumb.jsx";
import "./buttons.css";
import Buttons from "./homebuttons.jsx";
import PendingPackageTable from "./pendingPackageTable.jsx";

const buttons = [
  {
    text: "Entry New Package",
    className: "home-button",
    color: "orange",
    icon: faPlus,
    link: "/admin/add-new-package",
  },
  {
    text: "Assign Packages",
    className: "home-button",
    color: "rgb(23,100,131)",
    icon: faEdit,
    link: "/admin/intermediate",
  },
  {
    text: "Add New Exam",
    className: "home-button",
    link: "/admin/add-new-exam",
    color: "orange",
    icon: faPlus,
  },
  {
    text: "View Packages",
    className: "home-button",
    color: "rgb(23,100,131)",
    icon: faEdit,
    link: "/admin/view-packages",
  },
];
const breadcrumbItems = [
  {
    text: "Packages",
    link: "/admin/",
  },
];
class Home extends React.Component {
  state = {
    data: [],
  };

  componentDidMount = () => {};
  PendingTitle = () => {
    return (
      <div className="pendingTitle">
        <span>PENDING PACKAGES</span>
      </div>
    );
  };

  render() {
    return (
      <div>
        <BreadCrumb breadcrumbItems={breadcrumbItems} className="breadcrumb" />

        <div className="chart-buttons w-100">
          <div className="m-auto">
            <MDBCard>
              <MDBCardHeader>Quick Links</MDBCardHeader>
              <MDBCardBody>
                <Buttons class="packageButtons" buttons={buttons} />
              </MDBCardBody>
            </MDBCard>
          </div>
        </div>
        <MDBCard style={{ marginTop: "20px" }}>
          <MDBCardHeader>Pending Packages</MDBCardHeader>
          <MDBCardBody>
            <PendingPackageTable />
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}
export default Home;
