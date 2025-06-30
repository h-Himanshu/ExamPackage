import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Breadcrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import Table from "../../Widgets/Tables/tables.jsx";

class DepartmentHome extends React.Component {
  headings = [
    {
      label: "Department Name",
      sort: "asc",
      field: "departmentName",
    },
  ];
  quickLinks = [
    {
      text: "Add New Department",
      link: "/admin/add-new-department",
    },
  ];
  actions = [
    // {
    //   text: "Edit",
    //   icon: faEdit,
    //   link: "/admin/edit-department/",
    // },
    {
      text: "Delete",
      icon: faTrash,
      link: "/admin/delete/department/",
    },
  ];
  state = {
    tableData: [],
    isLoaded: false,
    filtered: [],
    isFiltered: false,
    searchBy: "departmentName",
  };
  componentDidMount = () => {
    console.log(import.meta.env.VITE_BACKEND_URL);

    fetch("/API/query/getDepartmentList")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          tableData: json,
          isLoaded: true,
        });
      });
  };

  statehandler = (states) => {
    this.setState(states);
    console.log(this.state);
  };

  render() {
    return (
      <div>
        <Breadcrumb />
        <Table
          headings={this.headings}
          tableData={
            this.state.isFiltered ? this.state.filtered : this.state.tableData
          }
          state={this.state}
          setState={(states) => this.statehandler(states)}
          actions={this.actions}
          quickLinks={this.quickLinks}
        />
      </div>
    );
  }
}
export default DepartmentHome;
