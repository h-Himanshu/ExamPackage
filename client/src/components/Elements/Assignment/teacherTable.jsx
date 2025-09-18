
import React, { Component, createRef } from "react";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";
import BreadCrumbs from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import PersonTable from "../Person/personTable.jsx";
import "./assignment.css";

const getBreadCrumbItems = () => {
  const currentPath = window.location.pathname;
  const isAssignTeacher = currentPath.includes('/assign-teacher');
  
  if (isAssignTeacher) {
    return [
      {
        text: "Unassigned Packages",
        link: "/admin/intermediate"
      },
      {
        text: "Assign Person",
        link: "" // Current page, no link needed
      }
    ];
  } else {
    return [
      {
        text: "Person",
        link: "/admin/person"
      }
    ];
  }
};

const breadCrumbItem = getBreadCrumbItems();


class TeacherTable extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      excelData: [],
    };
  }

  handleImportClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = null;
      this.fileInputRef.current.click();
    }
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.setState({ excelData: jsonData });

        // Ask user if they want to keep previous data
        const keepOld = window.confirm("Do you want to keep previous data in the person table? Click OK to keep, Cancel to replace.");
  fetch('/API/query/importPersons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: jsonData, keepOld })
        })
          .then(res => res.json())
          .then(result => {
            alert(result.message);
          });
      };
      reader.readAsArrayBuffer(file);
    }
  };



  render() {
    // Check if this is an assign-teacher context
    const currentPath = window.location.pathname;
    const isAssignTeacherContext = currentPath.includes('/assign-teacher');
    
    return (
      <React.Fragment>
        <BreadCrumbs breadcrumbItems={breadCrumbItem} />
        <MDBCard>
          <MDBCardHeader>
            {isAssignTeacherContext && <span>Choose Person to Assign </span>}
            <button
              type="button"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                float: 'right'
              }}
              onClick={this.handleImportClick}
            >
              Import Expert
            </button>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={this.fileInputRef}
              style={{ display: 'none' }}
              onChange={this.handleFileChange}
            />
          </MDBCardHeader>
          <MDBCardBody>
            <PersonTable id={this.props.id} />
          </MDBCardBody>
        </MDBCard>
      </React.Fragment>
    );
  }
}

export default TeacherTable;
