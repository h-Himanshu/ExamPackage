import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FIELD_ORDER = [
  // Package fields
  "packageCode",
  "subjectName",
  "noOfCopies",
  "codeRange",
  "examType",
  "date",
  "status",
  "center",
  // Assignment fields
  "dateOfAssignment",
  "dateOfSubmission",
  "resubmissionDate",
  "dateOfDeadline",
  "voucherNo",
];

const FIELD_LABELS = {
  // Package fields
  packageCode: "Package Code",
  subjectName: "Subject Name", 
  examType: "Exam Type",
  noOfCopies: "No. of Copies",
  codeRange: "Code Range",
  date: "Exam Date",
  status: "Status",
  center: "Center",
  // Assignment fields
  assignment_id: "Assignment ID",
  dateOfAssignment: "Date of Assignment",
  dateOfSubmission: "Date of Submission",
  resubmissionDate: "Resubmission Date",
  dateOfDeadline: "Date of Deadline",
  voucherNo: "Voucher No.",
};

const PackageDetail = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [assignmentData, setAssignmentData] = useState([]);

  useEffect(() => {
    fetch(`/API/query/getPackageAndAssignment/${packageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { codeStart, codeEnd, ...rest } = data[0];
          const codeRange = codeStart && codeEnd ? `${codeStart} - ${codeEnd}` : codeStart || codeEnd || "";
          // Determine a safe voucherNo from the assignment rows (prefer the latest non-empty)
          const latestVoucher = [...data]
            .reverse()
            .map(row => row && row.voucherNo)
            .find(v => v !== undefined && v !== null && String(v).trim() !== "");
          // Determine latest non-empty resubmission date
          const latestResubmission = [...data]
            .reverse()
            .map(row => row && row.resubmissionDate)
            .find(v => v !== undefined && v !== null && String(v).trim() !== "");

          setPackageData({
            ...rest,
            codeRange,
            voucherNo: latestVoucher ?? rest.voucherNo,
            resubmissionDate: latestResubmission ?? rest.resubmissionDate,
          });
          setAssignmentData(data);
        }
      });
  }, [packageId]);

  if (!packageData) return <div>Loading...</div>;

  return (
    <div>
      <form className="package-detail-form">
        {FIELD_ORDER.map((key) => (
          <div className="form-group" key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ minWidth: 150, marginRight: 16, fontWeight: 500 }}>{FIELD_LABELS[key] || key}</label>
            <input
              type="text"
              className="form-control"
              style={{ flex: 1, minWidth: 0 }}
              value={
                packageData[key] !== undefined && packageData[key] !== null && String(packageData[key]).trim() !== ""
                  ? String(packageData[key])
                  : "-"
              }
              readOnly
              disabled
            />
          </div>
        ))}
      </form>
      {/* You can add static assignment fields here if needed */}
    </div>
  );
};

export default PackageDetail;
