import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import adbs from "ad-bs-converter";
import React from "react";
import utils from "../../utils/utils.jsx";
import Table from "../Widgets/Tables/tables.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
          // Preserve backend status (e.g., 'Recheck') and enrich display
          const backendStatus = element["status"];
          if (backendStatus === "Recheck") {
            element["status"] = "Recheck";
          } else {
            element["status"] = diff < 0 ? "Overdue" : "Pending";
          }
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

  // Generate PDF report for current visible rows
  handleGenerateReport = () => {
    try {
      const headers = ["S.N", ...this.headings.map(h => h.label)];
      const fields = this.headings.map(h => h.field);
      const rows = (this.state.isFiltered ? this.state.filtered : this.state.tableData).map((row, idx) => {
        return [idx + 1, ...fields.map(f => (row[f] ? row[f] : '—'))];
      });

      const orientation = headers.length > 7 ? 'landscape' : 'portrait';
      const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });
      const title = 'Pending Packages Report';
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - textWidth) / 2, 40);

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 60,
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [52, 58, 64], halign: 'center' },
        bodyStyles: { valign: 'middle' },
        theme: 'grid'
      });

      const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 17);
      const rand = Math.random().toString(36).slice(2, 8);
      const fileName = `pending-packages-${ts}-${rand}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Failed to generate pending PDF', err);
      alert('Failed to generate PDF');
    }
  }
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
        <div className="d-flex justify-content-center" style={{ marginBottom: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => this.handleGenerateReport()}>Download Pending Report (PDF)</button>
        </div>
      </div>
    );
  }
}
export default PendingPackageTable;

