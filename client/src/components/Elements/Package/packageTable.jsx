import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";
import utils from "../../../utils/utils.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
      label: "Code Range",
      sort: "asc",
      field: "codeRange",
    },
    // {
    //   label: "Year/Part",
    //   sort: "asc",
    //   field: "yearPart",
    //   grouping: true,
    // },
    {
      label: "Name of Examiner",
      sort: "asc",
      field: "examinerName",
      grouping: true,
    },
    {
      label: "Mobile no.",
      sort: "asc",
      field: "examinerContact",
      grouping: true,
    },
    {
      label: "Status",
      sort: "asc",
      field: "status",
      grouping: true,
    },
    {
      label: "Submitted On",
      sort: "asc",
      field: "dateOfSubmission",
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
    if (props.initialData) {
      // Hide Status column only when a specific status filter is active
      if (props.statusFilter && this.headings.some((h) => h.label === "Status")) {
        this.headings = this.headings.filter((el) => el.label !== "Status");
      }
      // Apply filtering if statusFilter provided
      const sf = props.statusFilter ? String(props.statusFilter).toLowerCase() : null;
      let json = props.initialData;
      if (sf) {
        json = json.filter((el) => String(el.status || '').toLowerCase() === sf);
      }
      // Format data to ensure empty fields show as '—'
      const formattedData = this.formatTableData(json);
      // Optionally wrap cells in Links unless disabled or filtered by status
      const clickableData = (this.props.disableClickable || props.statusFilter)
        ? formattedData
        : formattedData.map((element) => {
            let id = element.id;
            let clickableRow = { ...element };
            for (let key in clickableRow) {
              if (
                key !== "id" &&
                typeof clickableRow[key] !== "object" &&
                typeof clickableRow[key] !== "undefined"
              ) {
                clickableRow[key] = (
                  <Link key={key} to={`/admin/packages/view-packages/${id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {element[key]}
                  </Link>
                );
              }
            }
            return clickableRow;
          });
      let categories = utils.createCategories(formattedData, this.headings);
      this.setState({
        isLoaded: true,
        tableData: clickableData,
        categories: categories,
      });
    }
  };

  // Format all empty fields with a dash
  formatTableData = (data) => {
    if (!data) return [];
    
    return data.map(item => {
      const formattedItem = {};
      
      // Process each field in the item
      Object.entries(item).forEach(([key, value]) => {
        // For Submitted On: prefer resubmissionDate, else dateOfSubmission
        if (key === 'dateOfSubmission') {
          const status = item.status?.toLowerCase();
          const effectiveDate = item?.resubmissionDate || value;
          formattedItem[key] = (status === 'submitted' || status === 'scrutinized') && effectiveDate
            ? new Date(effectiveDate).toLocaleDateString()
            : '—';
        }
        // For all other fields, replace falsy values with dash
        else {
          formattedItem[key] = value || '—';
        }
      });
      
      return formattedItem;
    });
  };

  componentDidMount() {
    console.log(this.props.initialData);
    if (this.props.initialData) {
      // If initialData is provided, optionally filter by statusFilter and hide Status column
      const { statusFilter } = this.props;
      if (statusFilter && this.headings.some((h) => h.label === "Status")) {
        this.headings = this.headings.filter((el) => el.label !== "Status");
      }
      let data = this.props.initialData;
      if (statusFilter) {
        const sf = String(statusFilter).toLowerCase();
        data = data.filter((el) => String(el.status || '').toLowerCase() === sf);
      }
      // Format the data before setting state so empty fields show as '—'
      const formattedData = this.formatTableData(data);
      const clickableData = (this.props.disableClickable || statusFilter)
        ? formattedData
        : formattedData.map((element) => {
            let id = element.id;
            let clickableRow = { ...element };
            for (let key in clickableRow) {
              if (
                key !== "id" &&
                typeof clickableRow[key] !== "object" &&
                typeof clickableRow[key] !== "undefined"
              ) {
                clickableRow[key] = (
                  <Link key={key} to={`/admin/packages/view-packages/${id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {element[key]}
                  </Link>
                );
              }
            }
            return clickableRow;
          });
      let categories = utils.createCategories(formattedData, this.headings);
      this.setState({
        isLoaded: true,
        tableData: clickableData,
        categories: categories,
      });
    } else {
      fetch("/API/query/getAllPackages")
        .then((res) => res.json())
        .then((json) => {
          console.log('API Response:', json);
          if (json && json.length > 0) {
            console.log('First package data:', json[0]);
            // Optionally filter by status before formatting and hide Status column
            const { statusFilter } = this.props;
            if (statusFilter && this.headings.some((h) => h.label === "Status")) {
              this.headings = this.headings.filter((el) => el.label !== "Status");
            }
            const source = statusFilter
              ? json.filter((el) => String(el.status || '').toLowerCase() === String(statusFilter).toLowerCase())
              : json;
            // Format the data before setting state
            const formattedData = this.formatTableData(source);
            console.log('Formatted data:', formattedData[0]);
            
            // Optionally disable wrapping cells in Links (when disableClickable is true or a statusFilter is active)
            let clickableData = formattedData.map((element) => {
              if (this.props.disableClickable || this.props.statusFilter) {
                return { ...element };
              }
              let id = element.id;
              let clickableRow = { ...element };
              for (let key in clickableRow) {
                if (
                  key !== "id" &&
                  typeof clickableRow[key] !== "object" &&
                  typeof clickableRow[key] !== "undefined"
                ) {
                  clickableRow[key] = (
                    <Link key={key} to={`/admin/packages/view-packages/${id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {element[key]}
                    </Link>
                  );
                }
              }
              return clickableRow;
            });
            // Build categories from plain formatted data to avoid React elements in <option>
            let categories = utils.createCategories(formattedData, this.headings);
            this.setState({
              isLoaded: true,
              tableData: clickableData,
              categories: categories,
            });
            return;
          }
        });
    }
  }

  statehandler = (states) => {
    this.setState(states);
    console.log(this.state);
  };

  // Safely convert any value (including React elements) to plain text for export
  getPlainText = (val) => {
    if (val === null || val === undefined) return "—";
    if (React.isValidElement(val)) {
      const children = val.props && val.props.children;
      if (Array.isArray(children)) {
        return children.map((c) => this.getPlainText(c)).join("");
      }
      return this.getPlainText(children);
    }
    if (typeof val === "object") {
      try {
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };

  // Get currently visible rows (respects Advanced Search filters)
  getVisibleRows = () => {
    const data = this.state.isFiltered ? this.state.filtered : this.state.tableData;
    return Array.isArray(data) ? data : [];
  };

  handleGenerateReport = () => {
    try {
      // Prepare headers: S.N + current headings (Status already removed if filtered earlier)
      const headers = ["S.N", ...this.headings.map((h) => h.label)];
      const fields = this.headings.map((h) => h.field);

      // Rows
      const rows = this.getVisibleRows().map((row, idx) => {
        const cells = fields.map((f) => this.getPlainText(row[f]));
        return [idx + 1, ...cells];
      });

      const orientation = headers.length > 7 ? "landscape" : "portrait";
      const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });

      // Title
      const title = "Package Report";
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - textWidth) / 2, 40);

      // Table
  autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 60,
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [52, 58, 64], halign: "center" },
        bodyStyles: { valign: "middle" },
        theme: "grid",
  });

  const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 17); // YYYYMMDDHHMMSSmmm
  const rand = Math.random().toString(36).slice(2, 8);
  const fileName = `package-report-${ts}-${rand}.pdf`;
  doc.save(fileName);
    } catch (err) {
      console.error("PDF export failed", err);
      if (typeof window !== "undefined") alert("Failed to generate PDF.");
    }
  };

  render() {
    console.log(this.state.tableData);
    return (
      <div className="mainTable">
        <Table
          disableLinks={this.props.disableClickable || !!this.props.statusFilter}
          headings={this.headings}
          tableData={
            this.state.isFiltered ? this.state.filtered : this.state.tableData
          }
          state={this.state}
          setState={(states) => this.statehandler(states)}
          actions={this.actions}
          categories={this.state.categories}
        />
        <div className="d-flex justify-content-center" style={{ marginBottom: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={this.handleGenerateReport}>Generate Report</button>
        </div>
      </div>
    );
  }
}
export default PackageTable;
