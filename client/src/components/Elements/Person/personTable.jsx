import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";

const breadCrumbItems = [
  {
    text: "Persons",
    link: "/admin/persons"
  }
];
import utils from "../../../utils/utils.jsx";
import Table from "../../Widgets/Tables/tables.jsx";
import "./persons.css";
class PersonTable extends React.Component {
  headings = [
    { label: "Name", field: "name", sort: "asc", width: 100 },
    { label: "Contact", field: "contact", sort: "asc", width: 100 },
    { label: "Course Code", field: "course_code", sort: "asc", width: 100 },
    { label: "Program", field: "program", sort: "asc", width: 100 },
    { label: "Year/Part", field: "year_part", sort: "asc", width: 100 },
    { label: "Subject", field: "subject", sort: "asc", width: 100 },
    { label: "Campus", field: "campus", sort: "asc", width: 120 },
  ];
  actions = [
    {
      text: "View Details",
      icon: faEye,
      link: "/admin/persons/",
      linkSuffix: "/assignments"
    },
    // {
    //   text: "Edit",
    //   icon: faEdit,
    //   link: "/admin/edit-person/",
    // },
    {
      text: "Delete",
      icon: faTrash,
      link: "/admin/delete/person/",
    },
  ];

  state = {
    tableData: [],
    filtered: [],
    isFiltered: false,
    categories: {},
    items: [],
    isLoaded: true,
  };

  componentWillMount = () => {
    fetch("/API/query/getPerson")
      .then((res) => res.json())
      .then((json) => {
        let categories = utils.createCategories(json, this.headings);
        json.forEach((element) => {
          element.name = element.name || "";
          element.contact = element.contact || "";
          element.course_code = element.course_code || "";
          element.program = element.program || "";
          element.year_part = element.year_part || "";
          element.subject = element.subject || "";
          element.campus = element.campus || "";
        
        });
        this.setState({
          isLoaded: true,
          tableData: json,
          categories: categories,
        });
      });
  };

  statehandler = (states) => {
    this.setState(states);
  };

  render() {
    return (
      <div className="personTable container-fluid">
        <Table
          headings={this.headings}
          tableData={
            this.state.isFiltered ? this.state.filtered : this.state.tableData
          }
          state={this.state}
          setState={(states) => this.statehandler(states)}
          actions={this.actions}
          categories={this.state.categories}
        />
      </div>
    );
  }
}
export default PersonTable;
