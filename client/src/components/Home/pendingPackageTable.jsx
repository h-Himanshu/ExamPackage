import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import adbs from "ad-bs-converter";
import React from "react";
import utils from "../../utils/utils.jsx";
import Table from "../Widgets/Tables/tables.jsx";

class PendingPackageTable extends React.Component {
  sortingOnlyList = ["Status"];
  headings = [
    {
      label: "Package Code",
      text: "Package ID",
      colspan: "2",
      field: "packageCode",
    },
    {
      label: "Subject Name",
      colspan: "2",
      field: "subjectName",
      grouping: true,
    },
    {
      label: "Assigned Date",
      text: "Assigned Date",
      colspan: "2",
      field: "dateOfAssignment",
    },
    {
      label: "Deadline",
      text: "To be Submitted",
      colspan: "2",
      field: "dateOfDeadline",
    },
    {
      label: "Assigned To",
      text: "Assigned To",
      colspan: "2",
      field: "fullName",
    },
    {
      label: "Contact",
      text: "Contact",
      colspan: "2",
      field: "contact",
    },
    {
      label: "Email",
      text: "Email",
      colspan: "2",
      field: "email",
    },
    {
      label: "Status",
      text: "Status",
      colspan: "2",
      field: "status",
    },
    {
      label: "Status Text",
      text: "Status Text",
      colspan: "2",
      field: "statusText",
    },
  ];
  actions = [
    {
      text: "Receive",
      icon: faReceipt,
      link: "/admin/receivePackage/",
    },
  ];

  state = {
    tableData: [],
    filtered: [],
    isFiltered: false,
    searchBy: "packageCode",
    items: [],
    isLoaded: true,
    categories: {},
  };

  parseDate(str) {
    //Convert to english
    const englishDate = adbs.bs2ad(str);
    console.log(englishDate, str);
    return new Date(englishDate.year, englishDate.month - 1, englishDate.day);
  }

  findDateDifference(myDate) {
    const now = new Date();
    now.setHours(0, 0, 0);
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      myDate.getFullYear(),
      myDate.getMonth(),
      myDate.getDate()
    );
    const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    //console.log(now, myDate);
    return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
  }
  formatDate(date) {
    let d = new Date(date);
    //Convert back to nepali
    const nepaliDate = adbs.ad2bs(d);
    const year = nepaliDate.en.year;
    const month = ("0" + nepaliDate.en.month).slice(-2);
    const day = ("0" + nepaliDate.en.day).slice(-2);
    return [year, month, day].join("/");
  }
  getPendingPackageFromAPI = () => {
    fetch("/API/query/getPendingPackages")
      .then((res) => res.json())
      .then((json) => {
        //Calculate if package is overdue
        // console.log("json",json)
        json.forEach((element) => {
          console.log(element);
          const myDate = this.parseDate(
            element["dateOfDeadline"].split("T")[0].replaceAll("-", "/")
          );
          console.log(myDate);
          const diff = this.findDateDifference(myDate);
          element["Overdue"] = { isOverdue: diff < 0, days: Math.abs(diff) };
          element["status"] = diff < 0 ? "Overdue" : "Pending";
          element["dateOfDeadline"] = element["dateOfDeadline"].split("T")[0];
          element["dateOfAssignment"] =
            element["dateOfAssignment"].split("T")[0];
        });

        json.filter((elem) => {
          return true;
        });
        console.log("Element after Overdue", json);
        let categories = {};
        categories = utils.createCategories(json, this.headings);
        categories["package"] = ["Overdue"];

        this.setState({
          isLoaded: true,
          tableData: json,
          categories: categories,
        });
      });
  };

  componentDidMount = () => {
    console.log(this.props);
    if (!this.props.initialData) {
      this.getPendingPackageFromAPI();
    }
  };

  statehandler = (states) => {
    this.setState(states);
  };
  render() {
    console.log(this.state.tableData);
    return (
      <div className="pendingPackageTable">
        <Table
          headings={this.headings}
          sortingOnlyList={this.sortingOnlyList}
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
export default PendingPackageTable;
