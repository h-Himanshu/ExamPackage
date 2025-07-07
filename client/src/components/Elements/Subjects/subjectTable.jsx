import React, { Component, Fragment, useState } from "react";
import Table from "../../Widgets/Tables/tables.jsx";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import utils from "../../../utils/utils.jsx";
import Breadcrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";

const breadCrumbItems = [
  {
    text: "Subjects",
    link: "/admin/subjects",
  },
];


class SubjectTable extends Component {
  headings = [

    {
      label: "Subject Name",
      sort: "asc",
      field: "subjectName",
    },
    {
      label: "Course Code",
      sort: "asc",
      field: "courseCode",
    },
    {
      label: "Program",
      sort: "asc",
      field: "programName",
      grouping: true,
    },
  ];

  actions = [
    // {
    //   text: "Edit",
    //   icon: faEdit,
    //   link: "/admin/edit-subject/",
    // },
    {
      text: "Delete",
      icon: faTrash,
      link: "/admin/delete/subject/",
    },
  ];
  quickLinks = [
    {
      text: "Add New Subject",
      link: "/admin/add-new-subject",
    },
  ];

  state = {
    tableData: [],
    isLoaded: false,
    filtered: [],
    isFiltered: false,
    categories: {},
  };
  componentDidMount = () => {
    if (this.props.hasOwnProperty("postedData")) {
      this.props.postedData.forEach((element) => {
        delete element.level;
      });
      this.setState({
        tableData: this.props.postedData,
      });
    } else {
      fetch(`/API/query/getSubjectList`)
        .then((res) => res.json())
        .then((json) => {
          let categories = utils.createCategories(json, this.headings);
          this.setState({
            isLoaded: true,
            tableData: json,
            categories: categories,
          });
        });
    }
  };

  statehandler = (states) => {
    this.setState(states);
    console.log(this.state);
  };
  render() {
    return (
      <Fragment>
        <Breadcrumb breadcrumbItems={breadCrumbItems} />
        <Table
          headings={this.headings}
          tableData={
            this.state.isFiltered ? this.state.filtered : this.state.tableData
          }
          state={this.state}
          setState={(states) => this.statehandler(states)}
          actions={this.actions}
          categories={this.state.categories}
          quickLinks={this.quickLinks}
        />
      </Fragment>
    );
  }
}

export default SubjectTable;
