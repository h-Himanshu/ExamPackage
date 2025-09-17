import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../../Widgets/Tables/tables.jsx';
import BreadCrumb from '../../Widgets/Breadcrumb/breadcrumb.jsx';

const PersonAssignments = () => {
  const { personId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [personName, setPersonName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch person details
    fetch(`/API/query/getOnePerson/${personId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) setPersonName(data[0].fullName || data[0].name);
      });
    // Fetch all package assignments for this person
    fetch(`/API/query/getPersonSpecificPackage/${personId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched assignments:', data);
        setAssignments(data);
        setLoading(false);
      });
  }, [personId]);

  const headings = [
    { label: "Package Code", field: "packageCode", sort: "asc", width: 120 },
    { label: "Subject Name", field: "subjectName", sort: "asc", width: 120 },
    { label: "Exam", field: "exam", sort: "asc", width: 120 },
    { label: "Exam Type", field: "examType", sort: "asc", width: 100 },
    { label: "No Of Copies", field: "noOfCopies", sort: "asc", width: 100 },
    { label: "Code Range", field: "codeRange", sort: "asc", width: 120 },
    { label: "Status", field: "status", sort: "asc", width: 100 },
    { label: "Submitted On", field: "dateOfSubmission", sort: "asc", width: 120 },
  ];

  // Prepare table data with S.N
  const tableData = Array.isArray(assignments)
    ? assignments.map((a, idx) => ({ ...a, sn: idx + 1 }))
    : [];
  console.log('Prepared tableData for Table:', tableData);

  if (loading) return <div>Loading...</div>;

  // Breadcrumb configuration
  const breadcrumbItems = [
    {
      text: "Persons",
      link: "/admin/person"
    },
    {
      text: `${personName} - Assignments`,
      link: "" // Current page, no link needed
    }
  ];

  // Always render the Table, even if no data
  return (
  <>
    <BreadCrumb breadcrumbItems={breadcrumbItems} className="breadcrumb" />
    <div style={{ padding: '2rem' }}>
      <h2>Assignments for {personName}</h2>
      <Table
        headings={headings}
        tableData={tableData}
        state={{}}
        setState={() => {}}
        actions={[]}
        categories={{}}
        hideActionColumn={true}
        disableLinks={true}
      />
    </div>
    </>
  );
};

export default PersonAssignments;
