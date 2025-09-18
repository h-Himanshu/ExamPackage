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
          // Store original ID to ensure it's never modified
          element.originalId = element.id;
          element.name = element.name || "";
          element.contact = element.contact || "";
          element.course_code = element.course_code || "";
          element.program = element.program || "";
          element.year_part = element.year_part || "";
          element.subject = element.subject || "";
          element.campus = element.campus || "";
        
        });

        // Check if this is an assignment context (assign-teacher or assign-package)
        const currentPath = window.location.pathname;
        const isAssignmentContext = currentPath.includes('/assign-teacher') || currentPath.includes('/assign-package');
        
        // console.log('PersonTable - Current Path:', currentPath);
        // console.log('PersonTable - Is Assignment Context:', isAssignmentContext);
        // console.log('PersonTable - Props ID:', this.props.id);
        
        // Make person data clickable for assignment ONLY if in assignment context
        if (isAssignmentContext && this.props.id) {
          // console.log('PersonTable - Making data clickable');
          // Instead of wrapping individual cells, we'll add click handlers via CSS/JS
          // This preserves sorting capability while making rows clickable
          json.forEach((element, index) => {
            // Add a special property to indicate this row should be clickable
            element._isClickable = true;
            element._clickTarget = `/admin/assign-package/${this.props.id}/${element.originalId}`;
          });
        } else {
          console.log('PersonTable - Data remains non-clickable');
        }

        this.setState({
          isLoaded: true,
          tableData: json,
          categories: categories,
        });
      });
  };

  componentDidMount() {
    // Add click handlers for clickable rows after component mounts
    this.addRowClickHandlers();
  }

  componentDidUpdate() {
    // Re-add click handlers after table updates (like sorting)
    this.addRowClickHandlers();
  }

  addRowClickHandlers = () => {
    setTimeout(() => {
      const tableRows = document.querySelectorAll('.personTable .table tbody tr');
      
      tableRows.forEach((row, index) => {
        // Check if this should be clickable based on current path
        const currentPath = window.location.pathname;
        const isAssignmentContext = currentPath.includes('/assign-teacher') || currentPath.includes('/assign-package');
        
        if (isAssignmentContext && this.props.id) {
          row.style.cursor = 'pointer';
          row.onclick = (e) => {
            // Prevent click if user clicked on action buttons
            if (e.target.closest('.btn') || e.target.closest('a')) return;
            
            // Get the name at the time of click (when DOM is definitely updated)
            const nameCell = row.querySelector('td:nth-child(2)');
            if (!nameCell) return;
            
            const displayedName = nameCell.textContent.trim();
            
            // Find the person in original data by matching the displayed name
            const personData = this.state.tableData.find(person => 
              person.name && person.name.trim() === displayedName
            );
            
            if (personData && personData.originalId) {
              window.location.href = `/admin/assign-package/${this.props.id}/${personData.originalId}`;
            }
          };
          row.onmouseenter = () => row.style.backgroundColor = '#f8f9fa';
          row.onmouseleave = () => row.style.backgroundColor = '';
        }
      });
    }, 500); // Increased delay to ensure DOM is fully updated
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
