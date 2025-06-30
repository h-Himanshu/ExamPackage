import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import NavBar from "../../components/Header/Navbar";
import Table from "../../components/Widgets/Tables/tables";
const Teacher = () => {
  const data = useLoaderData();
  console.log(data);
  const headings = [
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
      label: "Status",
      text: "Status",
      colspan: "2",
      field: "status",
    },
  ];

  const state = {
    filtered: [],
    isFiltered: false,
    searchBy: "packageCode",
    items: [],
    isLoaded: true,
    categories: {},
  };

  const actions = [
    {
      text: "Mark as Done",
      icon: faReceipt,
      link: "admin/receivePackage/",
      onClick: () => console.log("hello world"),
    },
  ];
  useEffect(() => {});
  return (
    <>
      <NavBar />
      <div style={{ padding: "15px" }}>
        <Table
          headings={headings}
          state={state}
          // setState = { ( state ) => data }
          // tableData = { data }
          tableData={data}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Teacher;
