import { Component } from "react";

import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import PendingPackageTable from "../../Home/pendingPackageTable.jsx";
import PackageTable from "../Package/packageTable.jsx";

import ExamListingTable from "./examListingTable.jsx";

import "./exams.css";
export class ExamDetails extends Component {
  state = {
    pending: [],
    unassigned: [],
    examDetailExpand: false,
    pendingPackageExpand: true,
    unassignedPackageExpand: true,
  };

  groupDetails = {};

  componentDidMount() {
    console.log("This is props", this.props);
    const groupID = this.props.match.params.examID;
    this.groupDetails = this.props.location.state.filter(
      (exam) => exam.id == groupID
    )[0];
    console.log(this.groupDetails);
    // console.log()
    const part = this.groupDetails.exams[0].part;
    const yyDate = this.groupDetails.exams[0].date.split("/")[0];
    const examType = this.groupDetails.exams[0].examType;
    console.log(yyDate);
    fetch(`/API/query/getPendingExamPackages/${groupID}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          pending: json,
        });
      });

    fetch(`/API/query/getNotAssignedExamPackages/${groupID}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          unassigned: json,
        });
      });
  }

  expandClickHandler = (event) => {
    try {
      document.getElementById(`${event.target.id}Body`).hidden =
        !document.getElementById(`${event.target.id}Body`).hidden;

      document.getElementById(`${event.target.id}Icon`).innerHTML =
        document.getElementById(`${event.target.id}Body`).hidden
          ? '<i class = "chevronIcon fas fa-chevron-up"></i>'
          : '<i class = "chevronIcon fas fa-chevron-down"></i>';
    } catch {
      console.error(event.target);
    }
  };

  render() {
    return (
      <div>
        <MDBCard>
          <div
            className="card-header expandableSection"
            id="examDetail"
            onClick={(event) => this.expandClickHandler(event)}
          >
            <b>Exam Details</b>
            <span id="examDetailIcon">
              <i className="chevronIcon fas fa-chevron-down" />
            </span>
            {/* <FontAwesomeIcon className = "chevronIcon" icon = {faChevronUp}/> */}
          </div>

          <MDBCardBody id="examDetailBody">
            {this.groupDetails.exams ? (
              <ExamListingTable tableData={this.groupDetails.exams} />
            ) : null}
          </MDBCardBody>
        </MDBCard>
        <MDBCard>
          <MDBCardHeader
            className="expandableSection"
            id="pendingPackageStatus"
            onClick={(event) => this.expandClickHandler(event)}
          >
            <b>Pending Package Status </b>
            <span id="pendingPackageStatusIcon">
              <i className="chevronIcon fas fa-chevron-down" />
            </span>
            {/* <FontAwesomeIcon className = "chevronIcon" icon = {faChevronUp}/> */}
          </MDBCardHeader>

          <MDBCardBody id="pendingPackageStatusBody">
            <PendingPackageTable initialData={this.state.pending} />
          </MDBCardBody>
        </MDBCard>
        <MDBCard>
          <MDBCardHeader
            className="expandableSection"
            id="unassignedPackageStatus"
            onClick={(event) => this.expandClickHandler(event)}
          >
            <b>Unassigned Package Status</b>
            <span id="unassignedPackageStatusIcon">
              <i className="chevronIcon fas fa-chevron-down" />
            </span>
            {/* <FontAwesomeIcon className = "chevronIcon" icon = {faChevronUp}/> */}
          </MDBCardHeader>
          <MDBCardBody id="unassignedPackageStatusBody">
            <PackageTable initialData={this.state.unassigned} />
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}

export default ExamDetails;
