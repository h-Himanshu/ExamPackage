import React, { Component } from "react";
import AssignPackageHomeTable from "./AssignPackageHomeTable.jsx";
import utils from "../../../utils/utils.jsx";
import BreadCrumb from '../../Widgets/Breadcrumb/breadcrumb.jsx';
import { Link } from 'react-router-dom';

const breadCrumbItems = [
  {
    text: 'Unassigned Packages',
    link: '/admin/intermediate',
  },
];

class AssignPackageHome extends Component {
  state = {
    unassignedPackages: [],
    isLoaded: false,
    error: null
  };

  componentDidMount() {
  fetch("/API/query/getNotAssignedPackages")
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => { throw err; });
      }
      return res.json();
    })
    .then((response) => {
      // Map backend fields to frontend fields if needed
      const formattedData = Array.isArray(response) ? response : [response];
      const formattedWithSN = formattedData.map((row, idx) => ({
        id: row.id, // <-- Add this line!
        sn: idx + 1,
        packageCode: row.packageCode, // must match backend
        subjectName: row.subjectName, // must match backend
        exam: row.exam, // must match backend
        center: row.center, // must match backend
        noOfCopies: row.noOfCopies // must match backend
      }));
      const headings = [
        { label: "Package Code", field: "packageCode", sort: "" },
        { label: "Subject Name", field: "subjectName", sort: "" },
        { label: "Exam", field: "exam", sort: "" },
        { label: "Center", field: "center", sort: "" },
        { label: "No of Copies", field: "noOfCopies", sort: "" }
      ];
      this.setState({
        unassignedPackages: formattedWithSN,
        headings,
        isLoaded: true,
        error: null
      });
    })
    .catch((error) => {
      this.setState({
        isLoaded: true,
        error: error.message || 'Failed to load packages'
      });
    });
}

  render() {
  const { unassignedPackages, isLoaded, error, headings } = this.state;
  const tableData = Array.isArray(unassignedPackages) ? unassignedPackages : [];
  const safeHeadings = Array.isArray(headings) ? headings : [];

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!safeHeadings.length) {
    return <div>No columns defined for the table.</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container-fluid">
      <BreadCrumb breadcrumbItems={breadCrumbItems} />
      <div className="mainTable">
        <AssignPackageHomeTable
          headings={safeHeadings}
          tableData={tableData}
          actions={[
            {
              label: "Assign",
              link: "/admin/assign-teacher",
              paramField: "id"
            }
          ]}
        />
      </div>
    </div>
  );
}
}

export default AssignPackageHome;
