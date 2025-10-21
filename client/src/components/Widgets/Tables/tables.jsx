import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MDBBtn,
  MDBDataTable,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
} from "mdbreact";
import React from "react";
import { Link } from "react-router-dom";
import "./tables.css";
import TableOptions from "./tablesOptions.jsx";

class MainTable extends React.Component {
  componentDidMount() {
    // Update S.N numbers after initial render
    this.updateSerialNumbers();
  }

  componentDidUpdate() {
    // Update S.N numbers after any update (including sorting)
    this.updateSerialNumbers();
  }

  updateSerialNumbers = () => {
    setTimeout(() => {
      const tableRows = document.querySelectorAll('.table tbody tr');
      tableRows.forEach((row, index) => {
        const snCell = row.querySelector('td:first-child');
        if (snCell) {
          snCell.textContent = index + 1;
        }
      });
    }, 10);
  };

  //MDBtable needs data in JSON format.Data methods is used for that.
  //Headings is looped and stored in columns
  //tableData is looped and stored in rows
  static defaultProps = {
    headings: [],
    categories: {},
    tableData: [],
    postedTable: false,
    hideActionColumn: false,
  };

  data = () => {
    //headings is passed in this.props
    let headings = this.props.headings;
    //tableData are datas to be rendered in tabular format
    let tableData = this.props.tableData;
    let actions = this.props.actions || [];
    let data = {};
    //Manually added first and Last column of Table which is absent in this.props.heading
    let remainingColumns = [
      {
        label: "S.N",
        field: "sn",
        sort: 'disabled',
        width: 50
      },
      {
        label: "Action",
        sort: "",
        field: "action",
      },
    ];
    //to make SN first column and Action Last column (only if not hiding action column)
    const shouldHideActionColumn = this.props.hideActionColumn;
    let columns = shouldHideActionColumn
      ? [remainingColumns[0], ...headings]  // No action column
      : [remainingColumns[0], ...headings, remainingColumns[1]];  // Include action column
    let rows = tableData.map((datas, index) => {
  console.log("Row data for action:", datas); // DEBUG: log each row's data
  let tempData = {};
      for (let key in datas) {
        if (key !== "id" && key !== "package" && key !== "subjectID") {
          // If the value is already a React element (e.g., a Link), use it directly to avoid nested <a>
          if (React.isValidElement(datas[key])) {
            tempData[key] = datas[key];
            continue;
          }

          if (key === "packageCode" && !this.props.disableLinks) {
            const val = datas[key];
            const link = `/packageHistory/${val}`;
            tempData[key] = <Link to={link}>{val}</Link>;
          } else {
            // Handle empty/null values with hyphens
            const value = datas[key];
            if (value === null || value === undefined || value === '' || value === 'null') {
              tempData[key] = '-';
            } else {
              tempData[key] = value;
            }
          }
        }
      }
      //Adding Icon/Button in Action Column in every row
      let actionTemplate = actions.map((action, index) => {
        let templates = null;
        if (action.hasOwnProperty("onClick")) {
          templates = (
            <button
              key={index}
              className="btn-xs btn-primary"
              onClick={() => action.onClick()}
            >
              {action.text}
            </button>
          );
        } else {
          const linkPath = action.linkSuffix 
            ? `${action.link}${datas["id"]}${action.linkSuffix}`
            : `${action.link}${datas["id"]}`;
          
          templates = (
            <Link
              key={index}
              to={{
                pathname: linkPath,
                state: this.props.detailParams,
              }}
              className="m-1"
            >
              <FontAwesomeIcon icon={action.icon} />
            </Link>
          );
        }
        return templates;
      });

      //Template for blinking button
      if (tempData.hasOwnProperty("Overdue")) {
        const overdueInfo = tempData["Overdue"];

        const blinkingButton = overdueInfo.isOverdue ? (
          //If overdue
          <MDBPopover placement="top" popover clickable id="popper1">
            <MDBBtn color="red" />
            <div>
              <MDBPopoverHeader>Overdue</MDBPopoverHeader>
              <MDBPopoverBody>{overdueInfo.days} days</MDBPopoverBody>
            </div>
          </MDBPopover>
        ) : (
          //Else
          <MDBPopover placement="top" popover clickable id="popper1">
            <MDBBtn color="success" />
            <div>
              <MDBPopoverHeader>Days remaining</MDBPopoverHeader>
              <MDBPopoverBody>{overdueInfo.days} days</MDBPopoverBody>
            </div>
          </MDBPopover>
        );

        tempData["Overdue"] = blinkingButton;
      }
      // Only add action column if not hiding action column
      const shouldHideActionColumn = this.props.postedTable || this.props.hideActionColumn;
      if (!shouldHideActionColumn) {
        tempData["action"] = actionTemplate;
      }
      return tempData;
    });

    // Add S.N after processing all rows - use placeholder that will be updated by DOM manipulation
    rows = rows.map((row, index) => ({
      ...row,
      sn: index + 1 // Initial value, will be updated by updateSerialNumbers
    }));

    data["columns"] = columns;
    data["rows"] = rows;
    return data;
  };

  stateHandler = (states) => {
    this.props.setState(states);
  };

  quickLinks = () => {
    if (this.props.quickLinks) {
      return this.props.quickLinks.map((element, index) => {
        return (
          <Link to={element.link} key={index}>
            <button className="btn btn-secondary">{element.text}</button>
          </Link>
        );
      });
    }
  };
  render() {
    return (
      <div>
        {this.props.postedTable ? null : (
          <TableOptions
            state={this.props.state}
            setState={(states) => this.stateHandler(states)}
            headings={this.props.headings}
            categories={this.props.categories}
            advancedRightControl={this.props.leftOfSearch}
          />
        )}

  <div>
        {/* Global control row: place leftOfSearch (e.g., exam type selector) right-aligned above the table (outside Advanced Search) */}
        {this.props.leftOfSearch ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px' }}>
            <div>{this.props.leftOfSearch}</div>
          </div>
        ) : null}
          <style>
            {`
              .table tbody tr td:first-child {
                transition: none !important;
                animation: none !important;
              }
            `}
          </style>
          <MDBDataTable
            searching={false}
            data={this.data()}
            bordered
            sortable
            onSort={() => {
              // Update serial numbers after sorting with minimal delay
              setTimeout(() => this.updateSerialNumbers(), 20);
            }}
          />
          {this.quickLinks()}
        </div>
      </div>
    );
  }
}
export default MainTable;
