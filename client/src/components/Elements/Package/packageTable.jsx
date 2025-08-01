import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import utils from "../../../utils/utils.jsx";
import Table from "../../Widgets/Tables/tables.jsx";
class PackageTable extends React.Component {
  sortingOnlyList = ["Status"];
  headings = [
     {
      label: "Package Code",
      sort: "asc",
      field: "packageCode",
    },
    {
      label: "Subject Name",
      sort: "asc",
      field: "subjectName",
      grouping: true,
    },
    {
      label: "Course Code",
      sort: "asc",
      field: "courseCode",
      grouping: true,
    },
    {
      label: "Exam",
      text: "Exam",
      sort: "asc",
      field: "exam",
    },
    {
      label: "Exam Type",
      text: "Exam Type",
      sort: "asc",
      field: "examType",
    },
   
    {
      label: "No Of Copies",
      sort: "asc",
      field: "noOfCopies",
    },
    {
      label: "Start Code",
      sort: "asc",
      field: "codeStart",
    },
    {
      label: "End Code",
      sort: "asc",
      field: "codeEnd",
    },
    // {
    //   label: "Year/Part",
    //   sort: "asc",
    //   field: "yearPart",
    //   grouping: true,
    // },
    {
      label: "Status",
      sort: "asc",
      field: "status",
      grouping: true,
    },
  ];
  actions = [
    // {
    {
      text: "Edit",
      icon: faEdit,
      link: "/admin/edit-package/", // The Table component appends the package ID
    },
  ];
  quickLinks = [
    {
      text: "Add New Package",
      link: "/admin/add-new-package",
    },
    {
      text: "Add New Exam",
      link: "/admin/add-new-Exam",
    },
  ];

  state = {
    tableData: [],
    isLoaded: false,
    filtered: [],
    isFiltered: false,
    categories: {},
  };
  deleteUnnecessaryTableData = (props) => {
    let receivedProps = props;
    if (receivedProps.hasOwnProperty("postedData")) {
      receivedProps.postedData.forEach((element) => {
        delete element.level;
        delete element.part;
        delete element.year;
        delete element.programID;
      });
      this.setState({
        isLoaded: true,
        tableData: receivedProps.postedData,
      });
    }
  };

  UNSAFE_componentWillReceiveProps = (props) => {
    this.deleteUnnecessaryTableData(props);

    if (props.initialData) {
      console.log(this.headings);
      this.headings = this.headings.filter((el) => {
        return el.label !== "Status";
      });
      let json = props.initialData;
      let categories = utils.createCategories(json, this.headings);
      this.setState({
        isLoaded: true,
        tableData: json,
        categories: categories,
      });
    }
  };

  componentDidMount() {
    console.log(this.props.initialData);
    if (this.props.initialData) {
      this.deleteUnnecessaryTableData(this.props);
    } else {
      fetch("/API/query/getAllPackages")
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          let categories = utils.createCategories(json, this.headings);
          this.setState({
            isLoaded: true,
            tableData: json,
            categories: categories,
          });
        });
    }
  }

  statehandler = (states) => {
    this.setState(states);
    console.log(this.state);
  };

  render() {
    console.log(this.state.tableData);
    return (
      <div className="mainTable">
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
export default PackageTable;
