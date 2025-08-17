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
  //MDBtable needs data in JSON format.Data methods is used for that.
  //Headings is looped and stored in columns
  //tableData is looped and stored in rows
  static defaultProps = {
    headings: [],
    categories: {},
    tableData: [],
    postedTable: false,
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
        sort: "asc",
        field: "sn",
      },
      {
        label: "Action",
        sort: "",
        field: "action",
      },
    ];
    //to make SN first column and Action Last column
    let columns = [remainingColumns[0], ...headings, remainingColumns[1]];
    let rows = tableData.map((datas, index) => {
  console.log("Row data for action:", datas); // DEBUG: log each row's data
  let tempData = {};
  tempData["sn"] = index + 1;
      for (let key in datas) {
        if (key !== "id" && key !== "package" && key !== "subjectID") {
          // If the value is already a React element (e.g., a Link), use it directly to avoid nested <a>
          if (React.isValidElement(datas[key])) {
            tempData[key] = datas[key];
            continue;
          }

          if (key === "packageCode") {
            const val = datas[key];
            const link = `/packageHistory/${val}`;
            tempData[key] = <Link to={link}>{val}</Link>;
          } else {
            tempData[key] = datas[key];
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
          templates = (
            <Link
              key={index}
              to={{
                pathname: `${action.link}${datas["id"]}`,
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
      tempData["action"] = actionTemplate;
      return tempData;
    });

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
          />
        )}

        <div>
          <MDBDataTable
            //searching={false}
            data={this.data()}
            bordered
            sortable
          />
          {this.quickLinks()}
        </div>
      </div>
    );
  }
}
export default MainTable;
