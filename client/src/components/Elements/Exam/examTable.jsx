import React from "react";
//import ExamGroupedTable from "./examGroupedTable.js";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import utils from "../../../utils/utils.jsx";
import Table from "../../Widgets/Tables/tables.jsx";
import Breadcrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";

const breadCrumbItems = [
  {
    text: "Exams",
    link: "/admin/exams",
  },
];

class ExamTable extends React.Component {
  quickLinks = [{ text: "Add New Exam", link: "/admin/add-new-exam" }];
  headings = [
    {
      label: "Exam Title",
      sort: "asc",
      field: "title",
      grouping: true,
    },
    {
      label: "Exam Type",
      text: "Exam Type",
      sort: "asc",
      field: "type",
      grouping: true,
    },
  ];

  actions = [
    // {
    //   text: "Details",
    //   icon: faInfoCircle,
    //   link: "/admin/exam-details/",
    // },
    // {
    //   text: "Edit",
    //   icon: faEdit,
    //   link: "/admin/edit-exam/",
    // },
    {
      text: "Delete",
      icon: faTrash,
      link: "/admin/delete/exam/",
    },
  ];

  state = {
    tableData: [],
    filtered: [],
    searchBy: "",
    isFiltered: false,
    isLoaded: false,
    groupedData: [],
    detailedGroupedData: [],
    categories: {},
  };

  //Group by a particular key in an array
  groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  componentDidMount = () => {
    console.log("hellow");
    fetch("/API/query/getExams")
      .then((res) => res.json())
      .then((json) => {
        //Group by data and year to separate exams
        console.log(json);
        json.forEach((element) => {
          const examYear = element.date.split("T")[0];
          // const part = element.part === "I" ? "Odd" : "Even";
          const type = element.examType;
          const sub = element.subjectName;

          element.examTitle = sub + " - " + examYear + " - " + "(" + type + ")";
        });

        const groups = this.groupBy(json, "examTitle");
        let groupsArr = [];
        let detailsArr = [];
        console.log(groups.length);
        Object.entries(groups).forEach(([key, value], index) => {
          groupsArr.push({
            id: value[0].id,
            title: key,
            type: value[0].examType,
            // yearPart: value[0].year + "/" + value[0].part,
          });
          detailsArr.push({ id: value[0].id, title: key, exams: value });
        });

        let categories = utils.createCategories(groupsArr, this.headings);
        this.setState({
          isLoaded: true,
          tableData: groupsArr,
          groupedData: groupsArr,
          detailedGroupedData: detailsArr,
          categories: categories,
        });
      });
  };

  statehandler = (states) => {
    this.setState(states);
  };
  render() {
    console.log("error");
    console.log(this.state.tableData);
    return (
      <div>
        <Breadcrumb breadcrumbItems={breadCrumbItems} />
        <div className="examTable">
          <Table
            headings={this.headings}
            tableData={
              this.state.isFiltered ? this.state.filtered : this.state.groupedData
            }
            state={this.state}
            setState={(states) => this.statehandler(states)}
            actions={this.actions}
            detailParams={this.state.detailedGroupedData}
            categories={this.state.categories}
            quickLinks={this.quickLinks}
          />
        </div>
      </div>
    );
  }
}
export default ExamTable;
