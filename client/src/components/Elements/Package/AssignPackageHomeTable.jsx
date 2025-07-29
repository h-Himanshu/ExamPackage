import React from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

// A local Table component for AssignPackageHome ONLY
export default function AssignPackageHomeTable({ headings, tableData }) {
  // Build columns for MDBDataTable
  const columns = [
    { label: "S.N", field: "sn", sort: "asc" },
    ...headings,
    { label: "Action", field: "action", sort: "" },
  ];

  // Build rows for MDBDataTable
  const rows = tableData.map((row, idx) => {
    // Copy all fields
    let temp = { ...row };
    // Add serial number
    temp.sn = idx + 1;
    // Add action button
    temp.action = (
      <Link
        to={`/admin/assign-teacher/${row.id}`}
        className="btn btn-primary btn-sm"
      >
        Assign
      </Link>
    );
    return temp;
  });

  return (
    <MDBDataTable
      data={{ columns, rows }}
      bordered
      sortable
    />
  );
}
